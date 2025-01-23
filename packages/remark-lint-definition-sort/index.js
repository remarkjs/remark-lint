/**
 * remark-lint rule to warn when definitions are not sorted.
 *
 * ## What is this?
 *
 * This package checks definition order.
 *
 * ## When should I use this?
 *
 * You can use this package to check definition order.
 *
 * ## API
 *
 * ### `unified().use(remarkLintDefinitionSort)`
 *
 * Warn when when definitions are not sorted.
 *
 * ###### Parameters
 *
 * There are no parameters.
 *
 * ###### Returns
 *
 * Transform ([`Transformer` from `unified`][github-unified-transformer]).
 *
 * [api-remark-lint-definition-sort]: #unifieduseremarklintdefinitionsort
 * [github-unified-transformer]: https://github.com/unifiedjs/unified#transformer
 *
 * @module definition-sort
 * @author Titus Wormer
 * @copyright 2025 Titus Wormer
 * @license MIT
 *
 * @example
 *   {"name": "ok.md"}
 *
 *   [mercury]: https://example.com/mercury/
 *
 *   [venus]: https://example.com/venus/
 *
 * @example
 *   {"gfm": true, "name": "gfm-ok.md"}
 *
 *   [^mercury]:
 *       **Mercury** is the first planet from the Sun and the smallest
 *       in the Solar System.
 *
 *   [^venus]:
 *       **Venus** is the second planet from
 *       the Sun.
 *
 * @example
 *   {"gfm": true, "name": "together.md"}
 *
 *   Definitions and footnote definitions are sorted separately.
 *
 *   [mercury]: https://example.com/mercury/
 *   [venus]: https://example.com/venus/
 *
 *   [^mercury]:
 *       **Mercury** is the first planet from the Sun and the smallest
 *       in the Solar System.
 *
 *   [^venus]:
 *       **Venus** is the second planet from
 *       the Sun.
 *
 * @example
 *   {"gfm": true, "name": "together.md"}
 *
 *   Definitions are sorted per “group”.
 *
 *   [mercury]: https://example.com/mercury/
 *   [venus]: https://example.com/venus/
 *
 *   This paragraph introduces another group.
 *
 *   [earth]: https://example.com/earth/
 *   [mars]: https://example.com/mars/
 *
 * @example
 *   {"name": "comment.md"}
 *
 *   [earth]: https://example.com/earth/
 *
 *   <!-- HTML comments are ignored. -->
 *
 *   [mars]: https://example.com/mars/
 *
 * @example
 *   {"mdx": true, "name": "comment.mdx"}
 *
 *   [earth]: https://example.com/earth/
 *
 *   {/* Comments in expressions in MDX are ignored. *␀/}
 *
 *   [mars]: https://example.com/mars/
 *
 * @example
 *   {"label": "input", "name": "not-ok.md"}
 *
 *   [venus]: https://example.com/venus/
 *
 *   [mercury]: https://example.com/mercury/
 *
 *   [earth]: https://example.com/earth/
 *
 *   [mars]: https://example.com/mars/
 * @example
 *   {"label": "output", "name": "not-ok.md"}
 *
 *   1:1-1:36: Unexpected definition `venus` in 1st place, expected alphabetically sorted definitions, move it to 4th place
 *   3:1-3:40: Unexpected definition `mercury` in 2nd place, expected alphabetically sorted definitions, move it to 3rd place
 *   5:1-5:36: Unexpected definition `earth` in 3rd place, expected alphabetically sorted definitions, move it to 1st place
 *   7:1-7:34: Unexpected definition `mars` in 4th place, expected alphabetically sorted definitions, move it to 2nd place
 *
 * @example
 *   {"gfm": true, "label": "input", "name": "not-ok-gfm.md"}
 *
 *   [^venus]:
 *       **Venus** is the second planet from
 *       the Sun.
 *
 *   [^mercury]:
 *       **Mercury** is the first planet from the Sun and the smallest
 *       in the Solar System.
 * @example
 *   {"gfm": true, "label": "output", "name": "not-ok-gfm.md"}
 *
 *   1:1-3:13: Unexpected footnote definition `venus` in 1st place, expected alphabetically sorted definitions, move it to 2nd place
 *   5:1-7:25: Unexpected footnote definition `mercury` in 2nd place, expected alphabetically sorted definitions, move it to 1st place
 */

/**
 * @import {DefinitionContent, Parents, Root} from 'mdast'
 */

import {ok as assert} from 'devlop'
import {phrasing} from 'mdast-util-phrasing'
import {lintRule} from 'unified-lint-rule'
import {SKIP, visitParents} from 'unist-util-visit-parents'

const pluralRules = new Intl.PluralRules('en-US', {type: 'ordinal'})

const remarkLintDefinitionSort = lintRule(
  {
    origin: 'remark-lint:definition-sort',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-definition-sort#readme'
  },
  /**
   * @param {Root} tree
   *   Tree.
   * @returns {undefined}
   *   Nothing.
   */
  function (tree, file) {
    visitParents(tree, function (parent, parents) {
      // Do not walk into phrasing.
      if (phrasing(parent)) return SKIP

      // Ignore leafs.
      if (!('children' in parent)) return

      let index = -1
      /** @type {DefinitionContent['type'] | undefined} */
      let type
      /** @type {Array<DefinitionContent> | undefined} */
      let nodes

      while (++index < parent.children.length) {
        const node = parent.children[index]

        if (type) {
          assert(nodes)

          // Same definition.
          if (node.type === type) {
            nodes.push(node)
          }
          // Comment.
          else if (
            (node.type === 'html' && /^[\t ]*<!--/.test(node.value)) ||
            (node.type === 'mdxFlowExpression' && /^\s*\/\*/.test(node.value))
          ) {
            // Empty
          } else {
            group([...parents, parent], nodes)
            type = undefined
            nodes = undefined
          }
        } else if (
          node.type === 'definition' ||
          node.type === 'footnoteDefinition'
        ) {
          type = node.type
          nodes = [node]
        }
      }

      if (type) {
        assert(nodes)
        group([...parents, parent], nodes)
      }
    })

    /**
     * @param {Array<Parents>} ancestors
     * @param {Array<DefinitionContent>} nodes
     * @returns {undefined}
     */
    function group(ancestors, nodes) {
      /** @type {Map<string, DefinitionContent>} */
      const map = new Map()
      /** @type {Array<string>} */
      const current = []

      for (const node of nodes) {
        current.push(node.identifier)
        map.set(node.identifier, node)
      }

      // Intentional that they are made unique with `Set`.
      const actual = [...new Set(current)]
      const expected = [...actual].sort()

      for (const name of actual) {
        const actualIndex = actual.indexOf(name)
        const expectedIndex = expected.indexOf(name)
        const node = map.get(name)
        assert(node) // Always defined.
        if (actualIndex !== expectedIndex && node.position) {
          file.message(
            'Unexpected' +
              (node.type === 'footnoteDefinition' ? ' footnote' : '') +
              ' definition `' +
              name +
              '` in ' +
              ordinal(actualIndex + 1) +
              ' place, expected alphabetically sorted definitions, move it to ' +
              ordinal(expectedIndex + 1) +
              ' place',
            {ancestors: [...ancestors, node], place: node.position}
          )
        }
      }
    }
  }
)

export default remarkLintDefinitionSort

/**
 * @param {number} n
 * @returns {string}
 */
function ordinal(n) {
  const rule = pluralRules.select(n)
  const suffix =
    rule === 'one' ? 'st' : rule === 'two' ? 'nd' : rule === 'few' ? 'rd' : 'th'
  return n + suffix
}

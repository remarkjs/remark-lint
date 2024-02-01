/**
 * remark-lint rule to warn when identifiers are defined multiple times.
 *
 * ## What is this?
 *
 * This package checks that defined identifiers are unique.
 *
 * ## When should I use this?
 *
 * You can use this package to check that definitions are useful.
 *
 * ## API
 *
 * ### `unified().use(remarkLintNoDuplicateDefinitions)`
 *
 * Warn when identifiers are defined multiple times.
 *
 * ###### Parameters
 *
 * There are no options.
 *
 * ###### Returns
 *
 * Transform ([`Transformer` from `unified`][github-unified-transformer]).
 *
 * ## Recommendation
 *
 * It’s a mistake when the same identifier is defined multiple times.
 *
 * [api-remark-lint-no-duplicate-definitions]: #unifieduseremarklintnoduplicatedefinitions
 * [github-unified-transformer]: https://github.com/unifiedjs/unified#transformer
 *
 * @module no-duplicate-definitions
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 *
 * @example
 *   {"name": "ok.md"}
 *
 *   [mercury]: https://example.com/mercury/
 *   [venus]: https://example.com/venus/
 *
 * @example
 *   {"label": "input", "name": "not-ok.md"}
 *
 *   [mercury]: https://example.com/mercury/
 *   [mercury]: https://example.com/venus/
 * @example
 *   {"label": "output", "name": "not-ok.md"}
 *
 *   2:1-2:38: Unexpected definition with an already defined identifier (`mercury`), expected unique identifiers
 *
 * @example
 *   {"gfm": true, "label": "input", "name": "gfm.md"}
 *
 *   Mercury[^mercury].
 *
 *   [^mercury]:
 *     Mercury is the first planet from the Sun and the smallest in the Solar
 *     System.
 *
 *   [^mercury]:
 *     Venus is the second planet from the Sun.
 *
 * @example
 *   {"gfm": true, "label": "output", "name": "gfm.md"}
 *
 *   7:1-7:12: Unexpected footnote definition with an already defined identifier (`mercury`), expected unique identifiers
 */

/**
 * @typedef {import('mdast').Nodes} Nodes
 * @typedef {import('mdast').Root} Root
 */

import {ok as assert} from 'devlop'
import {phrasing} from 'mdast-util-phrasing'
import {lintRule} from 'unified-lint-rule'
import {SKIP, visitParents} from 'unist-util-visit-parents'
import {VFileMessage} from 'vfile-message'

/** @type {ReadonlyArray<never>} */
const empty = []

const remarkLintNoDuplicateDefinitions = lintRule(
  {
    origin: 'remark-lint:no-duplicate-definitions',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-no-duplicate-definitions#readme'
  },
  /**
   * @param {Root} tree
   *   Tree.
   * @returns {undefined}
   *   Nothing.
   */
  function (tree, file) {
    /** @type {Map<string, Array<Nodes>>} */
    const definitions = new Map()
    /** @type {Map<string, Array<Nodes>>} */
    const footnoteDefinitions = new Map()

    visitParents(tree, function (node, parents) {
      // Do not walk into phrasing.
      if (phrasing(node)) {
        return SKIP
      }

      const [map, identifier] =
        node.type === 'definition'
          ? [definitions, node.identifier]
          : node.type === 'footnoteDefinition'
            ? [footnoteDefinitions, node.identifier]
            : empty

      if (map && identifier && node.position) {
        const ancestors = [...parents, node]
        const duplicateAncestors = map.get(identifier)

        if (duplicateAncestors) {
          const duplicate = duplicateAncestors.at(-1)
          assert(duplicate) // Always defined.

          file.message(
            'Unexpected ' +
              (node.type === 'footnoteDefinition' ? 'footnote ' : '') +
              'definition with an already defined identifier (`' +
              identifier +
              '`), expected unique identifiers',
            {
              ancestors,
              cause: new VFileMessage('Identifier already defined here', {
                ancestors: duplicateAncestors,
                place: duplicate.position,
                source: 'remark-lint',
                ruleId: 'no-duplicate-definitions'
              }),
              place: node.position
            }
          )
        }

        map.set(identifier, ancestors)
      }
    })
  }
)

export default remarkLintNoDuplicateDefinitions

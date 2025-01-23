/**
 * remark-lint rule to warn when directive attribute names
 * are reused.
 *
 * ## What is this?
 *
 * This package checks that directive attribute names are unique.
 *
 * ## When should I use this?
 *
 * You can use this package to check that directive attribute names
 * are unique.
 *
 * ## API
 *
 * ### `unified().use(remarkLintDirectiveUniqueAttributeName)`
 *
 * Warn when directive attribute names are reused.
 *
 * ###### Parameters
 *
 * There are no parameters.
 *
 * ###### Returns
 *
 * Transform ([`Transformer` from `unified`][github-unified-transformer]).
 *
 * [api-remark-lint-directive-unique-attribute-name]: #unifieduseremarklintdirectiveuniqueattributename
 * [github-unified-transformer]: https://github.com/unifiedjs/unified#transformer
 *
 * @module directive-unique-attribute-name
 * @author Titus Wormer
 * @copyright 2025 Titus Wormer
 * @license MIT
 *
 * @example
 *   {"directive": true, "name": "ok.md"}
 *
 *   :planet[Venus]{aphelion=0.728213 perihelion=0.718440 symbol=♀︎}
 *
 * @example
 *   {"directive": true, "name": "ok.md"}
 *
 *   :planet{#mercury value="Mercury"}
 *
 * @example
 *   {"directive": true, "label": "input", "name": "not-ok.md"}
 *
 *   :planet{#mercury adjective="Venusian" adjective="Cytherean" aphelion="0.728213" id="venus"}
 * @example
 *   {"directive": true, "label": "output", "name": "not-ok.md"}
 *
 *   1:39-1:48: Unexpected attribute name with equal text, expected unique attribute names
 *   1:81-1:83: Unexpected attribute name with equivalent text, expected unique attribute names
 *
 * @example
 *   {"directive": true, "name": "other-attributes.md"}
 *
 *   :planet[Mercury]{closest},
 *   :planet[Venus]{aphelion=0.728213}, and
 *   :planet[Mars]{.red.orange class="fourth"}.
 */

/**
 * @import {} from 'mdast-util-directive'
 * @import {Attribute} from 'remark-lint-directive-quote-style'
 * @import {Root} from 'mdast'
 */

import {inferAttributes} from 'remark-lint-directive-quote-style'
import {lintRule} from 'unified-lint-rule'
import {visitParents} from 'unist-util-visit-parents'
import {location} from 'vfile-location'
import {VFileMessage} from 'vfile-message'

const remarkLintDirectiveUniqueAttributeName = lintRule(
  {
    origin: 'remark-lint:directive-unique-attribute-name',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-directive-unique-attribute-name#readme'
  },
  /**
   * @param {Root} tree
   *   Tree.
   * @returns {undefined}
   *   Nothing.
   */
  function (tree, file) {
    const value = String(file)
    const toPoint = location(file).toPoint

    visitParents(tree, function (node, parents) {
      if (
        node.type === 'containerDirective' ||
        node.type === 'leafDirective' ||
        node.type === 'textDirective'
      ) {
        const attributes = inferAttributes(node, value)
        /** @type {Map<string, Attribute>} */
        const map = new Map()

        for (const attribute of attributes) {
          // Multiple class shortcuts are allowed.
          // Multiple `class` not!
          if (attribute.key[0] === '.') continue

          const key = attribute.key[0] === '#' ? 'id' : attribute.key[0]
          const duplicate = map.get(key)
          const start = toPoint(attribute.key[1])
          const end = toPoint(attribute.key[2])

          if (duplicate && start && end) {
            const label =
              attribute.key[0] === '#' || duplicate.key[0] === '#'
                ? 'equivalent'
                : 'equal'
            const duplicateStart = toPoint(duplicate.key[1])
            const duplicateEnd = toPoint(duplicate.key[2])

            file.message(
              'Unexpected attribute name with ' +
                label +
                ' text, expected unique attribute names',
              {
                ancestors: [...parents, node],
                cause:
                  duplicateStart && duplicateEnd
                    ? new VFileMessage(
                        label.slice(0, 1).toUpperCase() +
                          label.slice(1) +
                          ' attribute name defined here',
                        {
                          ancestors: [...parents, node],
                          place: {start: duplicateStart, end: duplicateEnd},
                          source: 'remark-lint',
                          ruleId: 'directive-unique-attribute-name'
                        }
                      )
                    : /* c8 ignore next - hard to test */
                      undefined,
                place: {start, end}
              }
            )
          }

          map.set(key, attribute)
        }
      }
    })
  }
)

export default remarkLintDirectiveUniqueAttributeName

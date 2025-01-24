/**
 * remark-lint rule to warn when attributes are not sorted.
 *
 * ## What is this?
 *
 * This package checks directive attribute order.
 *
 * ## When should I use this?
 *
 * You can use this package to check directive attribute order.
 *
 * ## API
 *
 * ### `unified().use(remarkLintDirectiveAttributeSort)`
 *
 * Warn when attributes are not sorted.
 *
 * This package does not differentiate between what values attributes have,
 * or whether they are collapsed or not.
 *
 * ###### Parameters
 *
 * There are no parameters.
 *
 * ###### Returns
 *
 * Transform ([`Transformer` from `unified`][github-unified-transformer]).
 *
 * [api-remark-lint-directive-attribute-sort]: #unifieduseremarklintdirectiveattributesort
 * [github-unified-transformer]: https://github.com/unifiedjs/unified#transformer
 *
 * @module directive-attribute-sort
 * @author Titus Wormer
 * @copyright Titus Wormer
 * @license MIT
 *
 * @example
 *   {"directive": true, "name": "ok.md"}
 *
 *   :planet[Saturn]{aphelion="1514.50" largest="no" perihelion="1352.55" satellites=146}
 *
 * @example
 *   {"directive": true, "label": "input", "name": "not-ok.md"}
 *
 *   :planet[Saturn]{largest="no" perihelion=1352.55 satellites=146 aphelion="1514.50"}
 * @example
 *   {"directive": true, "label": "output", "name": "not-ok.md"}
 *
 *   1:17-1:24: Unexpected attribute `largest` in 1st place, expected alphabetically sorted attributes, move it to 2nd place
 *   1:30-1:40: Unexpected attribute `perihelion` in 2nd place, expected alphabetically sorted attributes, move it to 3rd place
 *   1:49-1:59: Unexpected attribute `satellites` in 3rd place, expected alphabetically sorted attributes, move it to 4th place
 *   1:64-1:72: Unexpected attribute `aphelion` in 4th place, expected alphabetically sorted attributes, move it to 1st place
 *
 * @example
 *   {"directive": true, "name": "shortcut.md"}
 *
 *   :planet[Saturn]{#saturn.sixth.gas.giant aphelion="1514.50"}
 */

/**
 * @import {} from 'mdast-util-directive'
 * @import {Root} from 'mdast'
 * @import {Position} from 'unist'
 */

import {ok as assert} from 'devlop'
import {inferAttributes} from 'remark-lint-directive-quote-style'
import {lintRule} from 'unified-lint-rule'
import {visitParents} from 'unist-util-visit-parents'
import {location} from 'vfile-location'

const pluralRules = new Intl.PluralRules('en-US', {type: 'ordinal'})

const remarkLintDirectiveAttributeSort = lintRule(
  {
    origin: 'remark-lint:directive-attribute-sort',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-directive-attribute-sort#readme'
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
        /** @type {Map<string, Position>} */
        const map = new Map()
        /** @type {Array<string>} */
        const current = []

        for (const attribute of attributes) {
          const start = toPoint(attribute.key[1])
          const end = toPoint(attribute.key[2])
          if (start && end) {
            current.push(attribute.key[0])
            map.set(attribute.key[0], {start, end})
          }
        }

        // Intentional that they are made unique with `Set`.
        const actual = [...new Set(current)]
        // Note: we do not need extra handling for shortcuts as they are sorted
        // naturally:
        // `#` is `35`,
        // `.` is `46`,
        // after which come digits and letters.
        const expected = [...actual].sort()

        for (const name of actual) {
          const actualIndex = actual.indexOf(name)
          const expectedIndex = expected.indexOf(name)
          const place = map.get(name)
          assert(place) // Always defined.
          if (actualIndex !== expectedIndex) {
            file.message(
              'Unexpected attribute `' +
                name +
                '` in ' +
                ordinal(actualIndex + 1) +
                ' place, expected alphabetically sorted attributes, move it to ' +
                ordinal(expectedIndex + 1) +
                ' place',
              {ancestors: [...parents, node], place}
            )
          }
        }
      }
    })
  }
)

export default remarkLintDirectiveAttributeSort

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

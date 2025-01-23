/**
 * remark-lint rule to warn when attributes are not sorted.
 *
 * ## What is this?
 *
 * This package checks MDX JSX attribute order.
 *
 * ## When should I use this?
 *
 * You can use this package to check MDX JSX attribute order.
 *
 * ## API
 *
 * ### `unified().use(remarkLintMdxJsxAttributeSort)`
 *
 * Warn when attributes are not sorted.
 *
 * This package does not differentiate between what values attributes have,
 * or whether they are shorthand or not.
 *
 * Spreads must come first.
 *
 * ###### Parameters
 *
 * There are no parameters.
 *
 * ###### Returns
 *
 * Transform ([`Transformer` from `unified`][github-unified-transformer]).
 *
 * [api-remark-lint-mdx-jsx-attribute-sort]: #unifieduseremarklintmdxjsxattributesort
 * [github-unified-transformer]: https://github.com/unifiedjs/unified#transformer
 * [github-remark-mdx]: https://mdxjs.com/packages/remark-mdx/
 *
 * @module mdx-jsx-attribute-sort
 * @author Titus Wormer
 * @copyright Titus Wormer
 * @license MIT
 *
 * @example
 *   {"mdx": true, "name": "ok.mdx"}
 *
 *   <Saturn
 *     aphelion={1514.50}
 *     largest={false}
 *     perihelion={1352.55}
 *     satellites={146}
 *   />
 *
 * @example
 *   {"label": "input", "mdx": true, "name": "not-ok.mdx"}
 *
 *   <Saturn
 *     largest={false}
 *     perihelion={1352.55}
 *     satellites={146}
 *     aphelion={1514.50}
 *   />
 * @example
 *   {"label": "output", "mdx": true, "name": "not-ok.mdx"}
 *
 *   2:3-2:18: Unexpected attribute `largest` in 1st place, expected alphabetically sorted attributes, move it to 2nd place
 *   3:3-3:23: Unexpected attribute `perihelion` in 2nd place, expected alphabetically sorted attributes, move it to 3rd place
 *   4:3-4:19: Unexpected attribute `satellites` in 3rd place, expected alphabetically sorted attributes, move it to 4th place
 *   5:3-5:21: Unexpected attribute `aphelion` in 4th place, expected alphabetically sorted attributes, move it to 1st place
 *
 * @example
 *   {"label": "input", "mdx": true, "name": "spread.mdx"}
 *
 *   <Earth
 *     {...animals}
 *     symbol="🜨"
 *     {...humans}
 *   />
 * @example
 *   {"label": "output", "mdx": true, "name": "spread.mdx"}
 *
 *   4:3-4:14: Unexpected spread attribute after named attribute, expected spread attributes to come first
 */

/**
 * @import {Root} from 'mdast'
 * @import {MdxJsxAttribute} from 'mdast-util-mdx'
 */

import {ok as assert} from 'devlop'
import {lintRule} from 'unified-lint-rule'
import {visitParents} from 'unist-util-visit-parents'
import {VFileMessage} from 'vfile-message'

const pluralRules = new Intl.PluralRules('en-US', {type: 'ordinal'})

const remarkLintMdxJsxAttributeSort = lintRule(
  {
    origin: 'remark-lint:mdx-jsx-attribute-sort',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-mdx-jsx-attribute-sort#readme'
  },
  /**
   * @param {Root} tree
   *   Tree.
   * @returns {undefined}
   *   Nothing.
   */
  function (tree, file) {
    visitParents(tree, function (node, parents) {
      if (
        node.type === 'mdxJsxFlowElement' ||
        node.type === 'mdxJsxTextElement'
      ) {
        /** @type {Map<string, MdxJsxAttribute>} */
        const map = new Map()
        /** @type {Array<string>} */
        const current = []
        /** @type {MdxJsxAttribute | undefined} */
        let firstNamedAttribute

        for (const attribute of node.attributes) {
          if (attribute.type === 'mdxJsxExpressionAttribute') {
            if (firstNamedAttribute) {
              if (attribute.position) {
                file.message(
                  'Unexpected spread attribute after named attribute, expected spread attributes to come first',
                  {
                    ancestors: [...parents, node],
                    cause: new VFileMessage(
                      'First named attribute defined here',
                      {
                        ancestors: [...parents, node],
                        place: firstNamedAttribute.position,
                        ruleId: 'mdx-jsx-attribute-sort',
                        source: 'remark-lint'
                      }
                    ),
                    place: attribute.position
                  }
                )
              }
            } else {
              // Fine: there is no particular order for spread attributes.
              // They just have to come before the first named attribute
            }
          } else {
            // eslint-disable-next-line logical-assignment-operators
            if (!firstNamedAttribute) firstNamedAttribute = attribute
            current.push(attribute.name)
            map.set(attribute.name, attribute)
          }
        }

        // Intentional that they are made unique with `Set`.
        const actual = [...new Set(current)]
        const expected = [...actual].sort()

        for (const name of actual) {
          const actualIndex = actual.indexOf(name)
          const expectedIndex = expected.indexOf(name)
          const attribute = map.get(name)
          assert(attribute) // Always defined.

          if (actualIndex !== expectedIndex && attribute.position) {
            // assert(attribute)
            file.message(
              'Unexpected attribute `' +
                name +
                '` in ' +
                ordinal(actualIndex + 1) +
                ' place, expected alphabetically sorted attributes, move it to ' +
                ordinal(expectedIndex + 1) +
                ' place',
              {ancestors: [...parents, node], place: attribute.position}
            )
          }
        }
      }
    })
  }
)

export default remarkLintMdxJsxAttributeSort

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

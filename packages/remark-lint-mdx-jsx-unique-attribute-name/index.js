/**
 * remark-lint rule to warn when MDX JSX attribute names
 * are reused.
 *
 * ## What is this?
 *
 * This package check that MDX JSX attribute names are unique.
 *
 * ## When should I use this?
 *
 * You can use this package to check that MDX JSX attribute names
 * are unique.
 *
 * ## API
 *
 * ### `unified().use(remarkLintMdxJsxUniqueAttributeName)`
 *
 * Warn when MDX JSX attribute names are reused.
 *
 * ###### Parameters
 *
 * There are no parameters.
 *
 * ###### Returns
 *
 * Transform ([`Transformer` from `unified`][github-unified-transformer]).
 *
 * [api-remark-lint-mdx-jsx-unique-attribute-name]: #unifieduseremarklintmdxjsxuniqueattributename
 * [github-unified-transformer]: https://github.com/unifiedjs/unified#transformer
 *
 * @module mdx-jsx-unique-attribute-name
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 *
 * @example
 *   {"mdx": true, "name": "ok.mdx"}
 *
 *   <Component id="mercury" value="Mercury" />
 *
 * @example
 *   {"label": "input", "mdx": true, "name": "not-ok.mdx"}
 *
 *   <Component id="mercury" id="venus" value="Planet" />
 * @example
 *   {"label": "output", "mdx": true, "name": "not-ok.mdx"}
 *
 *   1:25-1:35: Unexpected attribute name with equal text, expected unique attribute names
 *
 * @example
 *   {"label": "input", "mdx": true, "name": "other-attributes.mdx"}
 *
 *   <Mercury closest />,
 *   <Venus aphelion={0.728213} />, and
 *   <Earth {...people} />.
 */

/**
 * @import {Nodes, Root} from 'mdast'
 * @import {MdxJsxAttribute} from 'mdast-util-mdx'
 */

// To do: check.
import {ok as assert} from 'devlop'
import {lintRule} from 'unified-lint-rule'
import {visitParents} from 'unist-util-visit-parents'
import {VFileMessage} from 'vfile-message'

const remarkLintMdxJsxUniqueAttributeName = lintRule(
  {
    origin: 'remark-lint:mdx-jsx-unique-attribute-name',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-mdx-jsx-unique-attribute-name#readme'
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
        /** @type {Map<string, Array<MdxJsxAttribute | Nodes>>} */
        const map = new Map()
        const ancestors = [...parents, node]

        for (const attribute of node.attributes) {
          // Ignore shorthand booleans and expressions using braces.
          if (attribute.type !== 'mdxJsxAttribute') continue

          const nodes = map.get(attribute.name)

          if (attribute.position && nodes) {
            const duplicateAncestors = [...nodes]
            const duplicate = duplicateAncestors.pop()
            assert(duplicate) // Always defined.
            assert(duplicate.type === 'mdxJsxAttribute')

            file.message(
              'Unexpected attribute name with equal text, expected unique attribute names',
              {
                ancestors,
                cause: new VFileMessage('Equal attribute name defined here', {
                  ancestors: duplicateAncestors,
                  place: duplicate.position,
                  source: 'remark-lint',
                  ruleId: 'no-duplicate-headings'
                }),
                place: attribute.position
              }
            )
          }

          map.set(attribute.name, [...ancestors, attribute])
        }
      }
    })
  }
)

export default remarkLintMdxJsxUniqueAttributeName

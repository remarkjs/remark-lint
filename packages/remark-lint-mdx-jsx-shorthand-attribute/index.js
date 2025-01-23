/**
 * remark-lint rule to warn when verbose attribute values are used.
 *
 * ## What is this?
 *
 * This package checks that shorthand attributes are used when
 * possible in MDX JSX.
 *
 * ## When should I use this?
 *
 * You can use this package to check that shorthand attributes are used
 * when possible in MDX JSX.
 *
 * This package does assume JavaScript:
 * that `planet` and `planet={true}` are equal.
 * JavaScript is almost always what is used with MDX.
 * But if you use other programming languages embedded in MDX
 * this package should not be used.
 *
 * ## API
 *
 * ### `unified().use(remarkLintMdxJsxShorthandAttribute)`
 *
 * Warn when verbose attribute values are used.
 *
 * ###### Parameters
 *
 * There are no parameters.
 *
 * ###### Returns
 *
 * Transform ([`Transformer` from `unified`][github-unified-transformer]).
 *
 * [api-remark-lint-mdx-jsx-shorthand-attribute]: #unifieduseremarklintmdxjsxshorthandattribute
 * [github-unified-transformer]: https://github.com/unifiedjs/unified#transformer
 *
 * @module mdx-jsx-shorthand-attribute
 * @author Titus Wormer
 * @copyright Titus Wormer
 * @license MIT
 *
 * @example
 *   {"mdx": true, "name": "ok.mdx"}
 *
 *   <Jupiter largest />
 *
 * @example
 *   {"label": "input", "mdx": true, "name": "not-ok.mdx"}
 *
 *   <Jupiter largest={true} />
 * @example
 *   {"label": "output", "mdx": true, "name": "not-ok.mdx"}
 *
 *   1:10-1:24: Unexpected verbose attribute value, expected shorthand boolean attribute
 */

/**
 * @import {Root} from 'mdast'
 * @import {} from 'mdast-util-mdx'
 */

import {lintRule} from 'unified-lint-rule'
import {visitParents} from 'unist-util-visit-parents'

const remarkLintMdxJsxShorthandAttribute = lintRule(
  {
    origin: 'remark-lint:mdx-jsx-shorthand-attribute',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-mdx-jsx-shorthand-attribute#readme'
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
        for (const attribute of node.attributes) {
          // Look for attributes with an expression value.
          if (
            attribute.type === 'mdxJsxAttribute' &&
            attribute.value &&
            typeof attribute.value === 'object' &&
            attribute.position &&
            attribute.value.data &&
            attribute.value.data.estree
          ) {
            const statement = attribute.value.data.estree.body[0]

            if (
              // Should always be one statement that is an expression.
              statement &&
              statement.type === 'ExpressionStatement' &&
              statement.expression.type === 'Literal' &&
              statement.expression.value === true
            ) {
              file.message(
                'Unexpected verbose attribute value, expected shorthand boolean attribute',
                {ancestors: [...parents, node], place: attribute.position}
              )
            }
          }
        }
      }
    })
  }
)

export default remarkLintMdxJsxShorthandAttribute

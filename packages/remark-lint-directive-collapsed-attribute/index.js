/**
 * remark-lint rule to warn when verbose attribute values are used.
 *
 * ## What is this?
 *
 * This package checks that collapsed attributes are used when
 * possible in directives.
 *
 * ## When should I use this?
 *
 * You can use this package to check that collapsed attributes are used
 * when possible in directives.
 *
 * ## API
 *
 * ### `unified().use(remarkLintDirectiveCollapsedAttribute)`
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
 * [api-remark-lint-directive-collapsed-attribute]: #unifieduseremarklintdirectivecollapsedattribute
 * [github-unified-transformer]: https://github.com/unifiedjs/unified#transformer
 *
 * @module directive-collapsed-attribute
 * @author Titus Wormer
 * @copyright Titus Wormer
 * @license MIT
 *
 * @example
 *   {"directive": true, "name": "ok.md"}
 *
 *   :planet[Jupiter]{largest}
 *
 * @example
 *   {"directive": true, "label": "input", "name": "not-ok.md"}
 *
 *   :planet[Jupiter]{largest=""}
 * @example
 *   {"directive": true, "label": "output", "name": "not-ok.md"}
 *
 *   1:18-1:25: Unexpected verbose attribute value, expected collapsed attribute
 */

/**
 * @import {} from 'mdast-util-directive'
 * @import {Root} from 'mdast'
 */

import {inferAttributes} from 'remark-lint-directive-quote-style'
import {lintRule} from 'unified-lint-rule'
import {visitParents} from 'unist-util-visit-parents'
import {location} from 'vfile-location'

const remarkLintDirectiveCollapsedAttribute = lintRule(
  {
    origin: 'remark-lint:directive-collapsed-attribute',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-directive-collapsed-attribute#readme'
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

        for (const attribute of attributes) {
          if (attribute.value && attribute.value[0] === '') {
            const start = toPoint(attribute.key[1])
            const end = toPoint(attribute.key[2])
            if (start && end) {
              file.message(
                'Unexpected verbose attribute value, expected collapsed attribute',
                {ancestors: [...parents, node], place: {start, end}}
              )
            }
          }
        }
      }
    })
  }
)

export default remarkLintDirectiveCollapsedAttribute

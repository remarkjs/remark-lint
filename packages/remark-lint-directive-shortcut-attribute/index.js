/**
 * remark-lint rule to warn when verbose attribute names are used.
 *
 * ## What is this?
 *
 * This package checks that shortcut attributes are used when possible in
 * directives.
 *
 * ## When should I use this?
 *
 * You can use this package to check that shortcut attributes are used
 * when possible in directives.
 *
 * ## API
 *
 * ### `unified().use(remarkLintDirectiveShortcutAttribute)`
 *
 * Warn when verbose attribute names are used.
 *
 * ###### Parameters
 *
 * There are no parameters.
 *
 * ###### Returns
 *
 * Transform ([`Transformer` from `unified`][github-unified-transformer]).
 *
 * [api-remark-lint-directive-shortcut-attribute]: #unifieduseremarklintdirectiveshortcutattribute
 * [github-unified-transformer]: https://github.com/unifiedjs/unified#transformer
 *
 * @module directive-shortcut-attribute
 * @author Titus Wormer
 * @copyright Titus Wormer
 * @license MIT
 *
 * @example
 *   {"directive": true, "name": "ok.md"}
 *
 *   :planet[Jupiter]{#jupiter.fifth.largest}
 *
 * @example
 *   {"directive": true, "label": "input", "name": "not-ok.md"}
 *
 *   :planet[Jupiter]{class="fifth largest" id="jupiter"}
 * @example
 *   {"directive": true, "label": "output", "name": "not-ok.md"}
 *
 *   1:18-1:23: Unexpected verbose attribute name `class`, expected shortcut attribute with `.`
 *   1:40-1:42: Unexpected verbose attribute name `id`, expected shortcut attribute with `#`
 */

/**
 * @import {} from 'mdast-util-directive'
 * @import {Root} from 'mdast'
 */

import {inferAttributes} from 'remark-lint-directive-quote-style'
import {lintRule} from 'unified-lint-rule'
import {visitParents} from 'unist-util-visit-parents'
import {location} from 'vfile-location'

const remarkLintDirectiveShortcutAttribute = lintRule(
  {
    origin: 'remark-lint:directive-shortcut-attribute',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-directive-shortcut-attribute#readme'
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
          const key = attribute.key[0]
          if (key === 'class' || key === 'id') {
            const start = toPoint(attribute.key[1])
            const end = toPoint(attribute.key[2])

            if (start && end) {
              file.message(
                'Unexpected verbose attribute name `' +
                  key +
                  '`, expected shortcut attribute with `' +
                  (key === 'id' ? '#' : '.') +
                  '`',
                {ancestors: [...parents, node], place: {start, end}}
              )
            }
          }
        }
      }
    })
  }
)

export default remarkLintDirectiveShortcutAttribute

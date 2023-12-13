/**
 * remark-lint rule to warn when list item markers are indented.
 *
 * ## What is this?
 *
 * This package checks indentation before list item markers.
 *
 * ## When should I use this?
 *
 * You can use this package to check that the style of list items is
 * consistent.
 *
 * ## API
 *
 * ### `unified().use(remarkLintListItemBulletIndent)`
 *
 * Warn when list item markers are indented.
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
 * There is no specific handling of indented list items in markdown.
 * While it is possible to use an indent to align ordered lists on their marker:
 *
 * ```markdown
 *   1. One
 *  10. Ten
 * 100. Hundred
 * ```
 *
 * …such a style is uncommon and hard to maintain as adding a 10th item
 * means 9 other items have to change (more arduous while unlikely would be
 * the 100th item).
 * So it is recommended to not indent items and to turn this rule on.
 *
 * ## Fix
 *
 * [`remark-stringify`][github-remark-stringify] formats all items without
 * indent.
 *
 * [api-remark-lint-list-item-bullet-indent]: #unifieduseremarklintlistitembulletindent
 * [github-remark-stringify]: https://github.com/remarkjs/remark/tree/main/packages/remark-stringify
 * [github-unified-transformer]: https://github.com/unifiedjs/unified#transformer
 *
 * @module list-item-bullet-indent
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @example
 *   {"name": "ok.md"}
 *
 *   Paragraph.
 *
 *   * List item
 *   * List item
 *
 * @example
 *   {"name": "not-ok.md", "label": "input"}
 *
 *   Paragraph.
 *
 *   ␠* List item
 *   ␠* List item
 *
 * @example
 *   {"name": "not-ok.md", "label": "output"}
 *
 *   3:2: Incorrect indentation before bullet: remove 1 space
 *   4:2: Incorrect indentation before bullet: remove 1 space
 */

/**
 * @typedef {import('mdast').Root} Root
 */

import plural from 'pluralize'
import {lintRule} from 'unified-lint-rule'
import {pointStart} from 'unist-util-position'
import {visit} from 'unist-util-visit'

const remarkLintListItemBulletIndent = lintRule(
  {
    origin: 'remark-lint:list-item-bullet-indent',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-list-item-bullet-indent#readme'
  },
  /**
   * @param {Root} tree
   *   Tree.
   * @returns {undefined}
   *   Nothing.
   */
  function (tree, file) {
    visit(tree, 'list', function (list, _, grandparent) {
      let index = -1
      const pointStartGrandparent = pointStart(grandparent)

      while (++index < list.children.length) {
        const item = list.children[index]
        const itemStart = pointStart(item)

        if (
          grandparent &&
          pointStartGrandparent &&
          itemStart &&
          grandparent.type === 'root'
        ) {
          const indent = itemStart.column - pointStartGrandparent.column

          if (indent) {
            file.message(
              'Incorrect indentation before bullet: remove ' +
                indent +
                ' ' +
                plural('space', indent),
              itemStart
            )
          }
        }
      }
    })
  }
)

export default remarkLintListItemBulletIndent

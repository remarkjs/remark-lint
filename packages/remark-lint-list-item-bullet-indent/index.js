/**
 * ## When should I use this?
 *
 * You can use this package to check that list items are not indented.
 *
 * ## API
 *
 * There are no options.
 *
 * ## Recommendation
 *
 * There is no specific handling of indented list items (or anything else) in
 * markdown.
 * While it is possible to use an indent to align ordered lists on their marker:
 *
 * ```markdown
 *   1. One
 *  10. Ten
 * 100. Hundred
 * ```
 *
 * …such a style is uncommon and a bit hard to maintain: adding a 10th item
 * means 9 other items have to change (more arduous, while unlikely, would be
 * the 100th item).
 * Hence, it’s recommended to not indent items and to turn this rule on.
 *
 * ## Fix
 *
 * [`remark-stringify`](https://github.com/remarkjs/remark/tree/main/packages/remark-stringify)
 * formats all items without indent.
 *
 * @module list-item-bullet-indent
 * @summary
 *   remark-lint rule to warn when list items are indented.
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
 *   ·* List item
 *   ·* List item
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

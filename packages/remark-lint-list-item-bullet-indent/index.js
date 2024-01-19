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
 *   1. Mercury
 *  10. Venus
 * 100. Earth
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
 *   Mercury.
 *
 *   * Venus.
 *   * Earth.
 *
 * @example
 *   {"label": "input", "name": "not-ok.md"}
 *
 *   Mercury.
 *
 *   ␠* Venus.
 *   ␠* Earth.
 *
 * @example
 *   {"label": "output", "name": "not-ok.md"}
 *
 *   3:2: Unexpected `1` space before list item, expected `0` spaces, remove them
 *   4:2: Unexpected `1` space before list item, expected `0` spaces, remove them
 */

/**
 * @typedef {import('mdast').Root} Root
 */

import pluralize from 'pluralize'
import {lintRule} from 'unified-lint-rule'
import {pointStart} from 'unist-util-position'

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
    const treeStart = pointStart(tree)

    // Unknown containers are not supported.
    if (!tree || tree.type !== 'root' || !treeStart) return

    for (const child of tree.children) {
      if (child.type !== 'list') continue

      const list = child

      for (const item of list.children) {
        const place = pointStart(item)

        /* c8 ignore next 2 -- doesn’t happen in tests as the whole tree is
         * generated. */
        if (!place) continue

        const actual = place.column - treeStart.column

        if (actual) {
          file.message(
            'Unexpected `' +
              actual +
              '` ' +
              pluralize('space', actual) +
              ' before list item, expected `0` spaces, remove them',
            {ancestors: [tree, list, item], place}
          )
        }
      }
    }
  }
)

export default remarkLintListItemBulletIndent

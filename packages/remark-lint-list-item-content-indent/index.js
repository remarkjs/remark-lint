/**
 * remark-lint rule to warn when the indent of list item content is not
 * consistent.
 *
 * ## What is this?
 *
 * This package checks the indent of list item content.
 * It checks the first thing in a list item and makes sure that all other
 * children have the same indent.
 *
 * ## When should I use this?
 *
 * You can use this package to check that list item content is indented
 * consistent.
 *
 * ## API
 *
 * ### `unified().use(remarkLintListItemContentIndent)`
 *
 * Warn when the indent of list item content is not consistent.
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
 * The position of the first child in a list item matters.
 * Further children should align with it.
 *
 * ## Fix
 *
 * [`remark-stringify`][github-remark-stringify] aligns the content of items.
 *
 * [api-remark-lint-list-item-content-indent]: #unifieduseremarklintlistitemcontentindent
 * [github-remark-stringify]: https://github.com/remarkjs/remark/tree/main/packages/remark-stringify
 * [github-unified-transformer]: https://github.com/unifiedjs/unified#transformer
 *
 * @module list-item-content-indent
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 *
 * @example
 *   {"name": "ok.md"}
 *
 *   1.␠Mercury.
 *   ␠␠␠***
 *   ␠␠␠* Venus.
 *
 * @example
 *   {"label": "input", "name": "not-ok.md"}
 *
 *   1.␠Mercury.
 *   ␠␠␠␠␠***
 *   ␠␠␠␠* Venus.
 * @example
 *   {"label": "output", "name": "not-ok.md"}
 *
 *   2:6: Unexpected unaligned list item child, expected to align with first child, remove `2` spaces
 *   3:5: Unexpected unaligned list item child, expected to align with first child, remove `1` space
 *
 * @example
 *   {"name": "ok-more.md"}
 *
 *   *␠␠␠Mercury.
 *   ␠␠␠␠***
 *
 * @example
 *   {"label": "input", "name": "not-ok-more.md"}
 *
 *   *␠␠␠Mercury.
 *   ␠␠␠␠␠␠***
 * @example
 *   {"label": "output", "name": "not-ok-more.md"}
 *
 *   2:7: Unexpected unaligned list item child, expected to align with first child, remove `2` spaces
 *
 * @example
 *   {"label": "input", "gfm": true, "name": "gfm-nok.md"}
 *
 *   1.␠[x] Mercury
 *   ␠␠␠␠␠***
 *   ␠␠␠␠* Venus
 * @example
 *   {"label": "output", "gfm": true, "name": "gfm-nok.md"}
 *
 *    2:6: Unexpected unaligned list item child, expected to align with first child, remove `2` spaces
 *    3:5: Unexpected unaligned list item child, expected to align with first child, remove `1` space
 *
 * @example
 *   {"label": "input", "name": "initial-blank.md"}
 *
 *   *
 *   ␠␠␠␠␠asd
 *
 *   ␠␠***
 * @example
 *   {"label": "output", "name": "initial-blank.md"}
 *
 *    4:3: Unexpected unaligned list item child, expected to align with first child, add `3` spaces
 */

/**
 * @typedef {import('mdast').Root} Root
 */

import {phrasing} from 'mdast-util-phrasing'
import pluralize from 'pluralize'
import {lintRule} from 'unified-lint-rule'
import {pointStart} from 'unist-util-position'
import {SKIP, visitParents} from 'unist-util-visit-parents'
import {VFileMessage} from 'vfile-message'

const remarkLintListItemContentIndent = lintRule(
  {
    origin: 'remark-lint:list-item-content-indent',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-list-item-content-indent#readme'
  },
  /**
   * @param {Root} tree
   *   Tree.
   * @returns {undefined}
   *   Nothing.
   */
  function (tree, file) {
    const value = String(file)
    /** @type {VFileMessage | undefined} */
    let cause

    visitParents(tree, function (node, parents) {
      // Do not walk into phrasing.
      if (phrasing(node)) {
        return SKIP
      }

      if (node.type !== 'listItem') return

      let index = -1
      /** @type {number | undefined} */
      let expected

      while (++index < node.children.length) {
        const child = node.children[index]
        const childStart = pointStart(child)

        if (!childStart || typeof childStart.offset !== 'number') {
          continue
        }

        let actual = childStart.column

        // Get indentation for the first child.
        // Only the first item can have a checkbox,
        // when it’s a paragraph,
        // so here we remove that from the column.
        if (index === 0 && typeof node.checked === 'boolean') {
          let beforeIndex = childStart.offset - 1

          while (
            beforeIndex > 0 &&
            value.charCodeAt(beforeIndex) !== 91 /* `[` */
          ) {
            beforeIndex--
          }

          actual -= childStart.offset - beforeIndex
        }

        if (expected) {
          // Warn for violating children.
          if (actual !== expected) {
            const difference = expected - actual
            const differenceAbsolute = Math.abs(difference)

            file.message(
              'Unexpected unaligned list item child, expected to align with first child, ' +
                (difference > 0 ? 'add' : 'remove') +
                ' `' +
                differenceAbsolute +
                '` ' +
                pluralize('space', differenceAbsolute),
              {ancestors: [...parents, node, child], cause, place: childStart}
            )
          }
        } else {
          expected = actual
          cause = new VFileMessage(
            'Alignment of first child first defined here',
            {
              ancestors: [...parents, node, child],
              place: childStart,
              ruleId: 'list-item-content-indent',
              source: 'remark-lint'
            }
          )
        }
      }
    })
  }
)

export default remarkLintListItemContentIndent

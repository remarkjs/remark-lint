/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module list-item-spacing
 * @fileoverview
 *   Warn when list looseness is incorrect, such as being tight when it should
 *   be loose, and vice versa.
 *
 *   According to the [`markdown-style-guide`](http://www.cirosantilli.com/markdown-style-guide/),
 *   if one or more list items in a list spans more than one line, the list is
 *   required to have blank lines between each item.
 *   And otherwise, there should not be blank lines between items.
 *
 *   By default, all items must be spread out (a blank line must be between
 *   them) if one or more items are multiline (span more than one line).
 *   Otherwise, the list must be tight (no blank line must be between items).
 *
 *   If you pass `{checkBlanks: true}`, all items must be spread out if one or
 *   more items contain blank lines.
 *   Otherwise, the list must be tight.
 *
 * @example
 *   {"name": "ok.md"}
 *
 *   A tight list:
 *
 *   -   item 1
 *   -   item 2
 *   -   item 3
 *
 *   A loose list:
 *
 *   -   Wrapped
 *       item
 *
 *   -   item 2
 *
 *   -   item 3
 *
 * @example
 *   {"name": "not-ok.md", "label": "input"}
 *
 *   A tight list:
 *
 *   -   Wrapped
 *       item
 *   -   item 2
 *   -   item 3
 *
 *   A loose list:
 *
 *   -   item 1
 *
 *   -   item 2
 *
 *   -   item 3
 *
 * @example
 *   {"name": "not-ok.md", "label": "output"}
 *
 *   4:9-5:1: Missing new line after list item
 *   5:11-6:1: Missing new line after list item
 *   10:11-12:1: Extraneous new line after list item
 *   12:11-14:1: Extraneous new line after list item
 *
 * @example
 *   {"name": "ok.md", "setting": {"checkBlanks": true}}
 *
 *   A tight list:
 *
 *   -   item 1
 *       - item 1.A
 *   -   item 2
 *       > Block quote
 *
 *   A loose list:
 *
 *   -   item 1
 *
 *       - item 1.A
 *
 *   -   item 2
 *
 *       > Block quote
 *
 * @example
 *   {"name": "not-ok.md", "setting": {"checkBlanks": true}, "label": "input"}
 *
 *   A tight list:
 *
 *   -   item 1
 *
 *       - item 1.A
 *   -   item 2
 *
 *       > Block quote
 *   -   item 3
 *
 *   A loose list:
 *
 *   -   item 1
 *       - item 1.A
 *
 *   -   item 2
 *       > Block quote
 *
 * @example
 *   {"name": "not-ok.md", "setting": {"checkBlanks": true}, "label": "output"}
 *
 *   5:15-6:1: Missing new line after list item
 *   8:18-9:1: Missing new line after list item
 *   14:15-16:1: Extraneous new line after list item
 */

/**
 * @typedef {import('mdast').Root} Root
 * @typedef {import('mdast').ListItem} ListItem
 *
 * @typedef Options
 * @property {boolean} [checkBlanks=false]
 */

import {lintRule} from 'unified-lint-rule'
import {visit} from 'unist-util-visit'
import {pointStart, pointEnd} from 'unist-util-position'
import {generated} from 'unist-util-generated'

const remarkLintListItemSpacing = lintRule(
  {
    origin: 'remark-lint:list-item-spacing',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-list-item-spacing#readme'
  },
  /** @type {import('unified-lint-rule').Rule<Root, Options>} */
  (tree, file, option = {}) => {
    const {checkBlanks} = option
    const infer = checkBlanks ? inferBlankLine : inferMultiline

    visit(tree, 'list', (node) => {
      if (!generated(node)) {
        let tight = true
        let index = -1

        while (++index < node.children.length) {
          if (infer(node.children[index])) {
            tight = false
            break
          }
        }

        index = 0 // Skip over first.

        while (++index < node.children.length) {
          const child = node.children[index - 1]
          const next = node.children[index]

          if (pointStart(next).line - pointEnd(child).line < 2 !== tight) {
            file.message(
              tight
                ? 'Extraneous new line after list item'
                : 'Missing new line after list item',
              {start: pointEnd(child), end: pointStart(next)}
            )
          }
        }
      }
    })
  }
)

export default remarkLintListItemSpacing

/**
 * @param {ListItem} node
 * @returns {boolean}
 */
function inferBlankLine(node) {
  let index = 0

  while (++index < node.children.length) {
    const child = node.children[index - 1]
    const next = node.children[index]

    // All children in `listItem`s are block.
    if (pointStart(next).line - pointEnd(child).line > 1) {
      return true
    }
  }

  return false
}

/**
 * @param {ListItem} node
 * @returns {boolean}
 */
function inferMultiline(node) {
  return (
    pointEnd(node.children[node.children.length - 1]).line -
      pointStart(node.children[0]).line >
    0
  )
}

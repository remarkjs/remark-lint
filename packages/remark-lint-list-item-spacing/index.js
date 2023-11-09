/**
 * ## When should I use this?
 *
 * You can use this package to check that lists are loose or tight when
 * they should be.
 *
 * ## API
 *
 * The following options (default: `undefined`) are accepted:
 *
 * *   `Object` with the following fields:
 *     *   `checkBlanks` (`boolean`, default: `false`)
 *         — adhere to CommonMark looseness instead of markdown-style-guide
 *         preference
 *
 * ## Recommendation
 *
 * First, some background.
 * There are two types of lists in markdown (other than ordered and unordered):
 * tight and loose lists.
 * Lists are tight by default but if there is a blank line between two list
 * items or between two blocks inside an item, that turns the whole list into a
 * loose list.
 * When turning markdown into HTML, paragraphs in tight lists are not wrapped
 * in `<p>` tags.
 *
 * This rule defaults to the
 * [`markdown style guide`](https://cirosantilli.com/markdown-style-guide/)
 * preference for which lists should be loose or not: loose when at least one
 * item spans more than one line, tight otherwise.
 * With `{checkBlanks: true}`, this rule dictates that when at least one item is
 * loose, all items must be loose.
 *
 * @module list-item-spacing
 * @summary
 *   remark-lint rule to warn when lists are loose when they should be tight,
 *   or vice versa.
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
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
 *   {"name": "ok.md", "config": {"checkBlanks": true}}
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
 *   {"name": "not-ok.md", "config": {"checkBlanks": true}, "label": "input"}
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
 *   {"name": "not-ok.md", "config": {"checkBlanks": true}, "label": "output"}
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
 *   Options.
 * @property {boolean | null | undefined} [checkBlanks=false]
 *   Adhere to CommonMark looseness instead of markdown-style-guide preference.
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
          const start = pointEnd(node.children[index - 1])
          const end = pointStart(node.children[index])

          if (start && end && end.line - start.line < 2 !== tight) {
            file.message(
              tight
                ? 'Extraneous new line after list item'
                : 'Missing new line after list item',
              {start, end}
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
    const start = pointStart(node.children[index])
    const end = pointEnd(node.children[index - 1])

    // All children in `listItem`s are block.
    if (start && end && start.line - end.line > 1) {
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
  const end = pointEnd(node.children[node.children.length - 1])
  const start = pointStart(node.children[0])

  return Boolean(start && end && end.line - start.line > 0)
}

/**
 * ## When should I use this?
 *
 * You can use this package to check that tables are not indented.
 * Tables are a GFM feature enabled with
 * [`remark-gfm`](https://github.com/remarkjs/remark-gfm).
 *
 * ## API
 *
 * There are no options.
 *
 * ## Recommendation
 *
 * There is no specific handling of indented tables (or anything else) in
 * markdown.
 * Hence, it’s recommended to not indent tables and to turn this rule on.
 *
 * ## Fix
 *
 * [`remark-gfm`](https://github.com/remarkjs/remark-gfm)
 * formats all tables without indent.
 *
 * @module no-table-indentation
 * @summary
 *   remark-lint rule to warn when tables are indented.
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @example
 *   {"name": "ok.md", "gfm": true}
 *
 *   Paragraph.
 *
 *   | A     | B     |
 *   | ----- | ----- |
 *   | Alpha | Bravo |
 *
 * @example
 *   {"name": "not-ok.md", "label": "input", "gfm": true}
 *
 *   Paragraph.
 *
 *   ···| A     | B     |
 *   ···| ----- | ----- |
 *   ···| Alpha | Bravo |
 *
 * @example
 *   {"name": "not-ok.md", "label": "output", "gfm": true}
 *
 *   3:4: Do not indent table rows
 *   4:4: Do not indent table rows
 *   5:4: Do not indent table rows
 *
 * @example
 *   {"name": "not-ok-blockquote.md", "label": "input", "gfm": true}
 *
 *   >··| A |
 *   >·| - |
 *
 * @example
 *   {"name": "not-ok-blockquote.md", "label": "output", "gfm": true}
 *
 *   1:4: Do not indent table rows
 *
 * @example
 *   {"name": "not-ok-list.md", "label": "input", "gfm": true}
 *
 *   -···paragraph
 *
 *   ·····| A |
 *   ····| - |
 *
 * @example
 *   {"name": "not-ok-list.md", "label": "output", "gfm": true}
 *
 *   3:6: Do not indent table rows
 */

/**
 * @typedef {import('mdast').Root} Root
 */

import {lintRule} from 'unified-lint-rule'
import {visit, SKIP} from 'unist-util-visit'
import {pointStart, pointEnd} from 'unist-util-position'
import {location} from 'vfile-location'

const remarkLintNoTableIndentation = lintRule(
  {
    origin: 'remark-lint:no-table-indentation',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-no-table-indentation#readme'
  },
  /** @type {import('unified-lint-rule').Rule<Root, void>} */
  (tree, file) => {
    const value = String(file)
    const loc = location(value)

    visit(tree, 'table', (node, _, parent) => {
      const end = pointEnd(node).line
      let line = pointStart(node).line
      let column = 0

      if (parent && parent.type === 'root') {
        column = 1
      } else if (parent && parent.type === 'blockquote') {
        column = pointStart(parent).column + 2
      } else if (parent && parent.type === 'listItem') {
        column = pointStart(parent.children[0]).column

        // Skip past the first line if we’re the first child of a list item.
        /* c8 ignore next 3 */
        if (parent.children[0] === node) {
          line++
        }
      }

      // In a parent we don’t know, exit.
      if (!column || !line) {
        return
      }

      while (line <= end) {
        let offset = loc.toOffset({line, column})
        const lineColumn = offset

        while (/[ \t]/.test(value.charAt(offset - 1))) {
          offset--
        }

        if (!offset || /[\r\n>]/.test(value.charAt(offset - 1))) {
          offset = lineColumn

          while (/[ \t]/.test(value.charAt(offset))) {
            offset++
          }

          if (lineColumn !== offset) {
            file.message('Do not indent table rows', loc.toPoint(offset))
          }
        }

        line++
      }

      return SKIP
    })
  }
)

export default remarkLintNoTableIndentation

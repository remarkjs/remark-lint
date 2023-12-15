/**
 * remark-lint rule to warn when GFM tables are indented.
 *
 * ## What is this?
 *
 * This package checks the indent of GFM tables.
 * Tables are a GFM feature enabled with
 * [`remark-gfm`][github-remark-gfm].
 *
 * ## When should I use this?
 *
 * You can use this package to check that tables are consistent.
 *
 * ## API
 *
 * ### `unified().use(remarkLintNoTableIndentation)`
 *
 * Warn when GFM tables are indented.
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
 * There is no specific handling of indented tables (or anything else) in
 * markdown.
 * So it’s recommended to not indent tables and to turn this rule on.
 *
 * ## Fix
 *
 * [`remark-stringify`][github-remark-stringify] with
 * [`remark-gfm`][github-remark-gfm] formats all tables without indent.
 *
 * [api-remark-lint-no-table-indentation]: #unifieduseremarklintnotableindentation
 * [github-remark-gfm]: https://github.com/remarkjs/remark-gfm
 * [github-remark-stringify]: https://github.com/remarkjs/remark/tree/main/packages/remark-stringify
 * [github-unified-transformer]: https://github.com/unifiedjs/unified#transformer
 *
 * @module no-table-indentation
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
 *   ␠␠␠| A     | B     |
 *   ␠␠␠| ----- | ----- |
 *   ␠␠␠| Alpha | Bravo |
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
 *   >␠␠| A |
 *   >␠| - |
 *
 * @example
 *   {"name": "not-ok-blockquote.md", "label": "output", "gfm": true}
 *
 *   1:4: Do not indent table rows
 *
 * @example
 *   {"name": "not-ok-list.md", "label": "input", "gfm": true}
 *
 *   -␠␠␠paragraph
 *
 *   ␠␠␠␠␠| A |
 *   ␠␠␠␠| - |
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
import {pointEnd, pointStart} from 'unist-util-position'
import {SKIP, visit} from 'unist-util-visit'
import {location} from 'vfile-location'

const remarkLintNoTableIndentation = lintRule(
  {
    origin: 'remark-lint:no-table-indentation',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-no-table-indentation#readme'
  },
  /**
   * @param {Root} tree
   *   Tree.
   * @returns {undefined}
   *   Nothing.
   */
  function (tree, file) {
    const value = String(file)
    const loc = location(value)

    visit(tree, 'table', function (node, _, parent) {
      const parentStart = pointStart(parent)
      const end = pointEnd(node)
      const start = pointStart(node)
      /** @type {number | undefined} */
      let column

      if (!start || !end) return

      let line = start.line

      if (parent && parent.type === 'root') {
        column = 1
      } else if (parent && parent.type === 'blockquote') {
        if (parentStart) column = parentStart.column + 2
      } else if (parent && parent.type === 'listItem') {
        const head = parent.children[0]
        column = pointStart(head)?.column

        /* c8 ignore next 4 -- skip past the first line if we’re the first
         * child of a list item. */
        if (typeof line === 'number' && head === node) {
          line++
        }
      }

      /* c8 ignore next -- in a parent we don’t know, exit */
      if (!column) return

      while (line <= end.line) {
        let offset = loc.toOffset({line, column})

        /* c8 ignore next 3 -- we get here if we have offsets. */
        if (typeof offset !== 'number') {
          continue
        }

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

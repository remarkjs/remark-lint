/**
 * ## When should I use this?
 *
 * You can use this package to check that table cell dividers are aligned.
 * Tables are a GFM feature enabled with
 * [`remark-gfm`](https://github.com/remarkjs/remark-gfm).
 *
 * ## API
 *
 * There are no options.
 *
 * ## Recommendation
 *
 * While aligning table dividers improves their legibility, it is somewhat
 * hard to maintain manually, especially for tables with many rows.
 *
 * ## Fix
 *
 * [`remark-gfm`](https://github.com/remarkjs/remark-gfm)
 * aligns table dividers by default.
 * Pass
 * [`tablePipeAlign: false`](https://github.com/remarkjs/remark-gfm#optionstablepipealign)
 * to use a more compact style.
 *
 * Aligning characters is impossible because whether they look aligned or not
 * depends on where the markup is shown: some characters (such as emoji or
 * Chinese characters) show smaller or bigger in different places.
 * You can pass your own
 * [`stringLength`](https://github.com/remarkjs/remark-gfm#optionsstringlength)
 * to `remark-gfm`, in which case this rule must be turned off.
 *
 * @module table-pipe-alignment
 * @summary
 *   remark-lint rule to warn when table cells are inconsistently padded.
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @example
 *   {"name": "ok.md", "gfm": true}
 *
 *   | A     | B     |
 *   | ----- | ----- |
 *   | Alpha | Bravo |
 *
 * @example
 *   {"name": "not-ok.md", "label": "input", "gfm": true}
 *
 *   | A | B |
 *   | -- | -- |
 *   | Alpha | Bravo |
 *
 * @example
 *   {"name": "not-ok.md", "label": "output", "gfm": true}
 *
 *   3:9-3:10: Misaligned table fence
 *   3:17-3:18: Misaligned table fence
 *
 * @example
 *   {"name": "ok-empty-columns.md", "gfm": true}
 *
 *   | | B     |   |
 *   |-| ----- | - |
 *   | | Bravo |   |
 *
 * @example
 *   {"name": "ok-empty-cells.md", "gfm": true}
 *
 *   |   |     |         |
 *   | - | --- | ------- |
 *   | A | Bra | Charlie |
 */

/**
 * @typedef {import('mdast').Root} Root
 */

import {lintRule} from 'unified-lint-rule'
import {pointEnd, pointStart} from 'unist-util-position'
import {visit} from 'unist-util-visit'

const remarkLintTablePipeAlignment = lintRule(
  {
    origin: 'remark-lint:table-pipe-alignment',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-table-pipe-alignment#readme'
  },
  /**
   * @param {Root} tree
   *   Tree.
   * @returns {undefined}
   *   Nothing.
   */
  function (tree, file) {
    const value = String(file)

    visit(tree, 'table', function (node) {
      /** @type {Array<number>} */
      const indices = []
      let index = -1

      while (++index < node.children.length) {
        const row = node.children[index]
        const begin = pointStart(row)
        let column = -2 // Start without a first cell.

        while (++column < row.children.length) {
          const cell = row.children[column]
          const nextColumn = column + 1
          const next = row.children[nextColumn]
          let initial = cell
            ? cell.children.length === 0
              ? pointStart(cell)?.offset
              : pointEnd(cell.children[cell.children.length - 1])?.offset
            : pointStart(row)?.offset
          let final = next
            ? next.children.length === 0
              ? pointEnd(next)?.offset
              : pointStart(next.children[0])?.offset
            : pointEnd(row)?.offset

          if (
            typeof initial !== 'number' ||
            typeof final !== 'number' ||
            typeof begin?.offset !== 'number'
          ) {
            continue
          }

          if (cell && cell.children.length === 0) initial++
          if (next && next.children.length === 0) final--

          const fence = value.slice(initial, final)
          const pos = initial + fence.indexOf('|') - begin.offset + 1

          // First cell at this column.
          if (indices[nextColumn] === undefined) {
            indices[nextColumn] = pos
          } else if (pos !== indices[nextColumn]) {
            file.message('Misaligned table fence', {
              start: {line: begin.line, column: pos},
              end: {line: begin.line, column: pos + 1}
            })
          }
        }
      }
    })
  }
)

export default remarkLintTablePipeAlignment

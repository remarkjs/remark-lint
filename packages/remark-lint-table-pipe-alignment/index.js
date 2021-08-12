/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module table-pipe-alignment
 * @fileoverview
 *   Warn when table pipes are not aligned.
 *
 *   ## Fix
 *
 *   [`remark-stringify`](https://github.com/remarkjs/remark/tree/HEAD/packages/remark-stringify)
 *   tries to align tables by default.
 *   Pass
 *   [`paddedTable: false`](https://github.com/remarkjs/remark/tree/HEAD/packages/remark-stringify#optionspaddedtable)
 *   to not align cells.
 *
 *   Aligning cells perfectly is impossible as some characters (such as emoji or
 *   Chinese characters) are rendered differently in different browsers,
 *   terminals, and editors.
 *   You can pass your own
 *   [`stringLength`](https://github.com/remarkjs/remark/tree/HEAD/packages/remark-stringify#optionsstringlength)
 *   function to customize how cells are aligned.
 *   In that case, this rule must be turned off.
 *
 *   See [Using remark to fix your Markdown](https://github.com/remarkjs/remark-lint#using-remark-to-fix-your-markdown)
 *   on how to automatically fix warnings for this rule.
 *
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
 */

/**
 * @typedef {import('mdast').Root} Root
 * @typedef {'-'|'*'|'+'} Marker
 * @typedef {'consistent'|Marker} Options
 */

import {lintRule} from 'unified-lint-rule'
import {visit} from 'unist-util-visit'
import {pointStart, pointEnd} from 'unist-util-position'

const remarkLintTablePipeAlignment = lintRule(
  'remark-lint:table-pipe-alignment',
  /** @type {import('unified-lint-rule').Rule<Root, void>} */
  (tree, file) => {
    const value = String(file)

    visit(tree, 'table', (node) => {
      /** @type {number[]} */
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
          const initial = cell ? pointEnd(cell).offset : pointStart(row).offset
          const final = next ? pointStart(next).offset : pointEnd(row).offset

          if (
            typeof initial !== 'number' ||
            typeof final !== 'number' ||
            typeof begin.offset !== 'number'
          ) {
            continue
          }

          const fence = value.slice(initial, final)
          const pos = initial + fence.indexOf('|') - begin.offset + 1

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

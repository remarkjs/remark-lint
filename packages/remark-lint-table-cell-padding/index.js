/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module table-cell-padding
 * @fileoverview
 *   Warn when table cells are incorrectly padded.
 *
 *   Options: `'consistent'`, `'padded'`, or `'compact'`, default: `'consistent'`.
 *
 *   `'consistent'` detects the first used cell padding style and warns when
 *   subsequent cells use different styles.
 *
 *   ## Fix
 *
 *   [`remark-stringify`](https://github.com/remarkjs/remark/tree/HEAD/packages/remark-stringify)
 *   formats tables with padding by default.
 *   Pass
 *   [`spacedTable: false`](https://github.com/remarkjs/remark/tree/HEAD/packages/remark-stringify#optionsspacedtable)
 *   to not use padding.
 *
 *   See [Using remark to fix your Markdown](https://github.com/remarkjs/remark-lint#using-remark-to-fix-your-markdown)
 *   on how to automatically fix warnings for this rule.
 *
 * @example {"name": "ok.md", "setting": "padded", "gfm": true}
 *
 *   | A     | B     |
 *   | ----- | ----- |
 *   | Alpha | Bravo |
 *
 * @example {"name": "not-ok.md", "label": "input", "setting": "padded", "gfm": true}
 *
 *   | A    |    B |
 *   | :----|----: |
 *   | Alpha|Bravo |
 *
 *   | C      |    D |
 *   | :----- | ---: |
 *   |Charlie | Delta|
 *
 *   Too much padding isn’t good either:
 *
 *   | E     | F        |   G    |      H |
 *   | :---- | -------- | :----: | -----: |
 *   | Echo  | Foxtrot  |  Golf  |  Hotel |
 *
 * @example {"name": "not-ok.md", "label": "output", "setting": "padded", "gfm": true}
 *
 *   3:8: Cell should be padded
 *   3:9: Cell should be padded
 *   7:2: Cell should be padded
 *   7:17: Cell should be padded
 *   13:9: Cell should be padded with 1 space, not 2
 *   13:20: Cell should be padded with 1 space, not 2
 *   13:21: Cell should be padded with 1 space, not 2
 *   13:29: Cell should be padded with 1 space, not 2
 *   13:30: Cell should be padded with 1 space, not 2
 *
 * @example {"name": "ok.md", "setting": "compact", "gfm": true}
 *
 *   |A    |B    |
 *   |-----|-----|
 *   |Alpha|Bravo|
 *
 * @example {"name": "not-ok.md", "label": "input", "setting": "compact", "gfm": true}
 *
 *   |   A    | B    |
 *   |   -----| -----|
 *   |   Alpha| Bravo|
 *
 *   |C      |     D|
 *   |:------|-----:|
 *   |Charlie|Delta |
 *
 * @example {"name": "not-ok.md", "label": "output", "setting": "compact", "gfm": true}
 *
 *   3:2: Cell should be compact
 *   3:11: Cell should be compact
 *   7:16: Cell should be compact
 *
 * @example {"name": "ok-padded.md", "setting": "consistent", "gfm": true}
 *
 *   | A     | B     |
 *   | ----- | ----- |
 *   | Alpha | Bravo |
 *
 *   | C       | D     |
 *   | ------- | ----- |
 *   | Charlie | Delta |
 *
 * @example {"name": "not-ok-padded.md", "label": "input", "setting": "consistent", "gfm": true}
 *
 *   | A     | B     |
 *   | ----- | ----- |
 *   | Alpha | Bravo |
 *
 *   | C      |     D |
 *   | :----- | ----: |
 *   |Charlie | Delta |
 *
 * @example {"name": "not-ok-padded.md", "label": "output", "setting": "consistent", "gfm": true}
 *
 *   7:2: Cell should be padded
 *
 * @example {"name": "ok-compact.md", "setting": "consistent", "gfm": true}
 *
 *   |A    |B    |
 *   |-----|-----|
 *   |Alpha|Bravo|
 *
 *   |C      |D    |
 *   |-------|-----|
 *   |Charlie|Delta|
 *
 * @example {"name": "not-ok-compact.md", "label": "input", "setting": "consistent", "gfm": true}
 *
 *   |A    |B    |
 *   |-----|-----|
 *   |Alpha|Bravo|
 *
 *   |C      |     D|
 *   |:------|-----:|
 *   |Charlie|Delta |
 *
 * @example {"name": "not-ok-compact.md", "label": "output", "setting": "consistent", "gfm": true}
 *
 *   7:16: Cell should be compact
 *
 * @example {"name": "not-ok.md", "label": "output", "setting": "💩", "positionless": true, "gfm": true}
 *
 *   1:1: Incorrect table cell padding style `💩`, expected `'padded'`, `'compact'`, or `'consistent'`
 *
 * @example {"name": "empty.md", "label": "input", "setting": "padded", "gfm": true}
 *
 *   <!-- Empty cells are OK, but those surrounding them may not be. -->
 *
 *   |        | Alpha | Bravo|
 *   | ------ | ----- | ---: |
 *   | Charlie|       |  Echo|
 *
 * @example {"name": "empty.md", "label": "output", "setting": "padded", "gfm": true}
 *
 *   3:25: Cell should be padded
 *   5:10: Cell should be padded
 *   5:25: Cell should be padded
 *
 * @example {"name": "missing-body.md", "setting": "padded", "gfm": true}
 *
 *   <!-- Missing cells are fine as well. -->
 *
 *   | Alpha | Bravo   | Charlie |
 *   | ----- | ------- | ------- |
 *   | Delta |
 *   | Echo  | Foxtrot |
 */

import {lintRule} from 'unified-lint-rule'
import {visit, SKIP} from 'unist-util-visit'
import {pointStart, pointEnd} from 'unist-util-position'
import {generated} from 'unist-util-generated'

const styles = {null: true, padded: true, compact: true}

const remarkLintTableCellPadding = lintRule(
  'remark-lint:table-cell-padding',
  (tree, file, option) => {
    const preferred =
      typeof option === 'string' && option !== 'consistent' ? option : null

    if (styles[preferred] !== true) {
      file.fail(
        'Incorrect table cell padding style `' +
          preferred +
          "`, expected `'padded'`, `'compact'`, or `'consistent'`"
      )
    }

    visit(tree, 'table', (node) => {
      const rows = node.children
      const sizes = Array.from({length: node.align.length})
      const entries = []
      let index = -1

      if (generated(node)) return

      // Check rows.
      while (++index < rows.length) {
        const row = rows[index]
        let column = -1

        // Check fences (before, between, and after cells).
        while (++column < row.children.length) {
          const cell = row.children[column]

          if (cell && cell.children.length > 0) {
            const contentStart = pointStart(cell.children[0]).offset
            const contentEnd = pointEnd(
              cell.children[cell.children.length - 1]
            ).offset

            entries.push({
              node: cell,
              start: contentStart - pointStart(cell).offset - (column ? 0 : 1),
              end: pointEnd(cell).offset - contentEnd - 1,
              column
            })

            // Detect max space per column.
            sizes[column] = Math.max(
              sizes[column] || 0,
              contentEnd - contentStart
            )
          }
        }
      }

      const style = preferred
        ? preferred === 'padded'
          ? 1
          : 0
        : entries[0] && (!entries[0].start || !entries[0].end)
        ? 0
        : 1

      index = -1

      while (++index < entries.length) {
        checkSide('start', entries[index], style, sizes)
        checkSide('end', entries[index], style, sizes)
      }

      return SKIP
    })

    function checkSide(side, entry, style, sizes) {
      const cell = entry.node
      const column = entry.column
      const spacing = entry[side]

      if (spacing === undefined || spacing === style) {
        return
      }

      let reason = 'Cell should be '

      if (style === 0) {
        // Ignore every cell except the biggest in the column.
        if (size(cell) < sizes[column]) {
          return
        }

        reason += 'compact'
      } else {
        reason += 'padded'

        if (spacing > style) {
          // May be right or center aligned.
          if (size(cell) < sizes[column]) {
            return
          }

          reason += ' with 1 space, not ' + spacing
        }
      }

      let point

      if (side === 'start') {
        point = pointStart(cell)
        if (!column) {
          point.column++
          point.offset++
        }
      } else {
        point = pointEnd(cell)
        point.column--
        point.offset--
      }

      file.message(reason, point)
    }
  }
)

export default remarkLintTableCellPadding

function size(node) {
  return (
    pointEnd(node.children[node.children.length - 1]).offset -
    pointStart(node.children[0]).offset
  )
}

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

'use strict'

var rule = require('unified-lint-rule')
var visit = require('unist-util-visit')
var position = require('unist-util-position')
var generated = require('unist-util-generated')

module.exports = rule('remark-lint:table-cell-padding', tableCellPadding)

var start = position.start
var end = position.end

var styles = {null: true, padded: true, compact: true}

function tableCellPadding(tree, file, option) {
  var preferred =
    typeof option === 'string' && option !== 'consistent' ? option : null

  if (styles[preferred] !== true) {
    file.fail(
      'Incorrect table cell padding style `' +
        preferred +
        "`, expected `'padded'`, `'compact'`, or `'consistent'`"
    )
  }

  visit(tree, 'table', visitor)

  function visitor(node) {
    var rows = node.children
    var sizes = new Array(node.align.length)
    var length = generated(node) ? -1 : rows.length
    var index = -1
    var entries = []
    var style
    var row
    var cells
    var column
    var cellCount
    var cell
    var entry
    var contentStart
    var contentEnd

    // Check rows.
    while (++index < length) {
      row = rows[index]
      cells = row.children
      cellCount = cells.length
      column = -1

      // Check fences (before, between, and after cells).
      while (++column < cellCount) {
        cell = cells[column]

        if (cell && cell.children.length !== 0) {
          contentStart = start(cell.children[0]).offset
          contentEnd = end(cell.children[cell.children.length - 1]).offset

          entries.push({
            node: cell,
            start: contentStart - start(cell).offset - (column ? 0 : 1),
            end: end(cell).offset - contentEnd - 1,
            column: column
          })

          // Detect max space per column.
          sizes[column] = Math.max(
            sizes[column] || 0,
            contentEnd - contentStart
          )
        }
      }
    }

    if (preferred) {
      style = preferred === 'padded' ? 1 : 0
    } else {
      style = entries[0] && (!entries[0].start || !entries[0].end) ? 0 : 1
    }

    index = -1
    length = entries.length

    while (++index < length) {
      entry = entries[index]
      checkSide('start', entry, style, sizes)
      checkSide('end', entry, style, sizes)
    }

    return visit.SKIP
  }

  function checkSide(side, entry, style, sizes) {
    var cell = entry.node
    var spacing = entry[side]
    var column = entry.column
    var reason
    var point

    if (spacing === undefined || spacing === style) {
      return
    }

    reason = 'Cell should be '

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

    if (side === 'start') {
      point = start(cell)
      if (!column) {
        point.column++
        point.offset++
      }
    } else {
      point = end(cell)
      point.column--
      point.offset--
    }

    file.message(reason, point)
  }
}

function size(node) {
  return (
    end(node.children[node.children.length - 1]).offset -
    start(node.children[0]).offset
  )
}

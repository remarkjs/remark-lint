/**
 * remark-lint rule to warn when GFM table cells are aligned inconsistently.
 *
 * ## What is this?
 *
 * This package checks table cell dividers are aligned.
 * Tables are a GFM feature enabled with [`remark-gfm`][github-remark-gfm].
 *
 * ## When should I use this?
 *
 * You can use this package to check that tables are consistent.
 *
 * ## API
 *
 * ### `unified().use(remarkLintTablePipeAlignment)`
 *
 * Warn when GFM table cells are aligned inconsistently.
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
 * While aligning table dividers improves their legibility,
 * it is somewhat hard to maintain manually,
 * especially for tables with many rows.
 *
 * ## Fix
 *
 * [`remark-stringify`][github-remark-stringify] with
 * [`remark-gfm`][github-remark-gfm] aligns table cell dividers by default.
 * Pass `tablePipeAlign: false` to use a more compact style.
 *
 * Aligning perfectly in all cases is not possible because whether characters
 * look aligned or not depends on where the markup is shown.
 * Some characters (such as emoji or Chinese characters) show smaller or bigger
 * in different places.
 * You can pass a `stringLength` function to `remark-gfm`,
 * to align better for your use case,
 * in which case this rule must be turned off.
 *
 * [api-remark-lint-table-pipe-alignment]: #unifieduseremarklinttablepipealignment
 * [github-remark-gfm]: https://github.com/remarkjs/remark-gfm
 * [github-remark-stringify]: https://github.com/remarkjs/remark/tree/main/packages/remark-stringify
 * [github-unified-transformer]: https://github.com/unifiedjs/unified#transformer
 *
 * @module table-pipe-alignment
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 *
 * @example
 *   {"gfm": true, "name": "ok.md"}
 *
 *   This rule is only about the alignment of pipes across rows:
 *
 *   | Planet  | Mean anomaly (°) |
 *   | ------- | ---------------: |
 *   | Mercury |          174 796 |
 *
 *   |Planet|Mean anomaly (°)|
 *   |------|---------------:|
 *   |Venus |         50 115 |
 *
 * @example
 *   {"gfm": true, "label": "input", "name": "not-ok.md"}
 *
 *   | Planet | Mean anomaly (°) |
 *   | - | -: |
 *   | Mercury | 174 796 |
 *
 * @example
 *   {"gfm": true, "label": "output", "name": "not-ok.md"}
 *
 *   1:10: Unexpected unaligned cell, expected aligned pipes, add `1` space
 *   2:5: Unexpected unaligned cell, expected aligned pipes, add `6` spaces (or add `-` to pad alignment row cells)
 *   2:7: Unexpected unaligned cell, expected aligned pipes, add `14` spaces (or add `-` to pad alignment row cells)
 *   3:13: Unexpected unaligned cell, expected aligned pipes, add `9` spaces
 *
 * @example
 *   {"gfm": true, "name": "empty.md"}
 *
 *   |         | Satellites |     |
 *   | ------- | ---------- | --- |
 *   | Mercury |            |     |
 *
 *   | aaa | bbb | ccc | ddd |
 *   | --- | :-- | :-: | --: |
 *   |     |     |     |     |
 *
 * @example
 *   {"gfm": true, "name": "aligned-pipes-but-weird-content.md"}
 *
 *   | Planet | Moon | Mercury | Venus | Sun | Mars | Jupiter | Saturn |
 *   | ------ | ---- | :------ | :---- | --: | ---: | :-----: | :----: |
 *   | Symbol |    ☾ | ☿       |   ♀   | ☉   |   ♂  | ♃       |      ♄ |
 *
 * @example
 *   {"gfm": true, "name": "missing-cells.md"}
 *
 *   | Planet  | Symbol | Satellites |
 *   | ------- | ------ | ---------- |
 *   | Mercury |
 *   | Venus   | ♀      |
 *   | Earth   | ♁      | 1          |
 *   | Mars    | ♂      | 2          | 19 412 |
 *
 * @example
 *   {"gfm": true, "label": "input", "name": "alignment.md"}
 *
 *   | Planet | Symbol | Satellites | Mean anomaly (°) |
 *   | - | :- | :-: | -: |
 *   | Mercury | ☿ | None | 174 796 |
 * @example
 *   {"gfm": true, "label": "output", "name": "alignment.md"}
 *
 *   1:10: Unexpected unaligned cell, expected aligned pipes, add `1` space
 *   2:5: Unexpected unaligned cell, expected aligned pipes, add `6` spaces (or add `-` to pad alignment row cells)
 *   2:10: Unexpected unaligned cell, expected aligned pipes, add `4` spaces (or add `-` to pad alignment row cells)
 *   2:12: Unexpected unaligned cell, expected aligned pipes, add `4` spaces (or add `-` to pad alignment row cells)
 *   2:16: Unexpected unaligned cell, expected aligned pipes, add `3` spaces (or add `-` to pad alignment row cells)
 *   2:18: Unexpected unaligned cell, expected aligned pipes, add `14` spaces (or add `-` to pad alignment row cells)
 *   3:15: Unexpected unaligned cell, expected aligned pipes, add `5` spaces
 *   3:17: Unexpected unaligned cell, expected aligned pipes, add `3` spaces
 *   3:22: Unexpected unaligned cell, expected aligned pipes, add `3` spaces
 *   3:24: Unexpected unaligned cell, expected aligned pipes, add `9` spaces
 *
 * @example
 *   {"gfm": true, "label": "input", "name": "missing-fences.md"}
 *
 *   Planet | Satellites
 *   -: | -
 *   Mercury | ☿
 * @example
 *   {"gfm": true, "label": "output", "name": "missing-fences.md"}
 *
 *   1:1: Unexpected unaligned cell, expected aligned pipes, add `1` space
 *   2:1: Unexpected unaligned cell, expected aligned pipes, add `5` spaces (or add `-` to pad alignment row cells)
 *
 * @example
 *   {"gfm": true, "label": "input", "name": "trailing-spaces.md"}
 *
 *   | Planet |␠␠
 *   | -: |␠
 * @example
 *   {"gfm": true, "label": "output", "name": "trailing-spaces.md"}
 *
 *   2:3: Unexpected unaligned cell, expected aligned pipes, add `4` spaces (or add `-` to pad alignment row cells)
 *
 * @example
 *   {"gfm": true, "label": "input", "name": "nothing.md"}
 *
 *   ||||
 *   |-|-|-|
 * @example
 *   {"gfm": true, "label": "output", "name": "nothing.md"}
 *
 *   1:2: Unexpected unaligned cell, expected aligned pipes, add `1` space
 *   1:3: Unexpected unaligned cell, expected aligned pipes, add `1` space
 *   1:4: Unexpected unaligned cell, expected aligned pipes, add `1` space
 *
 * @example
 *   {"gfm": true, "label": "input", "name": "more-weirdness.md"}
 *
 *   Mercury
 *   |-
 *
 *   Venus
 *   -|
 * @example
 *   {"gfm": true, "label": "output", "name": "more-weirdness.md"}
 *
 *   5:2: Unexpected unaligned cell, expected aligned pipes, add `4` spaces (or add `-` to pad alignment row cells)
 *
 * @example
 *   {"gfm": true, "label": "input", "name": "containers.md"}
 *
 *   > | Mercury|
 *   > | - |
 *
 *   * | Venus|
 *     | - |
 *
 *   > * > | Earth|
 *   >   > | - |
 * @example
 *   {"gfm": true, "label": "output", "name": "containers.md"}
 *
 *   2:5: Unexpected unaligned cell, expected aligned pipes, add `5` spaces (or add `-` to pad alignment row cells)
 *   5:5: Unexpected unaligned cell, expected aligned pipes, add `3` spaces (or add `-` to pad alignment row cells)
 *   8:5: Unexpected unaligned cell, expected aligned pipes, add `3` spaces (or add `-` to pad alignment row cells)
 *
 * @example
 *   {"gfm": true, "label": "input", "name": "windows.md"}
 *
 *   | Mercury|␍␊| --- |␍␊| None |
 * @example
 *   {"gfm": true, "label": "output", "name": "windows.md"}
 *
 *   2:7: Unexpected unaligned cell, expected aligned pipes, add `3` spaces (or add `-` to pad alignment row cells)
 *   3:8: Unexpected unaligned cell, expected aligned pipes, add `2` spaces
 */

/**
 * @typedef {import('mdast').AlignType} Align
 * @typedef {import('mdast').Nodes} Nodes
 * @typedef {import('mdast').Root} Root
 *
 * @typedef {import('unist').Point} Point
 */

import {ok as assert} from 'devlop'
import {phrasing} from 'mdast-util-phrasing'
import pluralize from 'pluralize'
import {lintRule} from 'unified-lint-rule'
import {pointEnd, pointStart} from 'unist-util-position'
import {SKIP, visitParents} from 'unist-util-visit-parents'

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
    /**
     * @typedef Entry
     * @property {Align} align
     * @property {Array<Nodes>} ancestors
     * @property {number} column
     * @property {number | undefined} row
     * @property {Size | undefined} size
     *
     * @typedef Size
     * @property {number | undefined} left
     * @property {Point} leftPoint
     * @property {number} middle
     * @property {number | undefined} right
     * @property {Point} rightPoint
     */

    const value = String(file)

    visitParents(tree, function (node, parents) {
      // Do not walk into phrasing.
      if (phrasing(node)) {
        return SKIP
      }

      if (node.type !== 'table') return

      const entries = inferTable([...parents, node])
      // Find max column sizes.
      /** @type {Array<number>} */
      const sizes = []

      for (const info of entries) {
        if (info.size) {
          let total = info.size.middle
          if (info.size.left) total += info.size.left
          if (info.size.right) total += info.size.right

          if (sizes[info.column] === undefined || total > sizes[info.column]) {
            sizes[info.column] = total
          }
        }
      }

      for (const info of entries) {
        if (!info.size) continue

        let total = info.size.middle
        if (info.size.left) total += info.size.left
        if (info.size.right) total += info.size.right

        const difference = sizes[info.column] - total
        assert(difference >= 0) // Always positive.
        let left = 0
        let right = 0

        // Center if there is something to center.
        if (info.align === 'center' && info.size.middle && difference > 0) {
          // Maximum number of spaces we would want on the left.
          const max = Math.floor((sizes[info.column] - info.size.middle) / 2)

          if (info.size.right !== undefined && max > info.size.right) {
            right = max - info.size.right
          }

          left = difference - right
        } else if (info.align === 'right') {
          left = difference
        } else {
          right = difference
        }

        warn(info, left, info.size.leftPoint)

        // If there is no final pipe, we don’t ask for trailing spaces.
        if (info.size.right !== undefined) {
          warn(info, right, info.size.rightPoint)
        }
      }

      return SKIP
    })

    /**
     * @param {Entry} info
     *   Info.
     * @param {number} add
     *   Number of spaces to add.
     * @param {Point} place
     *   Place to add spaces.
     * @returns {undefined}
     *   Nothing.
     */
    function warn(info, add, place) {
      if (add === 0) return
      file.message(
        'Unexpected unaligned cell, expected aligned pipes, add `' +
          add +
          '` ' +
          pluralize('space', add) +
          (info.row === undefined
            ? ' (or add `-` to pad alignment row cells)'
            : ''),
        {ancestors: info.ancestors, place}
      )
    }

    // Note: this code is also in `remark-lint-table-pipe-alignment`.
    /**
     * Get info about cells in a table.
     *
     * @param {Array<Nodes>} ancestors
     *   Ancestors.
     * @returns {Array<Entry>}
     *   Entries.
     */
    function inferTable(ancestors) {
      const node = ancestors.at(-1)
      assert(node) // Always defined.
      assert(node.type === 'table') // Always table.
      /* c8 ignore next -- `align` is optional in AST. */
      const align = node.align || []
      /** @type {Array<Entry>} */
      const result = []
      let rowIndex = -1

      // Regular rows.
      while (++rowIndex < node.children.length) {
        const row = node.children[rowIndex]
        let column = -1

        while (++column < row.children.length) {
          const node = row.children[column]

          result.push({
            align: align[column],
            ancestors: [...ancestors, row, node],
            column,
            row: rowIndex,
            size: inferSize(
              pointStart(node),
              pointEnd(node),
              column === row.children.length - 1
            )
          })
        }

        if (rowIndex === 0) {
          const alignRow = inferAlignRow(ancestors, align)
          if (alignRow) result.push(...alignRow)
        }
      }

      return result
    }

    /**
     * @param {Array<Nodes>} ancestors
     * @param {Array<Align>} align
     * @returns {Array<Entry> | undefined}
     */
    function inferAlignRow(ancestors, align) {
      const node = ancestors.at(-1)
      assert(node) // Always defined.
      assert(node.type === 'table') // Always table.
      const headEnd = pointEnd(node.children[0])

      if (!headEnd || typeof headEnd.offset !== 'number') return

      let index = headEnd.offset

      if (value.charCodeAt(index) === 13 /* `\r` */) index++
      /* c8 ignore next -- should never happen, alignment is needed. */
      if (value.charCodeAt(index) !== 10 /* `\n` */) return

      index++

      /** @type {Array<Entry>} */
      const result = []
      const line = headEnd.line + 1
      // Alignment row can only be on the second line,
      // so containers can only indent with `>` or spaces.
      let code = value.charCodeAt(index)
      while (
        code === 9 /* `\t` */ ||
        code === 32 /* ` ` */ ||
        code === 62 /* `>` */
      ) {
        index++
        code = value.charCodeAt(index)
      }

      /* c8 ignore next 7 -- should always be found. */
      if (
        code !== 45 /* `-` */ &&
        code !== 58 /* `:` */ &&
        code !== 124 /* `|` */
      ) {
        return
      }

      let lineEndOffset = value.indexOf('\n', index)
      if (lineEndOffset === -1) lineEndOffset = value.length
      if (value.charCodeAt(lineEndOffset - 1) === 13 /* `\r` */) lineEndOffset--

      let column = 0
      let cellStart = index
      let cellEnd = value.indexOf('|', index + (code === 124 ? 1 : 0))
      if (cellEnd === -1 || cellEnd > lineEndOffset) {
        cellEnd = lineEndOffset
      }

      while (cellStart !== cellEnd) {
        let nextCellEnd = value.indexOf('|', cellEnd + 1)

        if (nextCellEnd === -1 || nextCellEnd > lineEndOffset) {
          nextCellEnd = lineEndOffset
        }

        // Check if the trail is empty,
        // which means it’s a closing pipe with trailing whitespace.
        if (nextCellEnd === lineEndOffset) {
          let maybeEnd = lineEndOffset
          let code = value.charCodeAt(maybeEnd - 1)
          while (code === 9 /* `\t` */ || code === 32 /* ` ` */) {
            maybeEnd--
            code = value.charCodeAt(maybeEnd - 1)
          }

          if (cellEnd + 1 === maybeEnd) {
            cellEnd = lineEndOffset
          }
        }

        result.push({
          align: align[column],
          ancestors,
          column,
          row: undefined,
          size: inferSize(
            {
              line,
              column: cellStart - index + 1,
              offset: cellStart
            },
            {line, column: cellEnd - index + 1, offset: cellEnd},
            cellEnd === lineEndOffset
          )
        })

        cellStart = cellEnd
        cellEnd = nextCellEnd
        column++
      }

      return result
    }

    /**
     * @param {Point | undefined} start
     *   Start point.
     * @param {Point | undefined} end
     *   End point.
     * @param {boolean} tailCell
     *   Whether this is the last cell in a row.
     * @returns {Size | undefined}
     *   Size info.
     */
    function inferSize(start, end, tailCell) {
      if (
        end &&
        start &&
        typeof end.offset === 'number' &&
        typeof start.offset === 'number'
      ) {
        let leftIndex = start.offset
        /** @type {number | undefined} */
        let left
        /** @type {number | undefined} */
        let right

        if (value.charCodeAt(leftIndex) === 124 /* `|` */) {
          left = 0
          leftIndex++

          while (value.charCodeAt(leftIndex) === 32) {
            left++
            leftIndex++
          }
        }
        // Else, A leading pipe can only be omitted in the first cell.
        // Where we never want leading whitespace, as it’s seen as
        // indentation, and could turn into an indented block.

        let rightIndex = end.offset

        // The final pipe, if it exists, is part of the last cell in a row
        // according to positional info.
        if (tailCell) {
          while (value.charCodeAt(rightIndex - 1) === 32) {
            rightIndex--
          }

          // Found a pipe: we expect more whitespace.
          if (
            rightIndex > leftIndex &&
            value.charCodeAt(rightIndex - 1) === 124 /* `|` */
          ) {
            rightIndex--
          }
          // No pipe at the last cell: the trailing whitespace is part of
          // the cell.
          else {
            rightIndex = end.offset
          }
        }

        /** @type {number} */
        const rightEdgeIndex = rightIndex

        if (value.charCodeAt(rightIndex) === 124 /* `|` */) {
          right = 0

          while (
            rightIndex - 1 > leftIndex &&
            value.charCodeAt(rightIndex - 1) === 32
          ) {
            right++
            rightIndex--
          }
        }
        // Else, a trailing pipe can only be omitted in the last cell.
        // Where we never want trailing whitespace.

        return {
          left,
          leftPoint: {
            line: start.line,
            column: start.column + (leftIndex - start.offset),
            offset: leftIndex
          },
          middle: rightIndex - leftIndex,
          right,
          rightPoint: {
            line: end.line,
            column: end.column - (end.offset - rightEdgeIndex),
            offset: rightEdgeIndex
          }
        }
      }
    }
  }
)

export default remarkLintTablePipeAlignment

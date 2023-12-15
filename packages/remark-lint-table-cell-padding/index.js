/**
 * remark-lint rule to warn when GFM table cells are padded inconsistently.
 *
 * ## What is this?
 *
 * This package checks table cell padding.
 * Tables are a GFM feature enabled with [`remark-gfm`][github-remark-gfm].
 *
 * ## When should I use this?
 *
 * You can use this package to check that tables are consistent.
 *
 * ## API
 *
 * ### `unified().use(remarkLintTableCellPadding[, options])`
 *
 * Warn when GFM table cells are padded inconsistently.
 *
 * ###### Parameters
 *
 * * `options` ([`Options`][api-options], optional)
 *   — preferred style or whether to detect the first style and warn for
 *   further differences
 *
 * ###### Returns
 *
 * Transform ([`Transformer` from `unified`][github-unified-transformer]).
 *
 * ### `Style`
 *
 * Style (TypeScript type).
 *
 * * `'compact'`
 *   — prefer zero spaces between pipes and content
 * * `'padded'`
 *   — prefer at least one space between pipes and content
 *
 * ###### Type
 *
 * ```ts
 * type Style = 'compact' | 'padded'
 * ```
 *
 * ### `Options`
 *
 * Configuration (TypeScript type).
 *
 * ###### Type
 *
 * ```ts
 * type Options = Style | 'consistent'
 * ```
 *
 * ## Recommendation
 *
 * It’s recommended to use at least one space between pipes and content for
 * legibility of the markup (`'padded'`).
 *
 * ## Fix
 *
 * [`remark-stringify`][github-remark-stringify] with
 * [`remark-gfm`][github-remark-gfm] formats all table cells as padded by
 * default.
 * Pass `tableCellPadding: false` to use a more compact style.
 *
 * [api-options]: #options
 * [api-style]: #style
 * [api-remark-lint-table-cell-padding]: #unifieduseremarklinttablecellpadding-options
 * [github-remark-gfm]: https://github.com/remarkjs/remark-gfm
 * [github-remark-stringify]: https://github.com/remarkjs/remark/tree/main/packages/remark-stringify
 * [github-unified-transformer]: https://github.com/unifiedjs/unified#transformer
 *
 * @module table-cell-padding
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @example
 *   {"name": "ok.md", "config": "padded", "gfm": true}
 *
 *   | A     | B     |
 *   | ----- | ----- |
 *   | Alpha | Bravo |
 *
 * @example
 *   {"name": "not-ok.md", "label": "input", "config": "padded", "gfm": true}
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
 * @example
 *   {"name": "not-ok.md", "label": "output", "config": "padded", "gfm": true}
 *
 *   3:8: Cell should be padded
 *   3:9: Cell should be padded
 *   7:2: Cell should be padded
 *   7:17: Cell should be padded
 *   13:7: Cell should be padded with 1 space, not 2
 *   13:18: Cell should be padded with 1 space, not 2
 *   13:23: Cell should be padded with 1 space, not 2
 *   13:27: Cell should be padded with 1 space, not 2
 *   13:32: Cell should be padded with 1 space, not 2
 *
 * @example
 *   {"name": "ok.md", "config": "compact", "gfm": true}
 *
 *   |A    |B    |
 *   |-----|-----|
 *   |Alpha|Bravo|
 *
 * @example
 *   {"name": "not-ok.md", "label": "input", "config": "compact", "gfm": true}
 *
 *   |   A    | B    |
 *   |   -----| -----|
 *   |   Alpha| Bravo|
 *
 *   |C      |     D|
 *   |:------|-----:|
 *   |Charlie|Delta |
 *
 * @example
 *   {"name": "not-ok.md", "label": "output", "config": "compact", "gfm": true}
 *
 *   3:5: Cell should be compact
 *   3:12: Cell should be compact
 *   7:15: Cell should be compact
 *
 * @example
 *   {"name": "ok-padded.md", "gfm": true}
 *
 *   The default is `'consistent'`.
 *
 *   | A     | B     |
 *   | ----- | ----- |
 *   | Alpha | Bravo |
 *
 *   | C       | D     |
 *   | ------- | ----- |
 *   | Charlie | Delta |
 *
 * @example
 *   {"name": "not-ok-padded.md", "label": "input", "config": "consistent", "gfm": true}
 *
 *   | A     | B     |
 *   | ----- | ----- |
 *   | Alpha | Bravo |
 *
 *   | C      |     D |
 *   | :----- | ----: |
 *   |Charlie | Delta |
 *
 * @example
 *   {"name": "not-ok-padded.md", "label": "output", "config": "consistent", "gfm": true}
 *
 *   7:2: Cell should be padded
 *
 * @example
 *   {"name": "ok-compact.md", "config": "consistent", "gfm": true}
 *
 *   |A    |B    |
 *   |-----|-----|
 *   |Alpha|Bravo|
 *
 *   |C      |D    |
 *   |-------|-----|
 *   |Charlie|Delta|
 *
 * @example
 *   {"name": "not-ok-compact.md", "label": "input", "config": "consistent", "gfm": true}
 *
 *   |A    |B    |
 *   |-----|-----|
 *   |Alpha|Bravo|
 *
 *   |C      |     D|
 *   |:------|-----:|
 *   |Charlie|Delta |
 *
 * @example
 *   {"name": "not-ok-compact.md", "label": "output", "config": "consistent", "gfm": true}
 *
 *   7:15: Cell should be compact
 *
 * @example
 *   {"name": "not-ok.md", "label": "output", "config": "💩", "positionless": true, "gfm": true}
 *
 *   1:1: Incorrect table cell padding style `💩`, expected `'padded'`, `'compact'`, or `'consistent'`
 *
 * @example
 *   {"name": "empty.md", "label": "input", "config": "padded", "gfm": true}
 *
 *   <!-- Empty cells are OK, but those surrounding them may not be. -->
 *
 *   |        | Alpha | Bravo|
 *   | ------ | ----- | ---: |
 *   | Charlie|       |  Echo|
 *
 * @example
 *   {"name": "empty.md", "label": "output", "config": "padded", "gfm": true}
 *
 *   3:25: Cell should be padded
 *   5:10: Cell should be padded
 *   5:25: Cell should be padded
 *
 * @example
 *   {"name": "missing-body.md", "config": "padded", "gfm": true}
 *
 *   <!-- Missing cells are fine as well. -->
 *
 *   | Alpha | Bravo   | Charlie |
 *   | ----- | ------- | ------- |
 *   | Delta |
 *   | Echo  | Foxtrot |
 */

/**
 * @typedef {import('mdast').Root} Root
 * @typedef {import('mdast').TableCell} TableCell
 */

/**
 * @typedef {Style | 'consistent'} Options
 *   Configuration.
 *
 * @typedef {'compact' | 'padded'} Style
 *   Styles.
 */

import {lintRule} from 'unified-lint-rule'
import {pointEnd, pointStart} from 'unist-util-position'
import {SKIP, visit} from 'unist-util-visit'

const remarkLintTableCellPadding = lintRule(
  {
    origin: 'remark-lint:table-cell-padding',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-table-cell-padding#readme'
  },
  /**
   * @param {Root} tree
   *   Tree.
   * @param {Options | null | undefined} [options='consistent']
   *   Configuration (default: `'consistent'`).
   * @returns {undefined}
   *   Nothing.
   */
  function (tree, file, options) {
    const option = options || 'consistent'

    if (
      option !== 'compact' &&
      option !== 'consistent' &&
      option !== 'padded'
    ) {
      file.fail(
        'Incorrect table cell padding style `' +
          option +
          "`, expected `'padded'`, `'compact'`, or `'consistent'`"
      )
    }

    visit(tree, 'table', function (node) {
      const rows = node.children
      /* c8 ignore next -- generated AST can omit `align`. */
      const align = node.align || []
      /** @type {Array<number>} */
      const sizes = []
      /** @type {Array<{column: number, end: number, node: TableCell, start: number}>} */
      const entries = []
      let index = -1

      // Check align row.
      // Because there’s zero to two `:`, and there must be one `-`.
      while (++index < align.length) {
        const alignment = align[index]
        sizes[index] = alignment === 'center' ? 3 : alignment ? 2 : 1
      }

      index = -1

      // Check rows.
      while (++index < rows.length) {
        const row = rows[index]
        let column = -1

        // Check fences (before, between, and after cells).
        while (++column < row.children.length) {
          const cell = row.children[column]
          const cellStart = pointStart(cell)?.offset
          const cellEnd = pointEnd(cell)?.offset
          const contentStart = pointStart(cell.children[0])?.offset
          const contentEnd = pointEnd(
            cell.children[cell.children.length - 1]
          )?.offset

          if (
            typeof cellStart !== 'number' ||
            typeof cellEnd !== 'number' ||
            typeof contentStart !== 'number' ||
            typeof contentEnd !== 'number'
          ) {
            continue
          }

          entries.push({
            node: cell,
            start: contentStart - cellStart - 1,
            end:
              cellEnd -
              contentEnd -
              (column === row.children.length - 1 ? 1 : 0),
            column
          })

          // Detect max space per column.
          sizes[column] = Math.max(
            /* c8 ignore next */
            sizes[column] || 0,
            contentEnd - contentStart
          )
        }
      }

      const style =
        option === 'consistent'
          ? entries[0] && (!entries[0].start || !entries[0].end)
            ? 0
            : 1
          : option === 'padded'
            ? 1
            : 0

      index = -1

      while (++index < entries.length) {
        checkSide('start', entries[index], style, sizes)
        checkSide('end', entries[index], style, sizes)
      }

      return SKIP
    })

    /**
     * @param {'end' | 'start'} side
     *   Side to check.
     * @param {{column: number, end: number, node: TableCell, start: number}} entry
     *   Cell info.
     * @param {0 | 1} style
     *   Expected style.
     * @param {Array<number>} sizes
     *   Max sizes per column.
     * @returns {undefined}
     *   Nothing.
     */
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

      file.message(
        reason,
        side === 'start'
          ? pointStart(cell.children[0])
          : pointEnd(cell.children[cell.children.length - 1])
      )
    }
  }
)

export default remarkLintTableCellPadding

/**
 * @param {TableCell} node
 *   Cell.
 * @returns {number}
 *   Size of `node`.
 */
function size(node) {
  const head = pointStart(node.children[0])?.offset
  const tail = pointEnd(node.children[node.children.length - 1])?.offset
  /* c8 ignore next -- Only called when we’re sure offsets exist. */
  return typeof head === 'number' && typeof tail === 'number' ? tail - head : 0
}

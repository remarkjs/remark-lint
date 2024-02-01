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
 *
 * @example
 *   {"config": "padded", "gfm": true, "name": "ok.md"}
 *
 *   | Planet  | Symbol | Satellites | Mean anomaly (°) |
 *   | ------- | :----- | :--------: | ---------------: |
 *   | Mercury | ☿      |    None    |          174 796 |
 *
 *   | Planet | Symbol | Satellites | Mean anomaly (°) |
 *   | - | :- | :-: | -: |
 *   | Venus | ♀ | None | 50 115 |
 *
 * @example
 *   {"config": "padded", "gfm": true, "label": "input", "name": "not-ok.md"}
 *
 *   | Planet |
 *   | -------|
 *   | Mercury|
 *
 *   |Planet |
 *   |------ |
 *   |Venus  |
 *
 *   |  Planet  |
 *   |  ------  |
 *   |  Venus   |
 * @example
 *   {"config": "padded", "gfm": true, "label": "output", "name": "not-ok.md"}
 *
 *   2:10: Unexpected `0` spaces between cell content and edge, expected `1` space, add `1` space
 *   3:10: Unexpected `0` spaces between cell content and edge, expected `1` space, add `1` space
 *   5:2: Unexpected `0` spaces between cell edge and content, expected `1` space, add `1` space
 *   6:2: Unexpected `0` spaces between cell edge and content, expected `1` space, add `1` space
 *   7:2: Unexpected `0` spaces between cell edge and content, expected `1` space, add `1` space
 *   9:4: Unexpected `2` spaces between cell edge and content, expected `1` space, remove `1` space
 *   9:12: Unexpected `2` spaces between cell content and edge, expected `1` space, remove `1` space
 *   10:4: Unexpected `2` spaces between cell edge and content, expected `1` space, remove `1` space
 *   10:12: Unexpected `2` spaces between cell content and edge, expected `1` space, remove `1` space
 *   11:4: Unexpected `2` spaces between cell edge and content, expected `1` space, remove `1` space
 *   11:12: Unexpected `3` spaces between cell content and edge, expected between `1` (unaligned) and `2` (aligned) spaces, remove between `1` and `2` spaces
 *
 * @example
 *   {"config": "compact", "gfm": true, "name": "ok.md"}
 *
 *   |Planet |Symbol|Satellites|Mean anomaly (°)|
 *   |-------|:-----|:--------:|---------------:|
 *   |Mercury|☿     |   None   |         174 796|
 *
 *   |Planet|Symbol|Satellites|Mean anomaly (°)|
 *   |-|:-|:-:|-:|
 *   |Venus|♀|None|50 115|
 *
 * @example
 *   {"config": "compact", "gfm": true, "label": "input", "name": "not-ok.md"}
 *
 *   | Planet |
 *   | -------|
 *   | Mercury|
 *
 *   |Planet |
 *   |------ |
 *   |Venus  |
 *
 *   |  Planet  |
 *   |  ------  |
 *   |  Venus   |
 * @example
 *   {"config": "compact", "gfm": true, "label": "output", "name": "not-ok.md"}
 *
 *   1:3: Unexpected `1` space between cell edge and content, expected `0` spaces, remove `1` space
 *   2:3: Unexpected `1` space between cell edge and content, expected `0` spaces, remove `1` space
 *   3:3: Unexpected `1` space between cell edge and content, expected `0` spaces, remove `1` space
 *   5:9: Unexpected `1` space between cell content and edge, expected `0` spaces, remove `1` space
 *   6:9: Unexpected `1` space between cell content and edge, expected `0` spaces, remove `1` space
 *   7:9: Unexpected `2` spaces between cell content and edge, expected between `0` (unaligned) and `1` (aligned) space, remove between `1` and `2` spaces
 *   9:4: Unexpected `2` spaces between cell edge and content, expected `0` spaces, remove `2` spaces
 *   9:12: Unexpected `2` spaces between cell content and edge, expected `0` spaces, remove `2` spaces
 *   10:4: Unexpected `2` spaces between cell edge and content, expected `0` spaces, remove `2` spaces
 *   10:12: Unexpected `2` spaces between cell content and edge, expected `0` spaces, remove `2` spaces
 *   11:4: Unexpected `2` spaces between cell edge and content, expected `0` spaces, remove `2` spaces
 *   11:12: Unexpected `3` spaces between cell content and edge, expected between `0` (unaligned) and `1` (aligned) space, remove between `2` and `3` spaces
 *
 * @example
 *   {"gfm": true, "name": "consistent-padded-ok.md"}
 *
 *   | Planet |
 *   | - |
 *
 * @example
 *   {"gfm": true, "label": "input", "name": "consistent-padded-nok.md"}
 *
 *   | Planet|
 *   | - |
 * @example
 *   {"gfm": true, "label": "output", "name": "consistent-padded-nok.md"}
 *
 *   1:9: Unexpected `0` spaces between cell content and edge, expected `1` space, add `1` space
 *
 * @example
 *   {"gfm": true, "name": "consistent-compact-ok.md"}
 *
 *   |Planet|
 *   |-|
 *
 * @example
 *   {"gfm": true, "label": "input", "name": "consistent-compact-nok.md"}
 *
 *   |Planet |
 *   |-|
 * @example
 *   {"gfm": true, "label": "output", "name": "consistent-compact-nok.md"}
 *
 *   1:9: Unexpected `1` space between cell content and edge, expected `0` spaces, remove `1` space
 *
 * @example
 *   {"gfm": true, "name": "empty.md"}
 *
 *   | | Satellites |
 *   | - | - |
 *   | Mercury | |
 *
 * @example
 *   {"gfm": true, "name": "missing-cells.md"}
 *
 *   | Planet | Symbol | Satellites |
 *   | - | - | - |
 *   | Mercury |
 *   | Venus | ♀ |
 *   | Earth | 🜨 and ♁ | 1 |
 *   | Mars | ♂ | 2 | 19 412 |
 *
 * @example
 *   {"config": "padded", "gfm": true, "label": "input", "name": "missing-fences.md"}
 *
 *   ␠Planet|Symbol|Satellites
 *   ------:|:-----|----------
 *   Mercury|☿     |0
 *
 *   Planet|Symbol
 *   -----:|------
 *   ␠Venus|♀
 * @example
 *   {"config": "padded", "gfm": true, "label": "output", "name": "missing-fences.md"}
 *
 *   1:8: Unexpected `0` spaces between cell content and edge, expected `1` space, add `1` space
 *   1:9: Unexpected `0` spaces between cell edge and content, expected `1` space, add `1` space
 *   1:15: Unexpected `0` spaces between cell content and edge, expected `1` space, add `1` space
 *   1:16: Unexpected `0` spaces between cell edge and content, expected `1` space, add `1` space
 *   2:8: Unexpected `0` spaces between cell content and edge, expected `1` space, add `1` space
 *   2:9: Unexpected `0` spaces between cell edge and content, expected `1` space, add `1` space
 *   2:15: Unexpected `0` spaces between cell content and edge, expected `1` space, add `1` space
 *   2:16: Unexpected `0` spaces between cell edge and content, expected `1` space, add `1` space
 *   3:8: Unexpected `0` spaces between cell content and edge, expected `1` space, add `1` space
 *   3:9: Unexpected `0` spaces between cell edge and content, expected `1` space, add `1` space
 *   3:16: Unexpected `0` spaces between cell edge and content, expected `1` space, add `1` space
 *   5:7: Unexpected `0` spaces between cell content and edge, expected `1` space, add `1` space
 *   5:8: Unexpected `0` spaces between cell edge and content, expected `1` space, add `1` space
 *   6:7: Unexpected `0` spaces between cell content and edge, expected `1` space, add `1` space
 *   6:8: Unexpected `0` spaces between cell edge and content, expected `1` space, add `1` space
 *   7:7: Unexpected `0` spaces between cell content and edge, expected `1` space, add `1` space
 *   7:8: Unexpected `0` spaces between cell edge and content, expected `1` space, add `1` space
 *
 * @example
 *   {"config": "compact", "gfm": true, "label": "input", "name": "missing-fences.md"}
 *
 *   Planet | Symbol | Satellites
 *   -: | - | -
 *   Mercury | ☿ | 0
 *
 *   Planet | Symbol
 *   -----: | ------
 *   ␠Venus | ♀
 * @example
 *   {"config": "compact", "gfm": true, "label": "output", "name": "missing-fences.md"}
 *
 *   1:8: Unexpected `1` space between cell content and edge, expected `0` spaces, remove `1` space
 *   1:10: Unexpected `1` space between cell edge and content, expected `0` spaces, remove `1` space
 *   1:17: Unexpected `1` space between cell content and edge, expected `0` spaces, remove `1` space
 *   1:19: Unexpected `1` space between cell edge and content, expected `0` spaces, remove `1` space
 *   2:4: Unexpected `1` space between cell content and edge, expected `0` spaces, remove `1` space
 *   2:6: Unexpected `1` space between cell edge and content, expected `0` spaces, remove `1` space
 *   2:10: Unexpected `1` space between cell edge and content, expected `0` spaces, remove `1` space
 *   3:9: Unexpected `1` space between cell content and edge, expected `0` spaces, remove `1` space
 *   3:11: Unexpected `1` space between cell edge and content, expected `0` spaces, remove `1` space
 *   3:15: Unexpected `1` space between cell edge and content, expected `0` spaces, remove `1` space
 *   5:8: Unexpected `1` space between cell content and edge, expected `0` spaces, remove `1` space
 *   5:10: Unexpected `1` space between cell edge and content, expected `0` spaces, remove `1` space
 *   6:8: Unexpected `1` space between cell content and edge, expected `0` spaces, remove `1` space
 *   6:10: Unexpected `1` space between cell edge and content, expected `0` spaces, remove `1` space
 *   7:8: Unexpected `1` space between cell content and edge, expected `0` spaces, remove `1` space
 *   7:10: Unexpected `1` space between cell edge and content, expected `0` spaces, remove `1` space
 *
 * @example
 *   {"config": "compact", "gfm": true, "label": "input", "name": "trailing-spaces.md"}
 *
 *   Planet | Symbol␠
 *   -: | -␠
 *   Mercury | ☿␠␠
 *
 *   | Planet | Symbol |␠
 *   | ------ | ------ |␠
 *   | Venus  | ♀      |␠␠
 * @example
 *   {"config": "compact", "gfm": true, "label": "output", "name": "trailing-spaces.md"}
 *
 *   1:8: Unexpected `1` space between cell content and edge, expected `0` spaces, remove `1` space
 *   1:10: Unexpected `1` space between cell edge and content, expected `0` spaces, remove `1` space
 *   2:4: Unexpected `1` space between cell content and edge, expected `0` spaces, remove `1` space
 *   2:6: Unexpected `1` space between cell edge and content, expected `0` spaces, remove `1` space
 *   3:9: Unexpected `1` space between cell content and edge, expected `0` spaces, remove `1` space
 *   3:11: Unexpected `1` space between cell edge and content, expected `0` spaces, remove `1` space
 *   5:3: Unexpected `1` space between cell edge and content, expected `0` spaces, remove `1` space
 *   5:10: Unexpected `1` space between cell content and edge, expected `0` spaces, remove `1` space
 *   5:12: Unexpected `1` space between cell edge and content, expected `0` spaces, remove `1` space
 *   5:19: Unexpected `1` space between cell content and edge, expected `0` spaces, remove `1` space
 *   6:3: Unexpected `1` space between cell edge and content, expected `0` spaces, remove `1` space
 *   6:10: Unexpected `1` space between cell content and edge, expected `0` spaces, remove `1` space
 *   6:12: Unexpected `1` space between cell edge and content, expected `0` spaces, remove `1` space
 *   6:19: Unexpected `1` space between cell content and edge, expected `0` spaces, remove `1` space
 *   7:3: Unexpected `1` space between cell edge and content, expected `0` spaces, remove `1` space
 *   7:10: Unexpected `2` spaces between cell content and edge, expected between `0` (unaligned) and `1` (aligned) space, remove between `1` and `2` spaces
 *   7:12: Unexpected `1` space between cell edge and content, expected `0` spaces, remove `1` space
 *   7:19: Unexpected `6` spaces between cell content and edge, expected between `0` (unaligned) and `5` (aligned) spaces, remove between `1` and `6` spaces
 *
 * @example
 *   {"config": "compact", "gfm": true, "label": "input", "name": "nothing.md"}
 *
 *   |   |   |   |
 *   | - | - | - |
 *   |   |   |   |
 * @example
 *   {"config": "compact", "gfm": true, "label": "output", "name": "nothing.md"}
 *
 *   1:5: Unexpected `3` spaces between cell edge and content, expected between `0` (unaligned) and `1` (aligned) space, remove between `2` and `3` spaces
 *   1:9: Unexpected `3` spaces between cell edge and content, expected between `0` (unaligned) and `1` (aligned) space, remove between `2` and `3` spaces
 *   1:13: Unexpected `3` spaces between cell edge and content, expected between `0` (unaligned) and `1` (aligned) space, remove between `2` and `3` spaces
 *   2:3: Unexpected `1` space between cell edge and content, expected `0` spaces, remove `1` space
 *   2:5: Unexpected `1` space between cell content and edge, expected `0` spaces, remove `1` space
 *   2:7: Unexpected `1` space between cell edge and content, expected `0` spaces, remove `1` space
 *   2:9: Unexpected `1` space between cell content and edge, expected `0` spaces, remove `1` space
 *   2:11: Unexpected `1` space between cell edge and content, expected `0` spaces, remove `1` space
 *   2:13: Unexpected `1` space between cell content and edge, expected `0` spaces, remove `1` space
 *   3:5: Unexpected `3` spaces between cell edge and content, expected between `0` (unaligned) and `1` (aligned) space, remove between `2` and `3` spaces
 *   3:9: Unexpected `3` spaces between cell edge and content, expected between `0` (unaligned) and `1` (aligned) space, remove between `2` and `3` spaces
 *   3:13: Unexpected `3` spaces between cell edge and content, expected between `0` (unaligned) and `1` (aligned) space, remove between `2` and `3` spaces
 *
 * @example
 *   {"config": "padded", "gfm": true, "label": "input", "name": "nothing.md"}
 *
 *   ||||
 *   |-|-|-|
 *   ||||
 * @example
 *   {"config": "padded", "gfm": true, "label": "output", "name": "nothing.md"}
 *
 *   1:2: Unexpected `0` spaces between cell edge and content, expected between `1` (unaligned) and `3` (aligned) spaces, add between `3` and `1` space
 *   1:3: Unexpected `0` spaces between cell edge and content, expected between `1` (unaligned) and `3` (aligned) spaces, add between `3` and `1` space
 *   1:4: Unexpected `0` spaces between cell edge and content, expected between `1` (unaligned) and `3` (aligned) spaces, add between `3` and `1` space
 *   2:2: Unexpected `0` spaces between cell edge and content, expected `1` space, add `1` space
 *   2:3: Unexpected `0` spaces between cell content and edge, expected `1` space, add `1` space
 *   2:4: Unexpected `0` spaces between cell edge and content, expected `1` space, add `1` space
 *   2:5: Unexpected `0` spaces between cell content and edge, expected `1` space, add `1` space
 *   2:6: Unexpected `0` spaces between cell edge and content, expected `1` space, add `1` space
 *   2:7: Unexpected `0` spaces between cell content and edge, expected `1` space, add `1` space
 *   3:2: Unexpected `0` spaces between cell edge and content, expected between `1` (unaligned) and `3` (aligned) spaces, add between `3` and `1` space
 *   3:3: Unexpected `0` spaces between cell edge and content, expected between `1` (unaligned) and `3` (aligned) spaces, add between `3` and `1` space
 *   3:4: Unexpected `0` spaces between cell edge and content, expected between `1` (unaligned) and `3` (aligned) spaces, add between `3` and `1` space
 *
 * @example
 *   {"config": "padded", "gfm": true, "label": "input", "name": "more-weirdness.md"}
 *
 *   Mercury
 *   |-
 *
 *   Venus
 *   -|
 * @example
 *   {"config": "padded", "gfm": true, "label": "output", "name": "more-weirdness.md"}
 *
 *   2:2: Unexpected `0` spaces between cell edge and content, expected `1` space, add `1` space
 *   5:2: Unexpected `0` spaces between cell content and edge, expected between `1` (unaligned) and `5` (aligned) spaces, add between `5` and `1` space
 *
 * @example
 *   {"config": "padded", "gfm": true, "label": "input", "name": "containers.md"}
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
 *   {"config": "padded", "gfm": true, "label": "output", "name": "containers.md"}
 *
 *   1:12: Unexpected `0` spaces between cell content and edge, expected `1` space, add `1` space
 *   4:10: Unexpected `0` spaces between cell content and edge, expected `1` space, add `1` space
 *   7:14: Unexpected `0` spaces between cell content and edge, expected `1` space, add `1` space
 *
 * @example
 *   {"config": "padded", "gfm": true, "label": "input", "name": "windows.md"}
 *
 *   | Mercury|␍␊| --- |␍␊| None |
 * @example
 *   {"config": "padded", "gfm": true, "label": "output", "name": "windows.md"}
 *
 *   1:10: Unexpected `0` spaces between cell content and edge, expected `1` space, add `1` space
 *
 * @example
 *   {"config": "🌍", "gfm": true, "label": "output", "name": "not-ok.md", "positionless": true}
 *
 *   1:1: Unexpected value `🌍` for `options`, expected `'compact'`, `'padded'`, or `'consistent'`
 */

/**
 * @typedef {import('mdast').AlignType} Align
 * @typedef {import('mdast').Nodes} Nodes
 * @typedef {import('mdast').Root} Root
 *
 * @typedef {import('unist').Point} Point
 */

/**
 * @typedef {Style | 'consistent'} Options
 *   Configuration.
 *
 * @typedef {'compact' | 'padded'} Style
 *   Styles.
 */

import {ok as assert} from 'devlop'
import {phrasing} from 'mdast-util-phrasing'
import pluralize from 'pluralize'
import {lintRule} from 'unified-lint-rule'
import {pointEnd, pointStart} from 'unist-util-position'
import {SKIP, visitParents} from 'unist-util-visit-parents'
import {VFileMessage} from 'vfile-message'

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
    /**
     * @typedef Entry
     * @property {Align} align
     * @property {Array<Nodes>} ancestors
     * @property {number} column
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
    /** @type {Style | undefined} */
    let expected
    /** @type {VFileMessage | undefined} */
    let cause

    if (options === null || options === undefined || options === 'consistent') {
      // Empty.
    } else if (options === 'compact' || options === 'padded') {
      expected = options
    } else {
      file.fail(
        'Unexpected value `' +
          options +
          "` for `options`, expected `'compact'`, `'padded'`, or `'consistent'`"
      )
    }

    visitParents(tree, function (table, parents) {
      // Do not walk into phrasing.
      if (phrasing(table)) {
        return SKIP
      }

      if (table.type !== 'table') return

      const entries = inferTable([...parents, table])

      // Find max column sizes.
      /** @type {Array<number>} */
      const sizes = []

      for (const entry of entries) {
        if (
          entry.size &&
          (sizes[entry.column] === undefined ||
            entry.size.middle > sizes[entry.column])
        ) {
          sizes[entry.column] = entry.size.middle
        }
      }

      // Find the first cell that is the biggest in its column.
      if (!expected) {
        for (const info of entries) {
          if (
            info.size &&
            info.size.middle &&
            info.size.middle === sizes[info.column]
          ) {
            const node = info.ancestors.at(-1)
            assert(node) // Always defined.
            expected = info.size.left ? 'padded' : 'compact'
            cause = new VFileMessage(
              "Cell padding style `'" +
                expected +
                "'` first defined for `'consistent'` here",
              {
                ancestors: info.ancestors,
                place: node.position,
                ruleId: 'table-cell-padding',
                source: 'remark-lint'
              }
            )
          }
        }
      }

      /* c8 ignore next -- always a cell. */
      if (!expected) return

      for (const info of entries) {
        checkSide('left', info, sizes)
        checkSide('right', info, sizes)
      }

      // No tables in tables.
      return SKIP
    })

    /**
     * @param {'left' | 'right'} side
     *   Side to check.
     * @param {Entry} info
     *   Info.
     * @param {Array<number>} sizes
     *   Max column sizes.
     * @returns {undefined}
     *   Nothing.
     */
    function checkSide(side, info, sizes) {
      if (!info.size) {
        return
      }

      const actual = info.size[side]

      if (actual === undefined) {
        return
      }

      const alignSpaces = sizes[info.column] - info.size.middle
      const min = expected === 'compact' ? 0 : 1
      /** @type {number} */
      let max = min

      if (info.align === 'center') {
        max += Math.ceil(alignSpaces / 2)
      } else if (info.align === 'right' ? side === 'left' : side === 'right') {
        max += alignSpaces
      }

      // For empty cells,
      // the `left` field is used for all the whitespace in them.
      if (info.size.middle === 0) {
        if (side === 'right') return
        max = Math.max(max, sizes[info.column] + 2 * min)
      }

      if (actual < min || actual > max) {
        const differenceMin = min - actual
        const differenceMinAbsolute = Math.abs(differenceMin)
        const differenceMax = max - actual
        const differenceMaxAbsolute = Math.abs(differenceMax)

        file.message(
          'Unexpected `' +
            actual +
            '` ' +
            pluralize('space', actual) +
            ' between cell ' +
            (side === 'left' ? 'edge' : 'content') +
            ' and ' +
            (side === 'left' ? 'content' : 'edge') +
            ', expected ' +
            (min === max ? '' : 'between `' + min + '` (unaligned) and ') +
            '`' +
            max +
            '` ' +
            (min === max ? '' : '(aligned) ') +
            pluralize('space', max) +
            ', ' +
            (differenceMin < 0 ? 'remove' : 'add') +
            (differenceMin === differenceMax
              ? ''
              : ' between `' + differenceMaxAbsolute + '` and') +
            ' `' +
            differenceMinAbsolute +
            '` ' +
            pluralize('space', differenceMinAbsolute),
          {
            ancestors: info.ancestors,
            cause,
            place: side === 'left' ? info.size.leftPoint : info.size.rightPoint
          }
        )
      }
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

export default remarkLintTableCellPadding

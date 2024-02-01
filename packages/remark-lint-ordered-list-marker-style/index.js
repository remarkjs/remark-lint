/**
 * remark-lint rule to warn when ordered list markers are inconsistent.
 *
 * ## What is this?
 *
 * This package checks ordered list markers.
 *
 * ## When should I use this?
 *
 * You can use this package to check ordered lists.
 *
 * ## API
 *
 * ### `unified().use(remarkLintOrderedListMarkerStyle[, options])`
 *
 * Warn when ordered list markers are inconsistent.
 *
 * ###### Parameters
 *
 * * `options` ([`Options`][api-options], default: `'consistent'`)
 *   — preferred style or whether to detect the first style and warn for
 *   further differences
 *
 * ###### Returns
 *
 * Transform ([`Transformer` from `unified`][github-unified-transformer]).
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
 * ### `Style`
 *
 * Style (TypeScript type).
 *
 * ###### Type
 *
 * ```ts
 * type Style = '.' | ')'
 * ```
 *
 * ## Recommendation
 *
 * Parens for list markers were not supported in markdown before CommonMark.
 * While they should work in most places now,
 * not all markdown parsers follow CommonMark.
 * So it’s recommended to prefer dots.
 *
 * ## Fix
 *
 * [`remark-stringify`][github-remark-stringify] formats ordered lists with
 * dots by default.
 * Pass `bulletOrdered: ')'` to always use parens.
 *
 * [api-style]: #style
 * [api-options]: #options
 * [api-remark-lint-ordered-list-marker-style]: #unifieduseremarklintorderedlistmarkerstyle-options
 * [github-remark-stringify]: https://github.com/remarkjs/remark/tree/main/packages/remark-stringify
 * [github-unified-transformer]: https://github.com/unifiedjs/unified#transformer
 *
 * @module ordered-list-marker-style
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 *
 * @example
 *   {"name": "ok.md"}
 *
 *   1. Mercury
 *
 *   * Venus
 *
 *   1. Earth
 *
 * @example
 *   {"name": "ok.md", "config": "."}
 *
 *   1. Mercury
 *
 * @example
 *   {"name": "ok.md", "config": ")"}
 *
 *   1) Mercury
 *
 * @example
 *   {"label": "input", "name": "not-ok.md"}
 *
 *   1. Mercury
 *
 *   1) Venus
 *
 * @example
 *   {"label": "output", "name": "not-ok.md"}
 *
 *   3:2: Unexpected ordered list marker `)`, expected `.`
 *
 * @example
 *   {"name": "not-ok.md", "label": "output", "config": "🌍", "positionless": true}
 *
 *   1:1: Unexpected value `🌍` for `options`, expected `'.'`, `')'`, or `'consistent'`
 */

/**
 * @typedef {import('mdast').Root} Root
 */

/**
 * @typedef {Style | 'consistent'} Options
 *   Configuration.
 *
 * @typedef {'.' | ')'} Style
 *   Style.
 */

import {phrasing} from 'mdast-util-phrasing'
import {asciiDigit} from 'micromark-util-character'
import {lintRule} from 'unified-lint-rule'
import {pointStart} from 'unist-util-position'
import {SKIP, visitParents} from 'unist-util-visit-parents'
import {VFileMessage} from 'vfile-message'

const remarkLintOrderedListMarkerStyle = lintRule(
  {
    origin: 'remark-lint:ordered-list-marker-style',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-ordered-list-marker-style#readme'
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
    const value = String(file)
    /** @type {Style | undefined} */
    let expected
    /** @type {VFileMessage | undefined} */
    let cause

    if (options === null || options === undefined || options === 'consistent') {
      // Empty.
    } else if (options === '.' || options === ')') {
      expected = options
    } else {
      file.fail(
        'Unexpected value `' +
          options +
          "` for `options`, expected `'.'`, `')'`, or `'consistent'`"
      )
    }

    visitParents(tree, function (node, parents) {
      // Do not walk into phrasing.
      if (phrasing(node)) {
        return SKIP
      }

      if (node.type !== 'listItem') return

      const parent = parents.at(-1)

      if (!parent || parent.type !== 'list' || !parent.ordered) return

      const start = pointStart(node)

      if (start && typeof start.offset === 'number') {
        let index = start.offset
        let code = value.charCodeAt(index)
        while (asciiDigit(code)) {
          index++
          code = value.charCodeAt(index)
        }

        /* c8 ignore next 2 -- weird ASTs. */
        const actual =
          code === 41 /* `)` */ ? ')' : code === 46 /* `.` */ ? '.' : undefined

        /* c8 ignore next -- weird ASTs. */
        if (!actual) return

        const place = {
          line: start.line,
          column: start.column + (index - start.offset),
          offset: start.offset + (index - start.offset)
        }

        if (expected) {
          if (actual !== expected) {
            file.message(
              'Unexpected ordered list marker `' +
                actual +
                '`, expected `' +
                expected +
                '`',
              {ancestors: [...parents, node], cause, place}
            )
          }
        } else {
          expected = actual
          cause = new VFileMessage(
            'Ordered list marker style `' +
              expected +
              "` first defined for `'consistent'` here",
            {
              ancestors: [...parents, node],
              place,
              ruleId: 'ordered-list-marker-style',
              source: 'remark-lint'
            }
          )
        }
      }
    })
  }
)

export default remarkLintOrderedListMarkerStyle

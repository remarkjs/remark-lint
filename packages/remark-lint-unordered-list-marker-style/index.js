/**
 * remark-lint rule to warn when unordered list markers are inconsistent.
 *
 * ## What is this?
 *
 * This package checks unordered list markers.
 *
 * ## When should I use this?
 *
 * You can use this package to check unordered lists.
 *
 * ## API
 *
 * ### `unified().use(remarkLintUnorderedListMarkerStyle[, options])`
 *
 * Warn when unordered list markers are inconsistent.
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
 * type Style = '*' | '+' | '-'
 * ```
 *
 * ## Recommendation
 *
 * Because asterisks can be used as a marker for more markdown constructs,
 * it’s recommended to use that for lists (and thematic breaks, emphasis,
 * strong) too.
 *
 * ## Fix
 *
 * [`remark-stringify`][github-remark-stringify] formats unordered lists with
 * asterisks by default.
 * Pass `bullet: '+'` or `bullet: '-'` to use a different marker.
 *
 * [api-options]: #options
 * [api-style]: #style
 * [api-remark-lint-unordered-list-marker-style]: #unifieduseremarklintunorderedlistmarkerstyle-options
 * [github-remark-stringify]: https://github.com/remarkjs/remark/tree/main/packages/remark-stringify
 * [github-unified-transformer]: https://github.com/unifiedjs/unified#transformer
 *
 * @module unordered-list-marker-style
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @example
 *   {"name": "ok.md"}
 *
 *   * Mercury
 *
 *   1. Venus
 *
 *   * Earth
 *
 * @example
 *   {"name": "ok.md", "config": "*"}
 *
 *   * Mercury
 *
 * @example
 *   {"name": "ok.md", "config": "-"}
 *
 *   - Mercury
 *
 * @example
 *   {"name": "ok.md", "config": "+"}
 *
 *   + Mercury
 *
 * @example
 *   {"name": "not-ok.md", "label": "input"}
 *
 *   * Mercury
 *
 *   - Venus
 *
 *   + Earth
 * @example
 *   {"name": "not-ok.md", "label": "output"}
 *
 *   3:1: Unexpected unordered list marker `-`, expected `*`
 *   5:1: Unexpected unordered list marker `+`, expected `*`
 *
 * @example
 *   {"name": "not-ok.md", "label": "output", "config": "🌍", "positionless": true}
 *
 *   1:1: Unexpected value `🌍` for `options`, expected `'*'`, `'+'`, `'-'`, or `'consistent'`
 */

/**
 * @typedef {import('mdast').Root} Root
 */

/**
 * @typedef {Style | 'consistent'} Options
 *   Configuration.
 *
 * @typedef {'*' | '+' | '-'} Style
 *   Styles.
 */

import {lintRule} from 'unified-lint-rule'
import {pointStart} from 'unist-util-position'
import {visitParents} from 'unist-util-visit-parents'
import {VFileMessage} from 'vfile-message'

const remarkLintUnorderedListMarkerStyle = lintRule(
  {
    origin: 'remark-lint:unordered-list-marker-style',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-unordered-list-marker-style#readme'
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

    console.log('check:', file.path)

    if (options === null || options === undefined || options === 'consistent') {
      // Empty.
    } else if (options === '*' || options === '+' || options === '-') {
      expected = options
    } else {
      file.fail(
        'Unexpected value `' +
          options +
          "` for `options`, expected `'*'`, `'+'`, `'-'`, or `'consistent'`"
      )
    }

    visitParents(tree, 'listItem', function (node, parents) {
      const parent = parents.at(-1)

      if (!parent || parent.type !== 'list' || parent.ordered) return

      const place = pointStart(node)

      if (!place || typeof place.offset !== 'number') return

      const code = value.charCodeAt(place.offset)

      const actual =
        code === 42 /* `*` */
          ? '*'
          : code === 43 /* `+` */
            ? '+'
            : code === 45 /* `-` */
              ? '-'
              : /* c8 ignore next -- weird ASTs. */
                undefined

      /* c8 ignore next -- weird ASTs. */
      if (!actual) return

      if (expected) {
        if (actual !== expected) {
          file.message(
            'Unexpected unordered list marker `' +
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
          'Unordered list marker style `' +
            expected +
            "` first defined for `'consistent'` here",
          {
            ancestors: [...parents, node],
            place,
            ruleId: 'unordered-list-marker-style',
            source: 'remark-lint'
          }
        )
      }
    })
  }
)

export default remarkLintUnorderedListMarkerStyle

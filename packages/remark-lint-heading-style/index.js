/**
 * remark-lint rule to warn when headings violate a given style.
 *
 * ## What is this?
 *
 * This package checks the style of headings.
 *
 * ## When should I use this?
 *
 * You can use this package to check that the style of headings is consistent.
 *
 * ## API
 *
 * ### `unified().use(remarkLintHeadingStyle[, options])`
 *
 * Warn when headings violate a given style.
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
 * type Style = 'atx' | 'atx-closed' | 'setext'
 * ```
 *
 * ## Recommendation
 *
 * Setext headings are limited in that they can only construct headings with a
 * rank of one and two.
 * They do allow multiple lines of content where ATX only allows one line.
 * The number of used markers in their underline does not matter,
 * leading to either:
 *
 * * 1 marker (`Hello\n-`),
 *   which is the bare minimum,
 *   and for rank 2 headings looks suspiciously like an empty list item
 * * using as many markers as the content (`Hello\n-----`),
 *   which is hard to maintain and diff
 * * an arbitrary number (`Hello\n---`), which for rank 2 headings looks
 *   suspiciously like a thematic break
 *
 * Setext headings are also uncommon.
 * Using a sequence of hashes at the end of ATX headings is even more uncommon.
 * Due to this,
 * it’s recommended to use ATX headings, without closing hashes.
 *
 * ## Fix
 *
 * [`remark-stringify`][github-remark-stringify] formats headings as ATX by default.
 * The other styles can be configured with `setext: true` or `closeAtx: true`.
 *
 * [api-options]: #options
 * [api-remark-lint-heading-style]: #unifieduseremarklintheadingstyle-options
 * [api-style]: #style
 * [github-remark-stringify]: https://github.com/remarkjs/remark/tree/main/packages/remark-stringify
 * [github-unified-transformer]: https://github.com/unifiedjs/unified#transformer
 *
 * @module heading-style
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 *
 * @example
 *   {"config": "atx", "name": "ok.md"}
 *
 *   # Mercury
 *
 *   ## Venus
 *
 *   ### Earth
 *
 * @example
 *   {"config": "atx-closed", "name": "ok.md"}
 *
 *   # Mercury ##
 *
 *   ## Venus ##
 *
 *   ### Earth ###
 *
 * @example
 *   {"config": "setext", "name": "ok.md"}
 *
 *   Mercury
 *   =======
 *
 *   Venus
 *   -----
 *
 *   ### Earth
 *
 * @example
 *   {"label": "input", "name": "not-ok.md"}
 *
 *   Mercury
 *   =======
 *
 *   ## Venus
 *
 *   ### Earth ###
 * @example
 *   {"label": "output", "name": "not-ok.md"}
 *
 *   4:1-4:9: Unexpected ATX heading, expected setext
 *   6:1-6:14: Unexpected ATX (closed) heading, expected setext
 *
 * @example
 *   {"config": "🌍", "label": "output", "name": "not-ok.md", "positionless": true}
 *
 *   1:1: Unexpected value `🌍` for `options`, expected `'atx'`, `'atx-closed'`, `'setext'`, or `'consistent'`
 */

/**
 * @typedef {import('mdast').Root} Root
 */

/**
 * @typedef {Style | 'consistent'} Options
 *   Configuration.
 *
 * @typedef {'atx' | 'atx-closed' | 'setext'} Style
 *   Styles.
 */

import {headingStyle} from 'mdast-util-heading-style'
import {phrasing} from 'mdast-util-phrasing'
import {lintRule} from 'unified-lint-rule'
import {position} from 'unist-util-position'
import {SKIP, visitParents} from 'unist-util-visit-parents'
import {VFileMessage} from 'vfile-message'

const remarkLintHeadingStyle = lintRule(
  {
    origin: 'remark-lint:heading-style',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-heading-style#readme'
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
    /** @type {VFileMessage | undefined} */
    let cause
    /** @type {Style | undefined} */
    let expected

    if (options === null || options === undefined || options === 'consistent') {
      // Empty.
    } else if (
      options === 'atx' ||
      options === 'atx-closed' ||
      options === 'setext'
    ) {
      expected = options
    } else {
      file.fail(
        'Unexpected value `' +
          options +
          "` for `options`, expected `'atx'`, `'atx-closed'`, `'setext'`, or `'consistent'`"
      )
    }

    visitParents(tree, function (node, parents) {
      // Do not walk into phrasing.
      if (phrasing(node)) {
        return SKIP
      }

      if (node.type !== 'heading') return

      const place = position(node)
      const actual = headingStyle(node, expected)

      if (actual) {
        if (expected) {
          if (place && actual !== expected) {
            file.message(
              'Unexpected ' +
                displayStyle(actual) +
                ' heading, expected ' +
                displayStyle(expected),
              {ancestors: [...parents, node], cause, place}
            )
          }
        } else {
          expected = actual
          cause = new VFileMessage(
            'Heading style ' +
              displayStyle(expected) +
              " first defined for `'consistent'` here",
            {
              ancestors: [...parents, node],
              place,
              ruleId: 'heading-style',
              source: 'remark-lint'
            }
          )
        }
      }
    })
  }
)

export default remarkLintHeadingStyle

/**
 * @param {Style} style
 *   Style.
 * @returns {string}
 *   Display.
 */
function displayStyle(style) {
  return style === 'atx'
    ? 'ATX'
    : style === 'atx-closed'
      ? 'ATX (closed)'
      : 'setext'
}

/**
 * remark-lint rule to warn when the number of GFM strikethrough markers are
 * inconsistent.
 *
 * ## What is this?
 *
 * This package checks the number of strikethrough markers.
 * Strikethrough is a GFM feature enabled with
 * [`remark-gfm`][github-remark-gfm].
 *
 * ## When should I use this?
 *
 * You can use this package to check that GFM strikethrough is consistent.
 *
 * ## API
 *
 * ### `unified().use(remarkLintStrikethroughMarker[, options])`
 *
 * Warn when the number of GFM strikethrough markers are inconsistent.
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
 * ### `Marker`
 *
 * Marker (TypeScript type).
 *
 * ###### Type
 *
 * ```ts
 * type Marker = '~~' | '~'
 * ```
 *
 * ### `Options`
 *
 * Configuration (TypeScript type).
 *
 * ###### Type
 *
 * ```ts
 * type Options = Marker | 'consistent'
 * ```
 *
 * ## Recommendation
 *
 * GitHub flavored markdown (GFM) specifies that two tildes should be used,
 * but `github.com` allows one tilde everywhere.
 * It’s recommended to use two tildes.
 *
 * ## Fix
 *
 * [`remark-stringify`][github-remark-stringify] with
 * [`remark-gfm`][github-remark-gfm] formats all strikethrough with two tildes.
 *
 * [api-marker]: #marker
 * [api-options]: #options
 * [api-remark-lint-strikethrough-marker]: #unifieduseremarklintstrikethroughmarker-options
 * [github-remark-gfm]: https://github.com/remarkjs/remark-gfm
 * [github-remark-stringify]: https://github.com/remarkjs/remark/tree/main/packages/remark-stringify
 * [github-unified-transformer]: https://github.com/unifiedjs/unified#transformer
 *
 * @module strikethrough-marker
 * @author Denis Augsburger
 * @copyright Denis Augsburger
 * @license MIT
 *
 * @example
 *   {"gfm": true, "label": "input", "name": "not-ok.md"}
 *
 *   ~Mercury~Venus and ~~Earth~~Mars.
 * @example
 *   {"gfm": true, "label": "output", "name": "not-ok.md"}
 *
 *   1:20-1:29: Unexpected double tilde strikethrough sequences (`~~`), expected single tilde (`~`)
 *
 * @example
 *   {"config": "~", "gfm": true, "name": "ok.md"}
 *
 *   ~Mercury~Venus.
 *
 * @example
 *   {"config": "~", "gfm": true, "label": "input", "name": "not-ok.md"}
 *
 *   ~~Mercury~~Venus.
 * @example
 *   {"config": "~", "gfm": true, "label": "output", "name": "not-ok.md"}
 *
 *   1:1-1:12: Unexpected double tilde strikethrough sequences (`~~`), expected single tilde (`~`)
 *
 * @example
 *   {"config": "~~", "gfm": true, "name": "ok.md"}
 *
 *   ~~Mercury~~Venus.
 *
 * @example
 *   {"config": "~~", "gfm": true, "label": "input", "name": "not-ok.md"}
 *
 *   ~Mercury~Venus.
 * @example
 *   {"config": "~~", "gfm": true, "label": "output", "name": "not-ok.md"}
 *
 *   1:1-1:10: Unexpected single tilde strikethrough sequences (`~`), expected double tilde (`~~`)
 *
 * @example
 *   {"config": "🌍", "name": "not-ok.md", "label": "output", "positionless": true, "gfm": true}
 *
 *   1:1: Unexpected value `🌍` for `options`, expected `'~~'`, `'~'`, or `'consistent'`
 */

/**
 * @import {Root} from 'mdast'
 */

/**
 * @typedef {'~' | '~~'} Marker
 *   Styles.
 *
 * @typedef {Marker | 'consistent'} Options
 *   Configuration.
 */

import {lintRule} from 'unified-lint-rule'
import {pointStart} from 'unist-util-position'
import {visitParents} from 'unist-util-visit-parents'
import {VFileMessage} from 'vfile-message'

const remarkLintStrikethroughMarker = lintRule(
  {
    origin: 'remark-lint:strikethrough-marker',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-strikethrough-marker#readme'
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
    /** @type {VFileMessage | undefined} */
    let cause
    /** @type {Marker | undefined} */
    let expected

    if (options === null || options === undefined || options === 'consistent') {
      // Empty.
    } else if (options === '~~' || options === '~') {
      expected = options
    } else {
      file.fail(
        'Unexpected value `' +
          options +
          "` for `options`, expected `'~~'`, `'~'`, or `'consistent'`"
      )
    }

    visitParents(tree, 'delete', function (node, parents) {
      const start = pointStart(node)

      if (start && typeof start.offset === 'number') {
        /* c8 ignore next -- Weird AST. */
        if (value.charAt(start.offset) !== '~') return
        const actual = value.charAt(start.offset + 1) === '~' ? '~~' : '~'

        if (expected) {
          if (actual !== expected) {
            file.message(
              'Unexpected ' +
                (actual === '~' ? 'single' : 'double') +
                ' tilde strikethrough sequences (`' +
                actual +
                '`), expected ' +
                (expected === '~' ? 'single' : 'double') +
                ' tilde (`' +
                expected +
                '`)',
              {ancestors: [...parents, node], cause, place: node.position}
            )
          }
        } else {
          expected = actual
          cause = new VFileMessage(
            "Strikethrough sequence style `'" +
              actual +
              "'` first defined for `'consistent'` here",
            {
              ancestors: [...parents, node],
              place: node.position,
              ruleId: 'strikethrough-marker',
              source: 'remark-lint'
            }
          )
        }
      }
    })
  }
)

export default remarkLintStrikethroughMarker

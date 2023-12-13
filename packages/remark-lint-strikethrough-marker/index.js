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
 * @copyright 2021 Denis Augsburger
 * @license MIT
 * @example
 *   {"config": "~", "name": "ok.md", "gfm": true}
 *
 *   ~foo~
 *
 * @example
 *   {"config": "~", "name": "not-ok.md", "label": "input", "gfm": true}
 *
 *   ~~foo~~
 *
 * @example
 *   {"config": "~", "name": "not-ok.md", "label": "output", "gfm": true}
 *
 *   1:1-1:8: Strikethrough should use `~` as a marker
 *
 * @example
 *   {"config": "~~", "name": "ok.md", "gfm": true}
 *
 *   ~~foo~~
 *
 * @example
 *   {"config": "~~", "name": "not-ok.md", "label": "input", "gfm": true}
 *
 *   ~foo~
 *
 * @example
 *   {"config": "~~", "name": "not-ok.md", "label": "output", "gfm": true}
 *
 *   1:1-1:6: Strikethrough should use `~~` as a marker
 *
 * @example
 *   {"name": "not-ok.md", "label": "input", "gfm": true}
 *
 *   ~~foo~~
 *   ~bar~
 *
 * @example
 *   {"name": "not-ok.md", "label": "output", "gfm": true}
 *
 *   2:1-2:6: Strikethrough should use `~~` as a marker
 *
 * @example
 *   {"config": "💩", "name": "not-ok.md", "label": "output", "positionless": true, "gfm": true}
 *
 *   1:1: Incorrect strikethrough marker `💩`: use either `'consistent'`, `'~'`, or `'~~'`
 */

/**
 * @typedef {import('mdast').Root} Root
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
import {visit} from 'unist-util-visit'

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
    let option = options || 'consistent'

    if (option !== '~' && option !== '~~' && option !== 'consistent') {
      file.fail(
        'Incorrect strikethrough marker `' +
          option +
          "`: use either `'consistent'`, `'~'`, or `'~~'`"
      )
    }

    visit(tree, 'delete', function (node) {
      const start = pointStart(node)

      if (start && typeof start.offset === 'number') {
        const both = value.slice(start.offset, start.offset + 2)
        const marker = both === '~~' ? '~~' : '~'

        if (option === 'consistent') {
          option = marker
        } else if (marker !== option) {
          file.message(
            'Strikethrough should use `' + option + '` as a marker',
            node
          )
        }
      }
    })
  }
)

export default remarkLintStrikethroughMarker

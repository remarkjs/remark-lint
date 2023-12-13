/**
 * remark-lint rule to warn when strong markers are inconsistent.
 *
 * ## What is this?
 *
 * This package checks the style of strong markers.
 *
 * ## When should I use this?
 *
 * You can use this package to check that strong is consistent.
 *
 * ## API
 *
 * ### `unified().use(remarkLintStrongMarker[, options])`
 *
 * Warn when strong markers are inconsistent.
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
 * type Marker = '*' | '_'
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
 * Whether asterisks or underscores are used affects how and whether emphasis
 * works.
 * Underscores are sometimes used to represent normal underscores inside words,
 * so there are extra rules in markdown to support that.
 * Asterisks are not used in natural language,
 * so they don’t need these rules,
 * and thus can form emphasis in more cases.
 * Asterisks can also be used as the marker of more constructs than underscores:
 * lists.
 * Due to having simpler parsing rules,
 * looking more like syntax,
 * and that they can be used for more constructs,
 * it’s recommended to prefer asterisks.
 *
 * ## Fix
 *
 * [`remark-stringify`][github-remark-stringify] formats strong with asterisks
 * by default.
 * Pass `strong: '_'` to always use underscores.
 *
 * [api-marker]: #marker
 * [api-options]: #options
 * [api-remark-lint-strong-marker]: #unifieduseremarklintstrongmarker-options
 * [github-remark-stringify]: https://github.com/remarkjs/remark/tree/main/packages/remark-stringify
 * [github-unified-transformer]: https://github.com/unifiedjs/unified#transformer
 *
 * @module strong-marker
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @example
 *   {"name": "ok.md"}
 *
 *   **foo** and **bar**.
 *
 * @example
 *   {"name": "also-ok.md"}
 *
 *   __foo__ and __bar__.
 *
 * @example
 *   {"name": "ok.md", "config": "*"}
 *
 *   **foo**.
 *
 * @example
 *   {"name": "ok.md", "config": "_"}
 *
 *   __foo__.
 *
 * @example
 *   {"name": "not-ok.md", "label": "input"}
 *
 *   **foo** and __bar__.
 *
 * @example
 *   {"name": "not-ok.md", "label": "output"}
 *
 *   1:13-1:20: Strong should use `*` as a marker
 *
 * @example
 *   {"name": "not-ok.md", "label": "output", "config": "💩", "positionless": true}
 *
 *   1:1: Incorrect strong marker `💩`: use either `'consistent'`, `'*'`, or `'_'`
 */

/**
 * @typedef {import('mdast').Root} Root
 */

/**
 * @typedef {'*' | '_'} Marker
 *   Styles.
 *
 * @typedef {Marker | 'consistent'} Options
 *   Configuration.
 */

import {lintRule} from 'unified-lint-rule'
import {pointStart} from 'unist-util-position'
import {visit} from 'unist-util-visit'

const remarkLintStrongMarker = lintRule(
  {
    origin: 'remark-lint:strong-marker',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-strong-marker#readme'
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

    if (option !== '*' && option !== '_' && option !== 'consistent') {
      file.fail(
        'Incorrect strong marker `' +
          option +
          "`: use either `'consistent'`, `'*'`, or `'_'`"
      )
    }

    visit(tree, 'strong', function (node) {
      const start = pointStart(node)

      if (start && typeof start.offset === 'number') {
        const marker = /** @type {Marker} */ (value.charAt(start.offset))

        if (option === 'consistent') {
          option = marker
        } else if (marker !== option) {
          file.message('Strong should use `' + option + '` as a marker', node)
        }
      }
    })
  }
)

export default remarkLintStrongMarker

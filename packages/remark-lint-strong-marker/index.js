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
 * Whether asterisks or underscores are used affects how and whether strong
 * works.
 * Underscores are sometimes used to represent normal underscores inside words,
 * so there are extra rules in markdown to support that.
 * Asterisks are not used in natural language,
 * so they don’t need these rules,
 * and thus can form strong in more cases.
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
 *
 * @example
 *   {"config": "*", "name": "ok-asterisk.md"}
 *
 *   **Mercury**.
 *
 * @example
 *   {"config": "*", "label": "input", "name": "not-ok-asterisk.md"}
 *
 *   __Mercury__.
 *
 * @example
 *   {"config": "*", "label": "output", "name": "not-ok-asterisk.md"}
 *
 *   1:1-1:12: Unexpected strong marker `_`, expected `*`
 *
 * @example
 *   {"config": "_", "name": "ok-underscore.md"}
 *
 *   __Mercury__.
 *
 * @example
 *   {"config": "_", "label": "input", "name": "not-ok-underscore.md"}
 *
 *   **Mercury**.
 *
 * @example
 *   {"config": "_", "label": "output", "name": "not-ok-underscore.md"}
 *
 *   1:1-1:12: Unexpected strong marker `*`, expected `_`
 *
 * @example
 *   {"label": "input", "name": "not-ok-consistent.md"}
 *
 *   **Mercury** and __Venus__.
 *
 * @example
 *   {"label": "output", "name": "not-ok-consistent.md"}
 *
 *   1:17-1:26: Unexpected strong marker `_`, expected `*`
 *
 * @example
 *   {"config": "🌍", "label": "output", "name": "not-ok.md", "positionless": true}
 *
 *   1:1: Unexpected value `🌍` for `options`, expected `'*'`, `'_'`, or `'consistent'`
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
import {visitParents} from 'unist-util-visit-parents'
import {VFileMessage} from 'vfile-message'

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
    /** @type {VFileMessage | undefined} */
    let cause
    /** @type {Marker | undefined} */
    let expected

    if (options === null || options === undefined || options === 'consistent') {
      // Empty.
    } else if (options === '*' || options === '_') {
      expected = options
    } else {
      file.fail(
        'Unexpected value `' +
          options +
          "` for `options`, expected `'*'`, `'_'`, or `'consistent'`"
      )
    }

    visitParents(tree, 'strong', function (node, parents) {
      const start = pointStart(node)

      if (start && typeof start.offset === 'number') {
        const actual = value.charAt(start.offset)

        /* c8 ignore next -- should not happen. */
        if (actual !== '*' && actual !== '_') return

        if (expected) {
          if (actual !== expected) {
            file.message(
              'Unexpected strong marker `' +
                actual +
                '`, expected `' +
                expected +
                '`',
              {ancestors: [...parents, node], cause, place: node.position}
            )
          }
        } else {
          expected = actual
          cause = new VFileMessage(
            "Strong marker style `'" +
              actual +
              "'` first defined for `'consistent'` here",
            {
              ancestors: [...parents, node],
              place: node.position,
              ruleId: 'strong-marker',
              source: 'remark-lint'
            }
          )
        }
      }
    })
  }
)

export default remarkLintStrongMarker

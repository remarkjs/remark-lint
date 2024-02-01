/**
 * remark-lint rule to warn when fenced code markers are
 * inconsistent.
 *
 * ## What is this?
 *
 * This package checks fenced code block markers.
 *
 * ## When should I use this?
 *
 * You can use this package to check that fenced code block markers are
 * consistent.
 *
 * ## API
 *
 * ### `unified().use(remarkLintFencedCodeMarker[, options])`
 *
 * Warn when fenced code markers are inconsistent.
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
 * type Marker = '`' | '~'
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
 * Tildes are uncommon.
 * So it’s recommended to configure this rule with ``'`'``.
 *
 * ## Fix
 *
 * [`remark-stringify`][github-remark-stringify] formats fenced code with grave
 * accents by default.
 * Pass `fence: '~'` to always use tildes.
 *
 * [api-marker]: #marker
 * [api-options]: #options
 * [api-remark-lint-fenced-code-marker]: #unifieduseremarklintfencedcodemarker-options
 * [github-remark-stringify]: https://github.com/remarkjs/remark/tree/main/packages/remark-stringify
 * [github-unified-transformer]: https://github.com/unifiedjs/unified#transformer
 *
 * @module fenced-code-marker
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 *
 * @example
 *   {"name": "ok-indented.md"}
 *
 *   Indented code blocks are not affected by this rule:
 *
 *       mercury()
 *
 * @example
 *   {"config": "`", "name": "ok-tick.md"}
 *
 *   ```javascript
 *   mercury()
 *   ```
 *
 *   ```
 *   venus()
 *   ```
 *
 * @example
 *   {"config": "~", "name": "ok-tilde.md"}
 *
 *   ~~~javascript
 *   mercury()
 *   ~~~
 *
 *   ~~~
 *   venus()
 *   ~~~
 *
 * @example
 *   {"label": "input", "name": "not-ok-consistent-tick.md"}
 *
 *   ```javascript
 *   mercury()
 *   ```
 *
 *   ~~~
 *   venus()
 *   ~~~
 * @example
 *   {"label": "output", "name": "not-ok-consistent-tick.md"}
 *
 *   5:1-7:4: Unexpected fenced code marker `~`, expected `` ` ``
 *
 * @example
 *   {"label": "input", "name": "not-ok-consistent-tilde.md"}
 *
 *   ~~~javascript
 *   mercury()
 *   ~~~
 *
 *   ```
 *   venus()
 *   ```
 * @example
 *   {"label": "output", "name": "not-ok-consistent-tilde.md"}
 *
 *   5:1-7:4: Unexpected fenced code marker `` ` ``, expected `~`
 *
 * @example
 *   {"config": "🌍", "label": "output", "name": "not-ok-incorrect.md", "positionless": true}
 *
 *   1:1: Unexpected value `🌍` for `options`, expected ``'`'``, `'~'`, or `'consistent'`
 */

/**
 * @typedef {import('mdast').Root} Root
 */

/**
 * @typedef {'`' | '~'} Marker
 *   Styles.
 *
 * @typedef {Marker | 'consistent'} Options
 *   Configuration.
 */

import {phrasing} from 'mdast-util-phrasing'
import {lintRule} from 'unified-lint-rule'
import {pointStart} from 'unist-util-position'
import {SKIP, visitParents} from 'unist-util-visit-parents'
import {VFileMessage} from 'vfile-message'

const remarkLintFencedCodeMarker = lintRule(
  {
    origin: 'remark-lint:fenced-code-marker',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-fenced-code-marker#readme'
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
    } else if (options === '`' || options === '~') {
      expected = options
    } else {
      file.fail(
        'Unexpected value `' +
          options +
          "` for `options`, expected ``'`'``, `'~'`, or `'consistent'`"
      )
    }

    visitParents(tree, function (node, parents) {
      // Do not walk into phrasing.
      if (phrasing(node)) {
        return SKIP
      }

      if (node.type !== 'code') return

      const start = pointStart(node)

      if (start && typeof start.offset === 'number') {
        const actual = value
          .slice(start.offset, start.offset + 4)
          .replace(/^\s+/, '')
          .charAt(0)

        // Ignore unfenced code blocks.
        if (actual !== '`' && actual !== '~') return

        if (expected) {
          if (actual !== expected) {
            file.message(
              'Unexpected fenced code marker ' +
                (actual === '~' ? '`~`' : '`` ` ``') +
                ', expected ' +
                (expected === '~' ? '`~`' : '`` ` ``'),
              {ancestors: [...parents, node], cause, place: node.position}
            )
          }
        } else {
          expected = actual
          cause = new VFileMessage(
            'Fenced code marker style ' +
              (actual === '~' ? "`'~'`" : "``'`'``") +
              " first defined for `'consistent'` here",
            {
              ancestors: [...parents, node],
              place: node.position,
              ruleId: 'fenced-code-marker',
              source: 'remark-lint'
            }
          )
        }
      }
    })
  }
)

export default remarkLintFencedCodeMarker

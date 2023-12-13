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
 * @example
 *   {"name": "ok.md"}
 *
 *   Indented code blocks are not affected by this rule:
 *
 *       bravo()
 *
 * @example
 *   {"name": "ok.md", "config": "`"}
 *
 *   ```alpha
 *   bravo()
 *   ```
 *
 *   ```
 *   charlie()
 *   ```
 *
 * @example
 *   {"name": "ok.md", "config": "~"}
 *
 *   ~~~alpha
 *   bravo()
 *   ~~~
 *
 *   ~~~
 *   charlie()
 *   ~~~
 *
 * @example
 *   {"name": "not-ok-consistent-tick.md", "label": "input"}
 *
 *   ```alpha
 *   bravo()
 *   ```
 *
 *   ~~~
 *   charlie()
 *   ~~~
 *
 * @example
 *   {"name": "not-ok-consistent-tick.md", "label": "output"}
 *
 *   5:1-7:4: Fenced code should use `` ` `` as a marker
 *
 * @example
 *   {"name": "not-ok-consistent-tilde.md", "label": "input"}
 *
 *   ~~~alpha
 *   bravo()
 *   ~~~
 *
 *   ```
 *   charlie()
 *   ```
 *
 * @example
 *   {"name": "not-ok-consistent-tilde.md", "label": "output"}
 *
 *   5:1-7:4: Fenced code should use `~` as a marker
 *
 * @example
 *   {"name": "not-ok-incorrect.md", "config": "💩", "label": "output", "positionless": true}
 *
 *   1:1: Incorrect fenced code marker `💩`: use either `'consistent'`, `` '`' ``, or `'~'`
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

import {lintRule} from 'unified-lint-rule'
import {pointStart} from 'unist-util-position'
import {visit} from 'unist-util-visit'

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
    let option = options || 'consistent'
    const contents = String(file)

    if (option !== 'consistent' && option !== '~' && option !== '`') {
      file.fail(
        'Incorrect fenced code marker `' +
          option +
          "`: use either `'consistent'`, `` '`' ``, or `'~'`"
      )
    }

    visit(tree, 'code', function (node) {
      const start = pointStart(node)

      if (start && typeof start.offset === 'number') {
        const marker = contents
          .slice(start.offset, start.offset + 4)
          .replace(/^\s+/, '')
          .charAt(0)

        // Ignore unfenced code blocks.
        if (marker === '`' || marker === '~') {
          if (option === 'consistent') {
            option = marker
          } else if (marker !== option) {
            file.message(
              'Fenced code should use `' +
                (option === '~' ? option : '` ` `') +
                '` as a marker',
              node
            )
          }
        }
      }
    })
  }
)

export default remarkLintFencedCodeMarker

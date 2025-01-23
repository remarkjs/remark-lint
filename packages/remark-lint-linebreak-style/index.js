/**
 * remark-lint rule to warn when line endings violate a given style.
 *
 * ## When should I use this?
 *
 * This package checks the style of line endings.
 *
 * ## When should I use this?
 *
 * You can use this package to check that the style of line endings is
 * consistent.
 *
 * ## API
 *
 * ### `unified().use(remarkLintLinebreakStyle[, options])`
 *
 * Warn when line endings violate a given style.
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
 * type Style = 'unix' | 'windows'
 * ```
 *
 * ## Recommendation
 *
 * In Git projects, you can configure to automatically switch between line
 * endings based on who checks the repo out.
 * In other places, you may want to manually force that one or the other is
 * used.
 *
 * ## Fix
 *
 * [`remark-stringify`][github-remark-stringify] always uses Unix line endings.
 *
 * [api-options]: #options
 * [api-remark-lint-linebreak-style]: #unifieduseremarklintlinebreakstyle-options
 * [api-style]: #style
 * [github-remark-stringify]: https://github.com/remarkjs/remark/tree/main/packages/remark-stringify
 * [github-unified-transformer]: https://github.com/unifiedjs/unified#transformer
 *
 * @module linebreak-style
 * @author Titus Wormer
 * @copyright Titus Wormer
 * @license MIT
 *
 * @example
 *   {"name": "ok-consistent-as-windows.md"}
 *
 *   Mercury␍␊and␍␊Venus.
 *
 * @example
 *   {"name": "ok-consistent-as-unix.md"}
 *
 *   Mercury␊and␊Venus.
 *
 * @example
 *   {"config": "unix", "label": "input", "name": "not-ok-unix.md", "positionless": true}
 *
 *   Mercury.␍␊
 *
 * @example
 *   {"config": "unix", "label": "output", "name": "not-ok-unix.md", "positionless": true}
 *
 *   1:10: Unexpected windows (`\r\n`) line ending, expected unix (`\n`) line endings
 *
 * @example
 *   {"config": "windows", "label": "input", "name": "not-ok-windows.md", "positionless": true}
 *
 *   Mercury.␊
 *
 * @example
 *   {"config": "windows", "label": "output", "name": "not-ok-windows.md", "positionless": true}
 *
 *   1:9: Unexpected unix (`\n`) line ending, expected windows (`\r\n`) line endings
 *
 * @example
 *   {"config": "🌍", "label": "output", "name": "not-ok-options.md", "positionless": true}
 *
 *   1:1: Unexpected value `🌍` for `options`, expected `'unix'`, `'windows'`, or `'consistent'`
 *
 * @example
 *   {"config": "windows", "label": "input", "name": "many.md", "positionless": true}
 *
 *   Mercury.␊Venus.␊Earth.␊Mars.␊Jupiter.␊Saturn.␊Uranus.␊Neptune.␊
 *
 * @example
 *   {"config": "windows", "label": "output", "name": "many.md", "positionless": true}
 *
 *   1:9: Unexpected unix (`\n`) line ending, expected windows (`\r\n`) line endings
 *   2:7: Unexpected unix (`\n`) line ending, expected windows (`\r\n`) line endings
 *   3:7: Unexpected unix (`\n`) line ending, expected windows (`\r\n`) line endings
 *   4:6: Unexpected unix (`\n`) line ending, expected windows (`\r\n`) line endings
 *   5:9: Unexpected unix (`\n`) line ending, expected windows (`\r\n`) line endings
 *   6:8: Unexpected large number of incorrect line endings, stopping
 */

/**
 * @import {Root} from 'mdast'
 */

/**
 * @typedef {Style | 'consistent'} Options
 *   Options.
 *
 * @typedef {'unix' | 'windows'} Style
 *   Styles.
 */

import {ok as assert} from 'devlop'
import {lintRule} from 'unified-lint-rule'
import {location} from 'vfile-location'
import {VFileMessage} from 'vfile-message'

const max = 5

const remarkLintLinebreakStyle = lintRule(
  {
    origin: 'remark-lint:linebreak-style',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-linebreak-style#readme'
  },
  /**
   * @param {Root} _
   *   Tree.
   * @param {Options | null | undefined} [options='consistent']
   *   Configuration (default: `'consistent'`).
   * @returns {undefined}
   *   Nothing.
   */
  function (_, file, options) {
    const value = String(file)
    const toPoint = location(value).toPoint
    let index = value.indexOf('\n')
    /** @type {VFileMessage | undefined} */
    let cause
    /** @type {Style | undefined} */
    let expected

    if (options === null || options === undefined || options === 'consistent') {
      // Empty.
    } else if (options === 'unix' || options === 'windows') {
      expected = options
    } else {
      file.fail(
        'Unexpected value `' +
          options +
          "` for `options`, expected `'unix'`, `'windows'`, or `'consistent'`"
      )
    }

    let messages = 0

    while (index !== -1) {
      const actual = value.charAt(index - 1) === '\r' ? 'windows' : 'unix'
      const place = toPoint(index)
      assert(place) // Always defined.

      if (expected) {
        if (expected !== actual) {
          if (messages === max) {
            file.info(
              'Unexpected large number of incorrect line endings, stopping',
              {place}
            )
            return
          }

          file.message(
            'Unexpected ' +
              displayStyle(actual) +
              ' line ending, expected ' +
              displayStyle(expected) +
              ' line endings',
            {cause, place}
          )
          messages++
        }
      } else {
        expected = actual
        cause = new VFileMessage(
          'Line ending style ' +
            displayStyle(expected) +
            " first defined for `'consistent'` here",
          {place, ruleId: 'linebreak-style', source: 'remark-lint'}
        )
      }

      index = value.indexOf('\n', index + 1)
    }
  }
)

export default remarkLintLinebreakStyle

/**
 * @param {Style} style
 *   Style.
 * @returns {string}
 *   Display.
 */
function displayStyle(style) {
  return style === 'unix' ? 'unix (`\\n`)' : 'windows (`\\r\\n`)'
}

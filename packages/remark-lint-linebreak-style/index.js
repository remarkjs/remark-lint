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
 * [`remark-stringify`][github-remark-stringify] always uses Unix linebreaks.
 *
 * [api-options]: #options
 * [api-remark-lint-linebreak-style]: #unifieduseremarklintlinebreakstyle-options
 * [api-style]: #style
 * [github-remark-stringify]: https://github.com/remarkjs/remark/tree/main/packages/remark-stringify
 * [github-unified-transformer]: https://github.com/unifiedjs/unified#transformer
 *
 * @module linebreak-style
 * @author Titus Wormer
 * @copyright 2017 Titus Wormer
 * @license MIT
 * @example
 *   {"name": "ok-consistent-as-windows.md"}
 *
 *   Alpha␍␊Bravo␍␊
 *
 * @example
 *   {"name": "ok-consistent-as-unix.md"}
 *
 *   Alpha␊Bravo␊
 *
 * @example
 *   {"name": "not-ok-unix.md", "label": "input", "config": "unix", "positionless": true}
 *
 *   Alpha␍␊
 *
 * @example
 *   {"name": "not-ok-unix.md", "label": "output", "config": "unix"}
 *
 *   1:7: Expected linebreaks to be unix (`\n`), not windows (`\r\n`)
 *
 * @example
 *   {"name": "not-ok-windows.md", "label": "input", "config": "windows", "positionless": true}
 *
 *   Alpha␊
 *
 * @example
 *   {"name": "not-ok-windows.md", "label": "output", "config": "windows"}
 *
 *   1:6: Expected linebreaks to be windows (`\r\n`), not unix (`\n`)
 */

/**
 * @typedef {import('mdast').Root} Root
 */

/**
 * @typedef {Style | 'consistent'} Options
 *   Options.
 *
 * @typedef {'unix' | 'windows'} Style
 *   Styles.
 */

import {lintRule} from 'unified-lint-rule'
import {location} from 'vfile-location'

const escaped = {unix: '\\n', windows: '\\r\\n'}

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
    let option = options || 'consistent'
    const value = String(file)
    const toPoint = location(value).toPoint
    let index = value.indexOf('\n')

    while (index !== -1) {
      const type = value.charAt(index - 1) === '\r' ? 'windows' : 'unix'

      if (option === 'consistent') {
        option = type
      } else if (option !== type) {
        file.message(
          'Expected linebreaks to be ' +
            option +
            ' (`' +
            escaped[option] +
            '`), not ' +
            type +
            ' (`' +
            escaped[type] +
            '`)',
          toPoint(index)
        )
      }

      index = value.indexOf('\n', index + 1)
    }
  }
)

export default remarkLintLinebreakStyle

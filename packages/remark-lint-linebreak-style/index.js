/**
 * ## When should I use this?
 *
 * You can use this package to check that line endings are consistent.
 *
 * ## API
 *
 *
 * The following options (default: `'consistent'`) are accepted:
 *
 * *   `'unix'`
 *     — prefer Unix line endings (`\n`, `␊`):
 * *   `'window'`
 *     — prefer Windows line endings (`\r\n`, `␍␊`):
 * *   `'consistent'`
 *     — detect the first used style and warn when further line endings differ
 *
 * ## Recommendation
 *
 * In Git projects, you can configure it to automatically switch between line
 * endings based on who checks the repo out.
 * In other places, you might manually want to force that one or the other is
 * used, in which case this rule can be used and configured.
 *
 * ## Fix
 *
 * [`remark-stringify`](https://github.com/remarkjs/remark/tree/main/packages/remark-stringify)
 * always uses Unix linebreaks.
 * @module linebreak-style
 * @summary
 *   remark-lint rule to warn when line endings don’t match a given style.
 * @author Titus Wormer
 * @copyright 2017 Titus Wormer
 * @license MIT
 * @example
 *   {"name": "ok-consistent-as-windows.md"}
 *
 *   Alpha␍␊
 *   Bravo␍␊
 *
 * @example
 *   {"name": "ok-consistent-as-unix.md"}
 *
 *   Alpha␊
 *   Bravo␊
 *
 * @example
 *   {"name": "not-ok-unix.md", "label": "input", "setting": "unix", "positionless": true}
 *
 *   Alpha␍␊
 *
 * @example
 *   {"name": "not-ok-unix.md", "label": "output", "setting": "unix"}
 *
 *   1:7: Expected linebreaks to be unix (`\n`), not windows (`\r\n`)
 *
 * @example
 *   {"name": "not-ok-windows.md", "label": "input", "setting": "windows", "positionless": true}
 *
 *   Alpha␊
 *
 * @example
 *   {"name": "not-ok-windows.md", "label": "output", "setting": "windows"}
 *
 *   1:6: Expected linebreaks to be windows (`\r\n`), not unix (`\n`)
 */

/**
 * @typedef {import('mdast').Root} Root
 * @typedef {'unix'|'windows'} Type
 * @typedef {'consistent'|Type} Options
 */

import {lintRule} from 'unified-lint-rule'
import {location} from 'vfile-location'

const escaped = {unix: '\\n', windows: '\\r\\n'}

const remarkLintLinebreakStyle = lintRule(
  {
    origin: 'remark-lint:linebreak-style',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-linebreak-style#readme'
  },
  /** @type {import('unified-lint-rule').Rule<Root, Options>} */
  (_, file, option = 'consistent') => {
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

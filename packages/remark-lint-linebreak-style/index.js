/**
 * @author Titus Wormer
 * @copyright 2017 Titus Wormer
 * @license MIT
 * @module linebreak-style
 * @fileoverview
 *   Warn when linebreaks violate a given or detected style.
 *
 *   Options: either `'unix'` (for `\n`, denoted as `␊`), `'windows'` (for `\r\n`,
 *   denoted as `␍␊`), or `'consistent'` (to detect the first used linebreak in
 *   a file).  Default: `'consistent'`.
 *
 *   ## Fix
 *
 *   [`remark-stringify`](https://github.com/remarkjs/remark/tree/HEAD/packages/remark-stringify)
 *   always uses unix linebreaks.
 *
 *   See [Using remark to fix your Markdown](https://github.com/remarkjs/remark-lint#using-remark-to-fix-your-markdown)
 *   on how to automatically fix warnings for this rule.
 *
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

import {lintRule} from 'unified-lint-rule'
import {location} from 'vfile-location'

const escaped = {unix: '\\n', windows: '\\r\\n'}
const types = {true: 'windows', false: 'unix'}

const remarkLintLinebreakStyle = lintRule(
  'remark-lint:linebreak-style',
  (tree, file, option) => {
    const value = String(file)
    const toPoint = location(value).toPoint
    let preferred =
      typeof option === 'string' && option !== 'consistent' ? option : null
    let index = value.indexOf('\n')

    while (index !== -1) {
      const type = types[value.charAt(index - 1) === '\r']

      if (preferred) {
        if (preferred !== type) {
          file.message(
            'Expected linebreaks to be ' +
              preferred +
              ' (`' +
              escaped[preferred] +
              '`), not ' +
              type +
              ' (`' +
              escaped[type] +
              '`)',
            toPoint(index)
          )
        }
      } else {
        preferred = type
      }

      index = value.indexOf('\n', index + 1)
    }
  }
)

export default remarkLintLinebreakStyle

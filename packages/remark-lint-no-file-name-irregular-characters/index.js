/**
 * ## When should I use this?
 *
 * You can use this package to check that file names contain regular characters.
 *
 * ## API
 *
 * The following options (default: `'\\.a-zA-Z0-9-'`) are accepted:
 *
 * *   `string` (example `'\w\\.'`)
 *     — allowed characters, wrapped in `new RegExp('[^' + x + ']')`, make sure
 *     to double escape regexp characters
 * *   `RegExp` (example `/[^\.a-zA-Z0-9-]/`)
 *     — disallowed pattern
 *
 * @module no-file-name-irregular-characters
 * @summary
 *   remark-lint rule to warn when file names contain irregular characters.
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @example
 *   {"name": "plug-ins.md"}
 *
 * @example
 *   {"name": "plugins.md"}
 *
 * @example
 *   {"name": "plug_ins.md", "label": "output", "positionless": true}
 *
 *   1:1: Do not use `_` in a file name
 *
 * @example
 *   {"name": "README.md", "label": "output", "setting": "\\.a-z0-9", "positionless": true}
 *
 *   1:1: Do not use `R` in a file name
 *
 * @example
 *   {"name": "plug ins.md", "label": "output", "positionless": true}
 *
 *   1:1: Do not use ` ` in a file name
 */

/**
 * @typedef {import('mdast').Root} Root
 *
 * @typedef {RegExp|string} Options
 */

import {lintRule} from 'unified-lint-rule'

const expression = /[^\\.a-zA-Z\d-]/

const remarkLintNoFileNameIrregularCharacters = lintRule(
  {
    origin: 'remark-lint:no-file-name-irregular-characters',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-no-file-name-irregular-characters#readme'
  },
  /** @type {import('unified-lint-rule').Rule<Root, Options>} */
  (_, file, option) => {
    let preferred = option || expression

    if (typeof preferred === 'string') {
      preferred = new RegExp('[^' + preferred + ']')
    }

    const match = file.stem && file.stem.match(preferred)

    if (match) {
      file.message('Do not use `' + match[0] + '` in a file name')
    }
  }
)

export default remarkLintNoFileNameIrregularCharacters

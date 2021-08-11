/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module no-file-name-irregular-characters
 * @fileoverview
 *   Warn when file names contain irregular characters: characters other than
 *   alphanumericals (`a-zA-Z0-9`), hyphen-minus (`-`), and dots (`.`, full
 *   stops).
 *
 *   Options: `RegExp` or `string`, default: `'\\.a-zA-Z0-9-'`.
 *
 *   If a string is given, it will be wrapped in
 *   `new RegExp('[^' + preferred + ']')`.
 *
 *   Any match by the wrapped or given expressions creates a message.
 *
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

import {lintRule} from 'unified-lint-rule'

const expression = /[^\\.a-zA-Z\d-]/

const remarkLintNoFileNameIrregularCharacters = lintRule(
  'remark-lint:no-file-name-irregular-characters',
  (tree, file, option) => {
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

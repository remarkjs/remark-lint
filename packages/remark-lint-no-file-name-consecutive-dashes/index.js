/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module no-file-name-consecutive-dashes
 * @fileoverview
 *   Warn when file names contain consecutive dashes.
 *
 * @example {"name": "plug-ins.md"}
 *
 * @example {"name": "plug--ins.md", "label": "output", "positionless": true}
 *
 *   1:1: Do not use consecutive dashes in a file name
 */

import {lintRule} from 'unified-lint-rule'

const remarkLintNoFileNameConsecutiveDashes = lintRule(
  'remark-lint:no-file-name-consecutive-dashes',
  (tree, file) => {
    if (file.stem && /-{2,}/.test(file.stem)) {
      file.message('Do not use consecutive dashes in a file name')
    }
  }
)

export default remarkLintNoFileNameConsecutiveDashes

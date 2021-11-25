/**
 * ## When should I use this?
 *
 * You can use this package to check that no consecutive dashes appear in
 * file names.
 *
 * ## API
 *
 * There are no options.
 *
 * @module no-file-name-consecutive-dashes
 * @summary
 *   remark-lint rule to warn when consecutive dashes appear in file names.
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @example
 *   {"name": "plug-ins.md"}
 *
 * @example
 *   {"name": "plug--ins.md", "label": "output", "positionless": true}
 *
 *   1:1: Do not use consecutive dashes in a file name
 */

/**
 * @typedef {import('mdast').Root} Root
 */

import {lintRule} from 'unified-lint-rule'

const remarkLintNoFileNameConsecutiveDashes = lintRule(
  {
    origin: 'remark-lint:no-file-name-consecutive-dashes',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-no-file-name-consecutive-dashes#readme'
  },
  /** @type {import('unified-lint-rule').Rule<Root, void>} */
  (_, file) => {
    if (file.stem && /-{2,}/.test(file.stem)) {
      file.message('Do not use consecutive dashes in a file name')
    }
  }
)

export default remarkLintNoFileNameConsecutiveDashes

/**
 * ## When should I use this?
 *
 * You can use this package to check that file name casing is consistent
 * (either lowercase or uppercase).
 *
 * ## API
 *
 * There are no options.
 *
 * @module no-file-name-mixed-case
 * @summary
 *   remark-lint rule to warn when file name casing is inconsistent.
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @example
 *   {"name": "README.md"}
 *
 * @example
 *   {"name": "readme.md"}
 *
 * @example
 *   {"name": "Readme.md", "label": "output", "positionless": true}
 *
 *   1:1: Do not mix casing in file names
 */

/**
 * @typedef {import('mdast').Root} Root
 */

import {lintRule} from 'unified-lint-rule'

const remarkLintNofileNameMixedCase = lintRule(
  {
    origin: 'remark-lint:no-file-name-mixed-case',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-no-file-name-mixed-case#readme'
  },
  /** @type {import('unified-lint-rule').Rule<Root, void>} */
  (_, file) => {
    const name = file.stem

    if (name && !(name === name.toLowerCase() || name === name.toUpperCase())) {
      file.message('Do not mix casing in file names')
    }
  }
)

export default remarkLintNofileNameMixedCase

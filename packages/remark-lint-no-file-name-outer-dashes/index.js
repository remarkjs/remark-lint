/**
 * ## When should I use this?
 *
 * You can use this package to check that no initial or final dashes appear in
 * file names.
 *
 * ## API
 *
 * There are no options.
 *
 * @module no-file-name-outer-dashes
 * @summary
 *   remark-lint rule to warn when initial or final dashes appear in file names.
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @example
 *   {"name": "readme.md"}
 *
 * @example
 *   {"name": "-readme.md", "label": "output", "positionless": true}
 *
 *   1:1: Do not use initial or final dashes in a file name
 *
 * @example
 *   {"name": "readme-.md", "label": "output", "positionless": true}
 *
 *   1:1: Do not use initial or final dashes in a file name
 */

/**
 * @typedef {import('mdast').Root} Root
 */

import {lintRule} from 'unified-lint-rule'

const remarkLintNofileNameOuterDashes = lintRule(
  {
    origin: 'remark-lint:no-file-name-outer-dashes',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-no-file-name-outer-dashes#readme'
  },
  /** @type {import('unified-lint-rule').Rule<Root, void>} */
  (_, file) => {
    if (file.stem && /^-|-$/.test(file.stem)) {
      file.message('Do not use initial or final dashes in a file name')
    }
  }
)

export default remarkLintNofileNameOuterDashes

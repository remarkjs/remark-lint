/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module no-file-name-mixed-case
 * @fileoverview
 *   Warn when file names use mixed case: both upper- and lowercase characters.
 *
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
  'remark-lint:no-file-name-mixed-case',
  /** @type {import('unified-lint-rule').Rule<Root, void>} */
  (_, file) => {
    const name = file.stem

    if (name && !(name === name.toLowerCase() || name === name.toUpperCase())) {
      file.message('Do not mix casing in file names')
    }
  }
)

export default remarkLintNofileNameMixedCase

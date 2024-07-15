/**
 * remark-lint rule to warn when file names case is inconsistent.
 *
 * ## What is this?
 *
 * This package checks file names.
 *
 * ## When should I use this?
 *
 * You can use this package to check that file names are consistent (either
 * lowercase or uppercase).
 *
 * ## API
 *
 * ### `unified().use(remarkLintNoFileNameMixedCase)`
 *
 * Warn when file names case is inconsistent.
 *
 * ###### Parameters
 *
 * There are no options.
 *
 * ###### Returns
 *
 * Transform ([`Transformer` from `unified`][github-unified-transformer]).
 *
 * [api-remark-lint-no-file-name-mixed-case]: #unifieduseremarklintnofilenamemixedcase
 * [github-unified-transformer]: https://github.com/unifiedjs/unified#transformer
 *
 * @module no-file-name-mixed-case
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 *
 * @example
 *   {"name": "MERCURY.md"}
 *
 * @example
 *   {"name": "mercury.md"}
 *
 * @example
 *   {"label": "output", "name": "Mercury.md", "positionless": true}
 *
 *   1:1: Unexpected mixed case in file name, expected either lowercase or uppercase
 */

/**
 * @import {Root} from 'mdast'
 */

import {lintRule} from 'unified-lint-rule'

const remarkLintNofileNameMixedCase = lintRule(
  {
    origin: 'remark-lint:no-file-name-mixed-case',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-no-file-name-mixed-case#readme'
  },
  /**
   * @param {Root} _
   *   Tree.
   * @returns {undefined}
   *   Nothing.
   */
  function (_, file) {
    const name = file.stem

    if (name && !(name === name.toLowerCase() || name === name.toUpperCase())) {
      file.message(
        'Unexpected mixed case in file name, expected either lowercase or uppercase'
      )
    }
  }
)

export default remarkLintNofileNameMixedCase

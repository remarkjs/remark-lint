/**
 * remark-lint rule to warn when file names contain consecutive dashes.
 *
 * ## What is this?
 *
 * This package checks file names.
 *
 * ## When should I use this?
 *
 * You can use this package to check that file names are consistent.
 *
 * ## API
 *
 * ### `unified().use(remarkLintNoFileNameConsecutiveDashes)`
 *
 * Warn when file names contain consecutive dashes.
 *
 * ###### Parameters
 *
 * There are no options.
 *
 * ###### Returns
 *
 * Transform ([`Transformer` from `unified`][github-unified-transformer]).
 *
 * [api-remark-lint-no-file-name-consecutive-dashes]: #unifieduseremarklintnofilenameconsecutivedashes
 * [github-unified-transformer]: https://github.com/unifiedjs/unified#transformer
 *
 * @module no-file-name-consecutive-dashes
 * @author Titus Wormer
 * @copyright Titus Wormer
 * @license MIT
 *
 * @example
 *   {"name": "plug-ins.md"}
 *
 * @example
 *   {"name": "plug--ins.md", "label": "output", "positionless": true}
 *
 *   1:1: Unexpected consecutive dashes in a file name, expected `-`
 */

/**
 * @import {Root} from 'mdast'
 */

import {lintRule} from 'unified-lint-rule'

const remarkLintNoFileNameConsecutiveDashes = lintRule(
  {
    origin: 'remark-lint:no-file-name-consecutive-dashes',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-no-file-name-consecutive-dashes#readme'
  },
  /**
   * @param {Root} _
   *   Tree.
   * @returns {undefined}
   *   Nothing.
   */
  function (_, file) {
    if (file.stem && /-{2,}/.test(file.stem)) {
      file.message('Unexpected consecutive dashes in a file name, expected `-`')
    }
  }
)

export default remarkLintNoFileNameConsecutiveDashes

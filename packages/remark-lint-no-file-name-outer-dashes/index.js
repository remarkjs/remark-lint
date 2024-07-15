/**
 * remark-lint rule to warn when file names start or end with dashes.
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
 * ### `unified().use(remarkLintNoFileNameOuterDashes)`
 *
 * Warn when file names start or end with dashes.
 *
 * ###### Parameters
 *
 * There are no options.
 *
 * ###### Returns
 *
 * Transform ([`Transformer` from `unified`][github-unified-transformer]).
 *
 * [api-remark-lint-no-file-name-outer-dashes]: #unifieduseremarklintnofilenameouterdashes
 * [github-unified-transformer]: https://github.com/unifiedjs/unified#transformer
 *
 * @module no-file-name-outer-dashes
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 *
 * @example
 *   {"name": "mercury-and-venus.md"}
 *
 * @example
 *   {"label": "output", "name": "-mercury.md", "positionless": true}
 *
 *   1:1: Unexpected initial or final dashes in file name, expected dashes to join words
 *
 * @example
 *   {"label": "output", "name": "venus-.md", "positionless": true}
 *
 *   1:1: Unexpected initial or final dashes in file name, expected dashes to join words
 */

/**
 * @import {Root} from 'mdast'
 */

import {lintRule} from 'unified-lint-rule'

const remarkLintNofileNameOuterDashes = lintRule(
  {
    origin: 'remark-lint:no-file-name-outer-dashes',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-no-file-name-outer-dashes#readme'
  },
  /**
   * @param {Root} _
   *   Tree.
   * @returns {undefined}
   *   Nothing.
   */
  function (_, file) {
    if (file.stem && /^-|-$/.test(file.stem)) {
      file.message(
        'Unexpected initial or final dashes in file name, expected dashes to join words'
      )
    }
  }
)

export default remarkLintNofileNameOuterDashes

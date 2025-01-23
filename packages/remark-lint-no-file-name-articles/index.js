/**
 * remark-lint rule to warn when file names start with `a`, `the`, and such.
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
 * ### `unified().use(remarkLintNoFileNameArticles)`
 *
 * Warn when file names start with `a`, `the`, and such.
 *
 * ###### Parameters
 *
 * There are no options.
 *
 * ###### Returns
 *
 * Transform ([`Transformer` from `unified`][github-unified-transformer]).
 *
 * [api-remark-lint-no-file-name-articles]: #unifieduseremarklintnofilenamearticles
 * [github-unified-transformer]: https://github.com/unifiedjs/unified#transformer
 *
 * @module no-file-name-articles
 * @author Titus Wormer
 * @copyright Titus Wormer
 * @license MIT
 *
 * @example
 *   {"name": "title.md"}
 *
 * @example
 *   {"label": "output", "name": "a-title.md", "positionless": true}
 *
 *   1:1: Unexpected file name starting with `a`, remove it
 *
 * @example
 *   {"label": "output", "name": "the-title.md", "positionless": true}
 *
 *   1:1: Unexpected file name starting with `the`, remove it
 *
 * @example
 *   {"label": "output", "name": "an-article.md", "positionless": true}
 *
 *   1:1: Unexpected file name starting with `an`, remove it
 */

/**
 * @import {Root} from 'mdast'
 */

import {lintRule} from 'unified-lint-rule'

const remarkLintNoFileNameArticles = lintRule(
  {
    origin: 'remark-lint:no-file-name-articles',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-no-file-name-articles#readme'
  },
  /**
   * @param {Root} _
   *   Tree.
   * @returns {undefined}
   *   Nothing.
   */
  function (_, file) {
    const match = file.stem && file.stem.match(/^(?:the|teh|an?)\b/i)

    if (match) {
      file.message(
        'Unexpected file name starting with `' + match[0] + '`, remove it'
      )
    }
  }
)

export default remarkLintNoFileNameArticles

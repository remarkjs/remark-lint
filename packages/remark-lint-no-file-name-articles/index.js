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
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @example
 *   {"name": "title.md"}
 *
 * @example
 *   {"name": "a-title.md", "label": "output", "positionless": true}
 *
 *   1:1: Do not start file names with `a`
 *
 * @example
 *   {"name": "the-title.md", "label": "output", "positionless": true}
 *
 *   1:1: Do not start file names with `the`
 *
 * @example
 *   {"name": "teh-title.md", "label": "output", "positionless": true}
 *
 *   1:1: Do not start file names with `teh`
 *
 * @example
 *   {"name": "an-article.md", "label": "output", "positionless": true}
 *
 *   1:1: Do not start file names with `an`
 */

/**
 * @typedef {import('mdast').Root} Root
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
    const match = file.stem && file.stem.match(/^(the|teh|an?)\b/i)

    if (match) {
      file.message('Do not start file names with `' + match[0] + '`')
    }
  }
)

export default remarkLintNoFileNameArticles

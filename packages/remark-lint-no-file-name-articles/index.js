/**
 * ## When should I use this?
 *
 * You can use this package to check that file names do not start with
 *  articles (`a`, `the`, etc).
 *
 * ## API
 *
 * There are no options.
 *
 * @module no-file-name-articles
 * @summary
 *   remark-lint rule to warn when file names start with articles.
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
  /** @type {import('unified-lint-rule').Rule<Root, void>} */
  (_, file) => {
    const match = file.stem && file.stem.match(/^(the|teh|an?)\b/i)

    if (match) {
      file.message('Do not start file names with `' + match[0] + '`')
    }
  }
)

export default remarkLintNoFileNameArticles

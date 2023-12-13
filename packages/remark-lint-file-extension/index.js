/**
 * remark-lint rule to warn for unexpected file extensions.
 *
 * ## What is this?
 *
 * This package checks the file extension.
 *
 * ## When should I use this?
 *
 * You can use this package to check that file extensions are consistent.
 *
 * ## API
 *
 * ### `unified().use(remarkLintFileExtension[, options])`
 *
 * Warn for unexpected extensions.
 *
 * > 👉 **Note**: does not warn when files have no file extensions (such as
 * > `AUTHORS` or `LICENSE`).
 *
 * ###### Parameters
 *
 * * `options` (`string`, default: `'md'`)
 *   — preferred file extension
 *
 * ###### Returns
 *
 * Transform ([`Transformer` from `unified`][github-unified-transformer]).
 *
 * ## Recommendation
 *
 * Use `md` as it’s the most common.
 * Also use `md` when your markdown contains common syntax extensions (such as
 * GFM, frontmatter, or math).
 * Do not use `md` for MDX: use `mdx` instead.
 *
 * [api-remark-lint-file-extension]: #unifieduseremarklintfileextension-options
 * [github-unified-transformer]: https://github.com/unifiedjs/unified#transformer
 *
 * @module file-extension
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @example
 *   {"name": "readme.md"}
 *
 * @example
 *   {"name": "readme"}
 *
 * @example
 *   {"name": "readme.mkd", "label": "output", "positionless": true}
 *
 *   1:1: Incorrect extension: use `md`
 *
 * @example
 *   {"name": "readme.mkd", "config": "mkd"}
 */

/**
 * @typedef {import('mdast').Root} Root
 */

import {lintRule} from 'unified-lint-rule'

const remarkLintFileExtension = lintRule(
  {
    origin: 'remark-lint:file-extension',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-file-extension#readme'
  },
  /**
   * @param {Root} _
   *   Tree.
   * @param {string | null | undefined} [options='md']
   *   Configuration (default: `'md'`).
   * @returns {undefined}
   *   Nothing.
   */
  function (_, file, options) {
    const option = options || 'md'
    const ext = file.extname

    if (ext && ext.slice(1) !== option) {
      file.message('Incorrect extension: use `' + option + '`')
    }
  }
)

export default remarkLintFileExtension

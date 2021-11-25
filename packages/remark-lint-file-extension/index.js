/**
 * ## When should I use this?
 *
 * You can use this package to check that file extensions are `md`.
 *
 * ## API
 *
 * The following options (default: `'md'`) are accepted:
 *
 * *   `string` (example `'markdown'`)
 *     — preferred file extension (no dot)
 *
 * > 👉 **Note**: does not warn when files have no file extensions (such as
 * > `AUTHORS` or `LICENSE`).
 *
 * ## Recommendation
 *
 * Use `md` as it’s the most common.
 * Also use `md` when your markdown contains common syntax extensions (such as
 * GFM, frontmatter, or math).
 * Do not use `md` for MDX: use `mdx` instead.
 *
 * @module file-extension
 * @summary
 *   remark-lint rule to check the file extension.
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
 *   {"name": "readme.mkd", "setting": "mkd"}
 */

/**
 * @typedef {import('mdast').Root} Root
 * @typedef {string} Options
 */

import {lintRule} from 'unified-lint-rule'

const remarkLintFileExtension = lintRule(
  {
    origin: 'remark-lint:file-extension',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-file-extension#readme'
  },
  /** @type {import('unified-lint-rule').Rule<Root, Options>} */
  (_, file, option = 'md') => {
    const ext = file.extname

    if (ext && ext.slice(1) !== option) {
      file.message('Incorrect extension: use `' + option + '`')
    }
  }
)

export default remarkLintFileExtension

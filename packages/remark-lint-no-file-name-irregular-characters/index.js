/**
 * remark-lint rule to warn when file names contain irregular characters.
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
 * ### `unified().use(remarkLintNoFileNameIrregularCharacters[, options])`
 *
 * Warn when file names contain contain irregular characters.
 *
 * ###### Parameters
 *
 * * `options` (`RegExp` or `string`, default: `/[^-.\dA-Za-z]/`)
 *   — configuration,
 *   when string wrapped in `new RegExp('[^' + x + ']')` so make sure
 *   to escape regexp characters
 *
 * ###### Returns
 *
 * Transform ([`Transformer` from `unified`][github-unified-transformer]).
 *
 * [api-remark-lint-no-file-name-irregular-characters]: #unifieduseremarklintnofilenameirregularcharacters-options
 * [github-unified-transformer]: https://github.com/unifiedjs/unified#transformer
 *
 * @module no-file-name-irregular-characters
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @example
 *   {"name": "plug-ins.md"}
 *
 * @example
 *   {"name": "plugins.md"}
 *
 * @example
 *   {"name": "plug_ins.md", "label": "output", "positionless": true}
 *
 *   1:1: Do not use `_` in a file name
 *
 * @example
 *   {"name": "README.md", "label": "output", "config": "\\.a-z0-9", "positionless": true}
 *
 *   1:1: Do not use `R` in a file name
 *
 * @example
 *   {"name": "plug ins.md", "label": "output", "positionless": true}
 *
 *   1:1: Do not use ` ` in a file name
 */

/**
 * @typedef {import('mdast').Root} Root
 */

import {lintRule} from 'unified-lint-rule'

const expression = /[^-.\dA-Za-z]/

const remarkLintNoFileNameIrregularCharacters = lintRule(
  {
    origin: 'remark-lint:no-file-name-irregular-characters',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-no-file-name-irregular-characters#readme'
  },
  /**
   * @param {Root} _
   *   Tree.
   * @param {RegExp | string | null | undefined} [options]
   *   Configuration (default: `/[^-.\dA-Za-z]/`),
   *   when string wrapped in `new RegExp('[^' + x + ']')` so make sure to
   *   double escape regexp characters
   * @returns {undefined}
   *   Nothing.
   */
  function (_, file, options) {
    let preferred = options || expression

    if (typeof preferred === 'string') {
      preferred = new RegExp('[^' + preferred + ']')
    }

    const match = file.stem && file.stem.match(preferred)

    if (match) {
      file.message('Do not use `' + match[0] + '` in a file name')
    }
  }
)

export default remarkLintNoFileNameIrregularCharacters

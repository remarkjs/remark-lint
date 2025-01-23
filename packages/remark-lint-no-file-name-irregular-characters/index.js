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
 * @copyright Titus Wormer
 * @license MIT
 *
 * @example
 *   {"name": "mercury-and-venus.md"}
 *
 * @example
 *   {"name": "mercury.md"}
 *
 * @example
 *   {"label": "output", "name": "mercury_and_venus.md", "positionless": true}
 *
 *   1:1: Unexpected character `_` in file name
 *
 * @example
 *   {"config": "\\.a-z0-9", "label": "output", "name": "Readme.md", "positionless": true}
 *
 *   1:1: Unexpected character `R` in file name
 *
 * @example
 *   {"config": {"source": "[^\\.a-z0-9]"}, "label": "output", "name": "mercury_and_venus.md", "positionless": true}
 *
 *   1:1: Unexpected character `_` in file name
 *
 * @example
 *   {"label": "output", "name": "mercury and venus.md", "positionless": true}
 *
 *   1:1: Unexpected character ` ` in file name
 *
 * @example
 *   {"config": 1, "label": "output", "name": "not-ok-options.md", "positionless": true}
 *
 *   1:1: Unexpected value `1` for `options`, expected `RegExp` or `string`
 */

/**
 * @import {Root} from 'mdast'
 */

import {lintRule} from 'unified-lint-rule'

const defaultExpression = /[^-.\dA-Za-z]/

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
   *   when string wrapped in `new RegExp('[^' + x + ']', 'u')` so make sure to
   *   double escape regexp characters
   * @returns {undefined}
   *   Nothing.
   */
  function (_, file, options) {
    let expected = defaultExpression

    if (options === null || options === undefined) {
      // Empty.
    } else if (typeof options === 'string') {
      expected = new RegExp('[^' + options + ']', 'u')
    } else if (typeof options === 'object' && 'source' in options) {
      expected = new RegExp(options.source, options.flags ?? 'u')
    } else {
      file.fail(
        'Unexpected value `' +
          options +
          '` for `options`, expected `RegExp` or `string`'
      )
    }

    const match = file.stem && file.stem.match(expected)

    if (match) {
      file.message('Unexpected character `' + match[0] + '` in file name')
    }
  }
)

export default remarkLintNoFileNameIrregularCharacters

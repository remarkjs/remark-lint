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
 * ###### Parameters
 *
 * * `options` ([`Extensions`][api-extensions] or [`Options`][api-options],
 *   optional)
 *   — configuration
 *
 * ###### Returns
 *
 * Transform ([`Transformer` from `unified`][github-unified-transformer]).
 *
 * ### `Extensions`
 *
 * File extension(s) (TypeScript type).
 *
 * ###### Type
 *
 * ```ts
 * type Extensions = Array<string> | string
 * ```
 *
 * ### `Options`
 *
 * Configuration (TypeScript type).
 *
 * ###### Fields
 *
 * * `allowExtensionless` (`boolean`, default: `true`)
 *   — allow no file extension such as `AUTHORS` or `LICENSE`
 * * `extensions` ([`Extensions`][api-extensions], default: `['mdx', 'md']`)
 *   — allowed file extension(s)
 *
 * ## Recommendation
 *
 * Use `md` as it’s the most common.
 * Also use `md` when your markdown contains common syntax extensions (such as
 * GFM, frontmatter, or math).
 * Do not use `md` for MDX: use `mdx` instead.
 *
 * [api-extensions]: #extensions
 * [api-options]: #options
 * [api-remark-lint-file-extension]: #unifieduseremarklintfileextension-options
 * [github-unified-transformer]: https://github.com/unifiedjs/unified#transformer
 *
 * @module file-extension
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 *
 * @example
 *   {"name": "readme.md"}
 *
 * @example
 *   {"name": "readme.mdx"}
 *
 * @example
 *   {"name": "readme"}
 *
 * @example
 *   {"config": {"allowExtensionless": false}, "label": "output", "name": "readme", "positionless": true}
 *
 *   1:1: Unexpected missing file extension, expected `mdx` or `md`
 *
 * @example
 *   {"label": "output", "name": "readme.mkd", "positionless": true}
 *
 *   1:1: Unexpected file extension `mkd`, expected `mdx` or `md`
 *
 * @example
 *   {"config": "mkd", "name": "readme.mkd"}
 *
 * @example
 *   {"config": ["markdown", "md", "mdown", "mdwn", "mdx", "mkd", "mkdn", "mkdown", "ron"], "label": "input", "name": "readme.css", "positionless": true}
 *
 * @example
 *   {"config": ["markdown", "md", "mdown", "mdwn", "mdx", "mkd", "mkdn", "mkdown", "ron"], "label": "output", "name": "readme.css"}
 *
 *   1:1: Unexpected file extension `css`, expected `markdown`, `md`, `mdown`, …
 */

/**
 * @import {Root} from 'mdast'
 */

/**
 * @typedef {Array<string> | string} Extensions
 *   File extension(s).
 *
 * @typedef Options
 *   Configuration.
 * @property {boolean | null | undefined} [allowExtensionless=true]
 *   Allow no file extension such as `AUTHORS` or `LICENSE` (default: `true`).
 * @property {Readonly<Extensions> | null | undefined} [extensions=['mdx', 'md']]
 *   Allowed file extension(s) (default: `['mdx', 'md']`).
 */

import {quotation} from 'quotation'
import {lintRule} from 'unified-lint-rule'

/** @type {ReadonlyArray<string>} */
const defaultExtensions = ['mdx', 'md']

const listFormat = new Intl.ListFormat('en', {type: 'disjunction'})
const listFormatUnit = new Intl.ListFormat('en', {type: 'unit'})

const remarkLintFileExtension = lintRule(
  {
    origin: 'remark-lint:file-extension',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-file-extension#readme'
  },
  /**
   * @param {Root} _
   *   Tree.
   * @param {Readonly<Extensions> | Readonly<Options> | null | undefined} [options]
   *   Configuration (optional).
   * @returns {undefined}
   *   Nothing.
   */
  function (_, file, options) {
    let expected = defaultExtensions
    let allowExtensionless = true
    /** @type {Readonly<Extensions> | null | undefined} */
    let extensionsValue

    if (Array.isArray(options)) {
      // TS fails on `isArray` w/ readonly.
      extensionsValue = /** @type {ReadonlyArray<string>} */ (options)
    } else if (typeof options === 'string') {
      extensionsValue = options
    } else if (options) {
      // TS fails on `isArray` w/ readonly.
      const settings = /** @type {Options} */ (options)
      extensionsValue = settings.extensions

      if (settings.allowExtensionless === false) {
        allowExtensionless = false
      }
    }

    if (Array.isArray(extensionsValue)) {
      expected = /** @type {ReadonlyArray<string>} */ (extensionsValue)
    } else if (typeof extensionsValue === 'string') {
      expected = [extensionsValue]
    }

    const extname = file.extname
    const actual = extname ? extname.slice(1) : undefined
    const expectedDisplay =
      expected.length > 3
        ? listFormatUnit.format([...quotation(expected.slice(0, 3), '`'), '…'])
        : listFormat.format(quotation(expected, '`'))

    if (actual ? !expected.includes(actual) : !allowExtensionless) {
      file.message(
        (actual
          ? 'Unexpected file extension `' + actual + '`'
          : 'Unexpected missing file extension') +
          ', expected ' +
          expectedDisplay
      )
    }
  }
)

export default remarkLintFileExtension

/**
 * remark-lint rule to warn when language flags of fenced code
 * are not used.
 *
 * ## What is this?
 *
 * This package checks the language flags of fenced code blocks,
 * whether they exist,
 * and optionally what values they hold.
 *
 * ## When should I use this?
 *
 * You can use this package to check that the style of language flags of fenced
 * code blocks is consistent.
 *
 * ## API
 *
 * ### `unified().use(remarkLintFencedCodeFlag[, options])`
 *
 * Warn when language flags of fenced code are not used.
 *
 * ###### Parameters
 *
 * * `options` ([`Options`][api-options] or `Array<string>`, optional)
 *   — configuration or flags to allow
 *
 * ###### Returns
 *
 * Transform ([`Transformer` from `unified`][github-unified-transformer]).
 *
 * ### `Options`
 *
 * Configuration (TypeScript type).
 *
 * ###### Fields
 *
 * * `allowEmpty` (`boolean`, default: `false`)
 *   — allow language flags to be omitted
 * * `flags` (`Array<string>`, optional)
 *   — flags to allow,
 *   other flags will result in a warning
 *
 * ## Recommendation
 *
 * While omitting language flags is fine to signal that code is plain text,
 * it *could* point to a mistake.
 * It’s recommended to instead use a certain flag for plain text (such as
 * `txt`) and to turn this rule on.
 *
 * [api-options]: #options
 * [api-remark-lint-fenced-code-flag]: #unifieduseremarklintfencedcodeflag-options
 * [github-unified-transformer]: https://github.com/unifiedjs/unified#transformer
 *
 * @module fenced-code-flag
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 *
 * @example
 *   {"name": "ok.md"}
 *
 *   Some markdown:
 *
 *   ```markdown
 *   # Mercury
 *   ```
 *
 * @example
 *   {"label": "input", "name": "not-ok.md"}
 *
 *   ```
 *   mercury()
 *   ```
 * @example
 *   {"label": "output", "name": "not-ok.md"}
 *
 *   1:1-3:4: Unexpected missing fenced code language flag in info string, expected keyword
 *
 * @example
 *   {"config": {"allowEmpty": true}, "name": "ok-allow-empty.md"}
 *
 *   ```
 *   mercury()
 *   ```
 *
 * @example
 *   {"config": {"allowEmpty": false}, "label": "input", "name": "not-ok-allow-empty.md"}
 *
 *   ```
 *   mercury()
 *   ```
 * @example
 *   {"config": {"allowEmpty": false}, "label": "output", "name": "not-ok-allow-empty.md"}
 *
 *   1:1-3:4: Unexpected missing fenced code language flag in info string, expected keyword
 *
 * @example
 *   {"config": ["markdown"], "name": "ok-array.md"}
 *
 *   ```markdown
 *   # Mercury
 *   ```
 *
 * @example
 *   {"config": {"flags":["markdown"]}, "name": "ok-options.md"}
 *
 *   ```markdown
 *   # Mercury
 *   ```
 *
 * @example
 *   {"config": ["markdown"], "label": "input", "name": "not-ok-array.md"}
 *
 *   ```javascript
 *   mercury()
 *   ```
 * @example
 *   {"config": ["markdown"], "label": "output", "name": "not-ok-array.md"}
 *
 *   1:1-3:4: Unexpected fenced code language flag `javascript` in info string, expected `markdown`
 *
 * @example
 *   {"config": ["javascript", "markdown", "mdx", "typescript"], "label": "input", "name": "not-ok-long-array.md"}
 *
 *   ```html
 *   <h1>Mercury</h1>
 *   ```
 * @example
 *   {"config": ["javascript", "markdown", "mdx", "typescript"], "label": "output", "name": "not-ok-long-array.md"}
 *
 *   1:1-3:4: Unexpected fenced code language flag `html` in info string, expected `javascript`, `markdown`, `mdx`, …
 *
 * @example
 *   {"config": "🌍", "label": "output", "name": "not-ok-options.md", "positionless": true}
 *
 *   1:1: Unexpected value `🌍` for `options`, expected array or object
 */

/**
 * @import {Root} from 'mdast'
 */

/**
 * @typedef Options
 *   Configuration.
 * @property {boolean | null | undefined} [allowEmpty=false]
 *   Allow language flags to be omitted (default: `false`).
 * @property {ReadonlyArray<string> | null | undefined} [flags]
 *   Flags to allow,
 *   other flags will result in a warning (optional).
 */

import {quotation} from 'quotation'
import {phrasing} from 'mdast-util-phrasing'
import {lintRule} from 'unified-lint-rule'
import {pointEnd, pointStart} from 'unist-util-position'
import {SKIP, visitParents} from 'unist-util-visit-parents'

const fence = /^ {0,3}([~`])\1{2,}/

const listFormat = new Intl.ListFormat('en', {type: 'disjunction'})
const listFormatUnit = new Intl.ListFormat('en', {type: 'unit'})

const remarkLintFencedCodeFlag = lintRule(
  {
    origin: 'remark-lint:fenced-code-flag',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-fenced-code-flag#readme'
  },
  /**
   * @param {Root} tree
   *   Tree.
   * @param {Readonly<Options> | ReadonlyArray<string> | null | undefined} [options]
   *   Configuration or flags to allow (optional).
   * @returns {undefined}
   *   Nothing.
   */
  function (tree, file, options) {
    const value = String(file)
    let allowEmpty = false
    /** @type {ReadonlyArray<string> | undefined} */
    let allowed

    if (options === null || options === undefined) {
      // Empty.
    } else if (typeof options === 'object') {
      // Note: casts because `isArray` and `readonly` don’t mix.
      if (Array.isArray(options)) {
        const flags = /** @type {ReadonlyArray<string>} */ (options)
        allowed = flags
      } else {
        const settings = /** @type {Options} */ (options)
        allowEmpty = settings.allowEmpty === true

        if (settings.flags) {
          allowed = settings.flags
        }
      }
    } else {
      file.fail(
        'Unexpected value `' +
          options +
          '` for `options`, expected array or object'
      )
    }

    /** @type {string} */
    let allowedDisplay

    if (allowed) {
      allowedDisplay =
        allowed.length > 3
          ? listFormatUnit.format([...quotation(allowed.slice(0, 3), '`'), '…'])
          : listFormat.format(quotation(allowed, '`'))
    } else {
      allowedDisplay = 'keyword'
    }

    visitParents(tree, function (node, parents) {
      // Do not walk into phrasing.
      if (phrasing(node)) {
        return SKIP
      }

      if (node.type !== 'code') return

      const end = pointEnd(node)
      const start = pointStart(node)

      if (
        end &&
        start &&
        typeof end.offset === 'number' &&
        typeof start.offset === 'number'
      ) {
        if (node.lang) {
          if (allowed && !allowed.includes(node.lang)) {
            file.message(
              'Unexpected fenced code language flag `' +
                node.lang +
                '` in info string, expected ' +
                allowedDisplay,
              {ancestors: [...parents, node], place: node.position}
            )
          }
        } else if (!allowEmpty) {
          const slice = value.slice(start.offset, end.offset)

          if (fence.test(slice)) {
            file.message(
              'Unexpected missing fenced code language flag in info string, expected ' +
                allowedDisplay,
              {ancestors: [...parents, node], place: node.position}
            )
          }
        }
      }
    })
  }
)

export default remarkLintFencedCodeFlag

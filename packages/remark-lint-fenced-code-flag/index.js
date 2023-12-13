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
 *   ```alpha
 *   bravo()
 *   ```
 *
 * @example
 *   {"name": "not-ok.md", "label": "input"}
 *
 *   ```
 *   alpha()
 *   ```
 *
 * @example
 *   {"name": "not-ok.md", "label": "output"}
 *
 *   1:1-3:4: Missing code language flag
 *
 * @example
 *   {"name": "ok.md", "config": {"allowEmpty": true}}
 *
 *   ```
 *   alpha()
 *   ```
 *
 * @example
 *   {"name": "not-ok.md", "config": {"allowEmpty": false}, "label": "input"}
 *
 *   ```
 *   alpha()
 *   ```
 *
 * @example
 *   {"name": "not-ok.md", "config": {"allowEmpty": false}, "label": "output"}
 *
 *   1:1-3:4: Missing code language flag
 *
 * @example
 *   {"name": "ok.md", "config": ["alpha"]}
 *
 *   ```alpha
 *   bravo()
 *   ```
 *
 * @example
 *   {"name": "ok.md", "config": {"flags":["alpha"]}}
 *
 *   ```alpha
 *   bravo()
 *   ```
 *
 * @example
 *   {"name": "not-ok.md", "config": ["charlie"], "label": "input"}
 *
 *   ```alpha
 *   bravo()
 *   ```
 *
 * @example
 *   {"name": "not-ok.md", "config": ["charlie"], "label": "output"}
 *
 *   1:1-3:4: Incorrect code language flag
 */

/**
 * @typedef {import('mdast').Root} Root
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

import {lintRule} from 'unified-lint-rule'
import {pointEnd, pointStart} from 'unist-util-position'
import {visit} from 'unist-util-visit'

const fence = /^ {0,3}([~`])\1{2,}/
/** @type {ReadonlyArray<string>} */
const emptyFlags = []

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
    let allowed = emptyFlags

    if (options && typeof options === 'object') {
      // Note: casts because `isArray` and `readonly` don’t mix.
      if (Array.isArray(options)) {
        const flags = /** @type {ReadonlyArray<string>} */ (options)
        allowed = flags
      } else {
        const settings = /** @type {Options} */ (options)
        allowEmpty = Boolean(settings.allowEmpty)

        if (settings.flags) {
          allowed = settings.flags
        }
      }
    }

    visit(tree, 'code', function (node) {
      const end = pointEnd(node)
      const start = pointStart(node)

      if (
        end &&
        start &&
        typeof end.offset === 'number' &&
        typeof start.offset === 'number'
      ) {
        if (node.lang) {
          if (allowed.length > 0 && !allowed.includes(node.lang)) {
            file.message('Incorrect code language flag', node)
          }
        } else {
          const slice = value.slice(start.offset, end.offset)

          if (!allowEmpty && fence.test(slice)) {
            file.message('Missing code language flag', node)
          }
        }
      }
    })
  }
)

export default remarkLintFencedCodeFlag

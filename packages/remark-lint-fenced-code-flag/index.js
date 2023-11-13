/**
 * ## When should I use this?
 *
 * You can use this package to check that language flags of fenced code
 * are used and consistent.
 *
 * ## API
 *
 * The following options (default: `undefined`) are accepted:
 *
 * *   `Array<string>`
 *     — as if passing `{flags: options}`
 * *   `Object` with the following fields:
 *     *   `allowEmpty` (`boolean`, default: `false`)
 *         — allow language flags to be omitted
 *     *   `flags` (`Array<string>` default: `[]`)
 *         — specific flags to allow (other flags will result in a warning)
 *
 * ## Recommendation
 *
 * While omitting the language flag is perfectly fine to signal that the code is
 * plain text, it *could* point to a mistake.
 * It’s recommended to instead use a certain flag for plain text (such as `txt`)
 * and to turn this rule on.
 *
 * @module fenced-code-flag
 * @summary
 *   remark-lint rule to check that language flags of fenced code are used.
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
 * @typedef FlagMap
 *   Configuration.
 * @property {boolean | null | undefined} [allowEmpty=false]
 *   Allow language flags to be omitted (default: `false`).
 * @property {Flags | null | undefined} [flags]
 *   Language flags (optional).
 *
 * @typedef {Array<string>} Flags
 *   Language flags.
 *
 * @typedef {FlagMap | Flags} Options
 *   Configuration.
 */

import {lintRule} from 'unified-lint-rule'
import {pointEnd, pointStart} from 'unist-util-position'
import {visit} from 'unist-util-visit'

const fence = /^ {0,3}([~`])\1{2,}/

const remarkLintFencedCodeFlag = lintRule(
  {
    origin: 'remark-lint:fenced-code-flag',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-fenced-code-flag#readme'
  },
  /**
   * @param {Root} tree
   *   Tree.
   * @param {Options | null | undefined} [options]
   *   Configuration (optional).
   * @returns {undefined}
   *   Nothing.
   */
  function (tree, file, options) {
    const value = String(file)
    let allowEmpty = false
    /** @type {Array<string>} */
    let allowed = []

    if (options && typeof options === 'object') {
      if (Array.isArray(options)) {
        allowed = options
      } else {
        allowEmpty = Boolean(options.allowEmpty)

        if (options.flags) {
          allowed = options.flags
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

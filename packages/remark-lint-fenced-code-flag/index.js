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
 *   {"name": "ok.md", "setting": {"allowEmpty": true}}
 *
 *   ```
 *   alpha()
 *   ```
 *
 * @example
 *   {"name": "not-ok.md", "setting": {"allowEmpty": false}, "label": "input"}
 *
 *   ```
 *   alpha()
 *   ```
 *
 * @example
 *   {"name": "not-ok.md", "setting": {"allowEmpty": false}, "label": "output"}
 *
 *   1:1-3:4: Missing code language flag
 *
 * @example
 *   {"name": "ok.md", "setting": ["alpha"]}
 *
 *   ```alpha
 *   bravo()
 *   ```
 *
 * @example
 *   {"name": "ok.md", "setting": {"flags":["alpha"]}}
 *
 *   ```alpha
 *   bravo()
 *   ```
 *
 * @example
 *   {"name": "not-ok.md", "setting": ["charlie"], "label": "input"}
 *
 *   ```alpha
 *   bravo()
 *   ```
 *
 * @example
 *   {"name": "not-ok.md", "setting": ["charlie"], "label": "output"}
 *
 *   1:1-3:4: Incorrect code language flag
 */

/**
 * @typedef {import('mdast').Root} Root
 *
 * @typedef {Array<string>} Flags
 *
 * @typedef FlagMap
 * @property {Flags} [flags]
 * @property {boolean} [allowEmpty=false]
 *
 * @typedef {Flags|FlagMap} Options
 */

import {lintRule} from 'unified-lint-rule'
import {visit} from 'unist-util-visit'
import {pointStart, pointEnd} from 'unist-util-position'
import {generated} from 'unist-util-generated'

const fence = /^ {0,3}([~`])\1{2,}/

const remarkLintFencedCodeFlag = lintRule(
  {
    origin: 'remark-lint:fenced-code-flag',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-fenced-code-flag#readme'
  },
  /** @type {import('unified-lint-rule').Rule<Root, Options>} */
  (tree, file, option) => {
    const value = String(file)
    let allowEmpty = false
    /** @type {Array<string>} */
    let allowed = []

    if (typeof option === 'object') {
      if (Array.isArray(option)) {
        allowed = option
      } else {
        allowEmpty = Boolean(option.allowEmpty)

        if (option.flags) {
          allowed = option.flags
        }
      }
    }

    visit(tree, 'code', (node) => {
      if (!generated(node)) {
        if (node.lang) {
          if (allowed.length > 0 && !allowed.includes(node.lang)) {
            file.message('Incorrect code language flag', node)
          }
        } else {
          const slice = value.slice(
            pointStart(node).offset,
            pointEnd(node).offset
          )

          if (!allowEmpty && fence.test(slice)) {
            file.message('Missing code language flag', node)
          }
        }
      }
    })
  }
)

export default remarkLintFencedCodeFlag

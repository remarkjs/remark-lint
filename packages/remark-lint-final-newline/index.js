/**
 * ## When should I use this?
 *
 * You can use this package to check that fenced code markers are consistent.
 *
 * ## API
 *
 * There are no options.
 *
 * ## Recommendation
 *
 * Turn this rule on.
 * See [StackExchange](https://unix.stackexchange.com/questions/18743) for more
 * info.
 *
 * ## Fix
 *
 * [`remark-stringify`](https://github.com/remarkjs/remark/tree/main/packages/remark-stringify)
 * always adds final line endings.
 *
 * ## Example
 *
 * ##### `ok.md`
 *
 * ###### In
 *
 * > 👉 **Note**: `␊` represents a line feed (`\n`).
 *
 * ```markdown
 * Alpha␊
 * ```
 *
 * ###### Out
 *
 * No messages.
 *
 * ##### `not-ok.md`
 *
 * ###### In
 *
 * > 👉 **Note**: `␀` represents the end of the file.
 *
 * ```markdown
 * Bravo␀
 * ```
 *
 * ###### Out
 *
 * ```text
 * 1:1: Missing newline character at end of file
 * ```
 *
 * @module final-newline
 * @summary
 *   remark-lint rule to warn when files don’t end in a newline.
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 */

/**
 * @typedef {import('mdast').Root} Root
 */

import {lintRule} from 'unified-lint-rule'

const remarkLintFinalNewline = lintRule(
  {
    origin: 'remark-lint:final-newline',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-final-newline#readme'
  },
  /** @type {import('unified-lint-rule').Rule<Root, void>} */
  (_, file) => {
    const value = String(file)
    const last = value.length - 1

    if (last > -1 && value.charAt(last) !== '\n') {
      file.message('Missing newline character at end of file')
    }
  }
)

export default remarkLintFinalNewline

/**
 * remark-lint rule to warn when a final line ending is missing.
 *
 * ## What is this?
 *
 * This package checks the final line ending.
 *
 * ## When should I use this?
 *
 * You can use this package to check final line endings.
 *
 * ## API
 *
 * ### `unified().use(remarkLintFinalNewline)`
 *
 * Warn when a final line ending is missing.
 *
 * ###### Parameters
 *
 * There are no options.
 *
 * ###### Returns
 *
 * Transform ([`Transformer` from `unified`][github-unified-transformer]).
 *
 * ## Recommendation
 *
 * Turn this rule on.
 * See [StackExchange][] for more info.
 *
 * ## Fix
 *
 * [`remark-stringify`](https://github.com/remarkjs/remark/tree/main/packages/remark-stringify)
 * always adds final line endings.
 *
 * [api-remark-lint-final-newline]: #unifieduseremarklintfinalnewline
 * [github-remark-stringify]: https://github.com/remarkjs/remark/tree/main/packages/remark-stringify
 * [github-unified-transformer]: https://github.com/unifiedjs/unified#transformer
 * [stackexchange]: https://unix.stackexchange.com/questions/18743
 *
 * ## Examples
 *
 * ##### `ok.md`
 *
 * ###### In
 *
 * ```markdown
 * Mercury␊
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
 * ```markdown
 * Mercury␀
 * ```
 *
 * ###### Out
 *
 * ```text
 * 1:8: Unexpected missing final newline character, expected line feed (`\n`) at end of file
 * ```
 *
 * @module final-newline
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 */

/**
 * @typedef {import('mdast').Root} Root
 */

import {ok as assert} from 'devlop'
import {lintRule} from 'unified-lint-rule'
import {location} from 'vfile-location'

const remarkLintFinalNewline = lintRule(
  {
    origin: 'remark-lint:final-newline',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-final-newline#readme'
  },
  /**
   * @param {Root} _
   *   Tree.
   * @returns {undefined}
   *   Nothing.
   */
  function (_, file) {
    const value = String(file)
    const end = location(file).toPoint(value.length)
    const last = value.length - 1

    assert(end) // Always defined.

    if (
      // Empty is fine.
      last !== -1 &&
      value.charAt(last) !== '\n'
    ) {
      file.message(
        'Unexpected missing final newline character, expected line feed (`\\n`) at end of file',
        end
      )
    }
  }
)

export default remarkLintFinalNewline

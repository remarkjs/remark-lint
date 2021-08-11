/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module no-heading-punctuation
 * @fileoverview
 *   Warn when a heading ends with a group of characters.
 *
 *   Options: `string`, default: `'.,;:!?'`.
 *
 *   Note: these are added to a regex, in a group (`'[' + char + ']'`), be
 *   careful to escape the string correctly.
 *
 * @example {"name": "ok.md"}
 *
 *   # Hello
 *
 * @example {"name": "ok.md", "setting": ",;:!?"}
 *
 *   # Hello…
 *
 * @example {"name": "not-ok.md", "label": "input"}
 *
 *   # Hello:
 *
 *   # Hello?
 *
 *   # Hello!
 *
 *   # Hello,
 *
 *   # Hello;
 *
 * @example {"name": "not-ok.md", "label": "output"}
 *
 *   1:1-1:9: Don’t add a trailing `:` to headings
 *   3:1-3:9: Don’t add a trailing `?` to headings
 *   5:1-5:9: Don’t add a trailing `!` to headings
 *   7:1-7:9: Don’t add a trailing `,` to headings
 *   9:1-9:9: Don’t add a trailing `;` to headings
 */

import {lintRule} from 'unified-lint-rule'
import {visit} from 'unist-util-visit'
import {generated} from 'unist-util-generated'
import {toString} from 'mdast-util-to-string'

const defaults = '\\.,;:!?'

const remarkLintNoHeadingPunctuation = lintRule(
  'remark-lint:no-heading-punctuation',
  (tree, file, option) => {
    const expression = new RegExp(
      '[' + (typeof option === 'string' ? option : defaults) + ']'
    )

    visit(tree, 'heading', (node) => {
      if (!generated(node)) {
        const value = toString(node)
        const tail = value.charAt(value.length - 1)

        if (expression.test(tail)) {
          file.message('Don’t add a trailing `' + tail + '` to headings', node)
        }
      }
    })
  }
)

export default remarkLintNoHeadingPunctuation

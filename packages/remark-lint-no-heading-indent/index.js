/**
 * ## When should I use this?
 *
 * You can use this package to check that headings are not indented.
 *
 * ## API
 *
 * There are no options.
 *
 * ## Recommendation
 *
 * There is no specific handling of indented headings (or anything else) in
 * markdown.
 * While it is possible to use an indent to headings on their text:
 *
 * ```markdown
 *    # One
 *   ## Two
 *  ### Three
 * #### Four
 * ```
 *
 * …such style is uncommon, a bit hard to maintain, and it’s impossible to add a
 * heading with a rank of 5 as it would form indented code instead.
 * Hence, it’s recommended to not indent headings and to turn this rule on.
 *
 * ## Fix
 *
 * [`remark-stringify`](https://github.com/remarkjs/remark/tree/main/packages/remark-stringify)
 * formats all headings without indent.
 *
 * @module no-heading-indent
 * @summary
 *   remark-lint rule to warn when headings are indented.
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @example
 *   {"name": "ok.md"}
 *
 *   #·Hello world
 *
 *   Foo
 *   -----
 *
 *   #·Hello world·#
 *
 *   Bar
 *   =====
 *
 * @example
 *   {"name": "not-ok.md", "label": "input"}
 *
 *   ···# Hello world
 *
 *   ·Foo
 *   -----
 *
 *   ·# Hello world #
 *
 *   ···Bar
 *   =====
 *
 * @example
 *   {"name": "not-ok.md", "label": "output"}
 *
 *   1:4: Remove 3 spaces before this heading
 *   3:2: Remove 1 space before this heading
 *   6:2: Remove 1 space before this heading
 *   8:4: Remove 3 spaces before this heading
 */

/**
 * @typedef {import('mdast').Root} Root
 */

import {lintRule} from 'unified-lint-rule'
import plural from 'pluralize'
import {visit} from 'unist-util-visit'
import {pointStart} from 'unist-util-position'
import {generated} from 'unist-util-generated'

const remarkLintNoHeadingIndent = lintRule(
  {
    origin: 'remark-lint:no-heading-indent',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-no-heading-indent#readme'
  },
  /** @type {import('unified-lint-rule').Rule<Root, void>} */
  (tree, file) => {
    visit(tree, 'heading', (node, _, parent) => {
      // Note: it’s rather complex to detect what the expected indent is in block
      // quotes and lists, so let’s only do directly in root for now.
      if (generated(node) || (parent && parent.type !== 'root')) {
        return
      }

      const diff = pointStart(node).column - 1

      if (diff) {
        file.message(
          'Remove ' +
            diff +
            ' ' +
            plural('space', diff) +
            ' before this heading',
          pointStart(node)
        )
      }
    })
  }
)

export default remarkLintNoHeadingIndent

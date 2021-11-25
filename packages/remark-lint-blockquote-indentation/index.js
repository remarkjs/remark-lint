/**
 * ## When should I use this?
 *
 * You can use this package to check that the “indent” of block quotes is
 * consistent.
 * Indent here is the `>` (greater than) marker and the spaces before content.
 *
 * ## API
 *
 * The following options (default: `'consistent'`) are accepted:
 *
 * *   `number` (example: `2`)
 *     — preferred indent of `>` and spaces before content
 * *   `'consistent'`
 *     — detect the first used style and warn when further block quotes differ
 *
 * ## Recommendation
 *
 * CommonMark specifies that when block quotes are used the `>` markers can be
 * followed by an optional space.
 * No space at all arguably looks rather ugly:
 *
 * ```markdown
 * >Mars and
 * >Venus.
 * ```
 *
 * There is no specific handling of more that one space, so if 5 spaces were
 * used after `>`, then indented code kicks in:
 *
 * ```markdown
 * >     neptune()
 * ```
 *
 * Due to this, it’s recommended to configure this rule with `2`.
 *
 * @module blockquote-indentation
 * @summary
 *   remark-lint rule to warn when block quotes are indented too much or
 *   too little.
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @example
 *   {"name": "ok.md", "setting": 4}
 *
 *   >   Hello
 *
 *   Paragraph.
 *
 *   >   World
 * @example
 *   {"name": "ok.md", "setting": 2}
 *
 *   > Hello
 *
 *   Paragraph.
 *
 *   > World
 *
 * @example
 *   {"name": "not-ok.md", "label": "input"}
 *
 *   >  Hello
 *
 *   Paragraph.
 *
 *   >   World
 *
 *   Paragraph.
 *
 *   > World
 *
 * @example
 *   {"name": "not-ok.md", "label": "output"}
 *
 *   5:5: Remove 1 space between block quote and content
 *   9:3: Add 1 space between block quote and content
 */

/**
 * @typedef {import('mdast').Root} Root
 * @typedef {import('mdast').Blockquote} Blockquote
 * @typedef {'consistent'|number} Options
 */

import {lintRule} from 'unified-lint-rule'
import plural from 'pluralize'
import {visit} from 'unist-util-visit'
import {pointStart} from 'unist-util-position'
import {generated} from 'unist-util-generated'

const remarkLintBlockquoteIndentation = lintRule(
  {
    origin: 'remark-lint:blockquote-indentation',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-blockquote-indentation#readme'
  },
  /** @type {import('unified-lint-rule').Rule<Root, Options>} */
  (tree, file, option = 'consistent') => {
    visit(tree, 'blockquote', (node) => {
      if (generated(node) || node.children.length === 0) {
        return
      }

      if (option === 'consistent') {
        option = check(node)
      } else {
        const diff = option - check(node)

        if (diff !== 0) {
          const abs = Math.abs(diff)

          file.message(
            (diff > 0 ? 'Add' : 'Remove') +
              ' ' +
              abs +
              ' ' +
              plural('space', abs) +
              ' between block quote and content',
            pointStart(node.children[0])
          )
        }
      }
    })
  }
)

export default remarkLintBlockquoteIndentation

/**
 * @param {Blockquote} node
 * @returns {number}
 */
function check(node) {
  return pointStart(node.children[0]).column - pointStart(node).column
}

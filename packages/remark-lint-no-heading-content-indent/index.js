/**
 * ## When should I use this?
 *
 * You can use this package to check that there is on space between `#`
 * characters and the content in headings.
 *
 * ## API
 *
 * There are no options.
 *
 * ## Recommendation
 *
 * One space is required and more than one space has no effect.
 * Due to this, it’s recommended to turn this rule on.
 *
 * ## Fix
 *
 * [`remark-stringify`](https://github.com/remarkjs/remark/tree/main/packages/remark-stringify)
 * formats headings with exactly one space.
 *
 * @module no-heading-content-indent
 * @summary
 *   remark-lint rule to warn when there are too many spaces between
 *   hashes and content in headings.
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @example
 *   {"name": "ok.md"}
 *
 *   #·Foo
 *
 *   ## Bar·##
 *
 *     ##·Baz
 *
 *   Setext headings are not affected.
 *
 *   Baz
 *   ===
 *
 * @example
 *   {"name": "not-ok.md", "label": "input"}
 *
 *   #··Foo
 *
 *   ## Bar··##
 *
 *     ##··Baz
 *
 * @example
 *   {"name": "not-ok.md", "label": "output"}
 *
 *   1:4: Remove 1 space before this heading’s content
 *   3:7: Remove 1 space after this heading’s content
 *   5:7: Remove 1 space before this heading’s content
 *
 * @example
 *   {"name": "empty-heading.md"}
 *
 *   #··
 */

/**
 * @typedef {import('mdast').Root} Root
 */

import {lintRule} from 'unified-lint-rule'
import {visit} from 'unist-util-visit'
import {headingStyle} from 'mdast-util-heading-style'
import plural from 'pluralize'
import {pointStart, pointEnd} from 'unist-util-position'
import {generated} from 'unist-util-generated'

const remarkLintNoHeadingContentIndent = lintRule(
  {
    origin: 'remark-lint:no-heading-content-indent',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-no-heading-content-indent#readme'
  },
  /** @type {import('unified-lint-rule').Rule<Root, void>} */
  (tree, file) => {
    visit(tree, 'heading', (node) => {
      if (generated(node)) {
        return
      }

      const type = headingStyle(node, 'atx')

      if (type === 'atx' || type === 'atx-closed') {
        const head = pointStart(node.children[0]).column

        // Ignore empty headings.
        if (!head) {
          return
        }

        const diff = head - pointStart(node).column - 1 - node.depth

        if (diff) {
          file.message(
            'Remove ' +
              Math.abs(diff) +
              ' ' +
              plural('space', Math.abs(diff)) +
              ' before this heading’s content',
            pointStart(node.children[0])
          )
        }
      }

      // Closed ATX headings always must have a space between their content and
      // the final hashes, thus, there is no `add x spaces`.
      if (type === 'atx-closed') {
        const final = pointEnd(node.children[node.children.length - 1])
        const diff = pointEnd(node).column - final.column - 1 - node.depth

        if (diff) {
          file.message(
            'Remove ' +
              diff +
              ' ' +
              plural('space', diff) +
              ' after this heading’s content',
            final
          )
        }
      }
    })
  }
)

export default remarkLintNoHeadingContentIndent

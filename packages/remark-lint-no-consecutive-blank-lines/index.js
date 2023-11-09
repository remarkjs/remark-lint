/**
 * ## When should I use this?
 *
 * You can use this package to check that no more blank lines than needed
 * are used between blocks.
 *
 * ## API
 *
 * There are no options.
 *
 * ## Recommendation
 *
 * More than one blank line has no effect between blocks.
 *
 * ## Fix
 *
 * [`remark-stringify`](https://github.com/remarkjs/remark/tree/main/packages/remark-stringify)
 * adds exactly one blank line between any block.
 *
 * @module no-consecutive-blank-lines
 * @summary
 *   remark-lint rule to warn when more blank lines that needed are used
 *   between blocks.
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @example
 *   {"name": "ok.md"}
 *
 *   Foo…
 *   ␊
 *   …Bar.
 *
 * @example
 *   {"name": "empty-document.md"}
 *
 * @example
 *   {"name": "not-ok.md", "label": "input"}
 *
 *   Foo…
 *   ␊
 *   ␊
 *   …Bar
 *   ␊
 *   ␊
 *
 * @example
 *   {"name": "not-ok.md", "label": "output"}
 *
 *   4:1: Remove 1 line before node
 *   4:5: Remove 2 lines after node
 */

/**
 * @typedef {import('mdast').Root} Root
 * @typedef {import('unist').Point} Point
 */

import {lintRule} from 'unified-lint-rule'
import plural from 'pluralize'
import {visit} from 'unist-util-visit'
import {pointStart, pointEnd} from 'unist-util-position'

const unknownContainerSize = new Set(['mdxJsxFlowElement', 'mdxJsxTextElement'])

const remarkLintNoConsecutiveBlankLines = lintRule(
  {
    origin: 'remark-lint:no-consecutive-blank-lines',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-no-consecutive-blank-lines#readme'
  },
  /** @type {import('unified-lint-rule').Rule<Root, void>} */
  (tree, file) => {
    visit(tree, (node) => {
      if ('children' in node) {
        const head = node.children[0]
        const start = pointStart(node)
        const headStart = pointStart(head)

        if (head && start && headStart) {
          if (!unknownContainerSize.has(node.type)) {
            // Compare parent and first child.
            compare(start, headStart, 0)
          }

          // Compare between each child.
          let index = -1

          while (++index < node.children.length) {
            const previous = node.children[index - 1]
            const child = node.children[index]
            const previousEnd = pointEnd(previous)
            const childStart = pointStart(child)

            if (previous && previousEnd && childStart) {
              compare(previousEnd, childStart, 2)
            }
          }

          const end = pointEnd(node)
          const tail = node.children[node.children.length - 1]
          const tailEnd = pointEnd(tail)

          // Compare parent and last child.
          if (
            end &&
            tailEnd &&
            tail !== head &&
            !unknownContainerSize.has(node.type)
          ) {
            compare(end, tailEnd, 1)
          }
        }
      }
    })

    /**
     * Compare the difference between `start` and `end`, and warn when that
     * difference exceeds `max`.
     *
     * @param {Point} start
     * @param {Point} end
     * @param {0 | 1 | 2} max
     */
    function compare(start, end, max) {
      const diff = end.line - start.line
      const lines = Math.abs(diff) - max

      if (lines > 0) {
        file.message(
          'Remove ' +
            lines +
            ' ' +
            plural('line', Math.abs(lines)) +
            ' ' +
            (diff > 0 ? 'before' : 'after') +
            ' node',
          end
        )
      }
    }
  }
)

export default remarkLintNoConsecutiveBlankLines

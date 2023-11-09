/**
 * ## When should I use this?
 *
 * You can use this package to check that list item content is aligned.
 *
 * ## API
 *
 * There are no options.
 *
 * ## Recommendation
 *
 * The position of the first child in a list item matters.
 * Further children should align with it.
 *
 * ## Fix
 *
 * [`remark-stringify`](https://github.com/remarkjs/remark/tree/main/packages/remark-stringify)
 * aligns the content of items.
 *
 * @module list-item-content-indent
 * @summary
 *   remark-lint rule to warn when list item content is not aligned.
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @example
 *   {"name": "ok.md", "gfm": true}
 *
 *   1.·[x] Alpha
 *   ···1. Bravo
 *
 * @example
 *   {"name": "not-ok.md", "label": "input", "gfm": true}
 *
 *   1.·[x] Charlie
 *   ····1. Delta
 *
 * @example
 *   {"name": "not-ok.md", "label": "output", "gfm": true}
 *
 *   2:5: Don’t use mixed indentation for children, remove 1 space
 */

/**
 * @typedef {import('mdast').Root} Root
 */

import {lintRule} from 'unified-lint-rule'
import plural from 'pluralize'
import {visit} from 'unist-util-visit'
import {pointStart} from 'unist-util-position'

const remarkLintListItemContentIndent = lintRule(
  {
    origin: 'remark-lint:list-item-content-indent',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-list-item-content-indent#readme'
  },
  /** @type {import('unified-lint-rule').Rule<Root, void>} */
  (tree, file) => {
    const value = String(file)

    visit(tree, 'listItem', (node) => {
      let index = -1
      /** @type {number | undefined} */
      let style

      while (++index < node.children.length) {
        const item = node.children[index]
        const begin = pointStart(item)

        if (
          !begin ||
          typeof begin.column !== 'number' ||
          typeof begin.offset !== 'number'
        ) {
          continue
        }

        let column = begin.column

        // Get indentation for the first child.
        // Only the first item can have a checkbox, so here we remove that from
        // the column.
        if (index === 0) {
          // If there’s a checkbox before the content, look backwards to find
          // the start of that checkbox.
          if (typeof node.checked === 'boolean') {
            let char = begin.offset - 1

            while (char > 0 && value.charAt(char) !== '[') {
              char--
            }

            column -= begin.offset - char
          }

          style = column

          continue
        }

        // Warn for violating children.
        if (style && column !== style) {
          const diff = style - column
          const abs = Math.abs(diff)

          file.message(
            'Don’t use mixed indentation for children, ' +
              // Hard to test, I couldn’t find it at least.
              /* c8 ignore next */
              (diff > 0 ? 'add' : 'remove') +
              ' ' +
              abs +
              ' ' +
              plural('space', abs),
            {line: begin.line, column}
          )
        }
      }
    })
  }
)

export default remarkLintListItemContentIndent

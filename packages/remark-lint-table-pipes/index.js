/**
 * ## When should I use this?
 *
 * You can use this package to check that tables have initial and final
 * delimiters.
 * Tables are a GFM feature enabled with
 * [`remark-gfm`](https://github.com/remarkjs/remark-gfm).
 *
 * ## API
 *
 * There are no options.
 *
 * ## Recommendation
 *
 * While tables don’t require initial or final delimiters (pipes before the
 * first and after the last cells in a row), it arguably does look weird.
 *
 * ## Fix
 *
 * [`remark-gfm`](https://github.com/remarkjs/remark-gfm)
 * formats all tables with initial and final delimiters.
 *
 * @module table-pipes
 * @summary
 *   remark-lint rule to warn when tables are missing initial and final
 *   delimiters.
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @example
 *   {"name": "ok.md", "gfm": true}
 *
 *   | A     | B     |
 *   | ----- | ----- |
 *   | Alpha | Bravo |
 *
 * @example
 *   {"name": "not-ok.md", "label": "input", "gfm": true}
 *
 *   A     | B
 *   ----- | -----
 *   Alpha | Bravo
 *
 * @example
 *   {"name": "not-ok.md", "label": "output", "gfm": true}
 *
 *   1:1: Missing initial pipe in table fence
 *   1:10: Missing final pipe in table fence
 *   3:1: Missing initial pipe in table fence
 *   3:14: Missing final pipe in table fence
 */

/**
 * @typedef {import('mdast').Root} Root
 */

import {lintRule} from 'unified-lint-rule'
import {visit} from 'unist-util-visit'
import {pointStart, pointEnd} from 'unist-util-position'

const reasonStart = 'Missing initial pipe in table fence'
const reasonEnd = 'Missing final pipe in table fence'

const remarkLintTablePipes = lintRule(
  {
    origin: 'remark-lint:table-pipes',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-table-pipes#readme'
  },
  /** @type {import('unified-lint-rule').Rule<Root, void>} */
  (tree, file) => {
    const value = String(file)

    visit(tree, 'table', (node) => {
      let index = -1

      while (++index < node.children.length) {
        const row = node.children[index]
        const start = pointStart(row)
        const end = pointEnd(row)

        if (
          typeof start.offset === 'number' &&
          value.charCodeAt(start.offset) !== 124
        ) {
          file.message(reasonStart, start)
        }

        if (
          typeof end.offset === 'number' &&
          value.charCodeAt(end.offset - 1) !== 124
        ) {
          file.message(reasonEnd, end)
        }
      }
    })
  }
)

export default remarkLintTablePipes

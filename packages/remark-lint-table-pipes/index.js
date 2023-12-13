/**
 * remark-lint rule to warn when GFM table rows have no initial or
 * final cell delimiter.
 *
 * ## What is this?
 *
 * This package checks that table rows have initial and final delimiters.
 * Tables are a GFM feature enabled with [`remark-gfm`][github-remark-gfm].
 *
 * ## When should I use this?
 *
 * You can use this package to check that tables are consistent.
 *
 * ## API
 *
 * ### `unified().use(remarkLintTablePipes)`
 *
 * Warn when GFM table rows have no initial or final cell delimiter.
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
 * While tables don’t require initial or final delimiters (the pipes before the
 * first and after the last cells in a row),
 * it arguably does look weird without.
 *
 * ## Fix
 *
 * [`remark-stringify`][github-remark-stringify] with
 * [`remark-gfm`][github-remark-gfm] formats all tables with initial and final
 * delimiters.
 *
 * [api-remark-lint-table-pipes]: #unifieduseremarklinttablepipes
 * [github-remark-gfm]: https://github.com/remarkjs/remark-gfm
 * [github-remark-stringify]: https://github.com/remarkjs/remark/tree/main/packages/remark-stringify
 * [github-unified-transformer]: https://github.com/unifiedjs/unified#transformer
 *
 * @module table-pipes
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
import {pointEnd, pointStart} from 'unist-util-position'

const reasonStart = 'Missing initial pipe in table fence'
const reasonEnd = 'Missing final pipe in table fence'

const remarkLintTablePipes = lintRule(
  {
    origin: 'remark-lint:table-pipes',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-table-pipes#readme'
  },
  /**
   * @param {Root} tree
   *   Tree.
   * @returns {undefined}
   *   Nothing.
   */
  function (tree, file) {
    const value = String(file)

    visit(tree, 'table', function (node) {
      let index = -1

      while (++index < node.children.length) {
        const row = node.children[index]
        const start = pointStart(row)
        const end = pointEnd(row)

        if (
          start &&
          typeof start.offset === 'number' &&
          value.charCodeAt(start.offset) !== 124
        ) {
          file.message(reasonStart, start)
        }

        if (
          end &&
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

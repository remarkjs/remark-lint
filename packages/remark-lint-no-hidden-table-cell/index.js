/**
 * remark-lint rule to warn for superfluous table cells.
 *
 * ## What is this?
 *
 * This package checks that all table cells are rendered.
 *
 * ## When should I use this?
 *
 * You can use this package to check that table cells are rendered.
 *
 * ## API
 *
 * ### `unified().use(remarkLintNoHiddenTableCell)`
 *
 * Warn for superfluous table cells.
 *
 * ###### Parameters
 *
 * There are no parameters.
 *
 * ###### Returns
 *
 * Transform ([`Transformer` from `unified`][github-unified-transformer]).
 *
 * [api-remark-lint-no-hidden-table-cell]: #unifieduseremarklintnohiddentablecell
 * [github-unified-transformer]: https://github.com/unifiedjs/unified#transformer
 *
 * @module no-hidden-table-cell
 * @author Titus Wormer
 * @copyright Titus Wormer
 * @license MIT
 *
 * @example
 *   {"gfm": true, "name": "ok.md"}
 *
 *   | Planet | Mean anomaly (°) |
 *   | :- | -: |
 *   | Mercury | 174 796 |
 *
 * @example
 *   {"gfm": true, "label": "input", "name": "not-ok.md"}
 *
 *   | Planet | Symbol | Satellites |
 *   | :- | - | - |
 *   | Venus | ♀ |
 *   | Earth | ♁ | 1 |
 *   | Mars | ♂ | 2 | 19 412 |
 * @example
 *   {"gfm": true, "label": "output", "name": "not-ok.md"}
 *
 *   5:16-5:26: Unexpected hidden table cell, expected as many cells in body rows as in the head row
 */

/**
 * @import {Root} from 'mdast'
 */

import {lintRule} from 'unified-lint-rule'
import {visitParents} from 'unist-util-visit-parents'

const remarkLintNoHiddenTableCell = lintRule(
  {
    origin: 'remark-lint:no-hidden-table-cell',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-no-hidden-table-cell#readme'
  },
  /**
   * @param {Root} tree
   *   Tree.
   * @returns {undefined}
   *   Nothing.
   */
  function (tree, file) {
    visitParents(tree, 'tableCell', function (node, parents) {
      const row = parents.at(-1)
      const table = parents.at(-2)

      if (row && table && row.type === 'tableRow' && table.type === 'table') {
        const index = row.children.indexOf(node)

        if (table.align && index >= table.align.length && node.position) {
          file.message(
            'Unexpected hidden table cell, expected as many cells in body rows as in the head row',
            {ancestors: [...parents, node], place: node.position}
          )
        }
      }
    })
  }
)

export default remarkLintNoHiddenTableCell

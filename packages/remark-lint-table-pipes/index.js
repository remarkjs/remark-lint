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
 *
 * @example
 *   {"name": "ok.md", "gfm": true}
 *
 *   | Planet | Mean anomaly (°) |
 *   | :- | -: |
 *   | Mercury | 174 796 |
 *
 * @example
 *   {"name": "not-ok.md", "label": "input", "gfm": true}
 *
 *   Planet | Mean anomaly (°)
 *   :- | -:
 *   Mercury | 174 796
 * @example
 *   {"name": "not-ok.md", "label": "output", "gfm": true}
 *
 *   1:1: Unexpected missing closing pipe in row, expected `|`
 *   1:26: Unexpected missing opening pipe in row, expected `|`
 *   2:1: Unexpected missing closing pipe in row, expected `|`
 *   2:8: Unexpected missing opening pipe in row, expected `|`
 *   3:1: Unexpected missing closing pipe in row, expected `|`
 *   3:18: Unexpected missing opening pipe in row, expected `|`
 *
 * @example
 *   {"gfm": true, "label": "input", "name": "missing-cells.md"}
 *
 *   Planet | Symbol | Satellites
 *   :- | - | -
 *   Mercury
 *   Venus | ♀
 *   Earth | ♁ | 1
 *   Mars | ♂ | 2 | 19 412
 * @example
 *   {"gfm": true, "label": "output", "name": "missing-cells.md"}
 *
 *   1:1: Unexpected missing closing pipe in row, expected `|`
 *   1:29: Unexpected missing opening pipe in row, expected `|`
 *   2:1: Unexpected missing closing pipe in row, expected `|`
 *   2:11: Unexpected missing opening pipe in row, expected `|`
 *   3:1: Unexpected missing closing pipe in row, expected `|`
 *   3:8: Unexpected missing opening pipe in row, expected `|`
 *   4:1: Unexpected missing closing pipe in row, expected `|`
 *   4:10: Unexpected missing opening pipe in row, expected `|`
 *   5:1: Unexpected missing closing pipe in row, expected `|`
 *   5:14: Unexpected missing opening pipe in row, expected `|`
 *   6:1: Unexpected missing closing pipe in row, expected `|`
 *   6:22: Unexpected missing opening pipe in row, expected `|`
 *
 * @example
 *   {"gfm": true, "label": "input", "name": "trailing-spaces.md"}
 *
 *   ␠␠Planet␠␠
 *   ␠-:␠
 *
 *   ␠␠| Planet |␠␠
 *   ␠| -: |␠
 * @example
 *   {"gfm": true, "label": "output", "name": "trailing-spaces.md"}
 *
 *   1:3: Unexpected missing closing pipe in row, expected `|`
 *   1:11: Unexpected missing opening pipe in row, expected `|`
 *   2:2: Unexpected missing closing pipe in row, expected `|`
 *   2:5: Unexpected missing opening pipe in row, expected `|`
 *
 * @example
 *   {"gfm": true, "label": "input", "name": "windows.md"}
 *
 *   Mercury␍␊:-␍␊None
 * @example
 *   {"gfm": true, "label": "output", "name": "windows.md"}
 *
 *   1:1: Unexpected missing closing pipe in row, expected `|`
 *   1:8: Unexpected missing opening pipe in row, expected `|`
 *   2:1: Unexpected missing closing pipe in row, expected `|`
 *   2:3: Unexpected missing opening pipe in row, expected `|`
 *   3:1: Unexpected missing closing pipe in row, expected `|`
 *   3:5: Unexpected missing opening pipe in row, expected `|`
 */

/**
 * @typedef {import('mdast').Nodes} Nodes
 * @typedef {import('mdast').Root} Root
 *
 * @typedef {import('unist').Point} Point
 */

import {lintRule} from 'unified-lint-rule'
import {pointEnd, pointStart} from 'unist-util-position'
import {visitParents} from 'unist-util-visit-parents'

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

    visitParents(tree, 'table', function (node, parents) {
      let index = -1

      while (++index < node.children.length) {
        const row = node.children[index]
        const start = pointStart(row)
        const end = pointEnd(row)

        if (start && typeof start.offset === 'number') {
          checkStart(start.offset, start, [...parents, node, row])
        }

        if (end && typeof end.offset === 'number') {
          checkEnd(end.offset, end, [...parents, node, row])

          // Align row.
          if (index === 0) {
            let index = end.offset

            if (value.charCodeAt(index) === 13 /* `\r` */) index++
            /* c8 ignore next -- should never happen, alignment is needed. */
            if (value.charCodeAt(index) !== 10 /* `\n` */) continue
            index++

            const lineStart = index

            // Alignment row can only be on the second line,
            // so containers can only indent with `>` or spaces.
            let code = value.charCodeAt(index)

            while (
              code === 9 /* `\t` */ ||
              code === 32 /* ` ` */ ||
              code === 62 /* `>` */
            ) {
              index++
              code = value.charCodeAt(index)
            }

            checkStart(
              index,
              {
                line: end.line + 1,
                column: index - lineStart + 1,
                offset: index
              },
              [...parents, node]
            )

            index = value.indexOf('\n', index)
            if (index === -1) index = value.length
            if (value.charCodeAt(index - 1) === 13 /* `\r` */) index--

            checkEnd(
              index,
              {
                line: end.line + 1,
                column: index - lineStart + 1,
                offset: index
              },
              [...parents, node]
            )
          }
        }
      }
    })

    /**
     * @param {number} index
     * @param {Point} place
     * @param {Array<Nodes>} ancestors
     */
    function checkStart(index, place, ancestors) {
      let code = value.charCodeAt(index)

      /* c8 ignore next 3 -- parser currently places indent outside. */
      while (code === 9 /* `\t` */ || code === 32 /* ` ` */) {
        code = value.charCodeAt(++index)
      }

      if (code !== 124 /* `|` */) {
        file.message('Unexpected missing closing pipe in row, expected `|`', {
          ancestors,
          place
        })
      }
    }

    /**
     * @param {number} index
     * @param {Point} place
     * @param {Array<Nodes>} ancestors
     */
    function checkEnd(index, place, ancestors) {
      let code = value.charCodeAt(index - 1)

      while (code === 9 /* `\t` */ || code === 32 /* ` ` */) {
        index--
        code = value.charCodeAt(index - 1)
      }

      if (code !== 124 /* `|` */) {
        file.message('Unexpected missing opening pipe in row, expected `|`', {
          ancestors,
          place
        })
      }
    }
  }
)

export default remarkLintTablePipes

/**
 * remark-lint rule to warn when GFM tables are indented.
 *
 * ## What is this?
 *
 * This package checks the indent of GFM tables.
 * Tables are a GFM feature enabled with
 * [`remark-gfm`][github-remark-gfm].
 *
 * ## When should I use this?
 *
 * You can use this package to check that tables are consistent.
 *
 * ## API
 *
 * ### `unified().use(remarkLintNoTableIndentation)`
 *
 * Warn when GFM tables are indented.
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
 * There is no specific handling of indented tables (or anything else) in
 * markdown.
 * So it’s recommended to not indent tables and to turn this rule on.
 *
 * ## Fix
 *
 * [`remark-stringify`][github-remark-stringify] with
 * [`remark-gfm`][github-remark-gfm] formats all tables without indent.
 *
 * [api-remark-lint-no-table-indentation]: #unifieduseremarklintnotableindentation
 * [github-remark-gfm]: https://github.com/remarkjs/remark-gfm
 * [github-remark-stringify]: https://github.com/remarkjs/remark/tree/main/packages/remark-stringify
 * [github-unified-transformer]: https://github.com/unifiedjs/unified#transformer
 *
 * @module no-table-indentation
 * @author Titus Wormer
 * @copyright Titus Wormer
 * @license MIT
 *
 * @example
 *   {"name": "ok.md", "gfm": true}
 *
 *   | Planet  | Mean anomaly (°) |
 *   | ------- | ---------------: |
 *   | Mercury |          174 796 |
 *
 * @example
 *   {"gfm": true, "label": "input", "name": "not-ok.md"}
 *
 *   ␠| Planet  | Mean anomaly (°) |
 *   ␠␠| ------- | ---------------: |
 *   ␠␠␠| Mercury |          174 796 |
 *
 * @example
 *   {"gfm": true, "label": "output", "name": "not-ok.md"}
 *
 *   1:2: Unexpected `1` extra space before table row, remove `1` space
 *   2:3: Unexpected `2` extra spaces before table row, remove `2` spaces
 *   3:4: Unexpected `3` extra spaces before table row, remove `3` spaces
 *
 * @example
 *   {"gfm": true, "label": "input", "name": "blockquote.md"}
 *
 *   >␠| Planet  |
 *   >␠␠| ------- |
 *
 * @example
 *   {"gfm": true, "label": "output", "name": "blockquote.md"}
 *
 *   2:4: Unexpected `1` extra space before table row, remove `1` space
 *
 * @example
 *   {"gfm": true, "label": "input", "name": "list.md"}
 *
 *   *␠| Planet  |
 *   ␠␠␠| ------- |
 *
 * @example
 *   {"gfm": true, "label": "output", "name": "list.md"}
 *
 *   2:4: Unexpected `1` extra space before table row, remove `1` space
 */

/**
 * @import {Root} from 'mdast'
 */

import {ok as assert} from 'devlop'
import {phrasing} from 'mdast-util-phrasing'
import pluralize from 'pluralize'
import {lintRule} from 'unified-lint-rule'
import {pointEnd, pointStart} from 'unist-util-position'
import {SKIP, visitParents} from 'unist-util-visit-parents'
import {location} from 'vfile-location'

const remarkLintNoTableIndentation = lintRule(
  {
    origin: 'remark-lint:no-table-indentation',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-no-table-indentation#readme'
  },
  /**
   * @param {Root} tree
   *   Tree.
   * @returns {undefined}
   *   Nothing.
   */
  function (tree, file) {
    const value = String(file)
    const locations = location(value)

    // Note: this code is very similar to `remark-lint-no-paragraph-content-indent`.
    visitParents(tree, function (node, parents) {
      // Do not walk into phrasing.
      if (phrasing(node)) {
        return SKIP
      }

      if (node.type !== 'table') return

      const parent = parents.at(-1)
      const end = pointEnd(node)
      const start = pointStart(node)

      if (!parent || !end || !start) return

      const parentHead = parent.children[0]
      // Always defined if we have a parent.
      assert(parentHead)
      let line = start.line
      /** @type {number | undefined} */
      let column

      if (parent.type === 'root') {
        column = 1
      } else if (parent.type === 'blockquote') {
        const parentStart = pointStart(parent)

        if (parentStart) {
          column = parentStart.column + 2
        }
      } else if (parent.type === 'listItem') {
        const headStart = pointStart(parentHead)

        if (headStart) {
          column = headStart.column

          // Skip past the first line if we’re the first child of a list item.
          if (parentHead === node) {
            line++
          }
        }
      }

      /* c8 ignore next -- unknown parent. */
      if (!column) return

      while (line <= end.line) {
        let index = locations.toOffset({line, column})

        /* c8 ignore next -- out of range somehow. */
        if (typeof index !== 'number') continue

        const expected = index

        // Check that we only have whitespace / block quote marker before.
        // We expect a line ending or a block quote marker.
        // Otherwise (weird ancestor or lazy line) we stop.
        let code = value.charCodeAt(index - 1)

        while (code === 9 /* `\t` */ || code === 32 /* ` ` */) {
          index--
          code = value.charCodeAt(index - 1)
        }

        if (
          code === 10 /* `\n` */ ||
          code === 13 /* `\r` */ ||
          code === 62 /* `>` */ ||
          Number.isNaN(code)
        ) {
          // Now check superfluous indent.
          let actual = expected

          code = value.charCodeAt(actual)

          while (code === 9 /* `\t` */ || code === 32 /* ` ` */) {
            code = value.charCodeAt(++actual)
          }

          const difference = actual - expected

          if (difference !== 0) {
            file.message(
              'Unexpected `' +
                difference +
                '` extra ' +
                pluralize('space', difference) +
                ' before table row, remove `' +
                difference +
                '` ' +
                pluralize('space', difference),
              {
                ancestors: [...parents, node],
                place: {
                  line,
                  column: column + difference,
                  offset: actual
                }
              }
            )
          }
        }

        line++
      }

      return SKIP
    })
  }
)

export default remarkLintNoTableIndentation

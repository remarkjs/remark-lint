/**
 * remark-lint rule to warn when text in paragraphs is indented.
 *
 * ## What is this?
 *
 * This package checks that text in paragraphs is not indented.
 *
 * ## When should I use this?
 *
 * You can use this package to check that paragraphs are consistent.
 *
 * ## API
 *
 * ### `unified().use(remarkLintNoParagraphContentIndent)`
 *
 * Warn when text in paragraphs is indented.
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
 * Indenting further lines in a paragraph has no effect.
 * So it’s recommended to turn this rule on.
 *
 * [api-remark-lint-no-paragraph-content-indent]: #unifieduseremarklintnoparagraphcontentindent
 * [github-unified-transformer]: https://github.com/unifiedjs/unified#transformer
 *
 * @module no-paragraph-content-indent
 * @author Titus Wormer
 * @copyright 2017 Titus Wormer
 * @license MIT
 *
 * @example
 *   {"name": "ok.md"}
 *
 *   Mercury.
 *
 *   Venus and
 *   **Earth**.
 *
 *   * Mars and
 *     Jupiter.
 *
 *   > Saturn and
 *   > Uranus.
 *
 * @example
 *   {"label": "input", "name": "not-ok.md"}
 *
 *   ␠Mercury.
 *
 *   Venus and
 *   ␠␠**Earth**.
 *
 *   * Mars and
 *     ␠␠Jupiter.
 *
 *   > Saturn and
 *   > ␠Uranus.
 *
 *   * Neptune
 *   and
 *     ␠␠Pluto.
 *
 *   > Ceres
 *   and
 *   > ␠Makemake.
 *
 * @example
 *   {"label": "output", "name": "not-ok.md"}
 *
 *   1:2: Unexpected `1` extra space before content line, remove `1` space
 *   4:3: Unexpected `2` extra spaces before content line, remove `2` spaces
 *   7:5: Unexpected `2` extra spaces before content line, remove `2` spaces
 *   10:4: Unexpected `1` extra space before content line, remove `1` space
 *   14:5: Unexpected `2` extra spaces before content line, remove `2` spaces
 *   18:4: Unexpected `1` extra space before content line, remove `1` space
 */

/**
 * @typedef {import('mdast').Root} Root
 */

import {ok as assert} from 'devlop'
import {phrasing} from 'mdast-util-phrasing'
import pluralize from 'pluralize'
import {lintRule} from 'unified-lint-rule'
import {pointEnd, pointStart} from 'unist-util-position'
import {SKIP, visitParents} from 'unist-util-visit-parents'
import {location} from 'vfile-location'

const remarkLintNoParagraphContentIndent = lintRule(
  {
    origin: 'remark-lint:no-paragraph-content-indent',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-no-paragraph-content-indent#readme'
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

    // Note: this code is very similar to `remark-lint-no-table-indentation`.
    visitParents(tree, function (node, parents) {
      // Do not walk into phrasing.
      if (phrasing(node)) {
        return SKIP
      }

      if (node.type !== 'paragraph') return

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
                ' before content line, remove `' +
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

export default remarkLintNoParagraphContentIndent

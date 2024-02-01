/**
 * remark-lint rule to warn when extra whitespace is used between hashes and
 * content in headings.
 *
 * ## What is this?
 *
 * This package checks whitespace between hashes and content.
 *
 * ## When should I use this?
 *
 * You can use this package to check that headings are consistent.
 *
 * ## API
 *
 * ### `unified().use(remarkLintNoHeadingContentIndent)`
 *
 * Warn when extra whitespace is used between hashes and content in headings.
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
 * One space is required and more than one space has no effect.
 * Due to this, it’s recommended to turn this rule on.
 *
 * ## Fix
 *
 * [`remark-stringify`][github-remark-stringify] formats headings with one space.
 *
 * [api-remark-lint-no-heading-content-indent]: #unifieduseremarklintnoheadingcontentindent
 * [github-remark-stringify]: https://github.com/remarkjs/remark/tree/main/packages/remark-stringify
 * [github-unified-transformer]: https://github.com/unifiedjs/unified#transformer
 *
 * @module no-heading-content-indent
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 *
 * @example
 *   {"name": "ok.md"}
 *
 *   #␠Mercury
 *
 *   ##␠Venus␠##
 *
 *   ␠␠##␠Earth
 *
 *   Setext headings are not affected:
 *
 *   ␠Mars
 *   =====
 *
 *   ␠Jupiter
 *   --------
 *
 * @example
 *   {"label": "input", "name": "not-ok.md"}
 *
 *   #␠␠Mercury
 *
 *   ##␠Venus␠␠##
 *
 *   ␠␠##␠␠␠Earth
 * @example
 *   {"label": "output", "name": "not-ok.md"}
 *
 *   1:4: Unexpected `2` spaces between hashes and content, expected `1` space, remove `1` space
 *   3:11: Unexpected `2` spaces between content and hashes, expected `1` space, remove `1` space
 *   5:8: Unexpected `3` spaces between hashes and content, expected `1` space, remove `2` spaces
 *
 * @example
 *   {"label": "input", "name": "empty-heading.md"}
 *
 *   #␠␠
 * @example
 *   {"label": "output", "name": "empty-heading.md"}
 *
 *   1:4: Unexpected `2` spaces between hashes and content, expected `1` space, remove `1` space
 */

/**
 * @typedef {import('mdast').Root} Root
 */

import {phrasing} from 'mdast-util-phrasing'
import pluralize from 'pluralize'
import {lintRule} from 'unified-lint-rule'
import {pointEnd, pointStart} from 'unist-util-position'
import {SKIP, visitParents} from 'unist-util-visit-parents'

const remarkLintNoHeadingContentIndent = lintRule(
  {
    origin: 'remark-lint:no-heading-content-indent',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-no-heading-content-indent#readme'
  },
  /**
   * @param {Root} tree
   *   Tree.
   * @returns {undefined}
   *   Nothing.
   */
  function (tree, file) {
    const value = String(file)

    visitParents(tree, function (node, parents) {
      // Do not walk into phrasing.
      if (phrasing(node)) {
        return SKIP
      }

      if (node.type !== 'heading') return
      const start = pointStart(node)
      const end = pointEnd(node)

      if (
        !end ||
        !start ||
        typeof end.offset !== 'number' ||
        typeof start.offset !== 'number'
      ) {
        return
      }

      let index = start.offset
      let code = value.charCodeAt(index)
      // Node positional info starts after whitespace,
      // so we don’t need to walk past it.
      let found = false

      while (value.charCodeAt(index) === 35 /* `#` */) {
        index++
        found = true
        continue
      }

      const from = index

      code = value.charCodeAt(index)

      while (code === 9 /* `\t` */ || code === 32 /* ` ` */) {
        code = value.charCodeAt(++index)
        continue
      }

      const size = index - from

      // Not ATX / fine.
      if (found && size > 1) {
        file.message(
          'Unexpected `' +
            size +
            '` ' +
            pluralize('space', size) +
            ' between hashes and content, expected `1` space, remove `' +
            (size - 1) +
            '` ' +
            pluralize('space', size - 1),
          {
            ancestors: [...parents, node],
            place: {
              line: start.line,
              column: start.column + (index - start.offset),
              offset: start.offset + (index - start.offset)
            }
          }
        )
      }

      const contentStart = index

      index = end.offset
      code = value.charCodeAt(index - 1)

      while (code === 9 /* `\t` */ || code === 32 /* ` ` */) {
        index--
        code = value.charCodeAt(index - 1)
        continue
      }

      let endFound = false

      while (value.charCodeAt(index - 1) === 35 /* `#` */) {
        index--
        endFound = true
        continue
      }

      const endFrom = index

      code = value.charCodeAt(index - 1)

      while (code === 9 /* `\t` */ || code === 32 /* ` ` */) {
        index--
        code = value.charCodeAt(index - 1)
        continue
      }

      const endSize = endFrom - index

      if (endFound && index > contentStart && endSize > 1) {
        file.message(
          'Unexpected `' +
            endSize +
            '` ' +
            pluralize('space', endSize) +
            ' between content and hashes, expected `1` space, remove `' +
            (endSize - 1) +
            '` ' +
            pluralize('space', endSize - 1),
          {
            ancestors: [...parents, node],
            place: {
              line: end.line,
              column: end.column - (end.offset - endFrom),
              offset: end.offset - (end.offset - endFrom)
            }
          }
        )
      }
    })
  }
)

export default remarkLintNoHeadingContentIndent

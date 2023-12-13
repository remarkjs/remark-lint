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
 * @example
 *   {"name": "ok.md"}
 *
 *   #␠Foo
 *
 *   ## Bar␠##
 *
 *     ##␠Baz
 *
 *   Setext headings are not affected.
 *
 *   Baz
 *   ===
 *
 * @example
 *   {"name": "not-ok.md", "label": "input"}
 *
 *   #␠␠Foo
 *
 *   ## Bar␠␠##
 *
 *     ##␠␠Baz
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
 *   #␠␠
 */

/**
 * @typedef {import('mdast').Root} Root
 */

import {headingStyle} from 'mdast-util-heading-style'
import plural from 'pluralize'
import {lintRule} from 'unified-lint-rule'
import {pointEnd, pointStart} from 'unist-util-position'
import {visit} from 'unist-util-visit'

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
    visit(tree, 'heading', function (node) {
      const start = pointStart(node)
      const type = headingStyle(node, 'atx')

      if (!start) return

      if (type === 'atx' || type === 'atx-closed') {
        const headStart = pointStart(node.children[0])

        // Ignore empty headings.
        if (!headStart) {
          return
        }

        const diff = headStart.column - start.column - 1 - node.depth

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
        const end = pointEnd(node)

        /* c8 ignore next -- we get here if we have offsets. */
        if (!final || !end) return

        const diff = end.column - final.column - 1 - node.depth

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

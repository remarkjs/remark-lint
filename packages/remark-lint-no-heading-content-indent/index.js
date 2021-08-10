/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module no-heading-content-indent
 * @fileoverview
 *   Warn when content of headings is indented.
 *
 *   ## Fix
 *
 *   [`remark-stringify`](https://github.com/remarkjs/remark/tree/HEAD/packages/remark-stringify)
 *   removes all unneeded padding around content in headings.
 *
 *   See [Using remark to fix your Markdown](https://github.com/remarkjs/remark-lint#using-remark-to-fix-your-markdown)
 *   on how to automatically fix warnings for this rule.
 *
 * @example {"name": "ok.md"}
 *
 *   #·Foo
 *
 *   ## Bar·##
 *
 *     ##·Baz
 *
 *   Setext headings are not affected.
 *
 *   Baz
 *   ===
 *
 * @example {"name": "not-ok.md", "label": "input"}
 *
 *   #··Foo
 *
 *   ## Bar··##
 *
 *     ##··Baz
 *
 * @example {"name": "not-ok.md", "label": "output"}
 *
 *   1:4: Remove 1 space before this heading’s content
 *   3:7: Remove 1 space after this heading’s content
 *   5:7: Remove 1 space before this heading’s content
 *
 * @example {"name": "empty-heading.md"}
 *
 *   #··
 */

import {lintRule} from 'unified-lint-rule'
import {visit} from 'unist-util-visit'
import {headingStyle} from 'mdast-util-heading-style'
import plural from 'pluralize'
import {pointStart, pointEnd} from 'unist-util-position'
import {generated} from 'unist-util-generated'

const remarkLintNoHeadingContentIndent = lintRule(
  'remark-lint:no-heading-content-indent',
  noHeadingContentIndent
)

export default remarkLintNoHeadingContentIndent

function noHeadingContentIndent(tree, file) {
  visit(tree, 'heading', visitor)

  function visitor(node) {
    var depth
    var children
    var type
    var head
    var final
    var diff
    var reason
    var abs

    if (generated(node)) {
      return
    }

    depth = node.depth
    children = node.children
    type = headingStyle(node, 'atx')

    if (type === 'atx' || type === 'atx-closed') {
      head = pointStart(children[0]).column

      // Ignore empty headings.
      if (!head) {
        return
      }

      diff = head - pointStart(node).column - 1 - depth

      if (diff) {
        abs = Math.abs(diff)

        reason =
          'Remove ' +
          abs +
          ' ' +
          plural('space', abs) +
          ' before this heading’s content'

        file.message(reason, pointStart(children[0]))
      }
    }

    // Closed ATX headings always must have a space between their content and
    // the final hashes, thus, there is no `add x spaces`.
    if (type === 'atx-closed') {
      final = pointEnd(children[children.length - 1])
      diff = pointEnd(node).column - final.column - 1 - depth

      if (diff) {
        reason =
          'Remove ' +
          diff +
          ' ' +
          plural('space', diff) +
          ' after this heading’s content'

        file.message(reason, final)
      }
    }
  }
}

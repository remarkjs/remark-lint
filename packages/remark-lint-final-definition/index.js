/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module final-definition
 * @fileoverview
 *   Warn when definitions are placed somewhere other than at the end of
 *   the file.
 *
 * @example {"name": "ok.md"}
 *
 *   Paragraph.
 *
 *   [example]: http://example.com "Example Domain"
 *
 * @example {"name": "not-ok.md", "label": "input"}
 *
 *   Paragraph.
 *
 *   [example]: http://example.com "Example Domain"
 *
 *   Another paragraph.
 *
 * @example {"name": "not-ok.md", "label": "output"}
 *
 *   3:1-3:47: Move definitions to the end of the file (after the node at line `5`)
 *
 * @example {"name": "ok-comments.md"}
 *
 *   Paragraph.
 *
 *   [example-1]: http://example.com/one/
 *
 *   <!-- Comments are fine between and after definitions -->
 *
 *   [example-2]: http://example.com/two/
 */

import {lintRule} from 'unified-lint-rule'
import {visit} from 'unist-util-visit'
import {pointStart} from 'unist-util-position'
import {generated} from 'unist-util-generated'

const remarkLintFinalDefinition = lintRule(
  'remark-lint:final-definition',
  (tree, file) => {
    let last = null

    visit(
      tree,
      (node) => {
        // Ignore generated and HTML comment nodes.
        if (
          node.type === 'root' ||
          generated(node) ||
          (node.type === 'html' && /^\s*<!--/.test(node.value))
        ) {
          return
        }

        const line = pointStart(node).line

        if (node.type === 'definition') {
          if (last !== null && last > line) {
            file.message(
              'Move definitions to the end of the file (after the node at line `' +
                last +
                '`)',
              node
            )
          }
        } else if (last === null) {
          last = line
        }
      },
      true
    )
  }
)

export default remarkLintFinalDefinition

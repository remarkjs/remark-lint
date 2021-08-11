/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module no-emphasis-as-heading
 * @fileoverview
 *   Warn when emphasis (including strong), instead of a heading, introduces
 *   a paragraph.
 *
 * @example {"name": "ok.md"}
 *
 *   # Foo
 *
 *   Bar.
 *
 * @example {"name": "not-ok.md", "label": "input"}
 *
 *   *Foo*
 *
 *   Bar.
 *
 *   __Qux__
 *
 *   Quux.
 *
 * @example {"name": "not-ok.md", "label": "output"}
 *
 *   1:1-1:6: Don’t use emphasis to introduce a section, use a heading
 *   5:1-5:8: Don’t use emphasis to introduce a section, use a heading
 */

import {lintRule} from 'unified-lint-rule'
import {visit} from 'unist-util-visit'
import {generated} from 'unist-util-generated'

const remarkLintNoEmphasisAsHeading = lintRule(
  'remark-lint:no-emphasis-as-heading',
  (tree, file) => {
    visit(tree, 'paragraph', (node, index, parent) => {
      const head = node.children[0]
      const previous = parent.children[index - 1]
      const next = parent.children[index + 1]

      if (
        !generated(node) &&
        (!previous || previous.type !== 'heading') &&
        next &&
        next.type === 'paragraph' &&
        node.children.length === 1 &&
        (head.type === 'emphasis' || head.type === 'strong')
      ) {
        file.message(
          'Don’t use emphasis to introduce a section, use a heading',
          node
        )
      }
    })
  }
)

export default remarkLintNoEmphasisAsHeading

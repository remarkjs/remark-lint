/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module no-emphasis-as-heading
 * @fileoverview
 *   Warn when emphasis (including strong), instead of a heading, introduces
 *   a paragraph.
 *
 * @example
 *   {"name": "ok.md"}
 *
 *   # Foo
 *
 *   Bar.
 *
 * @example
 *   {"name": "not-ok.md", "label": "input"}
 *
 *   *Foo*
 *
 *   Bar.
 *
 *   __Qux__
 *
 *   Quux.
 *
 * @example
 *   {"name": "not-ok.md", "label": "output"}
 *
 *   1:1-1:6: Don’t use emphasis to introduce a section, use a heading
 *   5:1-5:8: Don’t use emphasis to introduce a section, use a heading
 */

/**
 * @typedef {import('mdast').Root} Root
 */

import {lintRule} from 'unified-lint-rule'
import {visit} from 'unist-util-visit'
import {generated} from 'unist-util-generated'

const remarkLintNoEmphasisAsHeading = lintRule(
  {
    origin: 'remark-lint:no-emphasis-as-heading',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-no-emphasis-as-heading#readme'
  },
  /** @type {import('unified-lint-rule').Rule<Root, void>} */
  (tree, file) => {
    visit(tree, 'paragraph', (node, index, parent) => {
      const head = node.children[0]

      if (
        parent &&
        typeof index === 'number' &&
        !generated(node) &&
        node.children.length === 1 &&
        (head.type === 'emphasis' || head.type === 'strong')
      ) {
        const previous = parent.children[index - 1]
        const next = parent.children[index + 1]

        if (
          (!previous || previous.type !== 'heading') &&
          next &&
          next.type === 'paragraph'
        ) {
          file.message(
            'Don’t use emphasis to introduce a section, use a heading',
            node
          )
        }
      }
    })
  }
)

export default remarkLintNoEmphasisAsHeading

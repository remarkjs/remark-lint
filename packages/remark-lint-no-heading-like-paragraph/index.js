/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module no-heading-like-paragraph
 * @fileoverview
 *   Warn for h7+ “headings”.
 *
 * @example
 *   {"name": "ok.md"}
 *
 *   ###### Alpha
 *
 *   Bravo.
 *
 * @example
 *   {"name": "not-ok.md", "label": "input"}
 *
 *   ####### Charlie
 *
 *   Delta.
 *
 * @example
 *   {"name": "not-ok.md", "label": "output"}
 *
 *   1:1-1:16: This looks like a heading but has too many hashes
 */

/**
 * @typedef {import('mdast').Root} Root
 */

import {lintRule} from 'unified-lint-rule'
import {visit} from 'unist-util-visit'
import {generated} from 'unist-util-generated'

const fence = '#######'

const remarkLintNoHeadingLikeParagraph = lintRule(
  {
    origin: 'remark-lint:no-heading-like-paragraph',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-no-heading-like-paragraph#readme'
  },
  /** @type {import('unified-lint-rule').Rule<Root, void>} */
  (tree, file) => {
    visit(tree, 'paragraph', (node) => {
      if (!generated(node)) {
        const head = node.children[0]

        if (
          head &&
          head.type === 'text' &&
          head.value.slice(0, fence.length) === fence
        ) {
          file.message(
            'This looks like a heading but has too many hashes',
            node
          )
        }
      }
    })
  }
)

export default remarkLintNoHeadingLikeParagraph

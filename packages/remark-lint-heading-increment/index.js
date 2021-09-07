/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module heading-increment
 * @fileoverview
 *   Warn when headings increment with more than 1 level at a time.
 *
 * @example
 *   {"name": "ok.md"}
 *
 *   # Alpha
 *
 *   ## Bravo
 *
 * @example
 *   {"name": "not-ok.md", "label": "input"}
 *
 *   # Charlie
 *
 *   ### Delta
 *
 * @example
 *   {"name": "not-ok.md", "label": "output"}
 *
 *   3:1-3:10: Heading levels should increment by one level at a time
 */

/**
 * @typedef {import('mdast').Root} Root
 * @typedef {import('mdast').Heading['depth']} Depth
 */

import {lintRule} from 'unified-lint-rule'
import {visit} from 'unist-util-visit'
import {generated} from 'unist-util-generated'

const remarkLintHeadingIncrement = lintRule(
  {
    origin: 'remark-lint:heading-increment',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-heading-increment#readme'
  },
  /** @type {import('unified-lint-rule').Rule<Root, void>} */
  (tree, file) => {
    /** @type {Depth} */
    let previous

    visit(tree, 'heading', (node) => {
      if (!generated(node)) {
        if (previous && node.depth > previous + 1) {
          file.message(
            'Heading levels should increment by one level at a time',
            node
          )
        }

        previous = node.depth
      }
    })
  }
)

export default remarkLintHeadingIncrement

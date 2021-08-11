/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module heading-increment
 * @fileoverview
 *   Warn when headings increment with more than 1 level at a time.
 *
 * @example {"name": "ok.md"}
 *
 *   # Alpha
 *
 *   ## Bravo
 *
 * @example {"name": "not-ok.md", "label": "input"}
 *
 *   # Charlie
 *
 *   ### Delta
 *
 * @example {"name": "not-ok.md", "label": "output"}
 *
 *   3:1-3:10: Heading levels should increment by one level at a time
 */

import {lintRule} from 'unified-lint-rule'
import {visit} from 'unist-util-visit'
import {generated} from 'unist-util-generated'

const remarkLintHeadingIncrement = lintRule(
  'remark-lint:heading-increment',
  (tree, file) => {
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

/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module no-multiple-toplevel-headings
 * @fileoverview
 *   Warn when multiple top level headings are used.
 *
 *   Options: `number`, default: `1`.
 *
 * @example {"name": "ok.md", "setting": 1}
 *
 *   # Foo
 *
 *   ## Bar
 *
 * @example {"name": "not-ok.md", "setting": 1, "label": "input"}
 *
 *   # Foo
 *
 *   # Bar
 *
 * @example {"name": "not-ok.md", "setting": 1, "label": "output"}
 *
 *   3:1-3:6: Don’t use multiple top level headings (1:1)
 */

import {lintRule} from 'unified-lint-rule'
import visit from 'unist-util-visit'
import position from 'unist-util-position'
import generated from 'unist-util-generated'
import stringify from 'unist-util-stringify-position'

const remarkLintNoMultipleToplevelHeadings = lintRule(
  'remark-lint:no-multiple-toplevel-headings',
  noMultipleToplevelHeadings
)

export default remarkLintNoMultipleToplevelHeadings

function noMultipleToplevelHeadings(tree, file, option) {
  var preferred = option || 1
  var duplicate

  visit(tree, 'heading', visitor)

  function visitor(node) {
    if (!generated(node) && node.depth === preferred) {
      if (duplicate) {
        file.message(
          'Don’t use multiple top level headings (' + duplicate + ')',
          node
        )
      } else {
        duplicate = stringify(position.start(node))
      }
    }
  }
}

/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module no-duplicate-headings
 * @fileoverview
 *   Warn when duplicate headings are found.
 *
 * @example {"name": "ok.md"}
 *
 *   # Foo
 *
 *   ## Bar
 *
 * @example {"name": "not-ok.md", "label": "input"}
 *
 *   # Foo
 *
 *   ## Foo
 *
 *   ## [Foo](http://foo.com/bar)
 *
 * @example {"name": "not-ok.md", "label": "output"}
 *
 *   3:1-3:7: Do not use headings with similar content (1:1)
 *   5:1-5:29: Do not use headings with similar content (3:1)
 */

import {lintRule} from 'unified-lint-rule'
import {pointStart} from 'unist-util-position'
import {generated} from 'unist-util-generated'
import {visit} from 'unist-util-visit'
import {stringifyPosition} from 'unist-util-stringify-position'
import {toString} from 'mdast-util-to-string'

const remarkLintNoDuplicateHeadings = lintRule(
  'remark-lint:no-duplicate-headings',
  noDuplicateHeadings
)

export default remarkLintNoDuplicateHeadings

var reason = 'Do not use headings with similar content'

function noDuplicateHeadings(tree, file) {
  var map = {}

  visit(tree, 'heading', visitor)

  function visitor(node) {
    var value
    var duplicate

    if (!generated(node)) {
      value = toString(node).toUpperCase()
      duplicate = map[value]

      if (duplicate && duplicate.type === 'heading') {
        file.message(
          reason + ' (' + stringifyPosition(pointStart(duplicate)) + ')',
          node
        )
      }

      map[value] = node
    }
  }
}

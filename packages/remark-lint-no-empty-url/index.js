/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module no-empty-url
 * @fileoverview
 *   Warn for empty URLs in links and images.
 *
 * @example
 *   {"name": "ok.md"}
 *
 *   [alpha](http://bravo.com).
 *
 *   ![charlie](http://delta.com/echo.png "foxtrot").
 *
 * @example
 *   {"name": "not-ok.md", "label": "input"}
 *
 *   [golf]().
 *
 *   ![hotel]().
 *
 * @example
 *   {"name": "not-ok.md", "label": "output"}
 *
 *   1:1-1:9: Don’t use links without URL
 *   3:1-3:11: Don’t use images without URL
 */

import {lintRule} from 'unified-lint-rule'
import {visit} from 'unist-util-visit'
import {generated} from 'unist-util-generated'

const remarkLintNoEmptyUrl = lintRule(
  'remark-lint:no-empty-url',
  (tree, file) => {
    visit(tree, (node) => {
      if (
        (node.type === 'link' || node.type === 'image') &&
        !generated(node) &&
        !node.url
      ) {
        file.message('Don’t use ' + node.type + 's without URL', node)
      }
    })
  }
)

export default remarkLintNoEmptyUrl

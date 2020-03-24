/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module no-html
 * @fileoverview
 *   Warn when HTML nodes are used.
 *
 *   Ignores comments, because they are used by `remark`, `remark-lint`, other
 *   Markdown tools, and because Markdown doesn’t have native comments.
 *
 * @example {"name": "ok.md"}
 *
 *   # Hello
 *
 *   <!--Comments are also OK-->
 *
 * @example {"name": "not-ok.md", "label": "input"}
 *
 *   <h1>Hello</h1>
 *
 * @example {"name": "not-ok.md", "label": "output"}
 *
 *   1:1-1:15: Do not use HTML in markdown
 */

'use strict'

var rule = require('unified-lint-rule')
var visit = require('unist-util-visit')
var generated = require('unist-util-generated')

module.exports = rule('remark-lint:no-html', noHTML)

var reason = 'Do not use HTML in markdown'

function noHTML(tree, file) {
  visit(tree, 'html', visitor)

  function visitor(node) {
    if (!generated(node) && !/^\s*<!--/.test(node.value)) {
      file.message(reason, node)
    }
  }
}

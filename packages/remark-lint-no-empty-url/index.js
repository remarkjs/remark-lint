/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module no-empty-url
 * @fileoverview
 *   Warn for empty URLs in links and images.
 *
 * @example {"name": "ok.md"}
 *
 *   [alpha](http://bravo.com).
 *
 *   ![charlie](http://delta.com/echo.png "foxtrot").
 *
 * @example {"name": "not-ok.md", "label": "input"}
 *
 *   [golf]().
 *
 *   ![hotel]().
 *
 * @example {"name": "not-ok.md", "label": "output"}
 *
 *   1:1-1:9: Don’t use links without URL
 *   3:1-3:11: Don’t use images without URL
 */

'use strict'

var rule = require('unified-lint-rule')
var visit = require('unist-util-visit')
var generated = require('unist-util-generated')

module.exports = rule('remark-lint:no-empty-url', noEmptyURL)

function noEmptyURL(tree, file) {
  visit(tree, ['link', 'image'], visitor)

  function visitor(node) {
    if (!generated(node) && !node.url) {
      file.message('Don’t use ' + node.type + 's without URL', node)
    }
  }
}

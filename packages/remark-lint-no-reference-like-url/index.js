/**
 * @author Titus Wormer
 * @copyright 2016 Titus Wormer
 * @license MIT
 * @module no-reference-like-url
 * @fileoverview
 *   Warn when URLs are also defined identifiers.
 *
 * @example {"name": "ok.md"}
 *
 *   [Alpha](http://example.com).
 *
 *   [bravo]: https://example.com
 *
 * @example {"name": "not-ok.md", "label": "input"}
 *
 *   [Charlie](delta).
 *
 *   [delta]: https://example.com
 *
 * @example {"name": "not-ok.md", "label": "output"}
 *
 *   1:1-1:17: Did you mean to use `[delta]` instead of `(delta)`, a reference?
 */

'use strict'

var rule = require('unified-lint-rule')
var generated = require('unist-util-generated')
var visit = require('unist-util-visit')

module.exports = rule('remark-lint:no-reference-like-url', noReferenceLikeURL)

function noReferenceLikeURL(tree, file) {
  var identifiers = []

  visit(tree, 'definition', find)
  visit(tree, ['image', 'link'], check)

  // Find identifiers.
  function find(node) {
    if (!generated(node)) {
      identifiers.push(node.identifier.toLowerCase())
    }
  }

  // Check `node`.
  function check(node) {
    var url = node.url
    var reason

    if (identifiers.indexOf(url.toLowerCase()) !== -1) {
      reason =
        'Did you mean to use `[' +
        url +
        ']` instead of ' +
        '`(' +
        url +
        ')`, a reference?'

      file.message(reason, node)
    }
  }
}

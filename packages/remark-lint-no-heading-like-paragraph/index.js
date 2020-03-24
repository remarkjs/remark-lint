/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module no-heading-like-paragraph
 * @fileoverview
 *   Warn for h7+ “headings”.
 *
 * @example {"name": "ok.md"}
 *
 *   ###### Alpha
 *
 *   Bravo.
 *
 * @example {"name": "not-ok.md", "label": "input"}
 *
 *   ####### Charlie
 *
 *   Delta.
 *
 * @example {"name": "not-ok.md", "label": "output"}
 *
 *   1:1-1:16: This looks like a heading but has too many hashes
 */

'use strict'

var rule = require('unified-lint-rule')
var visit = require('unist-util-visit')
var generated = require('unist-util-generated')

module.exports = rule(
  'remark-lint:no-heading-like-paragraph',
  noHeadingLikeParagraph
)

var fence = '#######'
var reason = 'This looks like a heading but has too many hashes'

function noHeadingLikeParagraph(tree, file) {
  visit(tree, 'paragraph', visitor)

  function visitor(node) {
    var head

    if (!generated(node)) {
      head = node.children[0]

      if (
        head &&
        head.type === 'text' &&
        head.value.slice(0, fence.length) === fence
      ) {
        file.message(reason, node)
      }
    }
  }
}

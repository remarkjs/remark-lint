/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module no-heading-like-paragraph
 * @fileoverview
 *   Warn for h7+ “headings”.
 *
 * @example {"name": "valid.md"}
 *
 *   ###### Alpha
 *
 *   Bravo.
 *
 * @example {"name": "invalid.md", "label": "input"}
 *
 *   ####### Charlie
 *
 *   Delta.
 *
 * @example {"name": "invalid.md", "label": "output"}
 *
 *   1:1-1:16: This looks like a heading but has too many hashes
 */

'use strict';

var rule = require('unified-lint-rule');
var visit = require('unist-util-visit');
var generated = require('unist-util-generated');

module.exports = rule('remark-lint:no-heading-like-paragraph', noHeadingLikeParagraph);

var fence = '#######';

function noHeadingLikeParagraph(tree, file) {
  visit(tree, 'paragraph', visitor);

  function visitor(node) {
    var head = node.children[0];

    if (
      head &&
      head.type === 'text' &&
      head.value.slice(0, fence.length) === fence &&
      !generated(node)
    ) {
      file.message('This looks like a heading but has too many hashes', node);
    }
  }
}

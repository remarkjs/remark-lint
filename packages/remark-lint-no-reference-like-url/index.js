/**
 * @author Titus Wormer
 * @copyright 2016 Titus Wormer
 * @license MIT
 * @module no-reference-like-url
 * @fileoverview
 *   Warn when URLs are also defined identifiers.
 *
 * @example {"name": "valid.md"}
 *
 *   [Alpha](http://example.com).
 *
 *   [bravo]: https://example.com
 *
 * @example {"name": "invalid.md", "label": "input"}
 *
 *   [Charlie](delta).
 *
 *   [delta]: https://example.com
 *
 * @example {"name": "invalid.md", "label": "output"}
 *
 *   1:1-1:17: Did you mean to use `[delta]` instead of `(delta)`, a reference?
 */

'use strict';

var rule = require('unified-lint-rule');
var generated = require('unist-util-generated');
var visit = require('unist-util-visit');

module.exports = rule('remark-lint:no-reference-like-url', noReferenceLikeURL);

function noReferenceLikeURL(tree, file) {
  var identifiers = [];

  visit(tree, 'definition', find);

  visit(tree, 'image', check);
  visit(tree, 'link', check);

  return;

  /* Find identifiers. */
  function find(node) {
    if (!generated(node)) {
      identifiers.push(node.identifier.toLowerCase());
    }
  }

  /* Check `node`. */
  function check(node) {
    var url = node.url;

    if (identifiers.indexOf(url.toLowerCase()) !== -1) {
      file.message(
        'Did you mean to use `[' + url + ']` instead of ' +
        '`(' + url + ')`, a reference?',
        node
      );
    }
  }
}

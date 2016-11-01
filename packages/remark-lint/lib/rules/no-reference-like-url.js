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

/* Dependencies. */
var position = require('unist-util-position');
var visit = require('unist-util-visit');

/* Expose. */
module.exports = noReferenceLikeURL;

/**
 * Warn when unused definitions are found.
 *
 * @param {Node} ast - Root node.
 * @param {File} file - Virtual file.
 */
function noReferenceLikeURL(tree, file) {
  var identifiers = [];

  visit(tree, 'definition', find);

  visit(tree, 'image', check);
  visit(tree, 'link', check);

  return;

  /* Find identifiers. */
  function find(node) {
    if (!position.generated(node)) {
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

/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module no-shortcut-reference-link
 * @fileoverview
 *   Warn when shortcut reference links are used.
 * @example
 *   <!-- Invalid: -->
 *   [foo]
 *
 *   [foo]: http://foo.bar/baz
 *
 *   <!-- Valid: -->
 *   [foo][]
 *
 *   [foo]: http://foo.bar/baz
 */

'use strict';

/* Dependencies. */
var visit = require('unist-util-visit');
var position = require('unist-util-position');

/* Expose. */
module.exports = noShortcutReferenceLink;

/**
 * Warn when shortcut reference links are used.
 *
 * @param {Node} ast - Root node.
 * @param {File} file - Virtual file.
 */
function noShortcutReferenceLink(ast, file) {
  visit(ast, 'linkReference', function (node) {
    if (position.generated(node)) {
      return;
    }

    if (node.referenceType === 'shortcut') {
      file.warn('Use the trailing [] on reference links', node);
    }
  });
}

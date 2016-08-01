/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module no-shortcut-reference-image
 * @fileoverview
 *   Warn when shortcut reference images are used.
 * @example
 *   <!-- Invalid: -->
 *   ![foo]
 *
 *   [foo]: http://foo.bar/baz.png
 *
 *   <!-- Valid: -->
 *   ![foo][]
 *
 *   [foo]: http://foo.bar/baz.png
 */

'use strict';

/* Dependencies. */
var visit = require('unist-util-visit');
var position = require('unist-util-position');

/* Expose. */
module.exports = noShortcutReferenceImage;

/**
 * Warn when shortcut reference images are used.
 *
 * @param {Node} ast - Root node.
 * @param {File} file - Virtual file.
 */
function noShortcutReferenceImage(ast, file) {
  visit(ast, 'imageReference', function (node) {
    if (position.generated(node)) {
      return;
    }

    if (node.referenceType === 'shortcut') {
      file.warn('Use the trailing [] on reference images', node);
    }
  });
}

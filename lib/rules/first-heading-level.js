/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module first-heading-level
 * @fileoverview
 *   Warn when the first heading has a level other than a specified value.
 *
 *   Options: `number`, default: `1`.
 * @example
 *   <!-- Valid, when set to `1` -->
 *   # Foo
 *
 *   ## Bar
 *
 *   <!-- Invalid, when set to `1` -->
 *   ## Foo
 *
 *   # Bar
 */

'use strict';

/* Dependencies. */
var visit = require('unist-util-visit');
var position = require('unist-util-position');

/* Expose. */
module.exports = firstHeadingLevel;

/**
 * Warn when the first heading has a level other than a specified value.
 *
 * @param {Node} ast - Root node.
 * @param {File} file - Virtual file.
 * @param {number?} [preferred=1] - First heading level.
 */
function firstHeadingLevel(ast, file, preferred) {
  var style = preferred && preferred !== true ? preferred : 1;

  visit(ast, 'heading', function (node) {
    if (position.generated(node)) {
      return;
    }

    if (node.depth !== style) {
      file.warn('First heading level should be `' + style + '`', node);
    }

    return false;
  });
}

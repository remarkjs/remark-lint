/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module final-definition
 * @fileoverview
 *   Warn when definitions are not placed at the end of the file.
 * @example
 *   <!-- Valid: -->
 *   ...
 *
 *   [example] http://example.com "Example Domain"
 *
 *   <!-- Invalid: -->
 *   ...
 *
 *   [example] http://example.com "Example Domain"
 *
 *   A trailing paragraph.
 */

'use strict';

/* Dependencies. */
var visit = require('unist-util-visit');
var position = require('unist-util-position');

/* Expose. */
module.exports = finalDefinition;

/* Methods. */
var start = position.start;

/**
 * Warn when definitions are not placed at the end of
 * the file.
 *
 * @param {Node} ast - Root node.
 * @param {File} file - Virtual file.
 */
function finalDefinition(ast, file) {
  var last = null;

  visit(ast, function (node) {
    var line = start(node).line;

    /* Ignore generated nodes. */
    if (node.type === 'root' || position.generated(node)) {
      return;
    }

    if (node.type === 'definition') {
      if (last !== null && last > line) {
        file.warn('Move definitions to the end of the file (after the node at line `' + last + '`)', node);
      }
    } else if (last === null) {
      last = line;
    }
  }, true);
}

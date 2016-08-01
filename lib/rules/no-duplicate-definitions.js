/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module no-duplicate-definitions
 * @fileoverview
 *   Warn when duplicate definitions are found.
 * @example
 *   <!-- Valid: -->
 *   [foo]: bar
 *   [baz]: qux
 *
 *   <!-- Invalid: -->
 *   [foo]: bar
 *   [foo]: qux
 */

'use strict';

/* Dependencies. */
var position = require('unist-util-position');
var visit = require('unist-util-visit');

/* Expose. */
module.exports = noDuplicateDefinitions;

/**
 * Warn when definitions with equal content are found.
 *
 * Matches case-insensitive.
 *
 * @param {Node} ast - Root node.
 * @param {File} file - Virtual file.
 */
function noDuplicateDefinitions(ast, file) {
  var map = {};

  visit(ast, 'definition', validate);
  visit(ast, 'footnoteDefinition', validate);

  return;

  /**
   * Check `node`.
   *
   * @param {Node} node - Node.
   */
  function validate(node) {
    var duplicate = map[node.identifier];
    var pos;

    if (position.generated(node)) {
      return;
    }

    if (duplicate && duplicate.type) {
      pos = position.start(duplicate);

      file.warn(
        'Do not use definitions with the same identifier (' +
        pos.line + ':' + pos.column + ')',
        node
      );
    }

    map[node.identifier] = node;
  }
}

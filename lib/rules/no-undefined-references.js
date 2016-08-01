/**
 * @author Titus Wormer
 * @copyright 2016 Titus Wormer
 * @license MIT
 * @module no-unused-definitions
 * @fileoverview
 *   Warn when references to undefined definitions are found.
 * @example
 *   <!-- Valid: -->
 *   [foo][]
 *
 *   [foo]: https://example.com
 *
 *   <!-- Invalid: -->
 *   [bar][]
 */

'use strict';

/* Dependencies. */
var position = require('unist-util-position');
var visit = require('unist-util-visit');

/* Expose. */
module.exports = noUnusedDefinitions;

/**
 * Warn when references to undefined definitions are found.
 *
 * @param {Node} ast - Root node.
 * @param {File} file - Virtual file.
 */
function noUnusedDefinitions(ast, file) {
  var map = {};

  visit(ast, 'definition', mark);
  visit(ast, 'footnoteDefinition', mark);

  visit(ast, 'imageReference', find);
  visit(ast, 'linkReference', find);
  visit(ast, 'footnoteReference', find);

  return;

  /**
   * Check `node`.
   *
   * @param {Node} node - Node.
   */
  function mark(node) {
    if (position.generated(node)) {
      return;
    }

    map[node.identifier.toUpperCase()] = true;
  }

  /**
   * Mark `node`.
   *
   * @param {Node} node - Node.
   */
  function find(node) {
    if (position.generated(node)) {
      return;
    }

    if (!map[node.identifier.toUpperCase()]) {
      file.warn('Found reference to undefined definition', node);
    }
  }
}

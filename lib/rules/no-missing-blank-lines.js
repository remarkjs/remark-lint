/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module no-missing-blank-lines
 * @fileoverview
 *   Warn for missing blank lines before a block node.
 * @example
 *   <!-- Invalid: -->
 *   # Foo
 *   ## Bar
 *
 *   <!-- Valid: -->
 *   # Foo
 *
 *   ## Bar
 */

'use strict';

/* Dependencies. */
var visit = require('unist-util-visit');
var position = require('unist-util-position');

/* Expose. */
module.exports = noMissingBlankLines;

/**
 * Warn when there is no empty line between two block
 * nodes.
 *
 * @param {Node} ast - Root node.
 * @param {File} file - Virtual file.
 */
function noMissingBlankLines(ast, file) {
  visit(ast, function (node, index, parent) {
    var next = parent && parent.children[index + 1];

    if (position.generated(node)) {
      return;
    }

    if (
      next &&
      isApplicable(node) &&
      isApplicable(next) &&
      position.start(next).line === position.end(node).line + 1
    ) {
      file.warn('Missing blank line before block node', next);
    }
  });
}

/**
 * Check if `node` is an applicable block-level node.
 *
 * @param {Node} node - Node to test.
 * @return {boolean} - Whether or not `node` is applicable.
 */
function isApplicable(node) {
  return [
    'paragraph',
    'blockquote',
    'heading',
    'code',
    'yaml',
    'html',
    'list',
    'table',
    'thematicBreak'
  ].indexOf(node.type) !== -1;
}

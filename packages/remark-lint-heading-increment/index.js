/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module heading-increment
 * @fileoverview
 *   Warn when headings increment with more than 1 level at a time.
 *
 * @example {"name": "valid.md"}
 *
 *   # Alpha
 *
 *   ## Bravo
 *
 * @example {"name": "invalid.md", "label": "input"}
 *
 *   # Charlie
 *
 *   ### Delta
 *
 * @example {"name": "invalid.md", "label": "output"}
 *
 *   3:1-3:10: Heading levels should increment by one level at a time
 */

'use strict';

var rule = require('unified-lint-rule');
var visit = require('unist-util-visit');
var generated = require('unist-util-generated');

module.exports = rule('remark-lint:heading-increment', headingIncrement);

function headingIncrement(ast, file) {
  var prev = null;

  visit(ast, 'heading', visitor);

  function visitor(node) {
    var depth = node.depth;

    if (generated(node)) {
      return;
    }

    if (prev && depth > prev + 1) {
      file.message('Heading levels should increment by one level at a time', node);
    }

    prev = depth;
  }
}

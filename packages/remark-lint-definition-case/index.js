/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module definition-case
 * @fileoverview
 *   Warn when definition labels are not lower-case.
 *
 * @example {"name": "valid.md"}
 *
 *   [example]: http://example.com "Example Domain"
 *
 * @example {"name": "invalid.md", "label": "input"}
 *
 *   [Example]: http://example.com "Example Domain"
 *
 * @example {"name": "invalid.md", "label": "output"}
 *
 *   1:1-1:47: Do not use upper-case characters in definition labels
 */

'use strict';

var rule = require('unified-lint-rule');
var visit = require('unist-util-visit');
var position = require('unist-util-position');
var generated = require('unist-util-generated');

module.exports = rule('remark-lint:definition-case', definitionCase);

var LABEL = /^\s*\[((?:\\[\s\S]|[^[\]])+)]/;

function definitionCase(tree, file) {
  var contents = file.toString();

  visit(tree, 'definition', validate);
  visit(tree, 'footnoteDefinition', validate);

  return;

  /* Validate a node, either a normal definition or
   * a footnote definition. */
  function validate(node) {
    var start = position.start(node).offset;
    var end = position.end(node).offset;
    var label;

    if (generated(node)) {
      return;
    }

    label = contents.slice(start, end).match(LABEL)[1];

    if (label !== label.toLowerCase()) {
      file.message('Do not use upper-case characters in definition labels', node);
    }
  }
}

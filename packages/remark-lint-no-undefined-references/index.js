/**
 * @author Titus Wormer
 * @copyright 2016 Titus Wormer
 * @license MIT
 * @module no-undefined-references
 * @fileoverview
 *   Warn when references to undefined definitions are found.
 *
 * @example {"name": "valid.md"}
 *
 *   [foo][]
 *
 *   [foo]: https://example.com
 *
 * @example {"name": "invalid.md", "label": "input"}
 *
 *   [bar][]
 *
 * @example {"name": "invalid.md", "label": "output"}
 *
 *   1:1-1:8: Found reference to undefined definition
 */

'use strict';

var rule = require('unified-lint-rule');
var generated = require('unist-util-generated');
var visit = require('unist-util-visit');

module.exports = rule('remark-lint:no-undefined-references', noUndefinedReferences);

function noUndefinedReferences(ast, file) {
  var map = {};

  visit(ast, 'definition', mark);
  visit(ast, 'footnoteDefinition', mark);

  visit(ast, 'imageReference', find);
  visit(ast, 'linkReference', find);
  visit(ast, 'footnoteReference', find);

  function mark(node) {
    if (!generated(node)) {
      map[node.identifier.toUpperCase()] = true;
    }
  }

  function find(node) {
    if (!generated(node) && !map[node.identifier.toUpperCase()]) {
      file.message('Found reference to undefined definition', node);
    }
  }
}

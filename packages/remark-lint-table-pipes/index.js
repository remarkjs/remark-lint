/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module table-pipes
 * @fileoverview
 *   Warn when table rows are not fenced with pipes.
 *
 *   ## Fix
 *
 *   [`remark-stringify`](https://github.com/remarkjs/remark/tree/master/packages/remark-stringify)
 *   creates fenced rows with initial and final pipes by default. Pass
 *   [`looseTable: true`](https://github.com/remarkjs/remark/tree/master/packages/remark-stringify#optionsloosetable)
 *   to not use row fences.
 *
 *   See [Using remark to fix your markdown](https://github.com/remarkjs/remark-lint#using-remark-to-fix-your-markdown)
 *   on how to automatically fix warnings for this rule.
 *
 * @example {"name": "valid.md"}
 *
 *   | A     | B     |
 *   | ----- | ----- |
 *   | Alpha | Bravo |
 *
 * @example {"name": "invalid.md", "label": "input"}
 *
 *   A     | B
 *   ----- | -----
 *   Alpha | Bravo
 *
 * @example {"name": "invalid.md", "label": "output"}
 *
 *   1:1: Missing initial pipe in table fence
 *   1:10: Missing final pipe in table fence
 *   3:1: Missing initial pipe in table fence
 *   3:14: Missing final pipe in table fence
 */

'use strict';

var rule = require('unified-lint-rule');
var visit = require('unist-util-visit');
var position = require('unist-util-position');
var generated = require('unist-util-generated');

module.exports = rule('remark-lint:table-pipes', tablePipes);

var start = position.start;
var end = position.end;

function tablePipes(ast, file) {
  visit(ast, 'table', visitor);

  function visitor(node) {
    var contents = file.toString();

    node.children.forEach(visitRow);

    function visitRow(row) {
      var cells = row.children;
      var head = cells[0];
      var tail = cells[cells.length - 1];
      var initial = contents.slice(start(row).offset, start(head).offset);
      var final = contents.slice(end(tail).offset, end(row).offset);

      if (generated(row)) {
        return;
      }

      if (initial.indexOf('|') === -1) {
        file.message('Missing initial pipe in table fence', start(row));
      }

      if (final.indexOf('|') === -1) {
        file.message('Missing final pipe in table fence', end(row));
      }
    }
  }
}

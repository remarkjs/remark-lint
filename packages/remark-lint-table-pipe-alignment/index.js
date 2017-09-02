/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module table-pipe-alignment
 * @fileoverview
 *   Warn when table pipes are not aligned.
 *
 *   ## Fix
 *
 *   [`remark-stringify`](https://github.com/wooorm/remark/tree/master/packages/remark-stringify)
 *   tries to align tables by default. Pass
 *   [`paddedTable: false`](https://github.com/wooorm/remark/tree/master/packages/remark-stringify#optionspaddedtable)
 *   to not align cells.
 *
 *   Aligning cells perfectly is impossible as some characters (such as emoji or
 *   Chinese characters) are rendered differently in different browsers, terminals,
 *   and editors. You can pass your own
 *   [`stringLength`](https://github.com/wooorm/remark/tree/master/packages/remark-stringify#optionsstringlength)
 *   function to customize how cells are aligned. In which case this rule must
 *   be turned off.
 *
 *   See [Using remark to fix your markdown](https://github.com/wooorm/remark-lint/tree/formatting#using-remark-to-fix-your-markdown)
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
 *   | A | B |
 *   | -- | -- |
 *   | Alpha | Bravo |
 *
 * @example {"name": "invalid.md", "label": "output"}
 *
 *   3:9-3:10: Misaligned table fence
 *   3:17-3:18: Misaligned table fence
 */

'use strict';

var rule = require('unified-lint-rule');
var visit = require('unist-util-visit');
var position = require('unist-util-position');
var generated = require('unist-util-generated');

module.exports = rule('remark-lint:table-pipe-alignment', tablePipeAlignment);

var start = position.start;
var end = position.end;

function tablePipeAlignment(ast, file) {
  visit(ast, 'table', visitor);

  function visitor(node) {
    var contents = file.toString();
    var indices = [];
    var offset;
    var line;

    if (generated(node)) {
      return;
    }

    node.children.forEach(visitRow);

    function visitRow(row) {
      var cells = row.children;

      line = start(row).line;
      offset = start(row).offset;

      check(start(row).offset, start(cells[0]).offset, 0);

      row.children.forEach(visitCell);

      function visitCell(cell, index) {
        var next = start(cells[index + 1]).offset || end(row).offset;

        check(end(cell).offset, next, index + 1);
      }
    }

    /* Check that all pipes after each column are at
     * aligned. */
    function check(initial, final, index) {
      var pos = initial + contents.slice(initial, final).indexOf('|') - offset + 1;

      if (indices[index] === undefined || indices[index] === null) {
        indices[index] = pos;
      } else if (pos !== indices[index]) {
        file.message('Misaligned table fence', {
          start: {line: line, column: pos},
          end: {line: line, column: pos + 1}
        });
      }
    }
  }
}

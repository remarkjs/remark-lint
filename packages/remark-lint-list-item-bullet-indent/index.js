/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module list-item-bullet-indent
 * @fileoverview
 *   Warn when list item bullets are indented.
 *
 * @example {"name": "valid.md"}
 *
 *   Paragraph.
 *
 *   * List item
 *   * List item
 *
 * @example {"name": "invalid.md", "label": "input"}
 *
 *   Paragraph.
 *
 *    * List item
 *    * List item
 *
 * @example {"name": "invalid.md", "label": "output"}
 *
 *   3:3: Incorrect indentation before bullet: remove 1 space
 *   4:3: Incorrect indentation before bullet: remove 1 space
 */

'use strict';

var rule = require('unified-lint-rule');
var plural = require('plur');
var visit = require('unist-util-visit');
var position = require('unist-util-position');
var generated = require('unist-util-generated');

module.exports = rule('remark-lint:list-item-bullet-indent', listItemBulletIndent);

var start = position.start;

function listItemBulletIndent(ast, file) {
  var contents = file.toString();

  visit(ast, 'list', visitor);

  function visitor(node) {
    var items = node.children;

    items.forEach(visitItems);
  }

  function visitItems(item) {
    var head = item.children[0];
    var initial = start(item).offset;
    var final = start(head).offset;
    var indent;

    if (generated(item)) {
      return;
    }

    indent = contents.slice(initial, final).match(/^\s*/)[0].length;

    if (indent !== 0) {
      initial = start(head);

      file.message('Incorrect indentation before bullet: remove ' + indent + ' ' + plural('space', indent), {
        line: initial.line,
        column: initial.column - indent
      });
    }
  }
}

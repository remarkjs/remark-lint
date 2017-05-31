/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module list-item-spacing
 * @fileoverview
 *   Warn when list looseness is incorrect, such as being tight
 *   when it should be loose, and vice versa.
 *
 *   Options: optional `Object`.
 *
 *   According to the [markdown-style-guide](http://www.cirosantilli.com/markdown-style-guide/),
 *   if one or more list-items in a list spans more than one line,
 *   the list is required to have blank lines between each item.
 *   And otherwise, there should not be blank lines between items.
 *
 *   Note: this applies to nested-lists too, to disable this behavior
 *   set `forceNestedToLoose` to false.
 *
 * @example {"name": "valid.md"}
 *
 *   A tight list:
 *
 *   -   item 1
 *   -   item 2
 *   -   item 3
 *
 *   A loose list:
 *
 *   -   Wrapped
 *       item
 *
 *   -   item 2
 *
 *   -   item 3
 *
 *   A nested list:
 *
 *   -   item 1
 *
 *       - item 1.1
 *       - item 1.2
 *
 *   -   item 2
 *
 *   -   item 3
 *
 * @example {"name": "invalid.md", "label": "input"}
 *
 *   A tight list:
 *
 *   -   Wrapped
 *       item
 *   -   item 2
 *   -   item 3
 *
 *   A loose list:
 *
 *   -   item 1
 *
 *   -   item 2
 *
 *   -   item 3
 *
 *   A nested list:
 *
 *   -   item 1
 *       - item 1.1
 *       - item 1.2
 *   -   item 2
 *   -   item 3
 *
 * @example {"name": "invalid.md", "label": "output"}
 *
 *   4:9-5:1: Missing new line after list item
 *   5:11-6:1: Missing new line after list item
 *   11:1-12:1: Extraneous new line after list item
 *   13:1-14:1: Extraneous new line after list item
 *   20:15-21:1: Missing new line after list item
 *   21:11-22:1: Missing new line after list item
 *
 * @example {"name": "valid.md", "setting": {"forceNestedToLoose": false}}
 *
 *   A tight list:
 *
 *   -   item 1
 *   -   item 2
 *   -   item 3
 *
 *   A loose list:
 *
 *   -   Wrapped
 *       item
 *
 *   -   item 2
 *
 *   -   item 3
 *
 *   A nested list:
 *
 *   -   item 1
 *       - item 1.1
 *       - item 1.2
 *   -   item 2
 *   -   item 3
 */

'use strict';

var rule = require('unified-lint-rule');
var visit = require('unist-util-visit');
var position = require('unist-util-position');
var generated = require('unist-util-generated');

module.exports = rule('remark-lint:list-item-spacing', listItemSpacing);

var start = position.start;
var end = position.end;

function listItemSpacing(ast, file, preferred) {
  var forceNestedToLoose = true;

  if (typeof preferred === 'object' && !('length' in preferred)) {
    forceNestedToLoose = Boolean(preferred.forceNestedToLoose);
  }

  visit(ast, 'list', visitor);

  function visitor(node) {
    var items = node.children;
    var isTightList = true;
    var indent = start(node).column;
    var type;

    if (generated(node)) {
      return;
    }

    items.forEach(infer);

    type = isTightList ? 'tight' : 'loose';

    items.forEach(warn);

    function infer(item) {
      var content = item.children;
      var head = content[0];
      var tail = content[content.length - 1];

      if (!forceNestedToLoose &&
        content.length === 2 &&
        content[0].type === 'paragraph' &&
        content[1].type === 'list'
      ) {
        tail = content[0];
      }

      var isLoose = (end(tail).line - start(head).line) > 0;

      if (isLoose) {
        isTightList = false;
      }
    }

    function warn(item, index) {
      var next = items[index + 1];
      var isTight = end(item).column > indent;

      /* Ignore last. */
      if (!next) {
        return;
      }

      /* Check if the list item's state does (not)
       * match the list's state. */
      if (isTight !== isTightList) {
        if (type === 'loose') {
          file.message('Missing new line after list item', {
            start: end(item),
            end: start(next)
          });
        } else {
          file.message('Extraneous new line after list item', {
            start: end(item),
            end: start(next)
          });
        }
      }
    }
  }
}

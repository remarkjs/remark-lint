/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module list-item-bullet-indent
 * @fileoverview
 *   Warn when list item bullets are indented.
 *
 *   ## Fix
 *
 *   [`remark-stringify`](https://github.com/remarkjs/remark/tree/HEAD/packages/remark-stringify)
 *   removes all indentation before bullets.
 *
 *   See [Using remark to fix your Markdown](https://github.com/remarkjs/remark-lint#using-remark-to-fix-your-markdown)
 *   on how to automatically fix warnings for this rule.
 *
 * @example {"name": "ok.md"}
 *
 *   Paragraph.
 *
 *   * List item
 *   * List item
 *
 * @example {"name": "not-ok.md", "label": "input"}
 *
 *   Paragraph.
 *
 *   ·* List item
 *   ·* List item
 *
 * @example {"name": "not-ok.md", "label": "output"}
 *
 *   3:2: Incorrect indentation before bullet: remove 1 space
 *   4:2: Incorrect indentation before bullet: remove 1 space
 */

'use strict'

var rule = require('unified-lint-rule')
var plural = require('pluralize')
var visit = require('unist-util-visit')
var generated = require('unist-util-generated')

module.exports = rule(
  'remark-lint:list-item-bullet-indent',
  listItemBulletIndent
)

function listItemBulletIndent(tree, file) {
  visit(tree, 'list', visitor)

  function visitor(list, _, grandparent) {
    list.children.forEach(visitItems)

    function visitItems(item) {
      var indent
      var reason

      if (
        grandparent &&
        grandparent.type === 'root' &&
        !generated(item) &&
        !generated(grandparent)
      ) {
        indent = item.position.start.column - grandparent.position.start.column

        if (indent) {
          reason =
            'Incorrect indentation before bullet: remove ' +
            indent +
            ' ' +
            plural('space', indent)

          file.message(reason, item.position.start)
        }
      }
    }
  }
}

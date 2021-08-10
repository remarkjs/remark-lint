/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module list-item-content-indent
 * @fileoverview
 *   Warn when the content of a list item has mixed indentation.
 *
 * @example {"name": "ok.md", "gfm": true}
 *
 *   1.·[x] Alpha
 *   ···1. Bravo
 *
 * @example {"name": "not-ok.md", "label": "input", "gfm": true}
 *
 *   1.·[x] Charlie
 *   ····1. Delta
 *
 * @example {"name": "not-ok.md", "label": "output", "gfm": true}
 *
 *   2:5: Don’t use mixed indentation for children, remove 1 space
 */

import {lintRule} from 'unified-lint-rule'
import plural from 'pluralize'
import visit from 'unist-util-visit'
import position from 'unist-util-position'
import generated from 'unist-util-generated'

const remarkLintListItemContentIndent = lintRule(
  'remark-lint:list-item-content-indent',
  listItemContentIndent
)

export default remarkLintListItemContentIndent

var start = position.start

function listItemContentIndent(tree, file) {
  var contents = String(file)

  visit(tree, 'listItem', visitor)

  function visitor(node) {
    var style

    node.children.forEach(visitInItem)

    function visitInItem(item, index) {
      var begin
      var column
      var char
      var diff
      var reason
      var abs

      if (generated(item)) {
        return
      }

      begin = start(item)
      column = begin.column

      // Get indentation for the first child.  Only the first item can have a
      // checkbox, so here we remove that from the column.
      if (index === 0) {
        // If there’s a checkbox before the content, look backwards to find the
        // start of that checkbox.
        if (typeof node.checked === 'boolean') {
          char = begin.offset - 1

          while (char > 0 && contents.charAt(char) !== '[') {
            char--
          }

          column -= begin.offset - char
        }

        style = column

        return
      }

      // Warn for violating children.
      if (column !== style) {
        diff = style - column
        abs = Math.abs(diff)

        reason =
          'Don’t use mixed indentation for children, ' +
          // Hard to test, I couldn’t find it at least.
          /* c8 ignore next */
          (diff > 0 ? 'add' : 'remove') +
          ' ' +
          abs +
          ' ' +
          plural('space', abs)

        file.message(reason, {
          line: start(item).line,
          column: column
        })
      }
    }
  }
}

/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module no-table-indentation
 * @fileoverview
 *   Warn when tables are indented.
 *
 *   ## Fix
 *
 *   [`remark-stringify`](https://github.com/remarkjs/remark/tree/HEAD/packages/remark-stringify)
 *   removes all unneeded indentation before tables.
 *
 *   See [Using remark to fix your Markdown](https://github.com/remarkjs/remark-lint#using-remark-to-fix-your-markdown)
 *   on how to automatically fix warnings for this rule.
 *
 * @example {"name": "ok.md", "gfm": true}
 *
 *   Paragraph.
 *
 *   | A     | B     |
 *   | ----- | ----- |
 *   | Alpha | Bravo |
 *
 * @example {"name": "not-ok.md", "label": "input", "gfm": true}
 *
 *   Paragraph.
 *
 *   ···| A     | B     |
 *   ···| ----- | ----- |
 *   ···| Alpha | Bravo |
 *
 * @example {"name": "not-ok.md", "label": "output", "gfm": true}
 *
 *   3:4: Do not indent table rows
 *   4:4: Do not indent table rows
 *   5:4: Do not indent table rows
 *
 * @example {"name": "not-ok-blockquote.md", "label": "input", "gfm": true}
 *
 *   >··| A |
 *   >·| - |
 *
 * @example {"name": "not-ok-blockquote.md", "label": "output", "gfm": true}
 *
 *   1:4: Do not indent table rows
 *
 * @example {"name": "not-ok-list.md", "label": "input", "gfm": true}
 *
 *   -···paragraph
 *
 *   ·····| A |
 *   ····| - |
 *
 * @example {"name": "not-ok-list.md", "label": "output", "gfm": true}
 *
 *   3:6: Do not indent table rows
 */

'use strict'

var rule = require('unified-lint-rule')
var visit = require('unist-util-visit')
var position = require('unist-util-position')
var vfileLocation = require('vfile-location')

module.exports = rule('remark-lint:no-table-indentation', noTableIndentation)

var reason = 'Do not indent table rows'

function noTableIndentation(tree, file) {
  var content = String(file)
  var location = vfileLocation(content)

  visit(tree, 'table', visitor)

  function visitor(node, _, parent) {
    var line = position.start(node).line
    var end = position.end(node).line
    var column
    var offset
    var lineColumn

    /* istanbul ignore else - Custom nodes may be containers. */
    if (parent && parent.type === 'root') {
      column = 1
    } else if (parent && parent.type === 'blockquote') {
      column = position.start(parent).column + 2
    } else if (parent && parent.type === 'listItem') {
      column = position.start(parent.children[0]).column

      // Skip past the first line if we’re the first child of a list item.
      if (parent.children[0] === node) {
        line++
      }
    }

    // In a parent we don’t know, exit.
    if (!column || !line) {
      return
    }

    while (line <= end) {
      offset = location.toOffset({line: line, column: column})
      lineColumn = offset

      while (/[ \t]/.test(content.charAt(offset - 1))) {
        offset--
      }

      /* istanbul ignore else - Exit if we find some other content before this
       * line.
       * This might be because the paragraph line is lazy, which isn’t this
       * rule. */
      if (!offset || /[\r\n>]/.test(content.charAt(offset - 1))) {
        offset = lineColumn

        while (/[ \t]/.test(content.charAt(offset))) {
          offset++
        }

        if (lineColumn !== offset) {
          file.message(reason, location.toPosition(offset))
        }
      }

      line++
    }

    return visit.SKIP
  }
}

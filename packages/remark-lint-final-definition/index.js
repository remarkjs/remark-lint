/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module final-definition
 * @fileoverview
 *   Warn when definitions are placed somewhere other than at the end of
 *   the file.
 *
 * @example {"name": "ok.md"}
 *
 *   Paragraph.
 *
 *   [example]: http://example.com "Example Domain"
 *
 * @example {"name": "not-ok.md", "label": "input"}
 *
 *   Paragraph.
 *
 *   [example]: http://example.com "Example Domain"
 *
 *   Another paragraph.
 *
 * @example {"name": "not-ok.md", "label": "output"}
 *
 *   3:1-3:47: Move definitions to the end of the file (after the node at line `5`)
 *
 * @example {"name": "ok-comments.md"}
 *
 *   Paragraph.
 *
 *   [example-1]: http://example.com/one/
 *
 *   <!-- Comments are fine between and after definitions -->
 *
 *   [example-2]: http://example.com/two/
 */

'use strict'

var rule = require('unified-lint-rule')
var visit = require('unist-util-visit')
var position = require('unist-util-position')
var generated = require('unist-util-generated')

module.exports = rule('remark-lint:final-definition', finalDefinition)

var start = position.start

function finalDefinition(tree, file) {
  var last = null

  visit(tree, visitor, true)

  function visitor(node) {
    var line = start(node).line

    // Ignore generated and HTML comment nodes.
    if (node.type === 'root' || generated(node) || (node.type === 'html' && /^\s*<!--/.test(node.value))) {
      return
    }

    if (node.type === 'definition') {
      if (last !== null && last > line) {
        file.message(
          'Move definitions to the end of the file (after the node at line `' +
            last +
            '`)',
          node
        )
      }
    } else if (last === null) {
      last = line
    }
  }
}

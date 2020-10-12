/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module no-blockquote-without-marker
 * @fileoverview
 *   Warn when blank lines without `>` (greater than) markers are found in a
 *   block quote.
 *
 *   ## Fix
 *
 *   [`remark-stringify`](https://github.com/remarkjs/remark/tree/HEAD/packages/remark-stringify)
 *   adds markers to every line in a block quote.
 *
 *   See [Using remark to fix your Markdown](https://github.com/remarkjs/remark-lint#using-remark-to-fix-your-markdown)
 *   on how to automatically fix warnings for this rule.
 *
 * @example {"name": "ok.md"}
 *
 *   > Foo…
 *   > …bar…
 *   > …baz.
 *
 * @example {"name": "ok-tabs.md"}
 *
 *   >»Foo…
 *   >»…bar…
 *   >»…baz.
 *
 * @example {"name": "not-ok.md", "label": "input"}
 *
 *   > Foo…
 *   …bar…
 *   > …baz.
 *
 * @example {"name": "not-ok.md", "label": "output"}
 *
 *   2:1: Missing marker in block quote
 *
 * @example {"name": "not-ok-tabs.md", "label": "input"}
 *
 *   >»Foo…
 *   »…bar…
 *   …baz.
 *
 * @example {"name": "not-ok-tabs.md", "label": "output"}
 *
 *   2:1: Missing marker in block quote
 *   3:1: Missing marker in block quote
 */

'use strict'

var rule = require('unified-lint-rule')
var vfileLocation = require('vfile-location')
var visit = require('unist-util-visit')
var position = require('unist-util-position')
var generated = require('unist-util-generated')

module.exports = rule(
  'remark-lint:no-blockquote-without-marker',
  noBlockquoteWithoutMarker
)

var reason = 'Missing marker in block quote'

function noBlockquoteWithoutMarker(tree, file) {
  var contents = String(file)
  var location = vfileLocation(file)

  visit(tree, 'blockquote', visitor)

  function onquotedchild(node) {
    var line
    var end
    var column
    var offset

    if (node.type === 'paragraph' && !generated(node)) {
      line = position.start(node).line
      end = position.end(node).line
      column = position.start(node).column

      // Skip past the first line.
      while (++line <= end) {
        offset = location.toOffset({line: line, column: column})

        if (/>[\t ]+$/.test(contents.slice(offset - 5, offset))) {
          continue
        }

        // Roughly here.
        file.message(reason, {line: line, column: column - 2})
      }
    }
  }

  function visitor(node) {
    node.children.forEach(onquotedchild)
  }
}

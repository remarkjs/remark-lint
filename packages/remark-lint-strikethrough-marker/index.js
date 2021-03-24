/**
 * @author Denis Augsburger
 * @copyright 2021 Denis Augsburger
 * @license MIT
 * @module strikethrough-marker
 * @fileoverview
 *   Warn for violating strikethrough markers.
 *
 *   Options: `'consistent'`, `'~'`, or `'~~'`, default: `'consistent'`.
 *
 *   `'consistent'` detects the first used strikethrough style and warns when
 *   subsequent strikethrough use different styles.
 *
 *   ## Fix
 *
 *   See [Using remark to fix your Markdown](https://github.com/remarkjs/remark-lint#using-remark-to-fix-your-markdown)
 *   on how to automatically fix warnings for this rule.
 *
 * @example {"setting": "~", "name": "ok.md"}
 *
 *   ~foo~
 *
 * @example {"setting": "~", "name": "not-ok.md", "label": "input"}
 *
 *   ~~foo~~
 *
 * @example {"setting": "~", "name": "not-ok.md", "label": "output"}
 *
 *   1:1-1:6: Strikethrough should use `~` as a marker
 *
 * @example {"setting": "~~", "name": "ok.md"}
 *
 *   ~~foo~~
 *
 * @example {"setting": "~~", "name": "not-ok.md", "label": "input"}
 *
 *   ~foo~
 *
 * @example {"setting": "~~", "name": "not-ok.md", "label": "output"}
 *
 *   1:1-1:6: Strikethrough should use `~~` as a marker
 *
 * @example {"name": "not-ok.md", "label": "input"}
 *
 *   ~~foo~~
 *   ~bar~
 *
 * @example {"name": "not-ok.md", "label": "output"}
 *
 *   2:1-2:6: Strikethrough should use `~~` as a marker
 *
 * @example {"setting": "💩", "name": "not-ok.md", "label": "output", "positionless": true}
 *
 *   1:1: Incorrect strikethrough marker `💩`: use either `'consistent'`, `'~'`, or `'~~'`
 */

'use strict'

var rule = require('unified-lint-rule')
var visit = require('unist-util-visit')
var position = require('unist-util-position')
var generated = require('unist-util-generated')

module.exports = rule('remark-lint:strikethrough-marker', strikethroughMarker)

var markers = {null: true, '~': true, '~~': true}

function strikethroughMarker(tree, file, option) {
  var contents = String(file)
  var preferred =
    typeof option === 'string' && option !== 'consistent' ? option : null

  if (markers[preferred] !== true) {
    file.fail(
      'Incorrect strikethrough marker `' +
        preferred +
        "`: use either `'consistent'`, `'~'`, or `'~~'`"
    )
  }

  visit(tree, 'delete', visitor)

  function visitor(node) {
    var marker

    if (!generated(node)) {
      marker = contents.substr(position.start(node).offset, 2) === '~~' ? 
        contents.substr(position.start(node).offset, 2) :
        contents.substr(position.start(node).offset, 1)

      if (preferred) {
        if (marker !== preferred) {
          file.message(
            'Strikethrough should use `' + preferred + '` as a marker',
            node
          )
        }
      } else {
        preferred = marker
      }
    }
  }
}

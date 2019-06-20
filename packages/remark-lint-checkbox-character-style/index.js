/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module checkbox-character-style
 * @fileoverview
 *   Warn when list item checkboxes violate a given style.
 *
 *   Options: `Object` or `'consistent'`, default: `'consistent'`.
 *
 *   `'consistent'` detects the first used checked and unchecked checkbox
 *   styles and warns when subsequent checkboxes use different styles.
 *
 *   Styles can also be passed in like so:
 *
 *   ```js
 *   { checked: 'x', unchecked: ' ' }
 *   ```
 *
 *   ## Fix
 *
 *   [`remark-stringify`](https://github.com/remarkjs/remark/tree/master/packages/remark-stringify)
 *   formats checked checkboxes using `x` (lowercase X) and unchecked checkboxes
 *   as `·` (a single space).
 *
 *   See [Using remark to fix your Markdown](https://github.com/remarkjs/remark-lint#using-remark-to-fix-your-markdown)
 *   on how to automatically fix warnings for this rule.
 *
 * @example {"name": "valid.md", "setting": {"checked": "x"}}
 *
 *   - [x] List item
 *   - [x] List item
 *
 * @example {"name": "valid.md", "setting": {"checked": "X"}}
 *
 *   - [X] List item
 *   - [X] List item
 *
 * @example {"name": "valid.md", "setting": {"unchecked": " "}}
 *
 *   - [ ] List item
 *   - [ ] List item
 *   - [ ]··
 *   - [ ]
 *
 * @example {"name": "valid.md", "setting": {"unchecked": "\t"}}
 *
 *   - [»] List item
 *   - [»] List item
 *
 * @example {"name": "invalid.md", "label": "input"}
 *
 *   - [x] List item
 *   - [X] List item
 *   - [ ] List item
 *   - [»] List item
 *
 * @example {"name": "invalid.md", "label": "output"}
 *
 *   2:4-2:5: Checked checkboxes should use `x` as a marker
 *   4:4-4:5: Unchecked checkboxes should use ` ` as a marker
 *
 * @example {"setting": {"unchecked": "!"}, "name": "invalid.md", "label": "output", "config": {"positionless": true}}
 *
 *   1:1: Invalid unchecked checkbox marker `!`: use either `'\t'`, or `' '`
 *
 * @example {"setting": {"checked": "!"}, "name": "invalid.md", "label": "output", "config": {"positionless": true}}
 *
 *   1:1: Invalid checked checkbox marker `!`: use either `'x'`, or `'X'`
 */

'use strict'

var rule = require('unified-lint-rule')
var vfileLocation = require('vfile-location')
var visit = require('unist-util-visit')
var position = require('unist-util-position')
var generated = require('unist-util-generated')

module.exports = rule(
  'remark-lint:checkbox-character-style',
  checkboxCharacterStyle
)

var start = position.start
var end = position.end

var checked = {x: true, X: true}
var unchecked = {' ': true, '\t': true}
var types = {true: 'checked', false: 'unchecked'}

function checkboxCharacterStyle(tree, file, pref) {
  var contents = String(file)
  var location = vfileLocation(file)

  pref = typeof pref === 'object' ? pref : {}

  if (pref.unchecked && unchecked[pref.unchecked] !== true) {
    file.fail(
      'Invalid unchecked checkbox marker `' +
        pref.unchecked +
        "`: use either `'\\t'`, or `' '`"
    )
  }

  if (pref.checked && checked[pref.checked] !== true) {
    file.fail(
      'Invalid checked checkbox marker `' +
        pref.checked +
        "`: use either `'x'`, or `'X'`"
    )
  }

  visit(tree, 'listItem', visitor)

  function visitor(node) {
    var type
    var initial
    var final
    var value
    var style
    var character
    var reason

    // Exit early for items without checkbox.
    if (typeof node.checked !== 'boolean' || generated(node)) {
      return
    }

    type = types[node.checked]
    initial = start(node).offset
    final = (node.children.length === 0 ? end(node) : start(node.children[0]))
      .offset

    // For a checkbox to be parsed, it must be followed by a whitespace.
    value = contents
      .slice(initial, final)
      .trimRight()
      .slice(0, -1)

    // The checkbox character is behind a square bracket.
    character = value.charAt(value.length - 1)
    style = pref[type]

    if (style) {
      if (character !== style) {
        reason =
          type.charAt(0).toUpperCase() +
          type.slice(1) +
          ' checkboxes should use `' +
          style +
          '` as a marker'

        file.message(reason, {
          start: location.toPosition(initial + value.length - 1),
          end: location.toPosition(initial + value.length)
        })
      }
    } else {
      pref[type] = character
    }
  }
}

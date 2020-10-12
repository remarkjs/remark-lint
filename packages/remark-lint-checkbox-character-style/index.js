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
 *   {checked: 'x', unchecked: ' '}
 *   ```
 *
 *   ## Fix
 *
 *   [`remark-stringify`](https://github.com/remarkjs/remark/tree/HEAD/packages/remark-stringify)
 *   formats checked checkboxes using `x` (lowercase X) and unchecked checkboxes
 *   as `·` (a single space).
 *
 *   See [Using remark to fix your Markdown](https://github.com/remarkjs/remark-lint#using-remark-to-fix-your-markdown)
 *   on how to automatically fix warnings for this rule.
 *
 * @example {"name": "ok.md", "setting": {"checked": "x"}, "gfm": true}
 *
 *   - [x] List item
 *   - [x] List item
 *
 * @example {"name": "ok.md", "setting": {"checked": "X"}, "gfm": true}
 *
 *   - [X] List item
 *   - [X] List item
 *
 * @example {"name": "ok.md", "setting": {"unchecked": " "}, "gfm": true}
 *
 *   - [ ] List item
 *   - [ ] List item
 *   - [ ]··
 *   - [ ]
 *
 * @example {"name": "ok.md", "setting": {"unchecked": "\t"}, "gfm": true}
 *
 *   - [»] List item
 *   - [»] List item
 *
 * @example {"name": "not-ok.md", "label": "input", "gfm": true}
 *
 *   - [x] List item
 *   - [X] List item
 *   - [ ] List item
 *   - [»] List item
 *
 * @example {"name": "not-ok.md", "label": "output", "gfm": true}
 *
 *   2:5: Checked checkboxes should use `x` as a marker
 *   4:5: Unchecked checkboxes should use ` ` as a marker
 *
 * @example {"setting": {"unchecked": "💩"}, "name": "not-ok.md", "label": "output", "positionless": true, "gfm": true}
 *
 *   1:1: Incorrect unchecked checkbox marker `💩`: use either `'\t'`, or `' '`
 *
 * @example {"setting": {"checked": "💩"}, "name": "not-ok.md", "label": "output", "positionless": true, "gfm": true}
 *
 *   1:1: Incorrect checked checkbox marker `💩`: use either `'x'`, or `'X'`
 */

'use strict'

var rule = require('unified-lint-rule')
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

function checkboxCharacterStyle(tree, file, option) {
  var contents = String(file)
  var preferred = typeof option === 'object' ? option : {}

  if (preferred.unchecked && unchecked[preferred.unchecked] !== true) {
    file.fail(
      'Incorrect unchecked checkbox marker `' +
        preferred.unchecked +
        "`: use either `'\\t'`, or `' '`"
    )
  }

  if (preferred.checked && checked[preferred.checked] !== true) {
    file.fail(
      'Incorrect checked checkbox marker `' +
        preferred.checked +
        "`: use either `'x'`, or `'X'`"
    )
  }

  visit(tree, 'listItem', visitor)

  function visitor(node) {
    var type
    var point
    var value
    var style
    var reason

    // Exit early for items without checkbox.
    if (typeof node.checked !== 'boolean' || generated(node)) {
      return
    }

    type = types[node.checked]

    /* istanbul ignore next - a list item cannot be checked and empty, according
     * to GFM, but theoretically it makes sense to get the end if that were
     * possible. */
    point = node.children.length === 0 ? end(node) : start(node.children[0])
    // Move back to before `] `.
    point.offset -= 2
    point.column -= 2

    // Assume we start with a checkbox, because well, `checked` is set.
    value = /\[([\t Xx])]/.exec(
      contents.slice(point.offset - 2, point.offset + 1)
    )

    /* istanbul ignore if - failsafe to make sure we don‘t crash if there
     * actually isn’t a checkbox. */
    if (!value) return

    style = preferred[type]

    if (style) {
      if (value[1] !== style) {
        reason =
          type.charAt(0).toUpperCase() +
          type.slice(1) +
          ' checkboxes should use `' +
          style +
          '` as a marker'

        file.message(reason, point)
      }
    } else {
      preferred[type] = value[1]
    }
  }
}

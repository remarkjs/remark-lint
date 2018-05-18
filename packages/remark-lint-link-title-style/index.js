/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module link-title-style
 * @fileoverview
 *   Warn when link and definition titles occur with incorrect quotes.
 *
 *   Options: `'consistent'`, `'"'`, `'\''`, or `'()'`, default: `'consistent'`.
 *
 *   `'consistent'` detects the first used quote style and warns when subsequent
 *   titles use different styles.
 *
 *   ## Fix
 *
 *   [`remark-stringify`](https://github.com/remarkjs/remark/tree/master/packages/remark-stringify)
 *   uses single quotes for titles if they contain a double quote, and double
 *   quotes otherwise.
 *
 *   See [Using remark to fix your markdown](https://github.com/remarkjs/remark-lint#using-remark-to-fix-your-markdown)
 *   on how to automatically fix warnings for this rule.
 *
 * @example {"name": "valid.md", "setting": "\""}
 *
 *   [Example](http://example.com "Example Domain")
 *   [Example](http://example.com "Example Domain")
 *
 * @example {"name": "valid.md", "setting": "'"}
 *
 *   ![Example](http://example.com/image.png 'Example Domain')
 *   ![Example](http://example.com/image.png 'Example Domain')
 *
 * @example {"name": "valid.md", "setting": "()"}
 *
 *   [Example](http://example.com (Example Domain) )
 *   [Example](http://example.com (Example Domain) )
 *
 * @example {"name": "invalid.md", "label": "input", "setting": "\""}
 *
 *   [Example]: http://example.com 'Example Domain'
 *
 * @example {"name": "invalid.md", "label": "output", "setting": "\""}
 *
 *   1:47: Titles should use `"` as a quote
 *
 * @example {"name": "invalid.md", "label": "input"}
 *
 *   [Example](http://example.com "Example Domain")
 *   [Example](http://example.com#without-title)
 *   [Example](http://example.com 'Example Domain')
 *
 * @example {"name": "invalid.md", "label": "output"}
 *
 *   3:46: Titles should use `"` as a quote
 *
 * @example {"name": "invalid.md", "label": "input", "setting": "()"}
 *
 *   [Example](http://example.com (Example Domain))
 *   [Example](http://example.com 'Example Domain')
 *
 * @example {"name": "invalid.md", "label": "output", "setting": "()"}
 *
 *   2:46: Titles should use `()` as a quote
 *
 * @example {"name": "invalid.md", "setting": ".", "label": "output", "config": {"positionless": true}}
 *
 *   1:1: Invalid link title style marker `.`: use either `'consistent'`, `'"'`, `'\''`, or `'()'`
 */

'use strict'

var rule = require('unified-lint-rule')
var vfileLocation = require('vfile-location')
var visit = require('unist-util-visit')
var position = require('unist-util-position')
var generated = require('unist-util-generated')

module.exports = rule('remark-lint:link-title-style', linkTitleStyle)

var end = position.end

var markers = {'"': true, "'": true, ')': true, null: true}

function linkTitleStyle(tree, file, pref) {
  var contents = String(file)
  var location = vfileLocation(file)

  pref = typeof pref === 'string' && pref !== 'consistent' ? pref : null
  pref = pref === '()' || pref === '(' ? ')' : pref

  if (markers[pref] !== true) {
    file.fail(
      'Invalid link title style marker `' +
        pref +
        "`: use either `'consistent'`, `'\"'`, `'\\''`, or `'()'`"
    )
  }

  visit(tree, ['link', 'image', 'definition'], validate)

  function validate(node) {
    var last = end(node).offset - 1
    var character
    var reason

    if (generated(node)) {
      return
    }

    if (node.type !== 'definition') {
      last--
    }

    while (last) {
      character = contents.charAt(last)

      /* istanbul ignore if - remark before 8.0.0 */
      if (/\s/.test(character)) {
        last--
      } else {
        break
      }
    }

    /* Skip non-titles. */
    if (character in markers) {
      if (pref) {
        if (pref !== character) {
          reason =
            'Titles should use `' +
            (pref === ')' ? '()' : pref) +
            '` as a quote'

          file.message(reason, location.toPosition(last + 1))
        }
      } else {
        pref = character
      }
    }
  }
}

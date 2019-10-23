/**
 * @author Alexandr Tovmach
 * @copyright 2019 Alexandr Tovmach
 * @license MIT
 * @module mdash-style
 * @fileoverview
 *   Warn when the mdash style violate a given style.
 *
 *   Options: `'―'`, `'-'`, `'--'`, default: `'―'`.
 *
 * @example {"name": "valid.md"}
 *
 *   `remark-lint` ― powerful Markdown processor powered by plugins.
 *
 * @example {"name": "valid.md", "setting": "-"}
 *
 *   `remark-lint` - powerful Markdown processor powered by plugins.
 *
 * @example {"name": "valid.md", "setting": "--"}
 *
 *   `remark-lint` -- powerful Markdown processor powered by plugins.
 *
 * @example {"name": "invalid.md", "label": "input"}
 *
 *   `remark-lint` - powerful Markdown processor powered by plugins.
 *
 *   `remark-lint` -- powerful Markdown processor powered by plugins.
 *
 * @example {"name": "invalid.md", "label": "output"}
 *
 *   1:1-1:64: Use `―` instead of `-` for mdash
 *   3:1-3:65: Use `―` instead of `--` for mdash
 */

'use strict'

var rule = require('unified-lint-rule')
var visit = require('unist-util-visit')
var generated = require('unist-util-generated')
var toString = require('mdast-util-to-string')

module.exports = rule('remark-lint:mdash-style', validateMdashStyle)

var options = ['―', '-', '--']

function validateMdashStyle(tree, file, pref) {
  var allowedMdash =
    (typeof pref === 'string' && options.includes(pref) && pref) || options[0]
  var notAllowedMdash = options.filter(el => el !== allowedMdash)
  var expression = new RegExp(`\\s(${notAllowedMdash.join('|')})\\s`, 'g')

  visit(tree, 'heading', visitor)
  visit(tree, 'paragraph', visitor)

  function visitor(node) {
    var value

    if (!generated(node)) {
      value = toString(node).match(expression)

      if (value) {
        value.forEach(el =>
          file.message(
            'Use `' +
              allowedMdash +
              '` instead of `' +
              el.trim() +
              '` for mdash',
            node
          )
        )
      }
    }
  }
}

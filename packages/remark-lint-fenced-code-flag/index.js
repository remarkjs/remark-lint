/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module fenced-code-flag
 * @fileoverview
 *   Check fenced code block flags.
 *
 *   Options: `Array.<string>` or `Object`, optional.
 *
 *   Providing an array is as passing `{flags: Array}`.
 *
 *   The object can have an array of `'flags'` which are allowed: other flags
 *   will not be allowed.
 *   An `allowEmpty` field (`boolean`, default: `false`) can be set to allow
 *   code blocks without language flags.
 *
 * @example {"name": "ok.md"}
 *
 *   ```alpha
 *   bravo();
 *   ```
 *
 * @example {"name": "not-ok.md", "label": "input"}
 *
 *   ```
 *   alpha();
 *   ```
 *
 * @example {"name": "not-ok.md", "label": "output"}
 *
 *   1:1-3:4: Missing code language flag
 *
 * @example {"name": "ok.md", "setting": {"allowEmpty": true}}
 *
 *   ```
 *   alpha();
 *   ```
 *
 * @example {"name": "not-ok.md", "setting": {"allowEmpty": false}, "label": "input"}
 *
 *   ```
 *   alpha();
 *   ```
 *
 * @example {"name": "not-ok.md", "setting": {"allowEmpty": false}, "label": "output"}
 *
 *   1:1-3:4: Missing code language flag
 *
 * @example {"name": "ok.md", "setting": ["alpha"]}
 *
 *   ```alpha
 *   bravo();
 *   ```
 *
 * @example {"name": "not-ok.md", "setting": ["charlie"], "label": "input"}
 *
 *   ```alpha
 *   bravo();
 *   ```
 *
 * @example {"name": "not-ok.md", "setting": ["charlie"], "label": "output"}
 *
 *   1:1-3:4: Incorrect code language flag
 */

'use strict'

var rule = require('unified-lint-rule')
var visit = require('unist-util-visit')
var position = require('unist-util-position')
var generated = require('unist-util-generated')

module.exports = rule('remark-lint:fenced-code-flag', fencedCodeFlag)

var start = position.start
var end = position.end

var fence = /^ {0,3}([~`])\1{2,}/
var reasonIncorrect = 'Incorrect code language flag'
var reasonMissing = 'Missing code language flag'

function fencedCodeFlag(tree, file, option) {
  var contents = String(file)
  var allowEmpty = false
  var allowed = []
  var flags = option

  if (typeof flags === 'object' && !('length' in flags)) {
    allowEmpty = Boolean(flags.allowEmpty)
    flags = flags.flags
  }

  if (typeof flags === 'object' && 'length' in flags) {
    allowed = String(flags).split(',')
  }

  visit(tree, 'code', visitor)

  function visitor(node) {
    var value

    if (!generated(node)) {
      if (node.lang) {
        if (allowed.length !== 0 && allowed.indexOf(node.lang) === -1) {
          file.message(reasonIncorrect, node)
        }
      } else {
        value = contents.slice(start(node).offset, end(node).offset)

        if (!allowEmpty && fence.test(value)) {
          file.message(reasonMissing, node)
        }
      }
    }
  }
}

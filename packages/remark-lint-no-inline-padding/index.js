/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module no-inline-padding
 * @fileoverview
 *   Warn when phrasing content is padded with spaces between their markers and
 *   content.
 *
 *   Warns for emphasis, strong, delete, image, and link.
 *
 * @example {"name": "ok.md"}
 *
 *   Alpha [bravo](http://echo.fox/trot)
 *
 * @example {"name": "not-ok.md", "label": "input"}
 *
 *   Alpha [ bravo ](http://echo.fox/trot)
 *
 * @example {"name": "not-ok.md", "label": "output"}
 *
 *   1:7-1:38: Don’t pad `link` with inner spaces
 */

'use strict'

var rule = require('unified-lint-rule')
var visit = require('unist-util-visit')
var generated = require('unist-util-generated')
var toString = require('mdast-util-to-string')

module.exports = rule('remark-lint:no-inline-padding', noInlinePadding)

function noInlinePadding(tree, file) {
  // Note: `emphasis`, `strong`, `delete` (GFM) can’t have padding anymore
  // since CM.
  visit(tree, ['link', 'linkReference'], visitor)

  function visitor(node) {
    var contents

    if (!generated(node)) {
      contents = toString(node)

      if (
        contents.charAt(0) === ' ' ||
        contents.charAt(contents.length - 1) === ' '
      ) {
        file.message('Don’t pad `' + node.type + '` with inner spaces', node)
      }
    }
  }
}

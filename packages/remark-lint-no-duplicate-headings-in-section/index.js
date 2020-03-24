/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module no-duplicate-headings-in-section
 * @fileoverview
 *   Warn when duplicate headings are found, but only when on the same level,
 *   “in” the same section.
 *
 * @example {"name": "ok.md"}
 *
 *   ## Alpha
 *
 *   ### Bravo
 *
 *   ## Charlie
 *
 *   ### Bravo
 *
 *   ### Delta
 *
 *   #### Bravo
 *
 *   #### Echo
 *
 *   ##### Bravo
 *
 * @example {"name": "not-ok.md", "label": "input"}
 *
 *   ## Foxtrot
 *
 *   ### Golf
 *
 *   ### Golf
 *
 * @example {"name": "not-ok.md", "label": "output"}
 *
 *   5:1-5:9: Do not use headings with similar content per section (3:1)
 */

'use strict'

var rule = require('unified-lint-rule')
var position = require('unist-util-position')
var generated = require('unist-util-generated')
var visit = require('unist-util-visit')
var stringify = require('unist-util-stringify-position')
var toString = require('mdast-util-to-string')

module.exports = rule(
  'remark-lint:no-duplicate-headings-in-section',
  noDuplicateHeadingsInSection
)

var reason = 'Do not use headings with similar content per section'

function noDuplicateHeadingsInSection(tree, file) {
  var stack = [{}]

  visit(tree, 'heading', visitor)

  function visitor(node) {
    var depth = node.depth
    var siblings = stack[depth - 1] || {}
    var value = toString(node).toUpperCase()
    var duplicate = siblings[value]

    stack = stack.slice(0, depth)
    stack[depth] = {}
    siblings[value] = node

    if (!generated(node) && duplicate && duplicate.type === 'heading') {
      file.message(
        reason + ' (' + stringify(position.start(duplicate)) + ')',
        node
      )
    }
  }
}

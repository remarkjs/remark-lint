/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module no-duplicate-definitions
 * @fileoverview
 *   Warn when duplicate definitions are found.
 *
 * @example {"name": "valid.md"}
 *
 *   [foo]: bar
 *   [baz]: qux
 *
 * @example {"name": "invalid.md", "label": "input"}
 *
 *   [foo]: bar
 *   [foo]: qux
 *
 * @example {"name": "invalid.md", "label": "output"}
 *
 *   2:1-2:11: Do not use definitions with the same identifier (1:1)
 */

'use strict'

var rule = require('unified-lint-rule')
var position = require('unist-util-position')
var generated = require('unist-util-generated')
var visit = require('unist-util-visit')

module.exports = rule(
  'remark-lint:no-duplicate-definitions',
  noDuplicateDefinitions
)

var reason = 'Do not use definitions with the same identifier'

function noDuplicateDefinitions(tree, file) {
  var map = {}

  visit(tree, ['definition', 'footnoteDefinition'], validate)

  function validate(node) {
    var identifier
    var duplicate
    var pos

    if (!generated(node)) {
      identifier = node.identifier
      duplicate = map[identifier]

      if (duplicate && duplicate.type) {
        pos = position.start(duplicate)
        file.message(reason + ' (' + pos.line + ':' + pos.column + ')', node)
      }

      map[identifier] = node
    }
  }
}

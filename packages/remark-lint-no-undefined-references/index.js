/**
 * @author Titus Wormer
 * @copyright 2016 Titus Wormer
 * @license MIT
 * @module no-undefined-references
 * @fileoverview
 *   Warn when references to undefined definitions are found.
 *
 *   Options: `Object`, optional.
 *
 *   The object can have an `allow` property, an array of strings that may
 *   appear between `[` and `]` but that should not be treated as link
 *   identifiers.
 *
 * @example {"name": "valid.md"}
 *
 *   [foo][]
 *
 *   [foo]: https://example.com
 *
 * @example {"name": "invalid.md", "label": "input"}
 *
 *   [bar][]
 *
 * @example {"name": "invalid.md", "label": "output"}
 *
 *   1:1-1:8: Found reference to undefined definition
 *
 * @example {"name": "valid-allow.md", "setting": {"allow": ["..."]}}
 *
 *   > Eliding a portion of a quoted passage [...] is acceptable.
 */

'use strict'

var collapseWhiteSpace = require('collapse-white-space')
var rule = require('unified-lint-rule')
var generated = require('unist-util-generated')
var visit = require('unist-util-visit')

module.exports = rule(
  'remark-lint:no-undefined-references',
  noUndefinedReferences
)

var reason = 'Found reference to undefined definition'

//  The identifier is upcased to avoid naming collisions with properties
//  inherited from `Object.prototype`. Were `Object.create(null)` to be
//  used in place of `{}`, downcasing would work equally well.
function normalize(s) {
  return collapseWhiteSpace(s.toUpperCase())
}

function noUndefinedReferences(tree, file, pref) {
  var allow =
    pref != null && Array.isArray(pref.allow) ? pref.allow.map(normalize) : []

  var map = {}

  visit(tree, ['definition', 'footnoteDefinition'], mark)
  visit(tree, ['imageReference', 'linkReference', 'footnoteReference'], find)

  function mark(node) {
    if (!generated(node)) {
      map[normalize(node.identifier)] = true
    }
  }

  function find(node) {
    if (
      !(
        generated(node) ||
        allow.includes(normalize(node.identifier)) ||
        normalize(node.identifier) in map
      )
    ) {
      file.message(reason, node)
    }
  }
}

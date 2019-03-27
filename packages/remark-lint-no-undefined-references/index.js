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
 *   The object can have a `'whitelist'`, an array of strings that may appear
 *   between `[` and `]` but that should not be treated as link identifiers.
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
 * @example {"name": "invalid.md", "label": "input"}
 *
 *   > Eliding a portion of a quoted passage [...] is acceptable.
 *
 * @example {"name": "invalid.md", "label": "output"}
 *
 *   1:41-1:46: Found reference to undefined definition
 *
 * @example {"name": "valid.md", "setting": {"whitelist": ["..."]}}
 *
 *   > Eliding a portion of a quoted passage [...] is acceptable.
 */

'use strict'

var rule = require('unified-lint-rule')
var generated = require('unist-util-generated')
var visit = require('unist-util-visit')

module.exports = rule(
  'remark-lint:no-undefined-references',
  noUndefinedReferences
)

var reason = 'Found reference to undefined definition'

function toUpper(s) { return s.toUpperCase() }

function noUndefinedReferences(tree, file, pref) {
  var whitelist = pref != null && Array.isArray (pref.whitelist) ?
                  pref.whitelist.map(toUpper) :
                  []

  var map = {}

  visit(tree, ['definition', 'footnoteDefinition'], mark)
  visit(tree, ['imageReference', 'linkReference', 'footnoteReference'], find)

  function mark(node) {
    if (!generated(node)) {
      map[toUpper(node.identifier)] = true
    }
  }

  function find(node) {
    if (!(generated(node) ||
          whitelist.includes(toUpper(node.identifier)) ||
          toUpper(node.identifier) in map)) {
      file.message(reason, node)
    }
  }
}

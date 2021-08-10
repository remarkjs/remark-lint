/**
 * @author Titus Wormer
 * @copyright 2016 Titus Wormer
 * @license MIT
 * @module no-unused-definitions
 * @fileoverview
 *   Warn when unused definitions are found.
 *
 * @example {"name": "ok.md"}
 *
 *   [foo][]
 *
 *   [foo]: https://example.com
 *
 * @example {"name": "not-ok.md", "label": "input"}
 *
 *   [bar]: https://example.com
 *
 * @example {"name": "not-ok.md", "label": "output"}
 *
 *   1:1-1:27: Found unused definition
 */

import {lintRule} from 'unified-lint-rule'
import generated from 'unist-util-generated'
import visit from 'unist-util-visit'

const remarkLintNoUnusedDefinitions = lintRule(
  'remark-lint:no-unused-definitions',
  noUnusedDefinitions
)

export default remarkLintNoUnusedDefinitions

var reason = 'Found unused definition'

function noUnusedDefinitions(tree, file) {
  var map = {}
  var identifier
  var entry

  visit(tree, ['definition', 'footnoteDefinition'], find)
  visit(tree, ['imageReference', 'linkReference', 'footnoteReference'], mark)

  for (identifier in map) {
    entry = map[identifier]

    if (!entry.used) {
      file.message(reason, entry.node)
    }
  }

  function find(node) {
    if (!generated(node)) {
      map[node.identifier.toUpperCase()] = {node: node, used: false}
    }
  }

  function mark(node) {
    var info = map[node.identifier.toUpperCase()]

    if (!generated(node) && info) {
      info.used = true
    }
  }
}

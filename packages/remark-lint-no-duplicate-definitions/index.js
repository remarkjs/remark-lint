/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module no-duplicate-definitions
 * @fileoverview
 *   Warn when duplicate definitions are found.
 *
 * @example {"name": "ok.md"}
 *
 *   [foo]: bar
 *   [baz]: qux
 *
 * @example {"name": "not-ok.md", "label": "input"}
 *
 *   [foo]: bar
 *   [foo]: qux
 *
 * @example {"name": "not-ok.md", "label": "output"}
 *
 *   2:1-2:11: Do not use definitions with the same identifier (1:1)
 */

import {lintRule} from 'unified-lint-rule'
import {pointStart} from 'unist-util-position'
import {generated} from 'unist-util-generated'
import {stringifyPosition} from 'unist-util-stringify-position'
import {visit} from 'unist-util-visit'

const remarkLintNoDuplicateDefinitions = lintRule(
  'remark-lint:no-duplicate-definitions',
  noDuplicateDefinitions
)

export default remarkLintNoDuplicateDefinitions

var reason = 'Do not use definitions with the same identifier'

function noDuplicateDefinitions(tree, file) {
  var map = {}

  visit(tree, ['definition', 'footnoteDefinition'], check)

  function check(node) {
    var identifier
    var duplicate

    if (!generated(node)) {
      identifier = node.identifier
      duplicate = map[identifier]

      if (duplicate && duplicate.type) {
        file.message(
          reason + ' (' + stringifyPosition(pointStart(duplicate)) + ')',
          node
        )
      }

      map[identifier] = node
    }
  }
}

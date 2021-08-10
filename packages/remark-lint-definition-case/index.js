/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module definition-case
 * @fileoverview
 *   Warn when definition labels are not lowercase.
 *
 * @example {"name": "ok.md"}
 *
 *   [example]: http://example.com "Example Domain"
 *
 * @example {"name": "not-ok.md", "label": "input"}
 *
 *   [Example]: http://example.com "Example Domain"
 *
 * @example {"name": "not-ok.md", "label": "output"}
 *
 *   1:1-1:47: Do not use uppercase characters in definition labels
 */

import {lintRule} from 'unified-lint-rule'
import {visit} from 'unist-util-visit'
import {pointStart, pointEnd} from 'unist-util-position'
import {generated} from 'unist-util-generated'

const remarkLintDefinitionCase = lintRule(
  'remark-lint:definition-case',
  definitionCase
)

export default remarkLintDefinitionCase

var label = /^\s*\[((?:\\[\s\S]|[^[\]])+)]/
var reason = 'Do not use uppercase characters in definition labels'

function definitionCase(tree, file) {
  var contents = String(file)

  visit(tree, ['definition', 'footnoteDefinition'], check)

  function check(node) {
    var start = pointStart(node).offset
    var end = pointEnd(node).offset
    var value

    if (!generated(node)) {
      value = contents.slice(start, end).match(label)[1]

      if (value !== value.toLowerCase()) {
        file.message(reason, node)
      }
    }
  }
}

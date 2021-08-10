/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module definition-spacing
 * @fileoverview
 *   Warn when consecutive whitespace is used in a definition.
 *
 * @example {"name": "ok.md"}
 *
 *   [example domain]: http://example.com "Example Domain"
 *
 * @example {"name": "not-ok.md", "label": "input"}
 *
 *   [example····domain]: http://example.com "Example Domain"
 *
 * @example {"name": "not-ok.md", "label": "output"}
 *
 *   1:1-1:57: Do not use consecutive whitespace in definition labels
 */

import {lintRule} from 'unified-lint-rule'
import visit from 'unist-util-visit'
import position from 'unist-util-position'
import generated from 'unist-util-generated'

const remarkLintDefinitionSpacing = lintRule(
  'remark-lint:definition-spacing',
  definitionSpacing
)

export default remarkLintDefinitionSpacing

var label = /^\s*\[((?:\\[\s\S]|[^[\]])+)]/
var reason = 'Do not use consecutive whitespace in definition labels'

function definitionSpacing(tree, file) {
  var contents = String(file)

  visit(tree, ['definition', 'footnoteDefinition'], check)

  function check(node) {
    var start = position.start(node).offset
    var end = position.end(node).offset

    if (
      !generated(node) &&
      /[ \t\n]{2,}/.test(contents.slice(start, end).match(label)[1])
    ) {
      file.message(reason, node)
    }
  }
}

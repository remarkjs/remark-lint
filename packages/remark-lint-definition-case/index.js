/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module definition-case
 * @fileoverview
 *   Warn when definition labels are not lowercase.
 *
 * @example
 *   {"name": "ok.md"}
 *
 *   [example]: http://example.com "Example Domain"
 *
 * @example
 *   {"name": "not-ok.md", "label": "input"}
 *
 *   [Example]: http://example.com "Example Domain"
 *
 * @example
 *   {"name": "not-ok.md", "label": "output"}
 *
 *   1:1-1:47: Do not use uppercase characters in definition labels
 */

import {lintRule} from 'unified-lint-rule'
import {visit} from 'unist-util-visit'
import {pointStart, pointEnd} from 'unist-util-position'
import {generated} from 'unist-util-generated'

const label = /^\s*\[((?:\\[\s\S]|[^[\]])+)]/

const remarkLintDefinitionCase = lintRule(
  'remark-lint:definition-case',
  (tree, file) => {
    const value = String(file)

    visit(tree, (node) => {
      if (
        (node.type === 'definition' || node.type === 'footnoteDefinition') &&
        !generated(node)
      ) {
        const start = pointStart(node).offset
        const end = pointEnd(node).offset
        const slice = value.slice(start, end).match(label)[1]

        if (slice !== slice.toLowerCase()) {
          file.message(
            'Do not use uppercase characters in definition labels',
            node
          )
        }
      }
    })
  }
)

export default remarkLintDefinitionCase

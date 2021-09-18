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

/**
 * @typedef {import('mdast').Root} Root
 */

import {lintRule} from 'unified-lint-rule'
import {visit} from 'unist-util-visit'
import {pointStart, pointEnd} from 'unist-util-position'

const label = /^\s*\[((?:\\[\s\S]|[^[\]])+)]/

const remarkLintDefinitionCase = lintRule(
  {
    origin: 'remark-lint:definition-case',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-definition-case#readme'
  },
  /** @type {import('unified-lint-rule').Rule<Root, void>} */
  (tree, file) => {
    const value = String(file)

    visit(tree, (node) => {
      if (node.type === 'definition' || node.type === 'footnoteDefinition') {
        const start = pointStart(node).offset
        const end = pointEnd(node).offset

        if (typeof start === 'number' && typeof end === 'number') {
          const match = value.slice(start, end).match(label)

          if (match && match[1] !== match[1].toLowerCase()) {
            file.message(
              'Do not use uppercase characters in definition labels',
              node
            )
          }
        }
      }
    })
  }
)

export default remarkLintDefinitionCase

/**
 * ## When should I use this?
 *
 * You can use this package to check that the labels used in definitions
 * do not use meaningless white space.
 *
 * ## API
 *
 * There are no options.
 *
 * ## Recommendation
 *
 * Definitions and references are matched together by collapsing white space.
 * Using more white space in labels might incorrectly indicate that they are of
 * importance.
 * Due to this, it’s recommended to use one space (or a line ending if needed)
 * and turn this rule on.
 *
 * @module definition-spacing
 * @summary
 *   remark-lint rule to warn when consecutive whitespace is used in
 *   a definition label.
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @example
 *   {"name": "ok.md"}
 *
 *   [example domain]: http://example.com "Example Domain"
 *
 * @example
 *   {"name": "not-ok.md", "label": "input"}
 *
 *   [example····domain]: http://example.com "Example Domain"
 *
 * @example
 *   {"name": "not-ok.md", "label": "output"}
 *
 *   1:1-1:57: Do not use consecutive whitespace in definition labels
 */

/**
 * @typedef {import('mdast').Root} Root
 */

import {lintRule} from 'unified-lint-rule'
import {visit} from 'unist-util-visit'
import {pointStart, pointEnd} from 'unist-util-position'

const label = /^\s*\[((?:\\[\s\S]|[^[\]])+)]/

const remarkLintDefinitionSpacing = lintRule(
  {
    origin: 'remark-lint:definition-spacing',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-definition-spacing#readme'
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

          if (match && /[ \t\n]{2,}/.test(match[1])) {
            file.message(
              'Do not use consecutive whitespace in definition labels',
              node
            )
          }
        }
      }
    })
  }
)

export default remarkLintDefinitionSpacing

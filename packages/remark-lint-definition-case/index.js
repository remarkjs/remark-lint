/**
 * ## When should I use this?
 *
 * You can use this package to check that the labels used in definitions
 * are lowercase.
 *
 * ## API
 *
 * There are no options.
 *
 * ## Recommendation
 *
 * Definitions and references are matched together regardless of casing.
 * Using uppercase in labels might incorrectly indicate that casing is of
 * importance.
 * Due to this, it’s recommended to use lowercase and turn this rule on.
 *
 * @module definition-case
 * @summary
 *   remark-lint rule to warn when definition labels are not lowercase.
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
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
import {pointEnd, pointStart} from 'unist-util-position'
import {visit} from 'unist-util-visit'

const label = /^\s*\[((?:\\[\s\S]|[^[\]])+)]/

const remarkLintDefinitionCase = lintRule(
  {
    origin: 'remark-lint:definition-case',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-definition-case#readme'
  },
  /**
   * @param {Root} tree
   *   Tree.
   * @returns {undefined}
   *   Nothing.
   */
  function (tree, file) {
    const value = String(file)

    visit(tree, function (node) {
      if (node.type === 'definition' || node.type === 'footnoteDefinition') {
        const end = pointEnd(node)
        const start = pointStart(node)

        if (
          end &&
          start &&
          typeof end.offset === 'number' &&
          typeof start.offset === 'number'
        ) {
          const match = value.slice(start.offset, end.offset).match(label)

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

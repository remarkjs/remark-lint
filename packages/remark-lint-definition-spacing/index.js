/**
 * remark-lint rule to warn when consecutive whitespace is used in
 * a definition label.
 *
 * ## What is this?
 *
 * This package checks the whitepsace in definition labels.
 *
 * GFM footnotes are not affected by this rule as footnote labels cannot
 * contain whitespace.
 *
 * ## When should I use this?
 *
 * You can use this package to check that definition labels are consistent.
 *
 * ## API
 *
 * ### `unified().use(remarkLintDefinitionSpacing)`
 *
 * Warn when consecutive whitespace is used in a definition label.
 *
 * ###### Parameters
 *
 * There are no options.
 *
 * ###### Returns
 *
 * Transform ([`Transformer` from `unified`][github-unified-transformer]).
 *
 * ## Recommendation
 *
 * Definitions and references are matched together by collapsing whitespace.
 * Using more whitespace in labels might incorrectly indicate that they are of
 * importance.
 * Due to this, it’s recommended to use one space and turn this rule on.
 *
 * [api-remark-lint-definition-spacing]: #unifieduseremarklintdefinitionspacing
 * [github-unified-transformer]: https://github.com/unifiedjs/unified#transformer
 *
 * @module definition-spacing
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
 *   [example␠␠␠␠domain]: http://example.com "Example Domain"
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
import {pointStart, pointEnd} from 'unist-util-position'
import {visit} from 'unist-util-visit'

const label = /^\s*\[((?:\\[\s\S]|[^[\]])+)]/

const remarkLintDefinitionSpacing = lintRule(
  {
    origin: 'remark-lint:definition-spacing',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-definition-spacing#readme'
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
      if (node.type === 'definition') {
        const end = pointEnd(node)
        const start = pointStart(node)

        if (
          end &&
          start &&
          typeof end.offset === 'number' &&
          typeof start.offset === 'number'
        ) {
          const match = value.slice(start.offset, end.offset).match(label)

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

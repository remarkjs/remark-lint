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
 *
 * @example
 *   {"name": "ok.md"}
 *
 *   The first planet is [planet mercury][].
 *
 *   [planet mercury]: https://example.com
 *
 * @example
 *   {"label": "input", "name": "not-ok-consecutive.md"}
 *
 *   [planet␠␠␠␠mercury]: https://example.com
 * @example
 *   {"label": "output", "name": "not-ok-consecutive.md"}
 *
 *   1:1-1:41: Unexpected `4` consecutive spaces in definition label, expected `1` space, remove `3` spaces
 *
 * @example
 *   {"label": "input", "name": "not-ok-non-space.md"}
 *
 *   [pla␉net␊mer␍cury]: https://e.com
 * @example
 *   {"label": "output", "name": "not-ok-non-space.md"}
 *
 *   1:1-3:21: Unexpected non-space whitespace character `\t` in definition label, expected `1` space, replace it
 *   1:1-3:21: Unexpected non-space whitespace character `\n` in definition label, expected `1` space, replace it
 *   1:1-3:21: Unexpected non-space whitespace character `\r` in definition label, expected `1` space, replace it
 */

/**
 * @import {Root} from 'mdast'
 */

import {longestStreak} from 'longest-streak'
import {phrasing} from 'mdast-util-phrasing'
import pluralize from 'pluralize'
import {lintRule} from 'unified-lint-rule'
import {SKIP, visitParents} from 'unist-util-visit-parents'

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
    visitParents(tree, function (node, parents) {
      // Do not walk into phrasing.
      if (phrasing(node)) {
        return SKIP
      }

      if (node.type === 'definition' && node.position && node.label) {
        const size = longestStreak(node.label, ' ')

        if (size > 1) {
          file.message(
            'Unexpected `' +
              size +
              '` consecutive spaces in definition label, expected `1` space, remove `' +
              (size - 1) +
              '` ' +
              pluralize('space', size - 1),
            {ancestors: [...parents, node], place: node.position}
          )
        }

        /** @type {Array<string>} */
        const disallowed = []
        if (node.label.includes('\t')) disallowed.push('\\t')
        if (node.label.includes('\n')) disallowed.push('\\n')
        if (node.label.includes('\r')) disallowed.push('\\r')

        for (const disallow of disallowed) {
          file.message(
            'Unexpected non-space whitespace character `' +
              disallow +
              '` in definition label, expected `1` space, replace it',
            {ancestors: [...parents, node], place: node.position}
          )
        }
      }
    })
  }
)

export default remarkLintDefinitionSpacing

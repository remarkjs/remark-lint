/**
 * remark-lint rule to warn when definition labels are not lowercase.
 *
 * ## What is this?
 *
 * This package checks the case of definition labels.
 *
 * ## When should I use this?
 *
 * You can use this package to check that definition labels are consistent.
 *
 * ## API
 *
 * ### `unified().use(remarkLintDefinitionCase)`
 *
 * Warn when definition labels are not lowercase.
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
 * Definitions and references are matched together regardless of casing.
 * Using uppercase in definition labels might incorrectly indicate that casing
 * is of importance.
 * Due to this, it’s recommended to use lowercase and turn this rule on.
 *
 * [api-remark-lint-definition-case]: #unifieduseremarklintdefinitioncase
 * [github-unified-transformer]: https://github.com/unifiedjs/unified#transformer
 *
 * @module definition-case
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 *
 * @example
 *   {"name": "ok.md"}
 *
 *   [mercury]: http://example.com "Mercury"
 *
 * @example
 *   {"label": "input", "name": "not-ok.md"}
 *
 *   [Mercury]: http://example.com "Mercury"
 * @example
 *   {"label": "output", "name": "not-ok.md"}
 *
 *   1:1-1:40: Unexpected uppercase characters in definition label, expected lowercase
 *
 * @example
 *   {"gfm": true, "label": "input", "name": "gfm.md"}
 *
 *   [^Mercury]:
 *       **Mercury** is the first planet from the Sun and the smallest
 *       in the Solar System.
 * @example
 *   {"gfm": true, "label": "output", "name": "gfm.md"}
 *
 *   1:1-3:25: Unexpected uppercase characters in footnote definition label, expected lowercase
 */

/**
 * @typedef {import('mdast').Root} Root
 */

import {phrasing} from 'mdast-util-phrasing'
import {lintRule} from 'unified-lint-rule'
import {SKIP, visitParents} from 'unist-util-visit-parents'

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
    visitParents(tree, function (node, parents) {
      // Do not walk into phrasing.
      if (phrasing(node)) {
        return SKIP
      }

      if (
        (node.type === 'definition' || node.type === 'footnoteDefinition') &&
        node.position &&
        node.label &&
        node.label !== node.label.toLowerCase()
      ) {
        file.message(
          'Unexpected uppercase characters in ' +
            (node.type === 'definition' ? '' : 'footnote ') +
            'definition label, expected lowercase',
          {ancestors: [...parents, node], place: node.position}
        )
      }
    })
  }
)

export default remarkLintDefinitionCase

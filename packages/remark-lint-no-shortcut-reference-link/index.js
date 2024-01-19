/**
 * remark-lint rule to warn when shortcut reference links are used.
 *
 * ## What is this?
 *
 * This package checks that collapsed or full reference links are used.
 *
 * ## When should I use this?
 *
 * You can use this package to check that references are consistent.
 *
 * ## API
 *
 * ### `unified().use(remarkLintNoShortcutReferenceLink)`
 *
 * Warn when shortcut reference links are used.
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
 * Shortcut references use an implicit style that looks a lot like something
 * that could occur as plain text instead of syntax.
 * In some cases,
 * plain text is intended instead of a link.
 * So it’s recommended to use collapsed or full references instead.
 *
 * [api-remark-lint-no-shortcut-reference-link]: #unifieduseremarklintnoshortcutreferencelink
 * [github-unified-transformer]: https://github.com/unifiedjs/unified#transformer
 *
 * @module no-shortcut-reference-link
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 *
 * @example
 *   {"name": "ok.md"}
 *
 *   [Mercury][]
 *
 *   [mercury]: http://example.com/mercury/
 *
 * @example
 *   {"label": "input", "name": "not-ok.md"}
 *
 *   [Mercury]
 *
 *   [mercury]: http://example.com/mercury/
 * @example
 *   {"label": "output", "name": "not-ok.md"}
 *
 *   1:1-1:10: Unexpected shortcut reference link (`[text]`), expected collapsed reference (`[text][]`)
 */

/**
 * @typedef {import('mdast').Root} Root
 */

import {lintRule} from 'unified-lint-rule'
import {visitParents} from 'unist-util-visit-parents'

const remarkLintNoShortcutReferenceLink = lintRule(
  {
    origin: 'remark-lint:no-shortcut-reference-link',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-no-shortcut-reference-link#readme'
  },
  /**
   * @param {Root} tree
   *   Tree.
   * @returns {undefined}
   *   Nothing.
   */
  function (tree, file) {
    visitParents(tree, 'linkReference', function (node, parents) {
      if (node.position && node.referenceType === 'shortcut') {
        file.message(
          'Unexpected shortcut reference link (`[text]`), expected collapsed reference (`[text][]`)',
          {ancestors: [...parents, node], place: node.position}
        )
      }
    })
  }
)

export default remarkLintNoShortcutReferenceLink

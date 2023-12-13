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
 * @example
 *   {"name": "ok.md"}
 *
 *   [foo][]
 *
 *   [foo]: http://foo.bar/baz
 *
 * @example
 *   {"name": "not-ok.md", "label": "input"}
 *
 *   [foo]
 *
 *   [foo]: http://foo.bar/baz
 *
 * @example
 *   {"name": "not-ok.md", "label": "output"}
 *
 *   1:1-1:6: Use the trailing `[]` on reference links
 */

/**
 * @typedef {import('mdast').Root} Root
 */

import {lintRule} from 'unified-lint-rule'
import {position} from 'unist-util-position'
import {visit} from 'unist-util-visit'

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
    visit(tree, 'linkReference', function (node) {
      const place = position(node)
      if (place && node.referenceType === 'shortcut') {
        file.message('Use the trailing `[]` on reference links', place)
      }
    })
  }
)

export default remarkLintNoShortcutReferenceLink

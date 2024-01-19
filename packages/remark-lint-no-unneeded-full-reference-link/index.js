/**
 * remark-lint rule to warn when unneeded full reference links are used.
 *
 * ## What is this?
 *
 * This package checks for unneeded full reference links.
 *
 * ## When should I use this?
 *
 * You can use this package to check that reference links are consistent.
 *
 * ## API
 *
 * ### `unified().use(remarkLintNoUnneededFullReferenceLink)`
 *
 * Warn when unneeded full reference links are used.
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
 * Full reference syntax (`[Text][text]`) is quite verbose compared to
 * the concise collapsed reference syntax (`[Text][]`).
 *
 * [api-remark-lint-no-unneeded-full-reference-link]: #unifieduseremarklintnounneededfullreferencelink
 * [github-unified-transformer]: https://github.com/unifiedjs/unified#transformer
 *
 * @module no-unneeded-full-reference-link
 * @author Titus Wormer
 * @copyright 2019 Titus Wormer
 * @license MIT
 *
 * @example
 *   {"name": "ok.md"}
 *
 *   [Mercury][] and [Venus][venus-url].
 *
 *   [mercury]: https://example.com/mercury/
 *   [venus-url]: https://example.com/venus/
 *
 * @example
 *   {"label": "input", "name": "not-ok.md"}
 *
 *   [Mercury][mercury].
 *
 *   [mercury]: https://example.com/mercury/
 *
 * @example
 *   {"label": "output", "name": "not-ok.md"}
 *
 *   1:1-1:19: Unexpected full reference link (`[text][label]`) where the identifier can be inferred from the text, expected collapsed reference (`[text][]`)
 *
 * @example
 *   {"gfm": true, "label": "input", "name": "escape.md"}
 *
 *   Matrix:
 *
 *   | Kind                      | Text normal | Text escape  | Text character reference |
 *   | ------------------------- | ----------- | ------------ | ------------------------ |
 *   | Label normal              | [&][&]      | [\&][&]      | [&amp;][&]               |
 *   | Label escape              | [&][\&]     | [\&][\&]     | [&amp;][\&]              |
 *   | Label character reference | [&][&amp;]  | [\&][&amp;]  | [&amp;][&amp;]           |
 *
 *   When using the above matrix, the first row will go to `a`, the second
 *   to `b`, third to `c`.
 *   Removing all labels, you’d instead get it per column: `a`, `b`, `c`.
 *   That shows the label is not needed when it matches the text, and is otherwise.
 *
 *   [&]: a
 *   [\&]: b
 *   [&amp;]: c
 *
 * @example
 *   {"label": "output", "name": "escape.md"}
 *
 *   5:31-5:37: Unexpected full reference link (`[text][label]`) where the identifier can be inferred from the text, expected collapsed reference (`[text][]`)
 *   6:45-6:53: Unexpected full reference link (`[text][label]`) where the identifier can be inferred from the text, expected collapsed reference (`[text][]`)
 *   7:60-7:74: Unexpected full reference link (`[text][label]`) where the identifier can be inferred from the text, expected collapsed reference (`[text][]`)
 */

/**
 * @typedef {import('mdast').Root} Root
 */

import {normalizeIdentifier} from 'micromark-util-normalize-identifier'
import {lintRule} from 'unified-lint-rule'
import {pointEnd, pointStart} from 'unist-util-position'
import {visitParents} from 'unist-util-visit-parents'

const remarkLintNoUnneededFullReferenceLink = lintRule(
  {
    origin: 'remark-lint:no-unneeded-full-reference-link',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-no-unneeded-full-reference-link#readme'
  },
  /**
   * @param {Root} tree
   *   Tree.
   * @returns {undefined}
   *   Nothing.
   */
  function (tree, file) {
    const value = String(file)

    visitParents(tree, 'linkReference', function (node, parents) {
      const end = pointEnd(node)
      const start = pointStart(node)

      if (
        node.referenceType !== 'full' ||
        !end ||
        !start ||
        typeof end.offset !== 'number' ||
        typeof start.offset !== 'number'
      ) {
        return
      }

      const slice = value.slice(start.offset, end.offset)
      // In a label, the `[` cannot occur unescaped.
      const index = slice.lastIndexOf('][')

      /* c8 ignore next -- shouldn’t happen */
      if (index === -1) return

      // `1` for `[`.
      const text = normalizeIdentifier(slice.slice(1, index))
      const label = node.identifier.toUpperCase()

      if (text === label) {
        file.message(
          'Unexpected full reference link (`[text][label]`) where the identifier can be inferred from the text, expected collapsed reference (`[text][]`)',
          {ancestors: [...parents, node], place: node.position}
        )
      }
    })
  }
)

export default remarkLintNoUnneededFullReferenceLink

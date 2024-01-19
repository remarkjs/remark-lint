/**
 * remark-lint rule to warn when unneeded full reference images are used.
 *
 * ## What is this?
 *
 * This package checks for unneeded full reference images.
 *
 * ## When should I use this?
 *
 * You can use this package to check that reference images are consistent.
 *
 * ## API
 *
 * ### `unified().use(remarkLintNoUnneededFullReferenceImage)`
 *
 * Warn when unneeded full reference images are used.
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
 * Full reference syntax (`![Alt][alt]`) is quite verbose compared to
 * the concise collapsed reference syntax (`![Alt][]`).
 *
 * [api-remark-lint-no-unneeded-full-reference-image]: #unifieduseremarklintnounneededfullreferenceimage
 * [github-unified-transformer]: https://github.com/unifiedjs/unified#transformer
 *
 * @module no-unneeded-full-reference-image
 * @author Titus Wormer
 * @copyright 2019 Titus Wormer
 * @license MIT
 *
 * @example
 *   {"name": "ok.md"}
 *
 *   ![Mercury][] and ![Venus][venus-image].
 *
 *   [mercury]: /mercury.png
 *   [venus-image]: /venus.png
 *
 * @example
 *   {"label": "input", "name": "not-ok.md"}
 *
 *   ![Mercury][mercury].
 *
 *   [mercury]: /mercury.png
 *
 * @example
 *   {"label": "output", "name": "not-ok.md"}
 *
 *   1:1-1:20: Unexpected full reference image (`![text][label]`) where the identifier can be inferred from the text, expected collapsed reference (`![text][]`)
 *
 * @example
 *   {"gfm": true, "label": "input", "name": "escape.md"}
 *
 *   Matrix:
 *
 *   | Kind                      | Text normal | Text escape  | Text character reference |
 *   | ------------------------- | ----------- | ------------ | ------------------------ |
 *   | Label normal              | ![&][&]     | ![\&][&]     | ![&amp;][&]              |
 *   | Label escape              | ![&][\&]    | ![\&][\&]    | ![&amp;][\&]             |
 *   | Label character reference | ![&][&amp;] | ![\&][&amp;] | ![&amp;][&amp;]          |
 *
 *   When using the above matrix, the first row will go to `/a.png`, the second
 *   to `b`, third to `c`.
 *   Removing all labels, you’d instead get it per column: `/a.png`, `b`, `c`.
 *   That shows the label is not needed when it matches the text, and is otherwise.
 *
 *   [&]: /a.png
 *   [\&]: /b.png
 *   [&amp;]: /c.png
 *
 * @example
 *   {"label": "output", "name": "escape.md"}
 *
 *   5:31-5:38: Unexpected full reference image (`![text][label]`) where the identifier can be inferred from the text, expected collapsed reference (`![text][]`)
 *   6:45-6:54: Unexpected full reference image (`![text][label]`) where the identifier can be inferred from the text, expected collapsed reference (`![text][]`)
 *   7:60-7:75: Unexpected full reference image (`![text][label]`) where the identifier can be inferred from the text, expected collapsed reference (`![text][]`)
 */

/**
 * @typedef {import('mdast').Root} Root
 */

import {normalizeIdentifier} from 'micromark-util-normalize-identifier'
import {lintRule} from 'unified-lint-rule'
import {pointEnd, pointStart} from 'unist-util-position'
import {visitParents} from 'unist-util-visit-parents'

const remarkLintNoUnneededFullReferenceImage = lintRule(
  {
    origin: 'remark-lint:no-unneeded-full-reference-image',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-no-unneeded-full-reference-image#readme'
  },
  /**
   * @param {Root} tree
   *   Tree.
   * @returns {undefined}
   *   Nothing.
   */
  function (tree, file) {
    const value = String(file)

    visitParents(tree, 'imageReference', function (node, parents) {
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

      // `2` for `![`.
      const text = normalizeIdentifier(slice.slice(2, index))
      const label = node.identifier.toUpperCase()

      if (text === label) {
        file.message(
          'Unexpected full reference image (`![text][label]`) where the identifier can be inferred from the text, expected collapsed reference (`![text][]`)',
          {ancestors: [...parents, node], place: node.position}
        )
      }
    })
  }
)

export default remarkLintNoUnneededFullReferenceImage

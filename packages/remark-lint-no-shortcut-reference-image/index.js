/**
 * remark-lint rule to warn when shortcut reference images are used.
 *
 * ## What is this?
 *
 * This package checks that collapsed or full reference images are used.
 *
 * ## When should I use this?
 *
 * You can use this package to check that references are consistent.
 *
 * ## API
 *
 * ### `unified().use(remarkLintNoShortcutReferenceImage)`
 *
 * Warn when shortcut reference images are used.
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
 * plain text is intended instead of an image.
 * So it’s recommended to use collapsed or full references instead.
 *
 * [api-remark-lint-no-shortcut-reference-image]: #unifieduseremarklintnoshortcutreferenceimage
 * [github-unified-transformer]: https://github.com/unifiedjs/unified#transformer
 *
 * @module no-shortcut-reference-image
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 *
 * @example
 *   {"name": "ok.md"}
 *
 *   ![Mercury][]
 *
 *   [mercury]: /mercury.png
 *
 * @example
 *   {"label": "input", "name": "not-ok.md"}
 *
 *   ![Mercury]
 *
 *   [mercury]: /mercury.png
 * @example
 *   {"label": "output", "name": "not-ok.md"}
 *
 *   1:1-1:11: Unexpected shortcut reference image (`![text]`), expected collapsed reference (`![text][]`)
 */

/**
 * @typedef {import('mdast').Root} Root
 */

import {lintRule} from 'unified-lint-rule'
import {visitParents} from 'unist-util-visit-parents'

const remarkLintNoShortcutReferenceImage = lintRule(
  {
    origin: 'remark-lint:no-shortcut-reference-image',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-no-shortcut-reference-image#readme'
  },
  /**
   * @param {Root} tree
   *   Tree.
   * @returns {undefined}
   *   Nothing.
   */
  function (tree, file) {
    visitParents(tree, 'imageReference', function (node, parents) {
      if (node.position && node.referenceType === 'shortcut') {
        file.message(
          'Unexpected shortcut reference image (`![text]`), expected collapsed reference (`![text][]`)',
          {ancestors: [...parents, node], place: node.position}
        )
      }
    })
  }
)

export default remarkLintNoShortcutReferenceImage

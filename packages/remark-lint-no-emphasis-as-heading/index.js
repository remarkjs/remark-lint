/**
 * remark-lint rule to warn when emphasis or strong are used instead of a
 * heading.
 *
 * ## What is this?
 *
 * This package checks emphasis and strong.
 *
 * ## When should I use this?
 *
 * You can use this package to check that headings are used.
 *
 * ## API
 *
 * ### `unified().use(remarkLintNoEmphasisAsHeading)`
 *
 * Warn when emphasis or strong are used instead of a heading.
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
 * While not always the case,
 * typically emphasis or strong around the text in a paragraph is used as a
 * “faux” heading.
 * It’s recommended to use actual headings instead.
 *
 * [api-remark-lint-no-emphasis-as-heading]: #unifieduseremarklintnoemphasisasheading
 * [github-unified-transformer]: https://github.com/unifiedjs/unified#transformer
 *
 * @module no-emphasis-as-heading
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 *
 * @example
 *   {"name": "ok.md"}
 *
 *   # Mercury
 *
 *   **Mercury** is the first planet from the Sun and the smallest in the Solar
 *   System.
 *
 * @example
 *   {"label": "input", "name": "not-ok.md"}
 *
 *   **Mercury**
 *
 *   **Mercury** is the first planet from the Sun and the smallest in the Solar
 *   System.
 *
 *   *Venus*
 *
 *   **Venus** is the second planet from the Sun.
 * @example
 *   {"label": "output", "name": "not-ok.md"}
 *
 *   1:1-1:12: Unexpected strong introducing a section, expected a heading instead
 *   6:1-6:8: Unexpected emphasis introducing a section, expected a heading instead
 */

/**
 * @typedef {import('mdast').Root} Root
 * @typedef {import('mdast').RootContent} RootContent
 */

import {phrasing} from 'mdast-util-phrasing'
import {lintRule} from 'unified-lint-rule'
import {SKIP, visitParents} from 'unist-util-visit-parents'

const remarkLintNoEmphasisAsHeading = lintRule(
  {
    origin: 'remark-lint:no-emphasis-as-heading',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-no-emphasis-as-heading#readme'
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

      if (node.type !== 'paragraph') return

      const parent = parents.at(-1)

      if (!node.position || !parent) {
        return
      }

      // Next sibling needs to be a paragraph.
      const siblings = /** @type {Array<RootContent>} */ (parent.children)
      const next = parent.children[siblings.indexOf(node) + 1]

      if (!next || next.type !== 'paragraph') {
        return
      }

      // Only child is emphasis/strong.
      const head = node.children[0]

      if (
        node.children.length !== 1 ||
        (head.type !== 'emphasis' && head.type !== 'strong')
      ) {
        return
      }

      file.message(
        'Unexpected ' +
          head.type +
          ' introducing a section, expected a heading instead',
        {ancestors: [...parents, node, head], place: node.position}
      )
    })
  }
)

export default remarkLintNoEmphasisAsHeading

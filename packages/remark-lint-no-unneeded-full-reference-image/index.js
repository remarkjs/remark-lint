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
 * @example
 *   {"name": "ok.md"}
 *
 *   ![alpha][]
 *   ![Bravo][]
 *   ![Charlie][delta]
 *
 *   [alpha]: a
 *   [bravo]: b
 *   [delta]: d
 *
 * @example
 *   {"name": "not-ok.md", "label": "input"}
 *
 *   ![alpha][alpha]
 *   ![Bravo][bravo]
 *   ![charlie][Charlie]
 *
 *   [alpha]: a
 *   [bravo]: b
 *   [charlie]: c
 *
 * @example
 *   {"name": "not-ok.md", "label": "output"}
 *
 *   1:1-1:16: Remove the image label as it matches the reference text
 *   2:1-2:16: Remove the image label as it matches the reference text
 *   3:1-3:20: Remove the image label as it matches the reference text
 */

/**
 * @typedef {import('mdast').Root} Root
 */

import {normalizeIdentifier} from 'micromark-util-normalize-identifier'
import {lintRule} from 'unified-lint-rule'
import {position} from 'unist-util-position'
import {visit} from 'unist-util-visit'

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
    visit(tree, 'imageReference', function (node) {
      const place = position(node)

      if (
        !place ||
        node.referenceType !== 'full' ||
        /* c8 ignore next */
        normalizeIdentifier(node.alt || '') !== node.identifier.toUpperCase()
      ) {
        return
      }

      file.message(
        'Remove the image label as it matches the reference text',
        place
      )
    })
  }
)

export default remarkLintNoUnneededFullReferenceImage

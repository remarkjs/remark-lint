/**
 * ## When should I use this?
 *
 * You can use this package to check that collapsed reference images are
 * used instead of full references where possible.
 *
 * ## API
 *
 * There are no options.
 *
 * ## Recommendation
 *
 * Full reference syntax (`[Text][text]`) is quite verbose compared to
 * the concise collapsed reference syntax (`[Text][]`).
 *
 * @module no-unneeded-full-reference-image
 * @summary
 *   remark-lint rule to warn when full reference images are used that
 *   could be collapsed.
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
 * @typedef {'-'|'*'|'+'} Marker
 */

import {lintRule} from 'unified-lint-rule'
import {visit} from 'unist-util-visit'
import {generated} from 'unist-util-generated'
import {normalizeIdentifier} from 'micromark-util-normalize-identifier'

const remarkLintNoUnneededFullReferenceImage = lintRule(
  {
    origin: 'remark-lint:no-unneeded-full-reference-image',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-no-unneeded-full-reference-image#readme'
  },
  /** @type {import('unified-lint-rule').Rule<Root, void>} */
  (tree, file) => {
    visit(tree, 'imageReference', (node) => {
      if (
        generated(node) ||
        node.referenceType !== 'full' ||
        // To do: update types to force `alt` existing.
        /* c8 ignore next */
        normalizeIdentifier(node.alt || '') !== node.identifier.toUpperCase()
      ) {
        return
      }

      file.message(
        'Remove the image label as it matches the reference text',
        node
      )
    })
  }
)

export default remarkLintNoUnneededFullReferenceImage

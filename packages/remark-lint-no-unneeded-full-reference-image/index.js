/**
 * @author Titus Wormer
 * @copyright 2019 Titus Wormer
 * @license MIT
 * @module no-unneeded-full-reference-image
 * @fileoverview
 *   Warn when full reference images are used that could be collapsed.
 *
 *   Full references (such as `[Remark][remark]`) can also be written as a
 *   collapsed reference (`[Remark][]`) if normalising the reference text yields
 *   the label.
 *
 * @example {"name": "ok.md"}
 *
 *   ![alpha][]
 *   ![Bravo][]
 *   ![Charlie][delta]
 *
 *   [alpha]: a
 *   [bravo]: b
 *   [delta]: d
 *
 * @example {"name": "not-ok.md", "label": "input"}
 *
 *   ![alpha][alpha]
 *   ![Bravo][bravo]
 *   ![charlie][Charlie]
 *
 *   [alpha]: a
 *   [bravo]: b
 *   [charlie]: c
 *
 * @example {"name": "not-ok.md", "label": "output"}
 *
 *   1:1-1:16: Remove the image label as it matches the reference text
 *   2:1-2:16: Remove the image label as it matches the reference text
 *   3:1-3:20: Remove the image label as it matches the reference text
 */

import {lintRule} from 'unified-lint-rule'
import {visit} from 'unist-util-visit'
import {generated} from 'unist-util-generated'
import {normalizeIdentifier} from 'micromark-util-normalize-identifier'

const remarkLintNoUnneededFullReferenceImage = lintRule(
  'remark-lint:no-unneeded-full-reference-image',
  (tree, file) => {
    visit(tree, 'imageReference', (node) => {
      if (
        generated(node) ||
        node.referenceType !== 'full' ||
        normalizeIdentifier(node.alt) !== node.identifier.toUpperCase()
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

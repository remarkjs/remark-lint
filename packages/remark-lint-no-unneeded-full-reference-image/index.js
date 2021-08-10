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
import {collapseWhiteSpace} from 'collapse-white-space'

const remarkLintNoUnneededFullReferenceImage = lintRule(
  'remark-lint:no-unneeded-full-reference-image',
  noUnneededFullReferenceImage
)

export default remarkLintNoUnneededFullReferenceImage

var reason = 'Remove the image label as it matches the reference text'

function noUnneededFullReferenceImage(tree, file) {
  visit(tree, 'imageReference', visitor)

  function visitor(node) {
    if (
      generated(node) ||
      node.referenceType !== 'full' ||
      normalize(node.alt) !== node.identifier
    ) {
      return
    }

    file.message(reason, node)
  }
}

// See: <https://github.com/remarkjs/remark/blob/cc7867b/packages/remark-parse/lib/util/normalize.js>
function normalize(value) {
  return collapseWhiteSpace(value).toLowerCase()
}

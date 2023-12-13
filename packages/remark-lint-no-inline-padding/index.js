/**
 * Deprecated.
 *
 * ## API
 *
 * to do: remove.
 *
 * [api-remark-lint-no-inline-padding]: #api
 *
 * @module no-inline-padding
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @deprecated
 *   **Stability: Legacy**.
 *   This rule is no longer recommended for use.
 *   With CommonMark, inlines can no longer be padded.
 *   Otherwise they don’t parse.
 *
 * @example
 *   {"name": "ok.md"}
 *
 *   Alpha [bravo](http://echo.fox/trot)
 *
 * @example
 *   {"name": "not-ok.md", "label": "input"}
 *
 *   Alpha [ bravo ](http://echo.fox/trot)
 *
 * @example
 *   {"name": "not-ok.md", "label": "output"}
 *
 *   1:7-1:38: Don’t pad `link` with inner spaces
 */

/**
 * @typedef {import('mdast').Root} Root
 */

import {toString} from 'mdast-util-to-string'
import {lintRule} from 'unified-lint-rule'
import {position} from 'unist-util-position'
import {visit} from 'unist-util-visit'

const remarkLintNoInlinePadding = lintRule(
  {
    origin: 'remark-lint:no-inline-padding',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-no-inline-padding#readme'
  },
  /**
   * @param {Root} tree
   *   Tree.
   * @returns {undefined}
   *   Nothing.
   */
  function (tree, file) {
    // Note: `emphasis`, `strong`, `delete` (GFM) can’t have padding anymore
    // since CM.
    visit(tree, function (node) {
      const place = position(node)

      if ((node.type === 'link' || node.type === 'linkReference') && place) {
        const value = toString(node)

        if (value.charAt(0) === ' ' || value.charAt(value.length - 1) === ' ') {
          file.message('Don’t pad `' + node.type + '` with inner spaces', place)
        }
      }
    })
  }
)

export default remarkLintNoInlinePadding

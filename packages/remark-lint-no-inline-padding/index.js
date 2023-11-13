/**
 * ## When should I use this?
 *
 * You can use this package to check that inline constructs (links) are
 * not padded.
 * Historically, it was possible to pad emphasis, strong, and strikethrough
 * too, but this was removed in CommonMark, making this rule much less useful.
 *
 * ## API
 *
 * There are no options.
 *
 * @module no-inline-padding
 * @summary
 *   remark-lint rule to warn when inline constructs are padded.
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
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

/**
 * remark-lint rule to warn when heading ranks increment with more than
 * 1 at a time.
 *
 * ## What is this?
 *
 * This package checks the increase of headings.
 *
 * ## When should I use this?
 *
 * You can use this package to check the increase of headings.
 *
 * ## API
 *
 * ### `unified().use(remarkLintHeadingIncrement)`
 *
 * Warn when heading ranks increment with more than 1 at a time.
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
 * While markdown is not only used for HTML,
 * HTML accessibility guidelines state that headings should increment by one at
 * a time.
 * As in,
 * say the previous heading had a rank of 2 (so `<h2>`),
 * then the following heading that is to be considered “inside” it should have
 * a rank of 3 (`<h3>`).
 * Due to this,
 * when HTML output is a goal of the document,
 * it’s recommended that this rule is turned on.
 *
 * [api-remark-lint-heading-increment]: #unifieduseremarklintheadingincrement
 * [github-unified-transformer]: https://github.com/unifiedjs/unified#transformer
 *
 * @module heading-increment
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @example
 *   {"name": "ok.md"}
 *
 *   # Alpha
 *
 *   ## Bravo
 *
 * @example
 *   {"name": "not-ok.md", "label": "input"}
 *
 *   # Charlie
 *
 *   ### Delta
 *
 * @example
 *   {"name": "not-ok.md", "label": "output"}
 *
 *   3:1-3:10: Heading levels should increment by one level at a time
 */

/**
 * @typedef {import('mdast').Heading} Heading
 * @typedef {import('mdast').Root} Root
 */

import {lintRule} from 'unified-lint-rule'
import {position} from 'unist-util-position'
import {visit} from 'unist-util-visit'

const remarkLintHeadingIncrement = lintRule(
  {
    origin: 'remark-lint:heading-increment',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-heading-increment#readme'
  },
  /**
   * @param {Root} tree
   *   Tree.
   * @returns {undefined}
   *   Nothing.
   */
  function (tree, file) {
    /** @type {Heading['depth'] | undefined} */
    let previous

    visit(tree, 'heading', function (node) {
      const place = position(node)

      if (place) {
        if (previous && node.depth > previous + 1) {
          file.message(
            'Heading levels should increment by one level at a time',
            place
          )
        }

        previous = node.depth
      }
    })
  }
)

export default remarkLintHeadingIncrement

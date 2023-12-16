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
 *
 * @example
 *   {"name": "html.md"}
 *
 *   In markdown, <b>HTML</b> is supported.
 *
 *   <h1>First heading</h1>
 *
 * @example
 *   {"name": "ok.mdx", "mdx": true}
 *
 *   In MDX, <b>JSX</b> is supported.
 *
 *   <h1>First heading</h1>
 */

/**
 * @typedef {import('mdast').Heading} Heading
 * @typedef {import('mdast').Root} Root
 */

/// <reference types="mdast-util-mdx" />

import {lintRule} from 'unified-lint-rule'
import {position} from 'unist-util-position'
import {visit} from 'unist-util-visit'

const htmlRe = /<h([1-6])/
const jsxNameRe = /^h([1-6])$/

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

    visit(tree, function (node) {
      const place = position(node)

      if (place) {
        /** @type {Heading['depth'] | undefined} */
        let rank

        if (node.type === 'heading') {
          rank = node.depth
        } else if (node.type === 'html') {
          const results = node.value.match(htmlRe)
          rank = results
            ? /** @type {Heading['depth']} */ (Number(results[1]))
            : undefined
        } else if (
          (node.type === 'mdxJsxFlowElement' ||
            node.type === 'mdxJsxTextElement') &&
          node.name
        ) {
          const results = node.name.match(jsxNameRe)
          rank = results
            ? /** @type {Heading['depth']} */ (Number(results[1]))
            : undefined
        }

        if (rank) {
          if (previous && rank > previous + 1) {
            file.message(
              'Heading levels should increment by one level at a time',
              place
            )
          }

          previous = rank
        }
      }
    })
  }
)

export default remarkLintHeadingIncrement

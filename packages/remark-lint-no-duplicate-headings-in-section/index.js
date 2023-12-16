/**
 * remark-lint rule to warn when the same text is used in multiple headings
 * in a section.
 *
 * ## What is this?
 *
 * This package checks that headings are unique in sections.
 *
 * ## When should I use this?
 *
 * You can use this package to check that headings are unique.
 *
 * ## API
 *
 * ### `unified().use(remarkLintNoDuplicateHeadingsInSection)`
 *
 * Warn when the same text is used in multiple headings in a section.
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
 * It’s likely a mistake that the same heading text is used in the same
 * section.
 *
 * [api-remark-lint-no-duplicate-headings-in-section]: #unifieduseremarklintnoduplicateheadingsinsection
 * [github-unified-transformer]: https://github.com/unifiedjs/unified#transformer
 *
 * @module no-duplicate-headings-in-section
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @example
 *   {"name": "ok.md"}
 *
 *   ## Alpha
 *
 *   ### Bravo
 *
 *   ## Charlie
 *
 *   ### Bravo
 *
 *   ### Delta
 *
 *   #### Bravo
 *
 *   #### Echo
 *
 *   ##### Bravo
 *
 * @example
 *   {"name": "not-ok.md", "label": "input"}
 *
 *   ## Foxtrot
 *
 *   ### Golf
 *
 *   ### Golf
 *
 * @example
 *   {"name": "not-ok.md", "label": "output"}
 *
 *   5:1-5:9: Do not use headings with similar content per section (3:1)
 *
 * @example
 *   {"name": "not-ok-tolerant-heading-increment.md", "label": "input"}
 *
 *   # Alpha
 *
 *   #### Bravo
 *
 *   ###### Charlie
 *
 *   #### Bravo
 *
 *   ###### Delta
 *
 * @example
 *   {"name": "not-ok-tolerant-heading-increment.md", "label": "output"}
 *
 *   7:1-7:11: Do not use headings with similar content per section (3:1)
 *
 * @example
 *   {"label": "input", "mdx": true, "name": "mdx.mdx"}
 *
 *   MDX is supported <em>too</em>.
 *
 *   <h2>Alpha</h2>
 *   <h2>Alpha</h2>
 *
 * @example
 *   {"label": "output", "mdx": true, "name": "mdx.mdx"}
 *
 *   4:1-4:15: Do not use headings with similar content per section (3:1)
 */

/**
 * @typedef {import('mdast').Heading} Heading
 * @typedef {import('mdast').Root} Root
 */

/// <reference types="mdast-util-mdx" />

import {toString} from 'mdast-util-to-string'
import {lintRule} from 'unified-lint-rule'
import {pointStart, position} from 'unist-util-position'
import {stringifyPosition} from 'unist-util-stringify-position'
import {visit} from 'unist-util-visit'

const jsxNameRe = /^h([1-6])$/

const remarkLintNoDuplicateHeadingsInSection = lintRule(
  {
    origin: 'remark-lint:no-duplicate-headings-in-section',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-no-duplicate-headings-in-section#readme'
  },
  /**
   * @param {Root} tree
   *   Tree.
   * @returns {undefined}
   *   Nothing.
   */
  function (tree, file) {
    /** @type {Array<Map<string, string>>} */
    const stack = []

    visit(tree, function (node) {
      /** @type {Heading['depth'] | undefined} */
      let rank

      if (node.type === 'heading') {
        rank = node.depth
      } else if (
        (node.type === 'mdxJsxFlowElement' ||
          node.type === 'mdxJsxTextElement') &&
        node.name
      ) {
        const match = node.name.match(jsxNameRe)
        rank = match
          ? /** @type {Heading['depth']} */ (Number(match[1]))
          : undefined
      }

      if (rank) {
        const value = toString(node).toLowerCase()
        const index = rank - 1
        const scope = stack[index] || (stack[index] = new Map())
        const duplicate = scope.get(value)
        const place = position(node)
        const start = pointStart(node)

        if (place && duplicate) {
          file.message(
            'Do not use headings with similar content per section (' +
              duplicate +
              ')',
            place
          )
        }

        scope.set(value, stringifyPosition(start))
        // Drop things after it.
        stack.length = rank
      }
    })
  }
)

export default remarkLintNoDuplicateHeadingsInSection

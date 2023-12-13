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
 */

/**
 * @typedef {import('mdast').Heading} Heading
 * @typedef {import('mdast').Root} Root
 */

import {toString} from 'mdast-util-to-string'
import {lintRule} from 'unified-lint-rule'
import {pointStart, position} from 'unist-util-position'
import {stringifyPosition} from 'unist-util-stringify-position'
import {visit} from 'unist-util-visit'

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

    visit(tree, 'heading', function (node) {
      const value = toString(node).toUpperCase()
      const index = node.depth - 1
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
      stack.length = node.depth
    })
  }
)

export default remarkLintNoDuplicateHeadingsInSection

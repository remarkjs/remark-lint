/**
 * ## When should I use this?
 *
 * You can use this package to check that headings with the same text are
 * used once per section.
 *
 * ## API
 *
 * There are no options.
 *
 * ## Recommendation
 *
 * It’s likely a mistake that the same heading text is used in the same
 * section.
 *
 * @module no-duplicate-headings-in-section
 * @summary
 *   remark-lint rule to warn when headings with the same text are used
 *   multiple times per section.
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
 * @typedef {import('mdast').Root} Root
 * @typedef {import('mdast').Heading} Heading
 */

import {lintRule} from 'unified-lint-rule'
import {pointStart} from 'unist-util-position'
import {generated} from 'unist-util-generated'
import {visit} from 'unist-util-visit'
import {stringifyPosition} from 'unist-util-stringify-position'
import {toString} from 'mdast-util-to-string'

const remarkLintNoDuplicateHeadingsInSection = lintRule(
  {
    origin: 'remark-lint:no-duplicate-headings-in-section',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-no-duplicate-headings-in-section#readme'
  },
  /** @type {import('unified-lint-rule').Rule<Root, void>} */
  (tree, file) => {
    /** @type {Array<Record<string, Heading>>} */
    let stack = []

    visit(tree, 'heading', (node) => {
      const depth = node.depth
      const value = toString(node).toUpperCase()
      const index = depth - 1
      const scope = stack[index] || (stack[index] = {})
      const duplicate = scope[value]

      if (!generated(node) && duplicate) {
        file.message(
          'Do not use headings with similar content per section (' +
            stringifyPosition(pointStart(duplicate)) +
            ')',
          node
        )
      }

      scope[value] = node
      stack = stack.slice(0, depth)
    })
  }
)

export default remarkLintNoDuplicateHeadingsInSection

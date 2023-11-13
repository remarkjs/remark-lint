/**
 * ## When should I use this?
 *
 * You can use this package to check the heading rank of the first heading.
 *
 * ## API
 *
 * The following options (default: `1`) are accepted:
 *
 * *   `number` (example `1`)
 *     — expected rank of first heading
 *
 * ## Recommendation
 *
 * In most cases you’d want to first heading in a markdown document to start at
 * rank 1.
 * In some cases a different rank makes more sense, such as when building a blog
 * and generating the primary heading from frontmatter metadata, in which case
 * a value of `2` can be defined here.
 *
 * @module first-heading-level
 * @summary
 *   remark-lint rule to warn when the first heading has an unexpected rank.
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @example
 *   {"name": "ok.md"}
 *
 *   # The default is to expect a level one heading
 *
 * @example
 *   {"name": "ok-html.md"}
 *
 *   <h1>An HTML heading is also seen by this rule.</h1>
 *
 * @example
 *   {"name": "ok-delayed.md"}
 *
 *   You can use markdown content before the heading.
 *
 *   <div>Or non-heading HTML</div>
 *
 *   <h1>So the first heading, be it HTML or markdown, is checked</h1>
 *
 * @example
 *   {"name": "not-ok.md", "label": "input"}
 *
 *   ## Bravo
 *
 *   Paragraph.
 *
 * @example
 *   {"name": "not-ok.md", "label": "output"}
 *
 *   1:1-1:9: First heading level should be `1`
 *
 * @example
 *   {"name": "not-ok-html.md", "label": "input"}
 *
 *   <h2>Charlie</h2>
 *
 *   Paragraph.
 *
 * @example
 *   {"name": "not-ok-html.md", "label": "output"}
 *
 *   1:1-1:17: First heading level should be `1`
 *
 * @example
 *   {"name": "ok.md", "config": 2}
 *
 *   ## Delta
 *
 *   Paragraph.
 *
 * @example
 *   {"name": "ok-html.md", "config": 2}
 *
 *   <h2>Echo</h2>
 *
 *   Paragraph.
 *
 * @example
 *   {"name": "not-ok.md", "config": 2, "label": "input"}
 *
 *   # Foxtrot
 *
 *   Paragraph.
 *
 * @example
 *   {"name": "not-ok.md", "config": 2, "label": "output"}
 *
 *   1:1-1:10: First heading level should be `2`
 *
 * @example
 *   {"name": "not-ok-html.md", "config": 2, "label": "input"}
 *
 *   <h1>Golf</h1>
 *
 *   Paragraph.
 *
 * @example
 *   {"name": "not-ok-html.md", "config": 2, "label": "output"}
 *
 *   1:1-1:14: First heading level should be `2`
 */

/**
 * @typedef {import('mdast').Heading} Heading
 * @typedef {import('mdast').Root} Root
 */

/**
 * @typedef {Heading['depth']} Depth
 *   Styles.
 *
 * @typedef {Depth} Options
 *   Configuration.
 */

import {lintRule} from 'unified-lint-rule'
import {position} from 'unist-util-position'
import {EXIT, visit} from 'unist-util-visit'

const re = /<h([1-6])/

const remarkLintFirstHeadingLevel = lintRule(
  {
    origin: 'remark-lint:first-heading-level',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-first-heading-level#readme'
  },
  /**
   * @param {Root} tree
   *   Tree.
   * @param {Options | null | undefined} [options=1]
   *   Configuration (default: `1`).
   * @returns {undefined}
   *   Nothing.
   */
  function (tree, file, options) {
    const option = options || 1

    visit(tree, function (node) {
      const place = position(node)

      if (place) {
        /** @type {Depth | undefined} */
        let rank

        // To do: MDX?
        if (node.type === 'heading') {
          rank = node.depth
        } else if (node.type === 'html') {
          const results = node.value.match(re)
          rank = results ? /** @type {Depth} */ (Number(results[1])) : undefined
        }

        if (rank) {
          if (rank !== option) {
            file.message(
              'First heading level should be `' + option + '`',
              place
            )
          }

          return EXIT
        }
      }
    })
  }
)

export default remarkLintFirstHeadingLevel

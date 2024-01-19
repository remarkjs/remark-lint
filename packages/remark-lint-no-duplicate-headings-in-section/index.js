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
 *   # Planets
 *
 *   ## Venus
 *
 *   ### Discovery
 *
 *   ## Mars
 *
 *   ### Discovery
 *
 *   ### Phobos
 *
 *   #### Discovery
 *
 * @example
 *   {"label": "input", "name": "not-ok.md"}
 *
 *   # Planets
 *
 *   ## Mars
 *
 *   ### Discovery
 *
 *   ### Discovery
 *
 * @example
 *   {"label": "output", "name": "not-ok.md"}
 *
 *   7:1-7:14: Unexpected heading with equivalent text in section, expected unique headings
 *
 * @example
 *   {"label": "input", "name": "tolerant-heading-increment.md"}
 *
 *   # Planets
 *
 *   #### Discovery
 *
 *   ###### Phobos
 *
 *   #### Discovery
 *
 *   ###### Deimos
 *
 * @example
 *   {"label": "output", "name": "tolerant-heading-increment.md"}
 *
 *   7:1-7:15: Unexpected heading with equivalent text in section, expected unique headings
 *
 * @example
 *   {"label": "input", "mdx": true, "name": "mdx.mdx"}
 *
 *   MDX is supported <em>too</em>.
 *
 *   <h1>Planets</h1>
 *   <h2>Mars</h2>
 *   <h3>Discovery</h3>
 *   <h3>Discovery</h3>
 *
 * @example
 *   {"label": "output", "mdx": true, "name": "mdx.mdx"}
 *
 *   6:1-6:19: Unexpected heading with equivalent text in section, expected unique headings
 */

/**
 * @typedef {import('mdast').Heading} Heading
 * @typedef {import('mdast').Nodes} Nodes
 * @typedef {import('mdast').Root} Root
 */

/// <reference types="mdast-util-mdx" />

import {ok as assert} from 'devlop'
import {toString} from 'mdast-util-to-string'
import {lintRule} from 'unified-lint-rule'
import {visitParents} from 'unist-util-visit-parents'
import {VFileMessage} from 'vfile-message'

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
    /** @type {Array<Map<string, Array<Nodes>>>} */
    const stack = []

    visitParents(tree, function (node, parents) {
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
        const ancestors = [...parents, node]
        const value = toString(node).toLowerCase()
        const index = rank - 1
        const map = stack[index] || (stack[index] = new Map())
        const duplicateAncestors = map.get(value)

        if (node.position && duplicateAncestors) {
          const duplicate = duplicateAncestors.at(-1)
          assert(duplicate) // Always defined.

          file.message(
            'Unexpected heading with equivalent text in section, expected unique headings',
            {
              ancestors,
              cause: new VFileMessage('Equivalent heading text defined here', {
                ancestors: duplicateAncestors,
                place: duplicate.position,
                source: 'remark-lint',
                ruleId: 'no-duplicate-headings-in-section'
              }),
              place: node.position
            }
          )
        }

        map.set(value, ancestors)
        // Drop things after it.
        stack.length = rank
      }
    })
  }
)

export default remarkLintNoDuplicateHeadingsInSection

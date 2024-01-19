/**
 * remark-lint rule to warn when the same text is used in multiple headings.
 *
 * ## What is this?
 *
 * This package checks that headings are unique.
 *
 * ## When should I use this?
 *
 * You can use this package to check that headings are unique.
 *
 * ## API
 *
 * ### `unified().use(remarkLintNoDuplicateHeadings)`
 *
 * Warn when the same text is used in multiple headings.
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
 * Headings having unique text helps screen reader users,
 * who typically use “jump to heading” features to navigate within a page,
 * which reads headings out loud.
 *
 * It also helps because often headings receive automatic unique IDs,
 * and when the same heading text is used,
 * they are suffixed with a number based on where they are positioned in the
 * document,
 * which makes linking to them prone to changes.
 *
 * [api-remark-lint-no-duplicate-headings]: #unifieduseremarklintnoduplicateheadings
 * [github-unified-transformer]: https://github.com/unifiedjs/unified#transformer
 *
 * @module no-duplicate-headings
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 *
 * @example
 *   {"name": "ok.md"}
 *
 *   # Mercury
 *
 *   ## Venus
 *
 * @example
 *   {"label": "input", "name": "not-ok.md"}
 *
 *   # Mercury
 *
 *   ## Mercury
 *
 *   ## [Mercury](http://example.com/mercury/)
 * @example
 *   {"label": "output", "name": "not-ok.md"}
 *
 *   3:1-3:11: Unexpected heading with equivalent text, expected unique headings
 *   5:1-5:42: Unexpected heading with equivalent text, expected unique headings
 *
 * @example
 *   {"label": "input", "mdx": true, "name": "mdx.mdx"}
 *
 *   <h1>Mercury</h1>
 *   <h2>Mercury</h2>
 * @example
 *   {"label": "output", "mdx": true, "name": "mdx.mdx"}
 *
 *   2:1-2:17: Unexpected heading with equivalent text, expected unique headings
 */

/**
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

const remarkLintNoDuplicateHeadings = lintRule(
  {
    origin: 'remark-lint:no-duplicate-headings',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-no-duplicate-headings#readme'
  },
  /**
   * @param {Root} tree
   *   Tree.
   * @returns {undefined}
   *   Nothing.
   */
  function (tree, file) {
    /** @type {Map<string, Array<Nodes>>} */
    const map = new Map()

    visitParents(tree, function (node, parents) {
      if (
        node.type === 'heading' ||
        ((node.type === 'mdxJsxFlowElement' ||
          node.type === 'mdxJsxTextElement') &&
          node.name &&
          jsxNameRe.test(node.name))
      ) {
        const ancestors = [...parents, node]
        const value = toString(node).toLowerCase()
        const duplicateAncestors = map.get(value)

        if (node.position && duplicateAncestors) {
          const duplicate = duplicateAncestors.at(-1)
          assert(duplicate) // Always defined.

          file.message(
            'Unexpected heading with equivalent text, expected unique headings',
            {
              ancestors,
              cause: new VFileMessage('Equivalent heading text defined here', {
                ancestors: duplicateAncestors,
                place: duplicate.position,
                source: 'remark-lint',
                ruleId: 'no-duplicate-headings'
              }),
              place: node.position
            }
          )
        }

        map.set(value, ancestors)
      }
    })
  }
)

export default remarkLintNoDuplicateHeadings

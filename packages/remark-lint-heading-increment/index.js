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
 *
 * @example
 *   {"name": "ok.md"}
 *
 *   # Mercury
 *
 *   ## Nomenclature
 *
 * @example
 *   {"name": "also-ok.md"}
 *
 *   #### Impact basins and craters
 *
 *   #### Plains
 *
 *   #### Compressional features
 *
 * @example
 *   {"label": "input", "name": "not-ok.md"}
 *
 *   # Mercury
 *
 *   ### Internal structure
 *
 *   ### Surface geology
 *
 *   ## Observation history
 *
 *   #### Mariner 10
 *
 * @example
 *   {"label": "output", "name": "not-ok.md"}
 *
 *   3:1-3:23: Unexpected heading rank `3`, exected rank `2`
 *   5:1-5:20: Unexpected heading rank `3`, exected rank `2`
 *   9:1-9:16: Unexpected heading rank `4`, exected rank `3`
 *
 * @example
 *   {"label": "input", "name": "html.md"}
 *
 *   # Mercury
 *
 *   <b>Mercury</b> is the first planet from the Sun and the smallest
 *   in the Solar System.
 *
 *   <h3>Internal structure</h3>
 *
 *   <h2>Orbit, rotation, and longitude</h2>
 * @example
 *   {"label": "output", "name": "html.md"}
 *
 *   6:1-6:28: Unexpected heading rank `3`, exected rank `2`
 *
 * @example
 *   {"mdx": true, "name": "mdx.mdx"}
 *
 *   # Mercury
 *
 *   <b>Mercury</b> is the first planet from the Sun and the smallest
 *   in the Solar System.
 *
 *   <h3>Internal structure</h3>
 *
 *   <h2>Orbit, rotation, and longitude</h2>
 * @example
 *   {"label": "output", "mdx": true, "name": "mdx.mdx"}
 *
 *   6:1-6:28: Unexpected heading rank `3`, exected rank `2`
 */

/**
 * @typedef {import('mdast').Heading} Heading
 * @typedef {import('mdast').Nodes} Nodes
 * @typedef {import('mdast').Root} Root
 */

/// <reference types="mdast-util-mdx" />

import {ok as assert} from 'devlop'
import {lintRule} from 'unified-lint-rule'
import {visitParents} from 'unist-util-visit-parents'
import {VFileMessage} from 'vfile-message'

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
    /** @type {Array<Array<Nodes> | undefined>} */
    const stack = []

    visitParents(tree, function (node, parents) {
      const rank = inferRank(node)

      if (rank) {
        let index = rank
        /** @type {Array<Nodes> | undefined} */
        let closestAncestors

        while (index--) {
          if (stack[index]) {
            closestAncestors = stack[index]
            break
          }
        }

        if (closestAncestors) {
          const parent = closestAncestors.at(-1)
          assert(parent) // Always defined.
          const parentRank = inferRank(parent)
          assert(parentRank) // Always defined.

          if (node.position && rank > parentRank + 1) {
            file.message(
              'Unexpected heading rank `' +
                rank +
                '`, exected rank `' +
                (parentRank + 1) +
                '`',
              {
                ancestors: [...parents, node],
                cause: new VFileMessage('Parent heading defined here', {
                  ancestors: closestAncestors,
                  place: parent.position,
                  source: 'remark-lint',
                  ruleId: 'heading-increment'
                }),
                place: node.position
              }
            )
          }
        }

        stack[rank] = [...parents, node]
        // Drop things after it.
        stack.length = rank + 1
      }
    })
  }
)

export default remarkLintHeadingIncrement

/**
 * Get rank of a node.
 *
 * @param {Nodes} node
 *   Node.
 * @returns {Heading['depth'] | undefined}
 *   Rank, if heading.
 */
function inferRank(node) {
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
    (node.type === 'mdxJsxFlowElement' || node.type === 'mdxJsxTextElement') &&
    node.name
  ) {
    const results = node.name.match(jsxNameRe)
    rank = results
      ? /** @type {Heading['depth']} */ (Number(results[1]))
      : undefined
  }

  return rank
}

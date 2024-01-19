/**
 * remark-lint rule to warn when top-level headings are used multiple times.
 *
 * ## What is this?
 *
 * This package checks that top-level headings are unique.
 *
 * ## When should I use this?
 *
 * You can use this package to check heading structure.
 *
 * ## API
 *
 * ### `unified().use(remarkLintNoMultipleToplevelHeadings[, options])`
 *
 * Warn when top-level headings are used multiple times.
 *
 * ###### Parameters
 *
 * * `options` ([`Options`][api-options], default: `1`)
 *   — configuration
 *
 * ###### Returns
 *
 * Transform ([`Transformer` from `unified`][github-unified-transformer]).
 *
 * ### `Depth`
 *
 * Depth (TypeScript type).
 *
 * ###### Type
 *
 * ```ts
 * type Depth = 1 | 2 | 3 | 4 | 5 | 6
 * ```
 *
 * ### `Options`
 *
 * Configuration (TypeScript type).
 *
 * ###### Type
 *
 * ```ts
 * type Options = Depth
 * ```
 *
 * ## Recommendation
 *
 * Documents should almost always have one main heading,
 * which is typically a heading with a rank of `1`.
 *
 * [api-depth]: #depth
 * [api-options]: #options
 * [api-remark-lint-no-multiple-toplevel-headings]: #unifieduseremarklintnomultipletoplevelheadings-options
 * [github-remark-stringify]: https://github.com/remarkjs/remark/tree/main/packages/remark-stringify
 * [github-unified-transformer]: https://github.com/unifiedjs/unified#transformer
 *
 * @module no-multiple-toplevel-headings
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
 *   # Venus
 *
 *   # Mercury
 * @example
 *   {"label": "output", "name": "not-ok.md"}
 *
 *   3:1-3:10: Unexpected duplicate toplevel heading, exected a single heading with rank `1`
 *
 * @example
 *   {"config": 2, "label": "input", "name": "not-ok.md"}
 *
 *   ## Venus
 *
 *   ## Mercury
 * @example
 *   {"config": 2, "label": "output", "name": "not-ok.md"}
 *
 *   3:1-3:11: Unexpected duplicate toplevel heading, exected a single heading with rank `2`
 *
 * @example
 *   {"label": "input", "name": "html.md"}
 *
 *   Venus <b>and</b> mercury.
 *
 *   <h1>Earth</h1>
 *
 *   <h1>Mars</h1>
 * @example
 *   {"label": "output", "name": "html.md"}
 *
 *   5:1-5:14: Unexpected duplicate toplevel heading, exected a single heading with rank `1`
 *
 * @example
 *   {"label": "input", "mdx": true, "name": "mdx.mdx"}
 *
 *   Venus <b>and</b> mercury.
 *
 *   <h1>Earth</h1>
 *   <h1>Mars</h1>
 * @example
 *   {"label": "output", "mdx": true, "name": "mdx.mdx"}
 *
 *   4:1-4:14: Unexpected duplicate toplevel heading, exected a single heading with rank `1`
 */

/**
 * @typedef {import('mdast').Heading} Heading
 * @typedef {import('mdast').Nodes} Nodes
 * @typedef {import('mdast').Root} Root
 */

/**
 * @typedef {Heading['depth']} Depth
 *   Styles.
 *
 * @typedef {Depth} Options
 *   Configuration.
 */

/// <reference types="mdast-util-mdx" />

import {ok as assert} from 'devlop'
import {lintRule} from 'unified-lint-rule'
import {visitParents} from 'unist-util-visit-parents'
import {VFileMessage} from 'vfile-message'

const htmlRe = /<h([1-6])/
const jsxNameRe = /^h([1-6])$/

const remarkLintNoMultipleToplevelHeadings = lintRule(
  {
    origin: 'remark-lint:no-multiple-toplevel-headings',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-no-multiple-toplevel-headings#readme'
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
    /** @type {Array<Nodes> | undefined} */
    let duplicateAncestors

    visitParents(tree, function (node, parents) {
      /** @type {Depth | undefined} */
      let rank

      if (node.type === 'heading') {
        rank = node.depth
      } else if (node.type === 'html') {
        const results = node.value.match(htmlRe)
        rank = results ? /** @type {Depth} */ (Number(results[1])) : undefined
      } else if (
        (node.type === 'mdxJsxFlowElement' ||
          node.type === 'mdxJsxTextElement') &&
        node.name
      ) {
        const results = node.name.match(jsxNameRe)
        rank = results ? /** @type {Depth} */ (Number(results[1])) : undefined
      }

      if (rank) {
        const ancestors = [...parents, node]

        if (node.position && rank === option) {
          if (duplicateAncestors) {
            const duplicate = duplicateAncestors.at(-1)
            assert(duplicate) // Always defined.

            file.message(
              'Unexpected duplicate toplevel heading, exected a single heading with rank `' +
                rank +
                '`',
              {
                ancestors,
                cause: new VFileMessage(
                  'Toplevel heading already defined here',
                  {
                    ancestors: duplicateAncestors,
                    place: duplicate.position,
                    source: 'remark-lint',
                    ruleId: 'no-multiple-toplevel-headings'
                  }
                ),
                place: node.position
              }
            )
          } else {
            duplicateAncestors = ancestors
          }
        }
      }
    })
  }
)

export default remarkLintNoMultipleToplevelHeadings

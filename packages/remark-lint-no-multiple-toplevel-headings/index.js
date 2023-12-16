/**
 * remark-lint rule to warn when multiple top-level headings are used.
 *
 * ## What is this?
 *
 * This package checks that no more than one top level heading is used.
 *
 * ## When should I use this?
 *
 * You can use this package to check heading structure.
 *
 * ## API
 *
 * ### `unified().use(remarkLintNoMultipleToplevelHeadings[, options])`
 *
 * Warn when multiple top-level headings are used.
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
 * @example
 *   {"name": "ok.md", "config": 1}
 *
 *   # Foo
 *
 *   ## Bar
 *
 * @example
 *   {"name": "not-ok.md", "config": 1, "label": "input"}
 *
 *   # Foo
 *
 *   # Bar
 *
 * @example
 *   {"name": "not-ok.md", "config": 1, "label": "output"}
 *
 *   3:1-3:6: Don’t use multiple top level headings (1:1)
 *
 * @example
 *   {"label": "input", "name": "html.md"}
 *
 *   In markdown, <b>HTML</b> is supported.
 *
 *   <h1>First</h1>
 *
 *   <h1>Second</h1>
 * @example
 *   {"label": "output", "name": "html.md"}
 *
 *   5:1-5:16: Don’t use multiple top level headings (3:1)
 *
 * @example
 *   {"label": "input", "mdx": true, "name": "mdx.mdx"}
 *
 *   In MDX, <b>JSX</b> is supported.
 *
 *   <h1>First</h1>
 *   <h1>Second</h1>
 * @example
 *   {"label": "output", "mdx": true, "name": "mdx.mdx"}
 *
 *   4:1-4:16: Don’t use multiple top level headings (3:1)
 */

/**
 * @typedef {import('mdast').Root} Root
 * @typedef {import('mdast').Heading} Heading
 */

/**
 * @typedef {Heading['depth']} Depth
 *   Styles.
 *
 * @typedef {Depth} Options
 *   Configuration.
 */

/// <reference types="mdast-util-mdx" />

import {lintRule} from 'unified-lint-rule'
import {pointStart, position} from 'unist-util-position'
import {stringifyPosition} from 'unist-util-stringify-position'
import {visit} from 'unist-util-visit'

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
    /** @type {string | undefined} */
    let duplicate

    visit(tree, function (node) {
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
        const start = pointStart(node)
        const place = position(node)

        if (start && place && rank === option) {
          if (duplicate) {
            file.message(
              'Don’t use multiple top level headings (' + duplicate + ')',
              place
            )
          } else {
            duplicate = stringifyPosition(start)
          }
        }
      }
    })
  }
)

export default remarkLintNoMultipleToplevelHeadings

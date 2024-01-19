/**
 * remark-lint rule to warn when the first heading has an unexpected rank.
 *
 * ## What is this?
 *
 * This package checks the rank of the first heading.
 *
 * ## When should I use this?
 *
 * You can use this package to check that the rank of first headings is
 * consistent.
 *
 * ## API
 *
 * ### `unified().use(remarkLintFirstHeadingLevel[, options])`
 *
 * Warn when the first heading has an unexpected rank.
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
 * ### `Options`
 *
 * Configuration (TypeScript type).
 *
 * ###### Type
 *
 * ```ts
 * type Options = 1 | 2 | 3 | 4 | 5 | 6
 * ```
 *
 * ## Recommendation
 *
 * In most cases you’d want to first heading in a markdown document to start at
 * rank `1`.
 * In some cases a different rank makes more sense,
 * such as when building a blog and generating the primary heading from
 * frontmatter metadata,
 * in which case a value of `2` can be defined here or the rule can be turned
 * off.
 *
 * [api-options]: #options
 * [api-remark-lint-first-heading-level]: #unifieduseremarklintfirstheadinglevel-options
 * [github-unified-transformer]: https://github.com/unifiedjs/unified#transformer
 *
 * @module first-heading-level
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 *
 * @example
 *   {"name": "ok.md"}
 *
 *   # Mercury
 *
 * @example
 *   {"name": "ok-delay.md"}
 *
 *   Mercury.
 *
 *   # Venus
 *
 * @example
 *   {"label": "input", "name": "not-ok.md"}
 *
 *   ## Mercury
 *
 *   Venus.
 * @example
 *   {"label": "output", "name": "not-ok.md"}
 *
 *   1:1-1:11: Unexpected first heading rank `2`, expected rank `1`
 *
 * @example
 *   {"config": 2, "name": "ok.md"}
 *
 *   ## Mercury
 *
 *   Venus.
 *
 * @example
 *   {"name": "ok-html.md"}
 *
 *   <div>Mercury.</div>
 *
 *   <h1>Venus</h1>
 *
 * @example
 *   {"mdx": true, "name": "ok-mdx.mdx"}
 *
 *   <div>Mercury.</div>
 *
 *   <h1>Venus</h1>
 *
 * @example
 *   {"config": "🌍", "label": "output", "name": "not-ok-options.md", "positionless": true}
 *
 *   1:1: Unexpected value `🌍` for `options`, expected `1`, `2`, `3`, `4`, `5`, or `6`
 */

/**
 * @typedef {import('mdast').Heading} Heading
 * @typedef {import('mdast').Root} Root
 */

/**
 * @typedef {1 | 2 | 3 | 4 | 5 | 6} Options
 *   Configuration.
 */

/// <reference types="mdast-util-mdx" />

import {lintRule} from 'unified-lint-rule'
import {EXIT, visitParents} from 'unist-util-visit-parents'

const htmlRe = /<h([1-6])/
const jsxNameRe = /^h([1-6])$/

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
    /** @type {Heading['depth']} */
    let expected

    if (options === null || options === undefined) {
      expected = 1
    } else if (
      options === 1 ||
      options === 2 ||
      options === 3 ||
      options === 4 ||
      options === 5 ||
      options === 6
    ) {
      expected = options
    } else {
      file.fail(
        'Unexpected value `' +
          options +
          '` for `options`, expected `1`, `2`, `3`, `4`, `5`, or `6`'
      )
    }

    visitParents(tree, function (node, parents) {
      /** @type {Heading['depth'] | undefined} */
      let actual

      if (node.type === 'heading') {
        actual = node.depth
      } else if (node.type === 'html') {
        const results = node.value.match(htmlRe)
        actual = results
          ? /** @type {Heading['depth']} */ (Number(results[1]))
          : undefined
      } else if (
        (node.type === 'mdxJsxFlowElement' ||
          node.type === 'mdxJsxTextElement') &&
        node.name
      ) {
        const results = node.name.match(jsxNameRe)
        actual = results
          ? /** @type {Heading['depth']} */ (Number(results[1]))
          : undefined
      }

      if (actual && node.position) {
        if (node.position && actual !== expected) {
          file.message(
            'Unexpected first heading rank `' +
              actual +
              '`, expected rank `' +
              expected +
              '`',
            {ancestors: [...parents, node], place: node.position}
          )
        }

        return EXIT
      }
    })
  }
)

export default remarkLintFirstHeadingLevel

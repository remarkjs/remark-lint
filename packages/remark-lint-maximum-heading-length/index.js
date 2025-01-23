/**
 * remark-lint rule to warn when headings are too long.
 *
 * ## What is this?
 *
 * This package checks the length of heading text.
 *
 * ## When should I use this?
 *
 * You can use this package to check that heading text is within reason.
 *
 * ## API
 *
 * ### `unified().use(remarkLintMaximumHeadingLength[, options])`
 *
 * Warn when headings are too long.
 *
 * ###### Parameters
 *
 * * `options` (`number`, default: `60`)
 *   — preferred max size
 *
 * ###### Returns
 *
 * Transform ([`Transformer` from `unified`][github-unified-transformer]).
 *
 * ## Recommendation
 *
 * While this rule is sometimes annoying,
 * reasonable size headings do help SEO purposes (bots prefer reasonable
 * headings),
 * visual users (headings are typically displayed quite large),
 * and users of screen readers (who use “jump to heading” features that read
 * every heading out loud to navigate within a page).
 *
 * [api-remark-lint-maximum-heading-length]: #unifieduseremarklintmaximumheadinglength-options
 * [github-unified-transformer]: https://github.com/unifiedjs/unified#transformer
 *
 * @module maximum-heading-length
 * @author Titus Wormer
 * @copyright Titus Wormer
 * @license MIT
 * @example
 *   {"name": "ok.md"}
 *
 *   # Mercury is the first planet from the Sun
 *
 * @example
 *   {"config": 30, "label": "input", "name": "not-ok.md"}
 *
 *   # Mercury is the first planet from the Sun
 *
 * @example
 *   {"config": 30, "label": "output", "name": "not-ok.md"}
 *
 *   1:1-1:43: Unexpected `40` characters in heading, expected at most `30` characters
 *
 * @example
 *   {"config": 30, "label": "input", "mdx": true, "name": "mdx.mdx"}
 *
 *   <h1>Mercury is the first planet from the Sun</h1>
 * @example
 *   {"config": 30, "label": "output", "mdx": true, "name": "mdx.mdx"}
 *
 *   1:1-1:50: Unexpected `40` characters in heading, expected at most `30` characters
 *
 * @example
 *   {"config": "🌍", "label": "output", "name": "not-ok.md", "positionless": true}
 *
 *   1:1: Unexpected value `🌍` for `options`, expected `number`
 */

/**
 * @import {Root} from 'mdast'
 * @import {} from 'mdast-util-mdx'
 */

import {toString} from 'mdast-util-to-string'
import {lintRule} from 'unified-lint-rule'
import {position} from 'unist-util-position'
import {visitParents} from 'unist-util-visit-parents'

const jsxNameRe = /^h([1-6])$/

const remarkLintMaximumHeadingLength = lintRule(
  {
    origin: 'remark-lint:maximum-heading-length',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-maximum-heading-length#readme'
  },
  /**
   * @param {Root} tree
   *   Tree.
   * @param {number | null | undefined} [options=60]
   *   Configuration (default: `60`).
   * @returns {undefined}
   *   Nothing.
   */
  function (tree, file, options) {
    let expected = 60

    if (options === null || options === undefined) {
      // Empty.
    } else if (typeof options === 'number') {
      expected = options
    } else {
      file.fail(
        'Unexpected value `' + options + '` for `options`, expected `number`'
      )
    }

    // Note: HTML headings cannot properly be checked,
    // because for markdown, blocks are one single raw string.

    visitParents(tree, function (node, parents) {
      if (
        node.type === 'heading' ||
        ((node.type === 'mdxJsxFlowElement' ||
          node.type === 'mdxJsxTextElement') &&
          node.name &&
          jsxNameRe.test(node.name))
      ) {
        const place = position(node)
        const actual = Array.from(toString(node, {includeHtml: false})).length

        if (place && actual > expected) {
          file.message(
            'Unexpected `' +
              actual +
              '` characters in heading, expected at most `' +
              expected +
              '` characters',
            {ancestors: [...parents, node], place}
          )
        }
      }
    })
  }
)

export default remarkLintMaximumHeadingLength

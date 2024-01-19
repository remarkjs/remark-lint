/**
 * remark-lint rule to warn when headings end in irregular characters.
 *
 * ## What is this?
 *
 * This package checks heading text.
 *
 * ## When should I use this?
 *
 * You can use this package to check that heading text is consistent.
 *
 * ## API
 *
 * ### `unified().use(remarkLintNoHeadingPunctuation[, options])`
 *
 * Warn when headings end in irregular characters.
 *
 * ###### Parameters
 *
 * * `options` (`RegExp` or `string`, default: `/[!,.:;?]/u`)
 *   — configuration,
 *   when string wrapped in `new RegExp('[' + x + ']', 'u')` so make sure to
 *   escape regexp characters
 *
 * ###### Returns
 *
 * Transform ([`Transformer` from `unified`][github-unified-transformer]).
 *
 * [api-remark-lint-no-heading-punctuation]: #unifieduseremarklintnoheadingpunctuation-options
 * [github-unified-transformer]: https://github.com/unifiedjs/unified#transformer
 *
 * @module no-heading-punctuation
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
 *   {"label": "input", "name": "not-ok.md"}
 *
 *   # Mercury:
 *
 *   # Venus?
 *
 *   # Earth!
 *
 *   # Mars,
 *
 *   # Jupiter;
 * @example
 *   {"label": "output", "name": "not-ok.md"}
 *
 *   1:1-1:11: Unexpected character `:` at end of heading, remove it
 *   3:1-3:9: Unexpected character `?` at end of heading, remove it
 *   5:1-5:9: Unexpected character `!` at end of heading, remove it
 *   7:1-7:8: Unexpected character `,` at end of heading, remove it
 *   9:1-9:11: Unexpected character `;` at end of heading, remove it
 *
 * @example
 *   {"config": ",;:!?", "name": "ok.md"}
 *
 *   # Mercury…
 *
 * @example
 *   {"config": {"source": "[^A-Za-z0-9]"}, "label": "input", "name": "regex.md"}
 *
 *   # Mercury!
 * @example
 *   {"config": {"source": "[^A-Za-z0-9]"}, "label": "output", "name": "regex.md"}
 *
 *   1:1-1:11: Unexpected character `!` at end of heading, remove it
 *
 * @example
 *   {"label": "input", "mdx": true, "name": "example.mdx"}
 *
 *   <h1>Mercury?</h1>
 * @example
 *   {"label": "output", "mdx": true, "name": "example.mdx"}
 *
 *   1:1-1:18: Unexpected character `?` at end of heading, remove it
 *
 * @example
 *   {"config": 1, "label": "output", "name": "not-ok-options.md", "positionless": true}
 *
 *   1:1: Unexpected value `1` for `options`, expected `RegExp` or `string`
 */

/**
 * @typedef {import('mdast').Root} Root
 */

/// <reference types="mdast-util-mdx" />

import {toString} from 'mdast-util-to-string'
import {lintRule} from 'unified-lint-rule'
import {visitParents} from 'unist-util-visit-parents'

const jsxNameRe = /^h([1-6])$/
const defaultExpression = /[!,.:;?]/u

const remarkLintNoHeadingPunctuation = lintRule(
  {
    origin: 'remark-lint:no-heading-punctuation',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-no-heading-punctuation#readme'
  },
  /**
   * @param {Root} tree
   *   Tree.
   * @param {RegExp | string | null | undefined} [options]
   *   Configuration (default: `/[!,.:;?]/u`),
   *   wrapped in `new RegExp('[' + x + ']', 'u')` so make sure to double escape
   *   regexp characters.
   * @returns {undefined}
   *   Nothing.
   */
  function (tree, file, options) {
    let expected = defaultExpression

    if (options === null || options === undefined) {
      // Empty.
    } else if (typeof options === 'string') {
      expected = new RegExp('[' + options + ']', 'u')
    } else if (typeof options === 'object' && 'source' in options) {
      expected = new RegExp(options.source, options.flags ?? 'u')
    } else {
      file.fail(
        'Unexpected value `' +
          options +
          '` for `options`, expected `RegExp` or `string`'
      )
    }

    visitParents(tree, function (node, parents) {
      if (
        node.position && // Plain markdown.
        (node.type === 'heading' ||
          // MDX JSX.
          ((node.type === 'mdxJsxFlowElement' ||
            node.type === 'mdxJsxTextElement') &&
            node.name &&
            jsxNameRe.test(node.name)))
      ) {
        const tail = Array.from(toString(node)).at(-1)

        if (tail && expected.test(tail)) {
          file.message(
            'Unexpected character `' + tail + '` at end of heading, remove it',
            {ancestors: [...parents, node], place: node.position}
          )
        }
      }
    })
  }
)

export default remarkLintNoHeadingPunctuation

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
 * * `options` ([`Options`][api-options] or `number`, optional)
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
 * ###### Properties
 *
 * * `size` (`number`, default: `60`)
 *   — preferred max size
 * * `stringLength` (`(value: string) => number`, optional)
 *   — function to detect text size
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
 * To better represent how long headings “look”,
 * you can pass a `stringLength` function.
 *
 * [api-options]: #options
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
 * @example
 *   {"config": 30, "label": "output", "name": "not-ok.md"}
 *
 *   1:1-1:43: Unexpected `40` characters in heading, expected at most `30` characters
 *
 * @example
 *   {"config": 30, "name": "string-length-default.md"}
 *
 *   # 水星是太陽系的八大行星中最小和最靠近太陽的行星
 *
 * @example
 *   {"config": {"size": 30, "stringLength": "__STRING_WIDTH__"}, "label": "input", "name": "string-length-custom.md"}
 *
 *   # 水星是太陽系的八大行星中最小和最靠近太陽的行星
 * @example
 *   {"config": {"size": 30, "stringLength": "__STRING_WIDTH__"}, "label": "output", "name": "string-length-custom.md"}
 *
 *   1:1-1:26: Unexpected `46` characters in heading, expected at most `30` characters
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
 *   1:1: Unexpected value `🌍` for `size`, expected `number`
 */

/**
 * @import {Root} from 'mdast'
 * @import {} from 'mdast-util-mdx'
 */

/**
 * @typedef Options
 *   Configuration.
 * @property {number | null | undefined} [size=60]
 *   Preferred max size (default: `60`).
 * @property {((value: string) => number) | null | undefined} [stringLength]
 *   Function to detect text size (optional).
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
   * @param {Options | number | null | undefined} [options=60]
   *   Configuration (default: `60`).
   * @returns {undefined}
   *   Nothing.
   */
  function (tree, file, options) {
    let expected = 60
    /** @type {Options['size']} */
    let size
    /** @type {Options['stringLength']} */
    let stringLength

    if (options && typeof options === 'object') {
      size = options.size
      stringLength = options.stringLength
    } else {
      size = options
    }

    if (size === null || size === undefined) {
      // Empty.
    } else if (typeof size === 'number') {
      expected = size
    } else {
      file.fail('Unexpected value `' + size + '` for `size`, expected `number`')
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
        const value = toString(node, {includeHtml: false})
        const actual = stringLength
          ? stringLength(value)
          : Array.from(value).length

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

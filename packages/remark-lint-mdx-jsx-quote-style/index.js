/**
 * remark-lint rule to warn when MDX JSX attribute value
 * markers violate a given style.
 *
 * ## What is this?
 *
 * This package checks the style of MDX JSX attribute value markers.
 *
 * ## When should I use this?
 *
 * You can use this package to check that the style of MDX JSX attribute value
 * markers is consistent.
 *
 * ## API
 *
 * ### `unified().use(remarkLintMdxJsxQuoteStyle[, options])`
 *
 * Warn when MDX JSX attribute value markers violate a given style.
 *
 * ###### Parameters
 *
 * * `options` ([`Options`][api-options], default: `'consistent'`)
 *   — preferred style or whether to detect the first style and warn for
 *   further differences
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
 * type Options = Style | 'consistent'
 * ```
 *
 * ### `Style`
 *
 * Style (TypeScript type).
 *
 * ###### Type
 *
 * ```ts
 * type Style = '"' | '\''
 * ```
 *
 * ## Recommendation
 *
 * In HTML,
 * attributes are commonly written with double quotes.
 * It’s recommended to go with that.
 * To configure this rule with `'"'`.
 *
 * ## Fix
 *
 * [`remark-mdx`][github-remark-mdx] formats titles with double
 * quotes by default.
 * Pass `quote: "'"` to use single quotes.
 *
 * [api-options]: #options
 * [api-remark-lint-mdx-jsx-quote-style]: #unifieduseremarklintmdxjsxquotestyle-options
 * [api-style]: #style
 * [github-unified-transformer]: https://github.com/unifiedjs/unified#transformer
 * [github-remark-mdx]: https://mdxjs.com/packages/remark-mdx/
 *
 * @module mdx-jsx-quote-style
 * @author Titus Wormer
 * @copyright 2025 Titus Wormer
 * @license MIT
 *
 * @example
 *   {"mdx": true, "name": "ok-consistent.mdx"}
 *
 *   <a href="http://example.com/venus/">Venus</a> and
 *   <a href="http://example.com/earth/">Earth</a>.
 *
 * @example
 *   {"label": "input", "mdx": true, "name": "not-ok-consistent.mdx"}
 *
 *   <a href="http://example.com/venus/">Venus</a> and
 *   <a href='http://example.com/earth/'>Earth</a>.
 * @example
 *   {"label": "output", "mdx": true, "name": "not-ok-consistent.mdx"}
 *
 *   2:4-2:36: Unexpected JSX quote markers `'`, expected `"`
 *
 * @example
 *   {"config": "\"", "label": "input", "mdx": true, "name": "double-quote.mdx"}
 *
 *   <a href="http://example.com/venus/">Venus</a> and
 *   <a href='http://example.com/earth/'>Earth</a>.
 * @example
 *   {"config": "\"", "label": "output", "mdx": true, "name": "double-quote.mdx"}
 *
 *   2:4-2:36: Unexpected JSX quote markers `'`, expected `"`
 *
 * @example
 *   {"config": "'", "label": "input", "mdx": true, "name": "single-quote.mdx"}
 *
 *   <a href="http://example.com/venus/">Venus</a> and
 *   <a href='http://example.com/earth/'>Earth</a>.
 * @example
 *   {"config": "'", "label": "output", "mdx": true, "name": "single-quote.mdx"}
 *
 *   1:4-1:36: Unexpected JSX quote markers `"`, expected `'`
 *
 * @example
 *   {"label": "input", "mdx": true, "name": "other-attributes.mdx"}
 *
 *   <Mercury closest />,
 *   <Venus aphelion={0.728213} />, and
 *   <Earth {...people} />.
 *
 * @example
 *   {"config": "\"", "mdx": true, "name": "whitespace.mdx"}
 *
 *   <Mars symbol = "♂" />.
 *
 * @example
 *   {"config": "🌍", "label": "output", "mdx": true, "name": "not-ok.mdx", "positionless": true}
 *
 *   1:1: Unexpected value `🌍` for `options`, expected `'"'`, `"'"`, or `'consistent'`
 */

/**
 * @import {Root} from 'mdast'
 * @import {} from 'mdast-util-mdx'
 */

/**
 * @typedef {Style | 'consistent'} Options
 *   Configuration.
 *
 * @typedef {'"' | '\''} Style
 *   Styles.
 */

import {unicodeWhitespace} from 'micromark-util-character'
import {lintRule} from 'unified-lint-rule'
import {pointEnd, pointStart} from 'unist-util-position'
import {visitParents} from 'unist-util-visit-parents'
import {VFileMessage} from 'vfile-message'

const remarkLintMdxJsxQuoteStyle = lintRule(
  {
    origin: 'remark-lint:mdx-jsx-quote-style',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-mdx-jsx-quote-style#readme'
  },
  /**
   * @param {Root} tree
   *   Tree.
   * @param {Options | null | undefined} [options='consistent']
   *   Configuration (default: `'consistent'`).
   * @returns {undefined}
   *   Nothing.
   */
  function (tree, file, options) {
    const value = String(file)
    /** @type {Style | undefined} */
    let expected
    /** @type {VFileMessage | undefined} */
    let cause

    if (options === null || options === undefined || options === 'consistent') {
      // Empty.
    } else if (options === '"' || options === "'") {
      expected = options
    } else {
      file.fail(
        'Unexpected value `' +
          options +
          "` for `options`, expected `'\"'`, `\"'\"`, or `'consistent'`"
      )
    }

    visitParents(tree, function (node, parents) {
      if (
        node.type === 'mdxJsxFlowElement' ||
        node.type === 'mdxJsxTextElement'
      ) {
        const attributes = node.attributes

        for (const attribute of attributes) {
          // Ignore shorthand booleans and expressions using braces.
          if (attribute.type !== 'mdxJsxAttribute') continue
          if (typeof attribute.value !== 'string') continue

          const start = pointStart(attribute)
          const end = pointEnd(attribute)

          if (
            !end ||
            !start ||
            typeof end.offset !== 'number' ||
            typeof start.offset !== 'number'
          ) {
            continue
          }

          let index = start.offset + attribute.name.length
          /* c8 ignore next -- should be correct but exit if not. */
          if (attribute.name !== value.slice(start.offset, index)) continue

          while (unicodeWhitespace(value.charCodeAt(index))) index++

          /* c8 ignore next -- should be correct but exit if not. */
          if (value.charCodeAt(index) !== 61 /* `=` */) continue
          index++

          while (unicodeWhitespace(value.charCodeAt(index))) index++

          const code = value.charCodeAt(index)
          /* c8 ignore next 2 -- should be correct but exit if not. */
          const actual = code === 34 ? '"' : code === 39 ? "'" : undefined
          if (!actual) continue

          if (expected) {
            if (actual !== expected) {
              file.message(
                'Unexpected JSX quote markers ' +
                  displayStyle(actual) +
                  ', expected ' +
                  displayStyle(expected),
                {
                  ancestors: [...parents, node],
                  cause,
                  place: attribute.position
                }
              )
            }
          } else {
            expected = actual
            cause = new VFileMessage(
              'JSX quote marker style ' +
                displayStyle(expected) +
                " first defined for `'consistent'` here",
              {
                ancestors: [...parents, node],
                place: attribute.position,
                ruleId: 'mdx-jsx-quote-style',
                source: 'remark-lint'
              }
            )
          }
        }
      }
    })
  }
)

export default remarkLintMdxJsxQuoteStyle

/**
 * @param {Style} style
 *   Style.
 * @returns {string}
 *   Display.
 */
function displayStyle(style) {
  return style === '"' ? '`"`' : "`'`"
}

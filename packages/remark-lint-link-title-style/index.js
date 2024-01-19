/**
 * remark-lint rule to warn when link title markers violate a given style.
 *
 * ## What is this?
 *
 * This package checks the style of link (*and* image and definition) title
 * markers.
 *
 * ## When should I use this?
 *
 * You can use this package to check that the style of link title markers is
 * consistent.
 *
 * ## API
 *
 * ### `unified().use(remarkLintLinkTitleStyle[, options])`
 *
 * Warn when link title markers violate a given style.
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
 * type Style = '"' | '\'' | '()'
 * ```
 *
 * ## Recommendation
 *
 * Before CommonMark, parens for titles were not supported in markdown.
 * They should now work in most places.
 * Parens do look a bit weird as they’re inside more parens:
 * `[text](url (title))`.
 *
 * In HTML, attributes are commonly written with double quotes.
 * Due to this, titles are almost exclusively wrapped in double quotes in
 * markdown, so it’s recommended to configure this rule with `'"'`.
 *
 * ## Fix
 *
 * [`remark-stringify`][github-remark-stringify] formats titles with double
 * quotes by default.
 * Pass `quote: "'"` to use single quotes.
 * There is no option to use parens.
 *
 * [api-options]: #options
 * [api-remark-lint-link-title-style]: #unifieduseremarklintlinktitlestyle-options
 * [api-style]: #style
 * [github-remark-stringify]: https://github.com/remarkjs/remark/tree/main/packages/remark-stringify
 * [github-unified-transformer]: https://github.com/unifiedjs/unified#transformer
 *
 * @module link-title-style
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 *
 * @example
 *   {"name": "ok-consistent.md"}
 *
 *   [Mercury](http://example.com/mercury/),
 *   [Venus](http://example.com/venus/ "Go to Venus"), and
 *   ![Earth](http://example.com/earth/ "Go to Earth").
 *
 *   [Mars]: http://example.com/mars/ "Go to Mars"
 *
 * @example
 *   {"label": "input", "name": "not-ok-consistent.md"}
 *
 *   [Mercury](http://example.com/mercury/ "Go to Mercury") and
 *   ![Venus](http://example.com/venus/ 'Go to Venus').
 *
 *   [Earth]: http://example.com/earth/ (Go to Earth)
 * @example
 *   {"label": "output", "name": "not-ok-consistent.md"}
 *
 *   2:1-2:50: Unexpected title markers `'`, expected `"`
 *   4:1-4:49: Unexpected title markers `'('` and `')'`, expected `"`
 *
 * @example
 *   {"config": "\"", "name": "ok-double.md"}
 *
 *   [Mercury](http://example.com/mercury/ "Go to Mercury").
 *
 * @example
 *   {"config": "\"", "label": "input", "name": "not-ok-double.md"}
 *
 *   [Mercury](http://example.com/mercury/ 'Go to Mercury').
 * @example
 *   {"config": "\"", "label": "output", "name": "not-ok-double.md"}
 *
 *   1:1-1:55: Unexpected title markers `'`, expected `"`
 *
 * @example
 *   {"config": "'", "name": "ok-single.md"}
 *
 *   [Mercury](http://example.com/mercury/ 'Go to Mercury').
 *
 * @example
 *   {"config": "'", "label": "input", "name": "not-ok-single.md"}
 *
 *   [Mercury](http://example.com/mercury/ "Go to Mercury").
 * @example
 *   {"config": "'", "label": "output", "name": "not-ok-single.md"}
 *
 *   1:1-1:55: Unexpected title markers `"`, expected `'`
 *
 * @example
 *   {"config": "()", "name": "ok-paren.md"}
 *
 *   [Mercury](http://example.com/mercury/ (Go to Mercury)).
 *
 * @example
 *   {"config": "()", "label": "input", "name": "not-ok-paren.md"}
 *
 *   [Mercury](http://example.com/mercury/ "Go to Mercury").
 * @example
 *   {"config": "()", "label": "output", "name": "not-ok-paren.md"}
 *
 *   1:1-1:55: Unexpected title markers `"`, expected `'('` and `')'`
 *
 * @example
 *   {"config": "🌍", "label": "output", "name": "not-ok.md", "positionless": true}
 *
 *   1:1: Unexpected value `🌍` for `options`, expected `'"'`, `"'"`, `'()'`, or `'consistent'`
 *
 * @example
 *   {"config": "\"", "name": "ok-parens-in-url.md"}
 *
 *   Parens in URLs work correctly:
 *
 *   [Mercury](http://example.com/(mercury) "Go to Mercury") and
 *   [Venus](http://example.com/(venus)).
 *
 * @example
 *   {"config": "\"", "name": "ok-whitespace.md"}
 *
 *   Trailing whitespace works correctly:
 *
 *   [Mercury](http://example.com/mercury/␠"Go to Mercury"␠).
 */

/**
 * @typedef {import('mdast').Root} Root
 */

/**
 * @typedef {Style | 'consistent'} Options
 *   Configuration.
 *
 * @typedef {'"' | '\'' | '()'} Style
 *   Styles.
 */

import {lintRule} from 'unified-lint-rule'
import {pointEnd} from 'unist-util-position'
import {visitParents} from 'unist-util-visit-parents'
import {VFileMessage} from 'vfile-message'

const remarkLintLinkTitleStyle = lintRule(
  {
    origin: 'remark-lint:link-title-style',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-link-title-style#readme'
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
      /* c8 ignore next 3 */
      // @ts-expect-error: to do: remove.
    } else if (options === '(') {
      expected = '()'
    } else if (options === '"' || options === "'" || options === '()') {
      expected = options
    } else {
      file.fail(
        'Unexpected value `' +
          options +
          "` for `options`, expected `'\"'`, `\"'\"`, `'()'`, or `'consistent'`"
      )
    }

    visitParents(tree, function (node, parents) {
      if (
        node.type === 'definition' ||
        node.type === 'image' ||
        node.type === 'link'
      ) {
        // Exit w/o title.
        if (!node.title) return

        const end = pointEnd(node)
        let endIndex = end ? end.offset : undefined

        // Exit w/o position.
        if (!endIndex) return

        // `)`
        if (node.type !== 'definition') endIndex--

        // Whitespace.
        let before = value.charCodeAt(endIndex - 1)
        while (before === 9 || before === 32) {
          endIndex--
          before = value.charCodeAt(endIndex - 1)
        }

        /** @type {Style | undefined} */
        const actual =
          before === 34 /* `"` */
            ? '"'
            : before === 39 /* `'` */
              ? "'"
              : before === 41 /* `)` */
                ? '()'
                : /* c8 ignore next -- we should find a correct marker. */
                  undefined

        /* c8 ignore next -- we should find a correct marker. */
        if (!actual) return

        if (expected) {
          if (actual !== expected) {
            file.message(
              'Unexpected title markers ' +
                displayStyle(actual) +
                ', expected ' +
                displayStyle(expected),
              {ancestors: [...parents, node], cause, place: node.position}
            )
          }
        } else {
          expected = actual
          cause = new VFileMessage(
            'Title marker style ' +
              displayStyle(expected) +
              " first defined for `'consistent'` here",
            {
              ancestors: [...parents, node],
              place: node.position,
              ruleId: 'link-title-style',
              source: 'remark-lint'
            }
          )
        }
      }
    })
  }
)

export default remarkLintLinkTitleStyle

/**
 * @param {Style} style
 *   Style.
 * @returns {string}
 *   Display.
 */
function displayStyle(style) {
  return style === '"' ? '`"`' : style === "'" ? "`'`" : "`'('` and `')'`"
}

/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module link-title-style
 * @fileoverview
 *   Warn when link and definition titles occur with incorrect quotes.
 *
 *   Options: `'consistent'`, `'"'`, `'\''`, or `'()'`, default: `'consistent'`.
 *
 *   `'consistent'` detects the first used quote style and warns when subsequent
 *   titles use different styles.
 *
 *   ## Fix
 *
 *   [`remark-stringify`](https://github.com/remarkjs/remark/tree/HEAD/packages/remark-stringify)
 *   uses `'` (single quote) for titles if they contain a double quote, and `"`
 *   (double quotes) otherwise.
 *
 *   See [Using remark to fix your Markdown](https://github.com/remarkjs/remark-lint#using-remark-to-fix-your-markdown)
 *   on how to automatically fix warnings for this rule.
 *
 * @example
 *   {"name": "ok.md", "setting": "\""}
 *
 *   [Example](http://example.com#without-title)
 *   [Example](http://example.com "Example Domain")
 *   ![Example](http://example.com "Example Domain")
 *
 *   [Example]: http://example.com "Example Domain"
 *
 *   You can use parens in URLs if they’re not a title (see GH-166):
 *
 *   [Example](#Heading-(optional))
 *
 * @example
 *   {"name": "not-ok.md", "label": "input", "setting": "\""}
 *
 *   [Example]: http://example.com 'Example Domain'
 *
 * @example
 *   {"name": "not-ok.md", "label": "output", "setting": "\""}
 *
 *   1:31-1:47: Titles should use `"` as a quote
 *
 * @example
 *   {"name": "ok.md", "setting": "'"}
 *
 *   [Example](http://example.com#without-title)
 *   [Example](http://example.com 'Example Domain')
 *   ![Example](http://example.com 'Example Domain')
 *
 *   [Example]: http://example.com 'Example Domain'
 *
 * @example
 *   {"name": "not-ok.md", "label": "input", "setting": "'"}
 *
 *   [Example]: http://example.com "Example Domain"
 *
 * @example
 *   {"name": "not-ok.md", "label": "output", "setting": "'"}
 *
 *   1:31-1:47: Titles should use `'` as a quote
 *
 * @example
 *   {"name": "ok.md", "setting": "()"}
 *
 *   [Example](http://example.com#without-title)
 *   [Example](http://example.com (Example Domain))
 *   ![Example](http://example.com (Example Domain))
 *
 *   [Example]: http://example.com (Example Domain)
 *
 * @example
 *   {"name": "not-ok.md", "label": "input", "setting": "()"}
 *
 *   [Example](http://example.com 'Example Domain')
 *
 * @example
 *   {"name": "not-ok.md", "label": "output", "setting": "()"}
 *
 *   1:30-1:46: Titles should use `()` as a quote
 *
 * @example
 *   {"name": "not-ok.md", "label": "input"}
 *
 *   [Example](http://example.com "Example Domain")
 *   [Example](http://example.com 'Example Domain')
 *
 * @example
 *   {"name": "not-ok.md", "label": "output"}
 *
 *   2:30-2:46: Titles should use `"` as a quote
 *
 * @example
 *   {"name": "not-ok.md", "setting": "💩", "label": "output", "positionless": true}
 *
 *   1:1: Incorrect link title style marker `💩`: use either `'consistent'`, `'"'`, `'\''`, or `'()'`
 */

/**
 * @typedef {import('mdast').Root} Root
 * @typedef {'"'|"'"|'()'} Marker
 * @typedef {'consistent'|Marker} Options
 */

import {lintRule} from 'unified-lint-rule'
import {location} from 'vfile-location'
import {visit} from 'unist-util-visit'
import {pointStart, pointEnd} from 'unist-util-position'

const own = {}.hasOwnProperty

const markers = {
  '"': '"',
  "'": "'",
  ')': '('
}

const remarkLintLinkTitleStyle = lintRule(
  {
    origin: 'remark-lint:link-title-style',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-link-title-style#readme'
  },
  /** @type {import('unified-lint-rule').Rule<Root, Options>} */
  (tree, file, option = 'consistent') => {
    const value = String(file)
    const loc = location(file)
    // @ts-expect-error: allow other paren combos.
    let look = option === '()' || option === '(' ? ')' : option

    if (look !== 'consistent' && !own.call(markers, look)) {
      file.fail(
        'Incorrect link title style marker `' +
          look +
          "`: use either `'consistent'`, `'\"'`, `'\\''`, or `'()'`"
      )
    }

    visit(tree, (node) => {
      if (
        node.type === 'link' ||
        node.type === 'image' ||
        node.type === 'definition'
      ) {
        const tail =
          'children' in node
            ? node.children[node.children.length - 1]
            : undefined
        const begin = tail ? pointEnd(tail) : pointStart(node)
        const end = pointEnd(node)

        if (
          typeof begin.offset !== 'number' ||
          typeof end.offset !== 'number'
        ) {
          return
        }

        let last = end.offset - 1

        if (node.type !== 'definition') {
          last--
        }

        const final = /** @type {keyof markers} */ (value.charAt(last))

        // Exit if the final marker is not a known marker.
        if (!(final in markers)) {
          return
        }

        const initial = markers[final]

        // Find the starting delimiter
        const first = value.lastIndexOf(initial, last - 1)

        // Exit if there’s no starting delimiter, the starting delimiter is before
        // the start of the node, or if it’s not preceded by whitespace.
        if (first <= begin.offset || !/\s/.test(value.charAt(first - 1))) {
          return
        }

        if (look === 'consistent') {
          look = final
        } else if (look !== final) {
          file.message(
            'Titles should use `' +
              (look === ')' ? '()' : look) +
              '` as a quote',
            {
              start: loc.toPoint(first),
              end: loc.toPoint(last + 1)
            }
          )
        }
      }
    })
  }
)

export default remarkLintLinkTitleStyle

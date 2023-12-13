/**
 * remark-lint rule to warn when unordered list markers are inconsistent.
 *
 * ## What is this?
 *
 * This package checks unordered list markers.
 *
 * ## When should I use this?
 *
 * You can use this package to check unordered lists.
 *
 * ## API
 *
 * ### `unified().use(remarkLintUnorderedListMarkerStyle[, options])`
 *
 * Warn when unordered list markers are inconsistent.
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
 * ### `Marker`
 *
 * Marker (TypeScript type).
 *
 * ###### Type
 *
 * ```ts
 * type Marker = '*' | '+' | '-'
 * ```
 *
 * ### `Options`
 *
 * Configuration (TypeScript type).
 *
 * ###### Type
 *
 * ```ts
 * type Options = Marker | 'consistent'
 * ```
 *
 * ## Recommendation
 *
 * Because asterisks can be used as a marker for more markdown constructs,
 * it’s recommended to use that for lists (and thematic breaks, emphasis,
 * strong) too.
 *
 * ## Fix
 *
 * [`remark-stringify`][github-remark-stringify] formats unordered lists with
 * asterisks by default.
 * Pass `bullet: '+'` or `bullet: '-'` to use a different marker.
 *
 * [api-marker]: #marker
 * [api-options]: #options
 * [api-remark-lint-unordered-list-marker-style]: #unifieduseremarklintunorderedlistmarkerstyle-options
 * [github-remark-stringify]: https://github.com/remarkjs/remark/tree/main/packages/remark-stringify
 * [github-unified-transformer]: https://github.com/unifiedjs/unified#transformer
 *
 * @module unordered-list-marker-style
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @example
 *   {"name": "ok.md"}
 *
 *   By default (`'consistent'`), if the file uses only one marker,
 *   that’s OK.
 *
 *   * Foo
 *   * Bar
 *   * Baz
 *
 *   Ordered lists are not affected.
 *
 *   1. Foo
 *   2. Bar
 *   3. Baz
 *
 * @example
 *   {"name": "ok.md", "config": "*"}
 *
 *   * Foo
 *
 * @example
 *   {"name": "ok.md", "config": "-"}
 *
 *   - Foo
 *
 * @example
 *   {"name": "ok.md", "config": "+"}
 *
 *   + Foo
 *
 * @example
 *   {"name": "not-ok.md", "label": "input"}
 *
 *   * Foo
 *   - Bar
 *   + Baz
 *
 * @example
 *   {"name": "not-ok.md", "label": "output"}
 *
 *   2:1-2:6: Marker style should be `*`
 *   3:1-3:6: Marker style should be `*`
 *
 * @example
 *   {"name": "not-ok.md", "label": "output", "config": "💩", "positionless": true}
 *
 *   1:1: Incorrect unordered list item marker style `💩`: use either `'-'`, `'*'`, or `'+'`
 */

/**
 * @typedef {import('mdast').Root} Root
 */

/**
 * @typedef {'*' | '+' | '-'} Marker
 *   Styles.
 *
 * @typedef {Marker | 'consistent'} Options
 *   Configuration.
 */

import {lintRule} from 'unified-lint-rule'
import {pointStart} from 'unist-util-position'
import {visit} from 'unist-util-visit'

const markers = new Set(['*', '+', '-'])

const remarkLintUnorderedListMarkerStyle = lintRule(
  {
    origin: 'remark-lint:unordered-list-marker-style',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-unordered-list-marker-style#readme'
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
    let option = options || 'consistent'

    if (option !== 'consistent' && !markers.has(option)) {
      file.fail(
        'Incorrect unordered list item marker style `' +
          option +
          "`: use either `'-'`, `'*'`, or `'+'`"
      )
    }

    visit(tree, 'list', function (node) {
      if (node.ordered) return

      let index = -1

      while (++index < node.children.length) {
        const child = node.children[index]
        const end = pointStart(child.children[0])
        const start = pointStart(child)

        if (
          end &&
          start &&
          typeof end.offset === 'number' &&
          typeof start.offset === 'number'
        ) {
          const marker = /** @type {Marker} */ (
            value
              .slice(start.offset, end.offset)
              .replace(/\[[x ]?]\s*$/i, '')
              .replace(/\s/g, '')
          )

          if (option === 'consistent') {
            option = marker
          } else if (marker !== option) {
            file.message('Marker style should be `' + option + '`', child)
          }
        }
      }
    })
  }
)

export default remarkLintUnorderedListMarkerStyle

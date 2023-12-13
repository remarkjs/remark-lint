/**
 * remark-lint rule to warn when ordered list markers are inconsistent.
 *
 * ## What is this?
 *
 * This package checks ordered list markers.
 *
 * ## When should I use this?
 *
 * You can use this package to check ordered lists.
 *
 * ## API
 *
 * ### `unified().use(remarkLintOrderedListMarkerStyle[, options])`
 *
 * Warn when ordered list markers are inconsistent.
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
 * type Marker = '.' | ')'
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
 * Parens for list markers were not supported in markdown before CommonMark.
 * While they should work in most places now,
 * not all markdown parsers follow CommonMark.
 * So it’s recommended to prefer dots.
 *
 * ## Fix
 *
 * [`remark-stringify`][github-remark-stringify] formats ordered lists with
 * dots by default.
 * Pass `bulletOrdered: ')'` to always use parens.
 *
 * [api-marker]: #marker
 * [api-options]: #options
 * [api-remark-lint-ordered-list-marker-style]: #unifieduseremarklintorderedlistmarkerstyle-options
 * [github-remark-stringify]: https://github.com/remarkjs/remark/tree/main/packages/remark-stringify
 * [github-unified-transformer]: https://github.com/unifiedjs/unified#transformer
 *
 * @module ordered-list-marker-style
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @example
 *   {"name": "ok.md"}
 *
 *   1.  Foo
 *
 *
 *   1.  Bar
 *
 *   Unordered lists are not affected by this rule.
 *
 *   * Foo
 *
 * @example
 *   {"name": "ok.md", "config": "."}
 *
 *   1.  Foo
 *
 *   2.  Bar
 *
 * @example
 *   {"name": "ok.md", "config": ")"}
 *
 *   1)  Foo
 *
 *   2)  Bar
 *
 * @example
 *   {"name": "not-ok.md", "label": "input"}
 *
 *   1.  Foo
 *
 *   2)  Bar
 *
 * @example
 *   {"name": "not-ok.md", "label": "output"}
 *
 *   3:1-3:8: Marker style should be `.`
 *
 * @example
 *   {"name": "not-ok.md", "label": "output", "config": "💩", "positionless": true}
 *
 *   1:1: Incorrect ordered list item marker style `💩`: use either `'.'` or `')'`
 */

/**
 * @typedef {import('mdast').Root} Root
 */

/**
 * @typedef {Marker | 'consistent'} Options
 *   Configuration.
 *
 * @typedef {'.' | ')'} Marker
 *   Style.
 */

import {lintRule} from 'unified-lint-rule'
import {pointStart} from 'unist-util-position'
import {visit} from 'unist-util-visit'

const remarkLintOrderedListMarkerStyle = lintRule(
  {
    origin: 'remark-lint:ordered-list-marker-style',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-ordered-list-marker-style#readme'
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

    if (option !== 'consistent' && option !== '.' && option !== ')') {
      file.fail(
        'Incorrect ordered list item marker style `' +
          option +
          "`: use either `'.'` or `')'`"
      )
    }

    visit(tree, 'list', function (node) {
      let index = -1

      if (!node.ordered) return

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
              .replace(/\s|\d/g, '')
              .replace(/\[[x ]?]\s*$/i, '')
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

export default remarkLintOrderedListMarkerStyle

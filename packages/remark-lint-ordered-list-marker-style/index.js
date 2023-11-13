/**
 * ## When should I use this?
 *
 * You can use this package to check that ordered list markers are consistent.
 *
 * ## API
 *
 * The following options (default: `'consistent'`) are accepted:
 *
 * *   `'.'`
 *     — prefer dots
 * *   `')'`
 *     — prefer parens
 * *   `'consistent'`
 *     — detect the first used style and warn when further markers differ
 *
 * ## Recommendation
 *
 * Parens for list markers were not supported in markdown before CommonMark.
 * While they should work in most places now, not all markdown parsers follow
 * CommonMark.
 * Due to this, it’s recommended to prefer dots.
 *
 * ## Fix
 *
 * [`remark-stringify`](https://github.com/remarkjs/remark/tree/main/packages/remark-stringify)
 * formats ordered lists with dots by default.
 * Pass
 * [`bulletOrdered: ')'`](https://github.com/remarkjs/remark/tree/main/packages/remark-stringify#optionsbulletordered)
 * to always use parens.
 *
 * @module ordered-list-marker-style
 * @summary
 *   remark-lint rule to warn when ordered list markers are inconsistent.
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

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
 *   {"name": "ok.md", "setting": "."}
 *
 *   1.  Foo
 *
 *   2.  Bar
 *
 * @example
 *   {"name": "ok.md", "setting": ")"}
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
 *   {"name": "not-ok.md", "label": "output", "setting": "💩", "positionless": true}
 *
 *   1:1: Incorrect ordered list item marker style `💩`: use either `'.'` or `')'`
 */

/**
 * @typedef {import('mdast').Root} Root
 * @typedef {'.'|')'} Marker
 * @typedef {'consistent'|Marker} Options
 */

import {lintRule} from 'unified-lint-rule'
import {visit} from 'unist-util-visit'
import {pointStart} from 'unist-util-position'
import {generated} from 'unist-util-generated'

const remarkLintOrderedListMarkerStyle = lintRule(
  {
    origin: 'remark-lint:ordered-list-marker-style',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-ordered-list-marker-style#readme'
  },
  /** @type {import('unified-lint-rule').Rule<Root, Options>} */
  (tree, file, option = 'consistent') => {
    const value = String(file)

    if (option !== 'consistent' && option !== '.' && option !== ')') {
      file.fail(
        'Incorrect ordered list item marker style `' +
          option +
          "`: use either `'.'` or `')'`"
      )
    }

    visit(tree, 'list', (node) => {
      let index = -1

      if (!node.ordered) return

      while (++index < node.children.length) {
        const child = node.children[index]

        if (!generated(child)) {
          const marker = /** @type {Marker} */ (
            value
              .slice(
                pointStart(child).offset,
                pointStart(child.children[0]).offset
              )
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

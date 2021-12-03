/**
 * ## When should I use this?
 *
 * You can use this package to check that unordered list markers (bullets)
 * are consistent.
 *
 * ## API
 *
 * The following options (default: `'consistent'`) are accepted:
 *
 * *   `'*'`
 *     — prefer asterisks
 * *   `'+'`
 *     — prefer plusses
 * *   `'-'`
 *     — prefer dashes
 * *   `'consistent'`
 *     — detect the first used style and warn when further markers differ
 *
 * ## Recommendation
 *
 * Because asterisks can be used as a marker for more markdown constructs,
 * it’s recommended to use that for lists (and thematic breaks, emphasis,
 * strong) too.
 *
 * ## Fix
 *
 * [`remark-stringify`](https://github.com/remarkjs/remark/tree/main/packages/remark-stringify)
 * formats ordered lists with asterisks by default.
 * Pass
 * [`bullet: '+'` or `bullet: '-'`](https://github.com/remarkjs/remark/tree/main/packages/remark-stringify#optionsbullet)
 * to always use plusses or dashes.
 *
 * @module unordered-list-marker-style
 * @summary
 *   remark-lint rule to warn when unordered list markers are inconsistent.
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
 *   {"name": "ok.md", "setting": "*"}
 *
 *   * Foo
 *
 * @example
 *   {"name": "ok.md", "setting": "-"}
 *
 *   - Foo
 *
 * @example
 *   {"name": "ok.md", "setting": "+"}
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
 *   {"name": "not-ok.md", "label": "output", "setting": "💩", "positionless": true}
 *
 *   1:1: Incorrect unordered list item marker style `💩`: use either `'-'`, `'*'`, or `'+'`
 */

/**
 * @typedef {import('mdast').Root} Root
 * @typedef {'-'|'*'|'+'} Marker
 * @typedef {'consistent'|Marker} Options
 */

import {lintRule} from 'unified-lint-rule'
import {visit} from 'unist-util-visit'
import {pointStart} from 'unist-util-position'
import {generated} from 'unist-util-generated'

const markers = new Set(['-', '*', '+'])

const remarkLintUnorderedListMarkerStyle = lintRule(
  {
    origin: 'remark-lint:unordered-list-marker-style',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-unordered-list-marker-style#readme'
  },
  /** @type {import('unified-lint-rule').Rule<Root, Options>} */
  (tree, file, option = 'consistent') => {
    const value = String(file)

    if (option !== 'consistent' && !markers.has(option)) {
      file.fail(
        'Incorrect unordered list item marker style `' +
          option +
          "`: use either `'-'`, `'*'`, or `'+'`"
      )
    }

    visit(tree, 'list', (node) => {
      if (node.ordered) return

      let index = -1

      while (++index < node.children.length) {
        const child = node.children[index]

        if (!generated(child)) {
          const marker = /** @type {Marker} */ (
            value
              .slice(
                pointStart(child).offset,
                pointStart(child.children[0]).offset
              )
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

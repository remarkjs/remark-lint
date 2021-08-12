/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module emphasis-marker
 * @fileoverview
 *   Warn for violating emphasis markers.
 *
 *   Options: `'consistent'`, `'*'`, or `'_'`, default: `'consistent'`.
 *
 *   `'consistent'` detects the first used emphasis style and warns when
 *   subsequent emphasis use different styles.
 *
 *   ## Fix
 *
 *   [`remark-stringify`](https://github.com/remarkjs/remark/tree/HEAD/packages/remark-stringify)
 *   formats emphasis using `_` (underscore) by default.
 *   Pass
 *   [`emphasis: '*'`](https://github.com/remarkjs/remark/tree/HEAD/packages/remark-stringify#optionsemphasis)
 *   to use `*` (asterisk) instead.
 *
 *   See [Using remark to fix your Markdown](https://github.com/remarkjs/remark-lint#using-remark-to-fix-your-markdown)
 *   on how to automatically fix warnings for this rule.
 *
 * @example
 *   {"setting": "*", "name": "ok.md"}
 *
 *   *foo*
 *
 * @example
 *   {"setting": "*", "name": "not-ok.md", "label": "input"}
 *
 *   _foo_
 *
 * @example
 *   {"setting": "*", "name": "not-ok.md", "label": "output"}
 *
 *   1:1-1:6: Emphasis should use `*` as a marker
 *
 * @example
 *   {"setting": "_", "name": "ok.md"}
 *
 *   _foo_
 *
 * @example
 *   {"setting": "_", "name": "not-ok.md", "label": "input"}
 *
 *   *foo*
 *
 * @example
 *   {"setting": "_", "name": "not-ok.md", "label": "output"}
 *
 *   1:1-1:6: Emphasis should use `_` as a marker
 *
 * @example
 *   {"name": "not-ok.md", "label": "input"}
 *
 *   *foo*
 *   _bar_
 *
 * @example
 *   {"name": "not-ok.md", "label": "output"}
 *
 *   2:1-2:6: Emphasis should use `*` as a marker
 *
 * @example
 *   {"setting": "💩", "name": "not-ok.md", "label": "output", "positionless": true}
 *
 *   1:1: Incorrect emphasis marker `💩`: use either `'consistent'`, `'*'`, or `'_'`
 */

/**
 * @typedef {import('mdast').Root} Root
 * @typedef {'*'|'_'} Marker
 * @typedef {'consistent'|Marker} Options
 */

import {lintRule} from 'unified-lint-rule'
import {visit} from 'unist-util-visit'
import {pointStart} from 'unist-util-position'

const remarkLintEmphasisMarker = lintRule(
  'remark-lint:emphasis-marker',
  /** @type {import('unified-lint-rule').Rule<Root, Options>} */
  (tree, file, option = 'consistent') => {
    const value = String(file)

    if (option !== '*' && option !== '_' && option !== 'consistent') {
      file.fail(
        'Incorrect emphasis marker `' +
          option +
          "`: use either `'consistent'`, `'*'`, or `'_'`"
      )
    }

    visit(tree, 'emphasis', (node) => {
      const start = pointStart(node).offset

      if (typeof start === 'number') {
        const marker = /** @type {Marker} */ (value.charAt(start))

        if (option === 'consistent') {
          option = marker
        } else if (marker !== option) {
          file.message('Emphasis should use `' + option + '` as a marker', node)
        }
      }
    })
  }
)

export default remarkLintEmphasisMarker

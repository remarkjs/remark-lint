/**
 * @author Denis Augsburger
 * @copyright 2021 Denis Augsburger
 * @license MIT
 * @module strikethrough-marker
 * @fileoverview
 *   Warn for violating strikethrough markers.
 *
 *   Options: `'consistent'`, `'~'`, or `'~~'`, default: `'consistent'`.
 *
 *   `'consistent'` detects the first used strikethrough style and warns when
 *   subsequent strikethrough use different styles.
 *
 *   ## Fix
 *
 *   See [Using remark to fix your Markdown](https://github.com/remarkjs/remark-lint#using-remark-to-fix-your-markdown)
 *   on how to automatically fix warnings for this rule.
 *
 * @example
 *   {"setting": "~", "name": "ok.md", "gfm": true}
 *
 *   ~foo~
 *
 * @example
 *   {"setting": "~", "name": "not-ok.md", "label": "input", "gfm": true}
 *
 *   ~~foo~~
 *
 * @example
 *   {"setting": "~", "name": "not-ok.md", "label": "output", "gfm": true}
 *
 *   1:1-1:8: Strikethrough should use `~` as a marker
 *
 * @example
 *   {"setting": "~~", "name": "ok.md", "gfm": true}
 *
 *   ~~foo~~
 *
 * @example
 *   {"setting": "~~", "name": "not-ok.md", "label": "input", "gfm": true}
 *
 *   ~foo~
 *
 * @example
 *   {"setting": "~~", "name": "not-ok.md", "label": "output", "gfm": true}
 *
 *   1:1-1:6: Strikethrough should use `~~` as a marker
 *
 * @example
 *   {"name": "not-ok.md", "label": "input", "gfm": true}
 *
 *   ~~foo~~
 *   ~bar~
 *
 * @example
 *   {"name": "not-ok.md", "label": "output", "gfm": true}
 *
 *   2:1-2:6: Strikethrough should use `~~` as a marker
 *
 * @example
 *   {"setting": "💩", "name": "not-ok.md", "label": "output", "positionless": true, "gfm": true}
 *
 *   1:1: Incorrect strikethrough marker `💩`: use either `'consistent'`, `'~'`, or `'~~'`
 */

/**
 * @typedef {import('mdast').Root} Root
 * @typedef {'~'|'~~'} Marker
 * @typedef {'consistent'|Marker} Options
 */

import {lintRule} from 'unified-lint-rule'
import {visit} from 'unist-util-visit'
import {pointStart} from 'unist-util-position'

const remarkLintStrikethroughMarker = lintRule(
  {
    origin: 'remark-lint:strikethrough-marker',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-strikethrough-marker#readme'
  },
  /** @type {import('unified-lint-rule').Rule<Root, Options>} */
  (tree, file, option = 'consistent') => {
    const value = String(file)

    if (option !== '~' && option !== '~~' && option !== 'consistent') {
      file.fail(
        'Incorrect strikethrough marker `' +
          option +
          "`: use either `'consistent'`, `'~'`, or `'~~'`"
      )
    }

    visit(tree, 'delete', (node) => {
      const start = pointStart(node).offset

      if (typeof start === 'number') {
        const both = value.slice(start, start + 2)
        const marker = both === '~~' ? '~~' : '~'

        if (option === 'consistent') {
          option = marker
        } else if (marker !== option) {
          file.message(
            'Strikethrough should use `' + option + '` as a marker',
            node
          )
        }
      }
    })
  }
)

export default remarkLintStrikethroughMarker

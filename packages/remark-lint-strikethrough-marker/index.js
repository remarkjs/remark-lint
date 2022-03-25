/**
 * ## When should I use this?
 *
 * You can use this package to check that the number of strikethrough
 * markers is consistent.
 * Strikethrough is a GFM feature enabled with
 * [`remark-gfm`](https://github.com/remarkjs/remark-gfm).
 *
 * ## API
 *
 * The following options (default: `'consistent'`) are accepted:
 *
 * *   `'~'`
 *     — prefer one strikethrough marker
 * *   `'~~'`
 *     — prefer two strikethrough markers
 * *   `'consistent'`
 *     — detect the first used style and warn when further strikethrough differs
 *
 * ## Recommendation
 *
 * GitHub flavored markdown (GFM) specifies that two tildes should be used,
 * but `github.com` allows one tilde everywhere.
 * It’s recommended to use two tildes.
 *
 * ## Fix
 *
 * [`remark-gfm`](https://github.com/remarkjs/remark-gfm)
 * formats all strikethrough with two tildes.
 *
 * @module strikethrough-marker
 * @summary
 *   remark-lint rule to warn when the number of strikethrough markers
 *   is inconsistent.
 * @author Denis Augsburger
 * @copyright 2021 Denis Augsburger
 * @license MIT
 * @example
 *   {"config": "~", "name": "ok.md", "gfm": true}
 *
 *   ~foo~
 *
 * @example
 *   {"config": "~", "name": "not-ok.md", "label": "input", "gfm": true}
 *
 *   ~~foo~~
 *
 * @example
 *   {"config": "~", "name": "not-ok.md", "label": "output", "gfm": true}
 *
 *   1:1-1:8: Strikethrough should use `~` as a marker
 *
 * @example
 *   {"config": "~~", "name": "ok.md", "gfm": true}
 *
 *   ~~foo~~
 *
 * @example
 *   {"config": "~~", "name": "not-ok.md", "label": "input", "gfm": true}
 *
 *   ~foo~
 *
 * @example
 *   {"config": "~~", "name": "not-ok.md", "label": "output", "gfm": true}
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
 *   {"config": "💩", "name": "not-ok.md", "label": "output", "positionless": true, "gfm": true}
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

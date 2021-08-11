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
 * @example {"setting": "~", "name": "ok.md", "gfm": true}
 *
 *   ~foo~
 *
 * @example {"setting": "~", "name": "not-ok.md", "label": "input", "gfm": true}
 *
 *   ~~foo~~
 *
 * @example {"setting": "~", "name": "not-ok.md", "label": "output", "gfm": true}
 *
 *   1:1-1:8: Strikethrough should use `~` as a marker
 *
 * @example {"setting": "~~", "name": "ok.md", "gfm": true}
 *
 *   ~~foo~~
 *
 * @example {"setting": "~~", "name": "not-ok.md", "label": "input", "gfm": true}
 *
 *   ~foo~
 *
 * @example {"setting": "~~", "name": "not-ok.md", "label": "output", "gfm": true}
 *
 *   1:1-1:6: Strikethrough should use `~~` as a marker
 *
 * @example {"name": "not-ok.md", "label": "input", "gfm": true}
 *
 *   ~~foo~~
 *   ~bar~
 *
 * @example {"name": "not-ok.md", "label": "output", "gfm": true}
 *
 *   2:1-2:6: Strikethrough should use `~~` as a marker
 *
 * @example {"setting": "💩", "name": "not-ok.md", "label": "output", "positionless": true, "gfm": true}
 *
 *   1:1: Incorrect strikethrough marker `💩`: use either `'consistent'`, `'~'`, or `'~~'`
 */

import {lintRule} from 'unified-lint-rule'
import {visit} from 'unist-util-visit'
import {pointStart} from 'unist-util-position'
import {generated} from 'unist-util-generated'

const markers = {null: true, '~': true, '~~': true}

const remarkLintStrikethroughMarker = lintRule(
  'remark-lint:strikethrough-marker',
  (tree, file, option) => {
    const value = String(file)
    let preferred =
      typeof option === 'string' && option !== 'consistent' ? option : null

    if (markers[preferred] !== true) {
      file.fail(
        'Incorrect strikethrough marker `' +
          preferred +
          "`: use either `'consistent'`, `'~'`, or `'~~'`"
      )
    }

    visit(tree, 'delete', (node) => {
      if (!generated(node)) {
        const offset = pointStart(node).offset
        const both = value.slice(offset, offset + 2)
        const marker = both === '~~' ? '~~' : '~'

        if (preferred) {
          if (marker !== preferred) {
            file.message(
              'Strikethrough should use `' + preferred + '` as a marker',
              node
            )
          }
        } else {
          preferred = marker
        }
      }
    })
  }
)

export default remarkLintStrikethroughMarker

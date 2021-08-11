/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module strong-marker
 * @fileoverview
 *   Warn for violating importance (strong) markers.
 *
 *   Options: `'consistent'`, `'*'`, or `'_'`, default: `'consistent'`.
 *
 *   `'consistent'` detects the first used importance style and warns when
 *   subsequent importance sequences use different styles.
 *
 *   ## Fix
 *
 *   [`remark-stringify`](https://github.com/remarkjs/remark/tree/HEAD/packages/remark-stringify)
 *   formats importance using an `*` (asterisk) by default.
 *   Pass
 *   [`strong: '_'`](https://github.com/remarkjs/remark/tree/HEAD/packages/remark-stringify#optionsstrong)
 *   to use `_` (underscore) instead.
 *
 *   See [Using remark to fix your Markdown](https://github.com/remarkjs/remark-lint#using-remark-to-fix-your-markdown)
 *   on how to automatically fix warnings for this rule.
 *
 * @example {"name": "ok.md"}
 *
 *   **foo** and **bar**.
 *
 * @example {"name": "also-ok.md"}
 *
 *   __foo__ and __bar__.
 *
 * @example {"name": "ok.md", "setting": "*"}
 *
 *   **foo**.
 *
 * @example {"name": "ok.md", "setting": "_"}
 *
 *   __foo__.
 *
 * @example {"name": "not-ok.md", "label": "input"}
 *
 *   **foo** and __bar__.
 *
 * @example {"name": "not-ok.md", "label": "output"}
 *
 *   1:13-1:20: Strong should use `*` as a marker
 *
 * @example {"name": "not-ok.md", "label": "output", "setting": "💩", "positionless": true}
 *
 *   1:1: Incorrect strong marker `💩`: use either `'consistent'`, `'*'`, or `'_'`
 */

import {lintRule} from 'unified-lint-rule'
import {visit} from 'unist-util-visit'
import {pointStart} from 'unist-util-position'
import {generated} from 'unist-util-generated'

const markers = {'*': true, _: true, null: true}

const remarkLintStrongMarker = lintRule(
  'remark-lint:strong-marker',
  (tree, file, option) => {
    const value = String(file)
    let preferred =
      typeof option === 'string' && option !== 'consistent' ? option : null

    if (markers[preferred] !== true) {
      file.fail(
        'Incorrect strong marker `' +
          preferred +
          "`: use either `'consistent'`, `'*'`, or `'_'`"
      )
    }

    visit(tree, 'strong', (node) => {
      const marker = value.charAt(pointStart(node).offset)

      if (!generated(node)) {
        if (preferred) {
          if (marker !== preferred) {
            file.message(
              'Strong should use `' + preferred + '` as a marker',
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

export default remarkLintStrongMarker

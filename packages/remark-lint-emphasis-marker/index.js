/**
 * ## When should I use this?
 *
 * You can use this package to check that emphasis markers are consistent.
 *
 * ## API
 *
 * The following options (default: `'consistent'`) are accepted:
 *
 * *   `'*'`
 *     — prefer asterisks
 * *   `'_'`
 *     — prefer underscores
 * *   `'consistent'`
 *     — detect the first used style and warn when further emphasis differs
 *
 * ## Recommendation
 *
 * Underscores and asterisks work slightly different: asterisks can form
 * emphasis in more cases than underscores.
 * Because underscores are sometimes used to represent normal underscores inside
 * words, there are extra rules supporting that.
 * Asterisks can also be used as the marker of more constructs than underscores:
 * lists.
 * Due to having simpler parsing rules, looking more like syntax, and that they
 * can be used for more constructs, it’s recommended to prefer asterisks.
 *
 * ## Fix
 *
 * [`remark-stringify`](https://github.com/remarkjs/remark/tree/main/packages/remark-stringify)
 * formats emphasis with asterisks by default.
 * Pass
 * [`emphasis: '_'`](https://github.com/remarkjs/remark/tree/main/packages/remark-stringify#optionsemphasis)
 * to always use underscores.
 *
 * @module emphasis-marker
 * @summary
 *   remark-lint rule to warn when emphasis markers are inconsistent.
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
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
  {
    origin: 'remark-lint:emphasis-marker',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-emphasis-marker#readme'
  },
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

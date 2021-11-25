/**
 * ## When should I use this?
 *
 * You can use this package to check that strong markers are consistent.
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
 *     — detect the first used style and warn when further strong differs
 *
 * ## Recommendation
 *
 * Underscores and asterisks work slightly different: asterisks can form strong
 * in more cases than underscores.
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
 * formats strong with asterisks by default.
 * Pass
 * [`strong: '_'`](https://github.com/remarkjs/remark/tree/main/packages/remark-stringify#optionsstrong)
 * to always use underscores.
 *
 * @module strong-marker
 * @summary
 *   remark-lint rule to warn when strong markers are inconsistent.
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @example
 *   {"name": "ok.md"}
 *
 *   **foo** and **bar**.
 *
 * @example
 *   {"name": "also-ok.md"}
 *
 *   __foo__ and __bar__.
 *
 * @example
 *   {"name": "ok.md", "setting": "*"}
 *
 *   **foo**.
 *
 * @example
 *   {"name": "ok.md", "setting": "_"}
 *
 *   __foo__.
 *
 * @example
 *   {"name": "not-ok.md", "label": "input"}
 *
 *   **foo** and __bar__.
 *
 * @example
 *   {"name": "not-ok.md", "label": "output"}
 *
 *   1:13-1:20: Strong should use `*` as a marker
 *
 * @example
 *   {"name": "not-ok.md", "label": "output", "setting": "💩", "positionless": true}
 *
 *   1:1: Incorrect strong marker `💩`: use either `'consistent'`, `'*'`, or `'_'`
 */

/**
 * @typedef {import('mdast').Root} Root
 * @typedef {'*'|'_'} Marker
 * @typedef {'consistent'|Marker} Options
 */

import {lintRule} from 'unified-lint-rule'
import {visit} from 'unist-util-visit'
import {pointStart} from 'unist-util-position'

const remarkLintStrongMarker = lintRule(
  {
    origin: 'remark-lint:strong-marker',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-strong-marker#readme'
  },
  /** @type {import('unified-lint-rule').Rule<Root, Options>} */
  (tree, file, option = 'consistent') => {
    const value = String(file)

    if (option !== '*' && option !== '_' && option !== 'consistent') {
      file.fail(
        'Incorrect strong marker `' +
          option +
          "`: use either `'consistent'`, `'*'`, or `'_'`"
      )
    }

    visit(tree, 'strong', (node) => {
      const start = pointStart(node).offset

      if (typeof start === 'number') {
        const marker = /** @type {Marker} */ (value.charAt(start))

        if (option === 'consistent') {
          option = marker
        } else if (marker !== option) {
          file.message('Strong should use `' + option + '` as a marker', node)
        }
      }
    })
  }
)

export default remarkLintStrongMarker

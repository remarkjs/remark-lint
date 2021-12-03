/**
 * ## When should I use this?
 *
 * You can use this package to check that fenced code markers are consistent.
 *
 * ## API
 *
 * The following options (default: `'consistent'`) are accepted:
 *
 * *   ``'`'``
 *     — prefer grave accents
 * *   `'~'`
 *     — prefer tildes
 * *   `'consistent'`
 *     — detect the first used style and warn when further fenced code differs
 *
 * ## Recommendation
 *
 * Tildes are extremely uncommon.
 * Due to this, it’s recommended to configure this rule with ``'`'``.
 *
 * ## Fix
 *
 * [`remark-stringify`](https://github.com/remarkjs/remark/tree/main/packages/remark-stringify)
 * formats fenced code with grave accents by default.
 * Pass
 * [`fence: '~'`](https://github.com/remarkjs/remark/tree/main/packages/remark-stringify#optionsfence)
 * to always use tildes.
 *
 * @module fenced-code-marker
 * @summary
 *   remark-lint rule to warn when fenced code markers are inconsistent.
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @example
 *   {"name": "ok.md"}
 *
 *   Indented code blocks are not affected by this rule:
 *
 *       bravo()
 *
 * @example
 *   {"name": "ok.md", "setting": "`"}
 *
 *   ```alpha
 *   bravo()
 *   ```
 *
 *   ```
 *   charlie()
 *   ```
 *
 * @example
 *   {"name": "ok.md", "setting": "~"}
 *
 *   ~~~alpha
 *   bravo()
 *   ~~~
 *
 *   ~~~
 *   charlie()
 *   ~~~
 *
 * @example
 *   {"name": "not-ok-consistent-tick.md", "label": "input"}
 *
 *   ```alpha
 *   bravo()
 *   ```
 *
 *   ~~~
 *   charlie()
 *   ~~~
 *
 * @example
 *   {"name": "not-ok-consistent-tick.md", "label": "output"}
 *
 *   5:1-7:4: Fenced code should use `` ` `` as a marker
 *
 * @example
 *   {"name": "not-ok-consistent-tilde.md", "label": "input"}
 *
 *   ~~~alpha
 *   bravo()
 *   ~~~
 *
 *   ```
 *   charlie()
 *   ```
 *
 * @example
 *   {"name": "not-ok-consistent-tilde.md", "label": "output"}
 *
 *   5:1-7:4: Fenced code should use `~` as a marker
 *
 * @example
 *   {"name": "not-ok-incorrect.md", "setting": "💩", "label": "output", "positionless": true}
 *
 *   1:1: Incorrect fenced code marker `💩`: use either `'consistent'`, `` '`' ``, or `'~'`
 */

/**
 * @typedef {import('mdast').Root} Root
 * @typedef {'~'|'`'} Marker
 * @typedef {'consistent'|Marker} Options
 */

import {lintRule} from 'unified-lint-rule'
import {visit} from 'unist-util-visit'
import {pointStart} from 'unist-util-position'

const remarkLintFencedCodeMarker = lintRule(
  {
    origin: 'remark-lint:fenced-code-marker',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-fenced-code-marker#readme'
  },
  /** @type {import('unified-lint-rule').Rule<Root, Options>} */
  (tree, file, option = 'consistent') => {
    const contents = String(file)

    if (option !== 'consistent' && option !== '~' && option !== '`') {
      file.fail(
        'Incorrect fenced code marker `' +
          option +
          "`: use either `'consistent'`, `` '`' ``, or `'~'`"
      )
    }

    visit(tree, 'code', (node) => {
      const start = pointStart(node).offset

      if (typeof start === 'number') {
        const marker = contents
          .slice(start, start + 4)
          .replace(/^\s+/, '')
          .charAt(0)

        // Ignore unfenced code blocks.
        if (marker === '~' || marker === '`') {
          if (option === 'consistent') {
            option = marker
          } else if (marker !== option) {
            file.message(
              'Fenced code should use `' +
                (option === '~' ? option : '` ` `') +
                '` as a marker',
              node
            )
          }
        }
      }
    })
  }
)

export default remarkLintFencedCodeMarker

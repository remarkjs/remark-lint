/**
 * ## When should I use this?
 *
 * You can use this package to check that the style of GFM tasklists is
 * consistent.
 *
 * ## API
 *
 * The following options (default: `'consistent'`) are accepted:
 *
 * *   `Object` with the following fields:
 *     *   `checked` (`'x'`, `'X'`, or `'consistent'`, default: `'consistent'`)
 *         — preferred character to use for checked checkboxes
 *     *   `unchecked` (`'·'` (a space), `'»'` (a tab), or `'consistent'`,
 *         default: `'consistent'`)
 *         — preferred character to use for unchecked checkboxes
 * *   `'consistent'`
 *     — detect the first used styles and warn when further checkboxes differ
 *
 * ## Recommendation
 *
 * It’s recommended to set `options.checked` to `'x'` (a lowercase X) as it
 * prevents an extra keyboard press and `options.unchecked` to `'·'` (a space)
 * to make all checkboxes align.
 *
 * ## Fix
 *
 * [`remark-stringify`](https://github.com/remarkjs/remark/tree/main/packages/remark-stringify)
 * formats checked checkboxes using `'x'` (lowercase X) and unchecked checkboxes
 * using `'·'` (a space).
 *
 * @module checkbox-character-style
 * @summary
 *   remark-lint rule to warn when list item checkboxes violate a given
 *   style.
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @example
 *   {"name": "ok.md", "setting": {"checked": "x"}, "gfm": true}
 *
 *   - [x] List item
 *   - [x] List item
 *
 * @example
 *   {"name": "ok.md", "setting": {"checked": "X"}, "gfm": true}
 *
 *   - [X] List item
 *   - [X] List item
 *
 * @example
 *   {"name": "ok.md", "setting": {"unchecked": " "}, "gfm": true}
 *
 *   - [ ] List item
 *   - [ ] List item
 *   - [ ]··
 *   - [ ]
 *
 * @example
 *   {"name": "ok.md", "setting": {"unchecked": "\t"}, "gfm": true}
 *
 *   - [»] List item
 *   - [»] List item
 *
 * @example
 *   {"name": "not-ok.md", "label": "input", "gfm": true}
 *
 *   - [x] List item
 *   - [X] List item
 *   - [ ] List item
 *   - [»] List item
 *
 * @example
 *   {"name": "not-ok.md", "label": "output", "gfm": true}
 *
 *   2:5: Checked checkboxes should use `x` as a marker
 *   4:5: Unchecked checkboxes should use ` ` as a marker
 *
 * @example
 *   {"setting": {"unchecked": "💩"}, "name": "not-ok.md", "label": "output", "positionless": true, "gfm": true}
 *
 *   1:1: Incorrect unchecked checkbox marker `💩`: use either `'\t'`, or `' '`
 *
 * @example
 *   {"setting": {"checked": "💩"}, "name": "not-ok.md", "label": "output", "positionless": true, "gfm": true}
 *
 *   1:1: Incorrect checked checkbox marker `💩`: use either `'x'`, or `'X'`
 */

/**
 * @typedef {import('mdast').Root} Root
 *
 * @typedef Styles
 * @property {'x'|'X'|'consistent'} [checked='consistent']
 * @property {' '|'\x09'|'consistent'} [unchecked='consistent']
 *
 * @typedef {'consistent'|Styles} Options
 */

import {lintRule} from 'unified-lint-rule'
import {visit} from 'unist-util-visit'
import {pointStart} from 'unist-util-position'

const remarkLintCheckboxCharacterStyle = lintRule(
  {
    origin: 'remark-lint:checkbox-character-style',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-checkbox-character-style#readme'
  },
  /** @type {import('unified-lint-rule').Rule<Root, Options>} */
  (tree, file, option = 'consistent') => {
    const value = String(file)
    /** @type {'x'|'X'|'consistent'} */
    let checked = 'consistent'
    /** @type {' '|'\x09'|'consistent'} */
    let unchecked = 'consistent'

    if (typeof option === 'object') {
      checked = option.checked || 'consistent'
      unchecked = option.unchecked || 'consistent'
    }

    if (unchecked !== 'consistent' && unchecked !== ' ' && unchecked !== '\t') {
      file.fail(
        'Incorrect unchecked checkbox marker `' +
          unchecked +
          "`: use either `'\\t'`, or `' '`"
      )
    }

    if (checked !== 'consistent' && checked !== 'x' && checked !== 'X') {
      file.fail(
        'Incorrect checked checkbox marker `' +
          checked +
          "`: use either `'x'`, or `'X'`"
      )
    }

    visit(tree, 'listItem', (node) => {
      const head = node.children[0]
      const point = pointStart(head)

      // Exit early for items without checkbox.
      // A list item cannot be checked and empty, according to GFM.
      if (
        typeof node.checked !== 'boolean' ||
        !head ||
        typeof point.offset !== 'number'
      ) {
        return
      }

      // Move back to before `] `.
      point.offset -= 2
      point.column -= 2

      // Assume we start with a checkbox, because well, `checked` is set.
      const match = /\[([\t Xx])]/.exec(
        value.slice(point.offset - 2, point.offset + 1)
      )

      // Failsafe to make sure we don‘t crash if there actually isn’t a checkbox.
      /* c8 ignore next */
      if (!match) return

      const style = node.checked ? checked : unchecked

      if (style === 'consistent') {
        if (node.checked) {
          // @ts-expect-error: valid marker.
          checked = match[1]
        } else {
          // @ts-expect-error: valid marker.
          unchecked = match[1]
        }
      } else if (match[1] !== style) {
        file.message(
          (node.checked ? 'Checked' : 'Unchecked') +
            ' checkboxes should use `' +
            style +
            '` as a marker',
          point
        )
      }
    })
  }
)

export default remarkLintCheckboxCharacterStyle

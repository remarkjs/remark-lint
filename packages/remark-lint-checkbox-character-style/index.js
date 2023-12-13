/**
 * remark-lint rule to warn when list item checkboxes violate a given
 * style.
 *
 * ## What is this?
 *
 * This package checks the character used in checkboxes.
 *
 * ## When should I use this?
 *
 * You can use this package to check that the style of GFM tasklists is
 * consistent.
 *
 * ## API
 *
 * ### `unified().use(remarkLintCheckboxCharacterStyle[, options])`
 *
 * Warn when list item checkboxes violate a given style.
 *
 * ###### Parameters
 *
 * * `options` ([`Options`][api-options], default: `'consistent'`)
 *   — either preferred values or whether to detect the first styles
 *   and warn for further differences
 *
 * ###### Returns
 *
 * Transform ([`Transformer` from `unified`][github-unified-transformer]).
 *
 * ### `Options`
 *
 * Configuration (TypeScript type).
 *
 * ###### Type
 *
 * ```ts
 * type Options = Styles | 'consistent'
 * ```
 *
 * ### `Styles`
 *
 * Styles (TypeScript type).
 *
 * ###### Fields
 *
 * * `checked` (`'X'`, `'x'`, or `'consistent'`, default: `'consistent'`)
 *   — preferred style to use for checked checkboxes
 * * `unchecked` (`'␉'` (a tab), `'␠'` (a space), or `'consistent'`, default:
 *   `'consistent'`)
 *   — preferred style to use for unchecked checkboxes
 *
 * ## Recommendation
 *
 * It’s recommended to set `options.checked` to `'x'` (a lowercase X) as it
 * prevents an extra keyboard press and `options.unchecked` to `'␠'` (a space)
 * to make all checkboxes align.
 *
 * ## Fix
 *
 * [`remark-stringify`][github-remark-stringify] formats checked checkboxes
 * using `'x'` (lowercase X) and unchecked checkboxes using `'␠'` (a space).
 *
 * [api-options]: #options
 * [api-remark-lint-checkbox-character-style]: #unifieduseremarklintcheckboxcharacterstyle-options
 * [api-styles]: #styles
 * [github-remark-stringify]: https://github.com/remarkjs/remark/tree/main/packages/remark-stringify
 * [github-unified-transformer]: https://github.com/unifiedjs/unified#transformer
 *
 * @module checkbox-character-style
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @example
 *   {"name": "ok.md", "config": {"checked": "x"}, "gfm": true}
 *
 *   - [x] List item
 *   - [x] List item
 *
 * @example
 *   {"name": "ok.md", "config": {"checked": "X"}, "gfm": true}
 *
 *   - [X] List item
 *   - [X] List item
 *
 * @example
 *   {"name": "ok.md", "config": {"unchecked": " "}, "gfm": true}
 *
 *   - [ ] List item
 *   - [ ] List item
 *   - [ ]␠␠
 *   - [ ]
 *
 * @example
 *   {"name": "ok.md", "config": {"unchecked": "\t"}, "gfm": true}
 *
 *   - [␉] List item
 *   - [␉] List item
 *
 * @example
 *   {"name": "not-ok.md", "label": "input", "gfm": true}
 *
 *   - [x] List item
 *   - [X] List item
 *   - [ ] List item
 *   - [␉] List item
 *
 * @example
 *   {"name": "not-ok.md", "label": "output", "gfm": true}
 *
 *   2:5: Checked checkboxes should use `x` as a marker
 *   4:5: Unchecked checkboxes should use ` ` as a marker
 *
 * @example
 *   {"config": {"unchecked": "💩"}, "name": "not-ok.md", "label": "output", "positionless": true, "gfm": true}
 *
 *   1:1: Incorrect unchecked checkbox marker `💩`: use either `'\t'`, or `' '`
 *
 * @example
 *   {"config": {"checked": "💩"}, "name": "not-ok.md", "label": "output", "positionless": true, "gfm": true}
 *
 *   1:1: Incorrect checked checkbox marker `💩`: use either `'x'`, or `'X'`
 */

/**
 * @typedef {import('mdast').Root} Root
 */

/**
 * @typedef {Styles | 'consistent'} Options
 *   Configuration.
 *
 * @typedef Styles
 *   Styles.
 * @property {'X' | 'x' | 'consistent' | null | undefined} [checked='consistent']
 *   Preferred style to use for checked checkboxes (default: `'consistent'`).
 * @property {'\t' | ' ' | 'consistent' | null | undefined} [unchecked='consistent']
 *   Preferred style to use for unchecked checkboxes (default: `'consistent'`).
 */

import {lintRule} from 'unified-lint-rule'
import {pointStart} from 'unist-util-position'
import {visit} from 'unist-util-visit'

const remarkLintCheckboxCharacterStyle = lintRule(
  {
    origin: 'remark-lint:checkbox-character-style',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-checkbox-character-style#readme'
  },
  /**
   * @param {Root} tree
   *   Tree.
   * @param {Options | null | undefined} [options]
   *   Configuration (optional).
   * @returns {undefined}
   *   Nothing.
   */
  function (tree, file, options) {
    const value = String(file)
    /** @type {'X' | 'x' | 'consistent'} */
    let checked = 'consistent'
    /** @type {'\x09' | ' ' | 'consistent'} */
    let unchecked = 'consistent'

    if (options && typeof options === 'object') {
      checked = options.checked || 'consistent'
      unchecked = options.unchecked || 'consistent'
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

    visit(tree, 'listItem', function (node) {
      const head = node.children[0]
      const point = pointStart(head)

      // Exit early for items without checkbox.
      // A list item cannot be checked and empty, according to GFM.
      if (
        !point ||
        !head ||
        typeof node.checked !== 'boolean' ||
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

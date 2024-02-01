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
 * Task lists are a GFM feature enabled with
 * [`remark-gfm`][github-remark-gfm].
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
 * [github-remark-gfm]: https://github.com/remarkjs/remark-gfm
 * [github-remark-stringify]: https://github.com/remarkjs/remark/tree/main/packages/remark-stringify
 * [github-unified-transformer]: https://github.com/unifiedjs/unified#transformer
 *
 * @module checkbox-character-style
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 *
 * @example
 *   {"config": {"checked": "x"}, "gfm": true, "name": "ok-x.md"}
 *
 *   - [x] Mercury.
 *   - [x] Venus.
 *
 * @example
 *   {"config": {"checked": "X"}, "gfm": true, "name": "ok-x-upper.md"}
 *
 *   - [X] Mercury.
 *   - [X] Venus.
 *
 * @example
 *   {"config": {"unchecked": " "}, "gfm": true, "name": "ok-space.md"}
 *
 *   - [ ] Mercury.
 *   - [ ] Venus.
 *   - [ ]␠␠
 *   - [ ]
 *
 * @example
 *   {"config": {"unchecked": "\t"}, "gfm": true, "name": "ok-tab.md"}
 *
 *   - [␉] Mercury.
 *   - [␉] Venus.
 *
 * @example
 *   {"label": "input", "gfm": true, "name": "not-ok-default.md"}
 *
 *   - [x] Mercury.
 *   - [X] Venus.
 *   - [ ] Earth.
 *   - [␉] Mars.
 * @example
 *   {"label": "output", "gfm": true, "name": "not-ok-default.md"}
 *
 *   2:5: Unexpected checked checkbox value `X`, expected `x`
 *   4:5: Unexpected unchecked checkbox value `\t`, expected ` `
 *
 * @example
 *   {"config": "🌍", "label": "output", "name": "not-ok-option.md", "positionless": true}
 *
 *   1:1: Unexpected value `🌍` for `options`, expected an object or `'consistent'`
 *
 * @example
 *   {"config": {"unchecked": "🌍"}, "label": "output", "name": "not-ok-option-unchecked.md", "positionless": true}
 *
 *   1:1: Unexpected value `🌍` for `options.unchecked`, expected `'\t'`, `' '`, or `'consistent'`
 *
 * @example
 *   {"config": {"checked": "🌍"}, "label": "output", "name": "not-ok-option-checked.md", "positionless": true}
 *
 *   1:1: Unexpected value `🌍` for `options.checked`, expected `'X'`, `'x'`, or `'consistent'`
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

import {phrasing} from 'mdast-util-phrasing'
import {lintRule} from 'unified-lint-rule'
import {pointStart} from 'unist-util-position'
import {SKIP, visitParents} from 'unist-util-visit-parents'
import {VFileMessage} from 'vfile-message'

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
    /** @type {'X' | 'x' | undefined} */
    let checkedExpected
    /** @type {VFileMessage | undefined} */
    let checkedConsistentCause
    /** @type {'\t' | ' ' | undefined} */
    let uncheckedExpected
    /** @type {VFileMessage | undefined} */
    let uncheckedConsistentCause

    if (options === null || options === undefined || options === 'consistent') {
      // Empty.
    } else if (typeof options === 'object') {
      if (options.checked === 'X' || options.checked === 'x') {
        checkedExpected = options.checked
      } else if (options.checked && options.checked !== 'consistent') {
        file.fail(
          'Unexpected value `' +
            options.checked +
            "` for `options.checked`, expected `'X'`, `'x'`, or `'consistent'`"
        )
      }

      if (options.unchecked === '\t' || options.unchecked === ' ') {
        uncheckedExpected = options.unchecked
      } else if (options.unchecked && options.unchecked !== 'consistent') {
        file.fail(
          'Unexpected value `' +
            options.unchecked +
            "` for `options.unchecked`, expected `'\\t'`, `' '`, or `'consistent'`"
        )
      }
    } else {
      file.fail(
        'Unexpected value `' +
          options +
          "` for `options`, expected an object or `'consistent'`"
      )
    }

    visitParents(tree, function (node, parents) {
      // Do not walk into phrasing.
      if (phrasing(node)) {
        return SKIP
      }

      if (node.type !== 'listItem') return

      const head = node.children[0]
      const headStart = pointStart(head)

      // Exit early for items without checkbox.
      // A list item cannot be checked and empty, according to GFM.
      if (
        !head ||
        !headStart ||
        typeof node.checked !== 'boolean' ||
        typeof headStart.offset !== 'number'
      ) {
        return
      }

      // Move back to before `] `.
      headStart.offset -= 2
      headStart.column -= 2

      // Assume we start with a checkbox, because well, `checked` is set.
      const match = /\[([\t Xx])]/.exec(
        value.slice(headStart.offset - 2, headStart.offset + 1)
      )

      /* c8 ignore next 2 -- failsafe so we don’t crash if there actually isn’t
       * a checkbox. */
      if (!match) return

      const actual = match[1]
      const actualDisplay = actual === '\t' ? '\\t' : actual
      const expected = node.checked ? checkedExpected : uncheckedExpected
      const expectedDisplay = expected === '\t' ? '\\t' : expected

      if (!expected) {
        const cause = new VFileMessage(
          (node.checked ? 'C' : 'Unc') +
            "hecked checkbox style `'" +
            actualDisplay +
            "'` first defined for `'consistent'` here",
          {
            ancestors: [...parents, node],
            place: headStart,
            ruleId: 'checkbox-character-style',
            source: 'remark-lint'
          }
        )

        if (node.checked) {
          checkedExpected = /** @type {'X' | 'x'} */ (actual)
          checkedConsistentCause = cause
        } else {
          uncheckedExpected = /** @type {'\t' | ' '} */ (actual)
          uncheckedConsistentCause = cause
        }
      } else if (actual !== expected) {
        file.message(
          'Unexpected ' +
            (node.checked ? '' : 'un') +
            'checked checkbox value `' +
            actualDisplay +
            '`, expected `' +
            expectedDisplay +
            '`',
          {
            ancestors: [...parents, node],
            cause: node.checked
              ? checkedConsistentCause
              : uncheckedConsistentCause,
            place: headStart
          }
        )
      }
    })
  }
)

export default remarkLintCheckboxCharacterStyle

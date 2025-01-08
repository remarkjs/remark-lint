/**
 * remark-lint rule to warn when lists violate a given style.
 *
 * ## What is this?
 *
 * This package checks blank lines between list items.
 *
 * ## When should I use this?
 *
 * You can use this package to check the style of lists.
 *
 * ## API
 *
 * ### `unified().use(remarkLintListItemSpacing[, options])`
 *
 * Warn when lists violate a given style.
 *
 * ###### Parameters
 *
 * * `options` ([`Options`][api-options], optional)
 *   — configuration
 *
 * ###### Returns
 *
 * Transform ([`Transformer` from `unified`][github-unified-transformer]).
 *
 * ### `Options`
 *
 * Configuration (TypeScript type).
 *
 * ###### Fields
 *
 * * `checkBlanks` (`boolean`, default: `false`)
 *   — expect blank lines between items based on whether an item has blank
 *   lines *in* them;
 *   the default is to expect blank lines based on whether items span multiple
 *   lines
 *
 * ## Recommendation
 *
 * First some background.
 * Regardless of ordered and unordered,
 * there are two kinds of lists in markdown,
 * tight and loose.
 * Lists are tight by default but if there is a blank line between two list
 * items or between two blocks inside an item,
 * that turns the whole list into a loose list.
 * When turning markdown into HTML,
 * paragraphs in tight lists are not wrapped in `<p>` tags.
 *
 * This rule defaults to the [`markdown-style-guide`][markdown-style-guide]
 * preference for which lists should be loose or not:
 * loose when at least one item spans more than one line and tight otherwise.
 * With `{checkBlanks: true}`,
 * this rule follows whether a list is loose or not according to Commonmark,
 * and when one item is loose,
 * all items must be loose.
 *
 * [api-options]: #options
 * [api-remark-lint-list-item-spacing]: #unifieduseremarklintlistitemspacing-options
 * [github-unified-transformer]: https://github.com/unifiedjs/unified#transformer
 * [markdown-style-guide]: https://cirosantilli.com/markdown-style-guide/
 *
 * @module list-item-spacing
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 *
 * @example
 *   {"name": "ok.md"}
 *
 *   * Mercury.
 *   * Venus.
 *
 *   +   Mercury and
 *       Venus.
 *
 *   +   Earth.
 *
 * @example
 *   {"config": {"checkBlanks": true}, "name": "ok-check-blanks.md"}
 *
 *   * Mercury.
 *   * Venus.
 *
 *   +   Mercury
 *
 *       Mercury is the first planet from the Sun and the smallest in the Solar
 *       System.
 *
 *   +   Earth.
 *
 * @example
 *   {"label": "input", "name": "not-ok.md"}
 *
 *   * Mercury.
 *
 *   * Venus.
 *
 *   +   Mercury and
 *       Venus.
 *   +   Earth.
 *
 *   *   Mercury.
 *
 *       Mercury is the first planet from the Sun and the smallest in the Solar
 *       System.
 *   *   Earth.
 * @example
 *   {"label": "output", "name": "not-ok.md"}
 *
 *   1:11-3:1: Unexpected `1` blank line between list items, expected `0` blank lines, remove `1` blank line
 *   6:11-7:1: Unexpected `0` blank lines between list items, expected `1` blank line, add `1` blank line
 *   12:12-13:1: Unexpected `0` blank lines between list items, expected `1` blank line, add `1` blank line
 *
 * @example
 *   {"config": {"checkBlanks": true}, "label": "input", "name": "not-ok-blank.md"}
 *
 *   * Mercury.
 *
 *   * Venus.
 *
 *   +   Mercury and
 *       Venus.
 *
 *   +   Earth.
 *
 *   *   Mercury.
 *
 *       Mercury is the first planet from the Sun and the smallest in the Solar
 *       System.
 *   *   Earth.
 * @example
 *   {"config": {"checkBlanks": true}, "label": "output", "name": "not-ok-blank.md"}
 *
 *   1:11-3:1: Unexpected `1` blank line between list items, expected `0` blank lines, remove `1` blank line
 *   6:11-8:1: Unexpected `1` blank line between list items, expected `0` blank lines, remove `1` blank line
 *   13:12-14:1: Unexpected `0` blank lines between list items, expected `1` blank line, add `1` blank line
 */

/**
 * @import {ListItem, Root} from 'mdast'
 */

/**
 * @typedef Options
 *   Configuration.
 * @property {boolean | null | undefined} [checkBlanks=false]
 *   Whether to follow CommonMark looseness instead of `markdown-style-guide`
 *   preference (default: `false`).
 */

import {phrasing} from 'mdast-util-phrasing'
import pluralize from 'pluralize'
import {lintRule} from 'unified-lint-rule'
import {pointEnd, pointStart} from 'unist-util-position'
import {SKIP, visitParents} from 'unist-util-visit-parents'
import {VFileMessage} from 'vfile-message'

/** @type {Readonly<Options>} */
const emptyOptions = {}

const remarkLintListItemSpacing = lintRule(
  {
    origin: 'remark-lint:list-item-spacing',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-list-item-spacing#readme'
  },
  /**
   * @param {Root} tree
   *   Tree.
   * @param {Readonly<Options> | null | undefined} [options]
   *   Configuration (optional).
   * @returns {undefined}
   *   Nothing.
   */
  function (tree, file, options) {
    const settings = options || emptyOptions
    // To do: change options. Maybe to `Style = 'markdown' | 'markdown-style-guide'`?
    // To do: default to “markdown” instead of weird archaic “markdown-style-guide”.
    const checkBlanks = settings.checkBlanks || false

    visitParents(tree, function (list, parents) {
      // Do not walk into phrasing.
      if (phrasing(list)) {
        return SKIP
      }

      if (list.type !== 'list') return
      /** @type {VFileMessage | undefined} */
      let spacedCause

      for (const item of list.children) {
        /** @type {boolean | null | undefined} */
        let spaced = false

        if (checkBlanks) {
          spaced = item.spread
        } else {
          const tail = item.children.at(-1)
          const end = pointEnd(tail)
          const start = pointStart(item)
          spaced = end && start && end.line - start.line > 0
        }

        if (spaced) {
          spacedCause = new VFileMessage(
            'Spaced list item first defined here',
            {
              ancestors: [...parents, list, item],
              place: item.position,
              ruleId: 'list-item-spacing',
              source: 'remark-lint'
            }
          )
          break
        }
      }

      const expected = spacedCause ? 1 : 0
      /** @type {ListItem | undefined} */
      let previous

      for (const item of list.children) {
        const previousEnd = pointEnd(previous)
        const itemStart = pointStart(item)

        if (previousEnd && itemStart) {
          const actual = itemStart.line - previousEnd.line - 1

          if (actual !== expected) {
            const difference = expected - actual
            const differenceAbsolute = Math.abs(difference)

            file.message(
              'Unexpected `' +
                actual +
                '` blank ' +
                pluralize('line', actual) +
                ' between list items, expected `' +
                expected +
                '` blank ' +
                pluralize('line', expected) +
                ', ' +
                (difference > 0 ? 'add' : 'remove') +
                ' `' +
                differenceAbsolute +
                '` blank ' +
                pluralize('line', differenceAbsolute),
              {
                ancestors: [...parents, list, item],
                cause: spacedCause,
                place: {start: previousEnd, end: itemStart}
              }
            )
          }
        }

        previous = item
      }
    })
  }
)

export default remarkLintListItemSpacing

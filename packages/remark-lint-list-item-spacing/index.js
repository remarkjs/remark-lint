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
 * @example
 *   {"name": "ok.md"}
 *
 *   A tight list:
 *
 *   -   item 1
 *   -   item 2
 *   -   item 3
 *
 *   A loose list:
 *
 *   -   Wrapped
 *       item
 *
 *   -   item 2
 *
 *   -   item 3
 *
 * @example
 *   {"name": "not-ok.md", "label": "input"}
 *
 *   A tight list:
 *
 *   -   Wrapped
 *       item
 *   -   item 2
 *   -   item 3
 *
 *   A loose list:
 *
 *   -   item 1
 *
 *   -   item 2
 *
 *   -   item 3
 *
 * @example
 *   {"name": "not-ok.md", "label": "output"}
 *
 *   4:9-5:1: Missing new line after list item
 *   5:11-6:1: Missing new line after list item
 *   10:11-12:1: Extraneous new line after list item
 *   12:11-14:1: Extraneous new line after list item
 *
 * @example
 *   {"name": "ok.md", "config": {"checkBlanks": true}}
 *
 *   A tight list:
 *
 *   -   item 1
 *       - item 1.A
 *   -   item 2
 *       > Block quote
 *
 *   A loose list:
 *
 *   -   item 1
 *
 *       - item 1.A
 *
 *   -   item 2
 *
 *       > Block quote
 *
 * @example
 *   {"name": "not-ok.md", "config": {"checkBlanks": true}, "label": "input"}
 *
 *   A tight list:
 *
 *   -   item 1
 *
 *       - item 1.A
 *   -   item 2
 *
 *       > Block quote
 *   -   item 3
 *
 *   A loose list:
 *
 *   -   item 1
 *       - item 1.A
 *
 *   -   item 2
 *       > Block quote
 *
 * @example
 *   {"name": "not-ok.md", "config": {"checkBlanks": true}, "label": "output"}
 *
 *   5:15-6:1: Missing new line after list item
 *   8:18-9:1: Missing new line after list item
 *   14:15-16:1: Extraneous new line after list item
 */

/**
 * @typedef {import('mdast').ListItem} ListItem
 * @typedef {import('mdast').Root} Root
 */

/**
 * @typedef Options
 *   Configuration.
 * @property {boolean | null | undefined} [checkBlanks=false]
 *   Whether to follow CommonMark looseness instead of `markdown-style-guide`
 *   preference (default: `false`).
 */

import {lintRule} from 'unified-lint-rule'
import {pointEnd, pointStart} from 'unist-util-position'
import {visit} from 'unist-util-visit'

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
    const checkBlanks = settings.checkBlanks || false
    const infer = checkBlanks ? blanksBetween : multiline

    visit(tree, 'list', function (node) {
      let index = -1
      let anySpaced = false

      while (++index < node.children.length) {
        const spaced = infer(node.children[index])

        if (spaced) {
          anySpaced = true
          break
        }
      }

      index = 0 // Skip first.

      while (++index < node.children.length) {
        const previous = node.children[index - 1]
        const current = node.children[index]
        const previousEnd = pointEnd(previous)
        const start = pointStart(current)

        if (previousEnd && start) {
          const spaced = start.line - previousEnd.line > 1

          if (spaced !== anySpaced) {
            file.message(
              anySpaced
                ? 'Missing new line after list item'
                : 'Extraneous new line after list item',
              {start: previousEnd, end: start}
            )
          }
        }
      }
    })
  }
)

export default remarkLintListItemSpacing

/**
 * @param {ListItem} node
 *   Item.
 * @returns {boolean}
 *   Whether there is a blank line between one of the children.
 */
function blanksBetween(node) {
  let index = 0 // Skip first.

  while (++index < node.children.length) {
    const previousEnd = pointEnd(node.children[index - 1])
    const start = pointStart(node.children[index])

    // Note: all children in `listItem`s are flow.
    if (start && previousEnd && start.line - previousEnd.line > 1) {
      return true
    }
  }

  return false
}

/**
 * @param {ListItem} node
 *   Item.
 * @returns {boolean}
 *   Whether `node` spans multiple lines.
 */
function multiline(node) {
  const head = node.children[0]
  const tail = node.children[node.children.length - 1]
  const end = pointEnd(tail)
  const start = pointStart(head)

  return Boolean(end && start && end.line - start.line > 0)
}

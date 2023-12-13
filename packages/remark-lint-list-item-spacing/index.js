/**
 * remark-lint rule to warn when lists violate a given style.
 *
 * ## What is this?
 *
 * This package checks the style of lists.
 *
 * ## When should I use this?
 *
 * You can use this package to check that lists are loose or tight when
 * they should be is.
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
 *   — whether to follow CommonMark looseness instead of `markdown-style-guide`
 *   preference
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
    // To do: change options? Follow CM by default?
    const settings = options || emptyOptions
    const checkBlanks = settings.checkBlanks || false
    const infer = checkBlanks ? inferBlankLine : inferMultiline

    visit(tree, 'list', function (node) {
      let tight = true
      let index = -1

      while (++index < node.children.length) {
        if (infer(node.children[index])) {
          tight = false
          break
        }
      }

      index = 0 // Skip over first.

      while (++index < node.children.length) {
        const start = pointEnd(node.children[index - 1])
        const end = pointStart(node.children[index])

        if (start && end && end.line - start.line < 2 !== tight) {
          file.message(
            tight
              ? 'Extraneous new line after list item'
              : 'Missing new line after list item',
            {start, end}
          )
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
 *   Whether there’s a blank line between item children.
 */
function inferBlankLine(node) {
  let index = 0

  while (++index < node.children.length) {
    const start = pointStart(node.children[index])
    const end = pointEnd(node.children[index - 1])

    // All children in `listItem`s are block.
    if (start && end && start.line - end.line > 1) {
      return true
    }
  }

  return false
}

/**
 * @param {ListItem} node
 *   Item.
 * @returns {boolean}
 *   Whether `node` is multiline.
 */
function inferMultiline(node) {
  const end = pointEnd(node.children[node.children.length - 1])
  const start = pointStart(node.children[0])

  return Boolean(start && end && end.line - start.line > 0)
}

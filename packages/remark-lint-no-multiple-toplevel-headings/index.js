/**
 * ## When should I use this?
 *
 * You can use this package to check that no more than one top level heading
 * is used.
 *
 * ## API
 *
 * The following options (default: `1`) are accepted:
 *
 * *   `number` (example: `1`)
 *     — assumed top level heading rank
 *
 * ## Recommendation
 *
 * Documents should almost always have one main heading, which is typically a
 * heading with a rank of `1`.
 *
 * @module no-multiple-toplevel-headings
 * @summary
 *   remark-lint rule to warn when more than one top level heading is used.
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @example
 *   {"name": "ok.md", "config": 1}
 *
 *   # Foo
 *
 *   ## Bar
 *
 * @example
 *   {"name": "not-ok.md", "config": 1, "label": "input"}
 *
 *   # Foo
 *
 *   # Bar
 *
 * @example
 *   {"name": "not-ok.md", "config": 1, "label": "output"}
 *
 *   3:1-3:6: Don’t use multiple top level headings (1:1)
 */

/**
 * @typedef {import('mdast').Root} Root
 * @typedef {import('mdast').Heading} Heading
 */

/**
 * @typedef {Heading['depth']} Options
 *   Configuration.
 */

import {lintRule} from 'unified-lint-rule'
import {pointStart, position} from 'unist-util-position'
import {stringifyPosition} from 'unist-util-stringify-position'
import {visit} from 'unist-util-visit'

const remarkLintNoMultipleToplevelHeadings = lintRule(
  {
    origin: 'remark-lint:no-multiple-toplevel-headings',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-no-multiple-toplevel-headings#readme'
  },
  /**
   * @param {Root} tree
   *   Tree.
   * @param {Options | null | undefined} [options=1]
   *   Configuration (default: `1`).
   * @returns {undefined}
   *   Nothing.
   */
  function (tree, file, options) {
    const option = options || 1
    /** @type {string | undefined} */
    let duplicate

    visit(tree, 'heading', function (node) {
      const start = pointStart(node)
      const place = position(node)

      if (start && place && node.depth === option) {
        if (duplicate) {
          file.message(
            'Don’t use multiple top level headings (' + duplicate + ')',
            place
          )
        } else {
          duplicate = stringifyPosition(start)
        }
      }
    })
  }
)

export default remarkLintNoMultipleToplevelHeadings

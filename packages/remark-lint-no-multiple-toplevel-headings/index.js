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
 *   {"name": "ok.md", "setting": 1}
 *
 *   # Foo
 *
 *   ## Bar
 *
 * @example
 *   {"name": "not-ok.md", "setting": 1, "label": "input"}
 *
 *   # Foo
 *
 *   # Bar
 *
 * @example
 *   {"name": "not-ok.md", "setting": 1, "label": "output"}
 *
 *   3:1-3:6: Don’t use multiple top level headings (1:1)
 */

/**
 * @typedef {import('mdast').Root} Root
 * @typedef {import('mdast').Heading} Heading
 * @typedef {Heading['depth']} Options
 */

import {lintRule} from 'unified-lint-rule'
import {visit} from 'unist-util-visit'
import {pointStart} from 'unist-util-position'
import {generated} from 'unist-util-generated'
import {stringifyPosition} from 'unist-util-stringify-position'

const remarkLintNoMultipleToplevelHeadings = lintRule(
  {
    origin: 'remark-lint:no-multiple-toplevel-headings',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-no-multiple-toplevel-headings#readme'
  },
  /** @type {import('unified-lint-rule').Rule<Root, Options>} */
  (tree, file, option = 1) => {
    /** @type {string|undefined} */
    let duplicate

    visit(tree, 'heading', (node) => {
      if (!generated(node) && node.depth === option) {
        if (duplicate) {
          file.message(
            'Don’t use multiple top level headings (' + duplicate + ')',
            node
          )
        } else {
          duplicate = stringifyPosition(pointStart(node))
        }
      }
    })
  }
)

export default remarkLintNoMultipleToplevelHeadings

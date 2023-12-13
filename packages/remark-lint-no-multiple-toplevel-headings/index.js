/**
 * remark-lint rule to warn when multiple top-level headings are used.
 *
 * ## What is this?
 *
 * This package checks that no more than one top level heading is used.
 *
 * ## When should I use this?
 *
 * You can use this package to check heading structure.
 *
 * ## API
 *
 * ### `unified().use(remarkLintNoMultipleToplevelHeadings[, options])`
 *
 * Warn when multiple top-level headings are used.
 *
 * ###### Parameters
 *
 * * `options` ([`Options`][api-options], default: `1`)
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
 * ###### Type
 *
 * ```ts
 * type Options = 1 | 2 | 3 | 4 | 5 | 6
 * ```
 *
 * ## Recommendation
 *
 * Documents should almost always have one main heading,
 * which is typically a heading with a rank of `1`.
 *
 * [api-options]: #options
 * [api-remark-lint-no-multiple-toplevel-headings]: #unifieduseremarklintnomultipletoplevelheadings-options
 * [github-remark-stringify]: https://github.com/remarkjs/remark/tree/main/packages/remark-stringify
 * [github-unified-transformer]: https://github.com/unifiedjs/unified#transformer
 *
 * @module no-multiple-toplevel-headings
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

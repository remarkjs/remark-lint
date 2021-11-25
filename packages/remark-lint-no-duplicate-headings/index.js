/**
 * ## When should I use this?
 *
 * You can use this package to check that headings with the same text are
 * used once.
 *
 * ## API
 *
 * There are no options.
 *
 * ## Recommendation
 *
 * Headings having unique text helps screen reader users (who typically use
 * “jump to heading” features to navigate within a page, which reads headings
 * out loud).
 * It also helps because often headings receive automatic unique IDs, and when
 * the same heading text is used, they are suffixed with a number based on where
 * they are positioned in the document, which makes linking to them prone to
 * changes.
 *
 * @module no-duplicate-headings
 * @summary
 *   remark-lint rule to warn when headings with the same text are found.
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @example
 *   {"name": "ok.md"}
 *
 *   # Foo
 *
 *   ## Bar
 *
 * @example
 *   {"name": "not-ok.md", "label": "input"}
 *
 *   # Foo
 *
 *   ## Foo
 *
 *   ## [Foo](http://foo.com/bar)
 *
 * @example
 *   {"name": "not-ok.md", "label": "output"}
 *
 *   3:1-3:7: Do not use headings with similar content (1:1)
 *   5:1-5:29: Do not use headings with similar content (3:1)
 */

/**
 * @typedef {import('mdast').Root} Root
 */

import {lintRule} from 'unified-lint-rule'
import {pointStart} from 'unist-util-position'
import {generated} from 'unist-util-generated'
import {visit} from 'unist-util-visit'
import {stringifyPosition} from 'unist-util-stringify-position'
import {toString} from 'mdast-util-to-string'

const remarkLintNoDuplicateHeadings = lintRule(
  {
    origin: 'remark-lint:no-duplicate-headings',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-no-duplicate-headings#readme'
  },
  /** @type {import('unified-lint-rule').Rule<Root, void>} */
  (tree, file) => {
    /** @type {Record<string, string>} */
    const map = Object.create(null)

    visit(tree, 'heading', (node) => {
      if (!generated(node)) {
        const value = toString(node).toUpperCase()
        const duplicate = map[value]

        if (duplicate) {
          file.message(
            'Do not use headings with similar content (' + duplicate + ')',
            node
          )
        }

        map[value] = stringifyPosition(pointStart(node))
      }
    })
  }
)

export default remarkLintNoDuplicateHeadings

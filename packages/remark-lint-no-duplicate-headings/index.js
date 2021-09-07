/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module no-duplicate-headings
 * @fileoverview
 *   Warn when duplicate headings are found.
 *
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

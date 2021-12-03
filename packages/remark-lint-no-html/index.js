/**
 * ## When should I use this?
 *
 * You can use this package to check that no HTML (other than comments) is used.
 *
 * ## API
 *
 * There are no options.
 *
 * @module no-html
 * @summary
 *   remark-lint rule to warn when HTML is used.
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 *
 * @example
 *   {"name": "ok.md"}
 *
 *   # Hello
 *
 *   <!--Comments are also OK-->
 *
 * @example
 *   {"name": "not-ok.md", "label": "input"}
 *
 *   <h1>Hello</h1>
 *
 * @example
 *   {"name": "not-ok.md", "label": "output"}
 *
 *   1:1-1:15: Do not use HTML in markdown
 */

/**
 * @typedef {import('mdast').Root} Root
 */

import {lintRule} from 'unified-lint-rule'
import {visit} from 'unist-util-visit'
import {generated} from 'unist-util-generated'

const remarkLintNoHtml = lintRule(
  {
    origin: 'remark-lint:no-html',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-no-html#readme'
  },
  /** @type {import('unified-lint-rule').Rule<Root, void>} */
  (tree, file) => {
    visit(tree, 'html', (node) => {
      if (!generated(node) && !/^\s*<!--/.test(node.value)) {
        file.message('Do not use HTML in markdown', node)
      }
    })
  }
)

export default remarkLintNoHtml

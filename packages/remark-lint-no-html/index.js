/**
 * remark-lint rule to warn when HTML is used.
 *
 * ## What is this?
 *
 * This package checks HTML.
 *
 * ## When should I use this?
 *
 * You can use this package to check that no HTML is used.
 *
 * ## API
 *
 * ### `unified().use(remarkLintNoHtml)`
 *
 * Warn when HTML is used.
 *
 * ###### Parameters
 *
 * There are no options.
 *
 * ###### Returns
 *
 * Transform ([`Transformer` from `unified`][github-unified-transformer]).
 *
 * [api-remark-lint-no-html]: #unifieduseremarklintnohtml
 * [github-unified-transformer]: https://github.com/unifiedjs/unified#transformer
 *
 * @module no-html
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
import {position} from 'unist-util-position'
import {visit} from 'unist-util-visit'

const remarkLintNoHtml = lintRule(
  {
    origin: 'remark-lint:no-html',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-no-html#readme'
  },
  /**
   * @param {Root} tree
   *   Tree.
   * @returns {undefined}
   *   Nothing.
   */
  function (tree, file) {
    visit(tree, 'html', function (node) {
      const place = position(node)
      if (place && !/^\s*<!--/.test(node.value)) {
        file.message('Do not use HTML in markdown', place)
      }
    })
  }
)

export default remarkLintNoHtml

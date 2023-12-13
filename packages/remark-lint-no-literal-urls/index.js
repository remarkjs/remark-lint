/**
 * remark-lint rule to warn when GFM autolink literals are used.
 *
 * ## What is this?
 *
 * This package checks that regular autolinks or full links are used.
 *
 * ## When should I use this?
 *
 * You can use this package to check links.
 *
 * ## API
 *
 * ### `unified().use(remarkLintNoLiteralUrls)`
 *
 * Warn when GFM autolink literals are used.
 *
 * ###### Parameters
 *
 * There are no options.
 *
 * ###### Returns
 *
 * Transform ([`Transformer` from `unified`][github-unified-transformer]).
 *
 * ## Recommendation
 *
 * GFM autolink literals (just a raw URL) are a feature enabled by GFM.
 * They don’t work everywhere.
 * So,
 * it’s recommended to instead use regular autolinks (`<https://url>`) or full
 * links (`[text](url)`).
 *
 * ## Fix
 *
 * [`remark-stringify`][github-remark-stringify] never generates GFM autolink
 * literals.
 * It always generates regular autolinks or full links.
 *
 * [api-remark-lint-no-literal-urls]: #unifieduseremarklintnoliteralurls
 * [github-remark-stringify]: https://github.com/remarkjs/remark/tree/main/packages/remark-stringify
 * [github-unified-transformer]: https://github.com/unifiedjs/unified#transformer
 *
 * @module no-literal-urls
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @example
 *   {"name": "ok.md"}
 *
 *   <http://foo.bar/baz>
 *
 * @example
 *   {"name": "not-ok.md", "label": "input", "gfm": true}
 *
 *   http://foo.bar/baz
 *
 * @example
 *   {"name": "not-ok.md", "label": "output", "gfm": true}
 *
 *   1:1-1:19: Don’t use literal URLs without angle brackets
 */

/**
 * @typedef {import('mdast').Root} Root
 */

import {toString} from 'mdast-util-to-string'
import {lintRule} from 'unified-lint-rule'
import {pointEnd, pointStart} from 'unist-util-position'
import {visit} from 'unist-util-visit'

const remarkLintNoLiteralUrls = lintRule(
  {
    origin: 'remark-lint:no-literal-urls',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-no-literal-urls#readme'
  },
  /**
   * @param {Root} tree
   *   Tree.
   * @returns {undefined}
   *   Nothing.
   */
  function (tree, file) {
    visit(tree, 'link', function (node) {
      const value = toString(node)
      const end = pointEnd(node)
      const start = pointStart(node)
      const headStart = pointStart(node.children[0])
      const tailEnd = pointEnd(node.children[node.children.length - 1])

      if (
        end &&
        start &&
        headStart &&
        tailEnd &&
        end.column === tailEnd.column &&
        start.column === headStart.column &&
        (node.url === 'mailto:' + value || node.url === value)
      ) {
        file.message('Don’t use literal URLs without angle brackets', node)
      }
    })
  }
)

export default remarkLintNoLiteralUrls

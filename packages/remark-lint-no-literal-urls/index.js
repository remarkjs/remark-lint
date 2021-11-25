/**
 * ## When should I use this?
 *
 * You can use this package to check that autolink literal URLs are not used.
 *
 * ## API
 *
 * There are no options.
 *
 * ## Recommendation
 *
 * Autolink literal URLs (just a URL) are a feature enabled by GFM.
 * They don’t work everywhere.
 * Due to this, it’s recommended to instead use normal autolinks
 * (`<https://url>`) or links (`[text](url)`).
 *
 * ## Fix
 *
 * [`remark-stringify`](https://github.com/remarkjs/remark/tree/main/packages/remark-stringify)
 * never creates autolink literals and always uses normal autolinks (`<url>`).
 *
 * @module no-literal-urls
 * @summary
 *   remark-lint rule to warn for autolink literals.
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

import {lintRule} from 'unified-lint-rule'
import {visit} from 'unist-util-visit'
import {pointStart, pointEnd} from 'unist-util-position'
import {generated} from 'unist-util-generated'
import {toString} from 'mdast-util-to-string'

const remarkLintNoLiteralUrls = lintRule(
  {
    origin: 'remark-lint:no-literal-urls',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-no-literal-urls#readme'
  },
  /** @type {import('unified-lint-rule').Rule<Root, void>} */
  (tree, file) => {
    visit(tree, 'link', (node) => {
      const value = toString(node)

      if (
        !generated(node) &&
        pointStart(node).column === pointStart(node.children[0]).column &&
        pointEnd(node).column ===
          pointEnd(node.children[node.children.length - 1]).column &&
        (node.url === 'mailto:' + value || node.url === value)
      ) {
        file.message('Don’t use literal URLs without angle brackets', node)
      }
    })
  }
)

export default remarkLintNoLiteralUrls

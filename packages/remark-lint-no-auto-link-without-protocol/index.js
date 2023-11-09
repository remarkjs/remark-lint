/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module no-auto-link-without-protocol
 * @deprecated
 *   **Stability: Legacy**.
 *   This rule is no longer recommended for use.
 *   With CommonMark, all autolinks (except for emails) are required to have a
 *   protocol.
 *   Otherwise they don’t parse.
 *   The previous suggestion to add a protocol to email autolinks was wrong.
 *
 * @example
 *   {"name": "ok.md"}
 *
 *   <http://www.example.com>
 *   <mailto:foo@bar.com>
 *
 *   Most Markdown vendors don’t recognize the following as a link:
 *   <www.example.com>
 *
 * @example
 *   {"name": "not-ok.md", "label": "input"}
 *
 *   <foo@bar.com>
 *
 * @example
 *   {"name": "not-ok.md", "label": "output"}
 *
 *   1:1-1:14: All automatic links must start with a protocol
 */

/**
 * @typedef {import('mdast').Root} Root
 */

import {lintRule} from 'unified-lint-rule'
import {visit} from 'unist-util-visit'
import {pointStart, pointEnd} from 'unist-util-position'
import {toString} from 'mdast-util-to-string'

// Protocol expression.
// See: <https://en.wikipedia.org/wiki/URI_scheme#Generic_syntax>.
const protocol = /^[a-z][a-z+.-]+:\/?/i

const remarkLintNoAutoLinkWithoutProtocol = lintRule(
  {
    origin: 'remark-lint:no-auto-link-without-protocol',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-no-auto-link-without-protocol#readme'
  },
  /** @type {import('unified-lint-rule').Rule<Root, void>} */
  (tree, file) => {
    visit(tree, 'link', (node) => {
      const end = pointEnd(node)
      const headStart = pointStart(node.children[0])
      const start = pointStart(node)
      const tailEnd = pointEnd(node.children[node.children.length - 1])

      if (
        end &&
        headStart &&
        start &&
        tailEnd &&
        start.column === headStart.column - 1 &&
        end.column === tailEnd.column + 1 &&
        !protocol.test(toString(node))
      ) {
        file.message('All automatic links must start with a protocol', node)
      }
    })
  }
)

export default remarkLintNoAutoLinkWithoutProtocol

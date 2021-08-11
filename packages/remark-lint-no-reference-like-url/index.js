/**
 * @author Titus Wormer
 * @copyright 2016 Titus Wormer
 * @license MIT
 * @module no-reference-like-url
 * @fileoverview
 *   Warn when URLs are also defined identifiers.
 *
 * @example {"name": "ok.md"}
 *
 *   [Alpha](http://example.com).
 *
 *   [bravo]: https://example.com
 *
 * @example {"name": "not-ok.md", "label": "input"}
 *
 *   [Charlie](delta).
 *
 *   [delta]: https://example.com
 *
 * @example {"name": "not-ok.md", "label": "output"}
 *
 *   1:1-1:17: Did you mean to use `[delta]` instead of `(delta)`, a reference?
 */

import {lintRule} from 'unified-lint-rule'
import {generated} from 'unist-util-generated'
import {visit} from 'unist-util-visit'

const remarkLintNoReferenceLikeUrl = lintRule(
  'remark-lint:no-reference-like-url',
  (tree, file) => {
    const identifiers = []

    visit(tree, 'definition', (node) => {
      if (!generated(node)) {
        identifiers.push(node.identifier.toLowerCase())
      }
    })

    visit(tree, (node) => {
      if (
        (node.type === 'image' || node.type === 'link') &&
        identifiers.includes(node.url.toLowerCase())
      ) {
        file.message(
          'Did you mean to use `[' +
            node.url +
            ']` instead of ' +
            '`(' +
            node.url +
            ')`, a reference?',
          node
        )
      }
    })
  }
)

export default remarkLintNoReferenceLikeUrl

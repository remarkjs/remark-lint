/**
 * remark-lint rule to warn when URLs are also defined identifiers.
 *
 * ## What is this?
 *
 * This package checks for likely broken URLs that should probably have been
 * references.
 *
 * ## When should I use this?
 *
 * You can use this package to check links.
 *
 * ## API
 *
 * ### `unified().use(remarkLintNoReferenceLikeUrl)`
 *
 * Warn when URLs are also defined identifiers.
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
 * While full URLs for definition identifiers are okay
 * (`[https://example.com]: https://example.com`),
 * and what looks like an identifier could be an actual URL (`[text](alpha)`),
 * the more common case is that,
 * assuming a definition `[alpha]: https://example.com`,
 * then a link `[text](alpha)` should instead have been `[text][alpha]`.
 *
 * [api-remark-lint-no-reference-like-url]: #unifieduseremarklintnoreferencelikeurl
 * [github-unified-transformer]: https://github.com/unifiedjs/unified#transformer
 *
 * @module no-reference-like-url
 * @author Titus Wormer
 * @copyright 2016 Titus Wormer
 * @license MIT
 * @example
 *   {"name": "ok.md"}
 *
 *   [Alpha](http://example.com).
 *
 *   [bravo]: https://example.com
 *
 * @example
 *   {"name": "not-ok.md", "label": "input"}
 *
 *   [Charlie](delta).
 *
 *   [delta]: https://example.com
 *
 * @example
 *   {"name": "not-ok.md", "label": "output"}
 *
 *   1:1-1:17: Did you mean to use `[delta]` instead of `(delta)`, a reference?
 */

/**
 * @typedef {import('mdast').Root} Root
 */

import {lintRule} from 'unified-lint-rule'
import {position} from 'unist-util-position'
import {visit} from 'unist-util-visit'

const remarkLintNoReferenceLikeUrl = lintRule(
  {
    origin: 'remark-lint:no-reference-like-url',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-no-reference-like-url#readme'
  },
  /**
   * @param {Root} tree
   *   Tree.
   * @returns {undefined}
   *   Nothing.
   */
  function (tree, file) {
    /** @type {Set<string>} */
    const identifiers = new Set()

    visit(tree, 'definition', function (node) {
      identifiers.add(node.identifier.toLowerCase())
    })

    visit(tree, function (node) {
      const place = position(node)

      if (
        place &&
        (node.type === 'image' || node.type === 'link') &&
        identifiers.has(node.url.toLowerCase())
      ) {
        file.message(
          'Did you mean to use `[' +
            node.url +
            ']` instead of ' +
            '`(' +
            node.url +
            ')`, a reference?',
          place
        )
      }
    })
  }
)

export default remarkLintNoReferenceLikeUrl

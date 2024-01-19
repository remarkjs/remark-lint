/**
 * remark-lint rule to warn when empty URLs are used.
 *
 * ## What is this?
 *
 * This package checks URLs of definitions, images, and links.
 *
 * ## When should I use this?
 *
 * You can use this package to check that URLs of definitions, images, and
 * links are not empty.
 *
 * ## API
 *
 * ### `unified().use(remarkLintNoEmptyUrl)`
 *
 * Warn when empty URLs are used.
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
 * While it is possible to omit URLs in links and images,
 * that typically indicates a “placeholder” or something that has to be filled
 * out later.
 * It’s recommended to fill them out.
 *
 * [api-remark-lint-no-empty-url]: #unifieduseremarklintnoemptyurl
 * [github-unified-transformer]: https://github.com/unifiedjs/unified#transformer
 *
 * @module no-empty-url
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 *
 * @example
 *   {"name": "ok.md"}
 *
 *   [Mercury](http://example.com/mercury/).
 *
 *   ![Venus](http://example.com/venus/ "Go to Venus").
 *
 *   [earth]: http://example.com/earth/
 *
 * @example
 *   {"label": "input", "name": "not-ok.md"}
 *
 *   [Mercury]().
 *
 *   ![Venus](#).
 *
 *   [earth]: <>
 *
 * @example
 *   {"label": "output", "name": "not-ok.md"}
 *
 *   1:1-1:12: Unexpected empty link URL referencing the current document, expected URL
 *   3:1-3:12: Unexpected empty image URL referencing the current document, expected URL
 *   5:1-5:12: Unexpected empty definition URL referencing the current document, expected URL
 */

/**
 * @typedef {import('mdast').Root} Root
 */

import {lintRule} from 'unified-lint-rule'
import {visitParents} from 'unist-util-visit-parents'

const remarkLintNoEmptyUrl = lintRule(
  {
    origin: 'remark-lint:no-empty-url',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-no-empty-url#readme'
  },
  /**
   * @param {Root} tree
   *   Tree.
   * @returns {undefined}
   *   Nothing.
   */
  function (tree, file) {
    visitParents(tree, function (node, parents) {
      if (
        (node.type === 'definition' ||
          node.type === 'image' ||
          node.type === 'link') &&
        node.position &&
        (!node.url || node.url === '#' || node.url === '?')
      ) {
        file.message(
          'Unexpected empty ' +
            node.type +
            ' URL referencing the current document, expected URL',
          {ancestors: [...parents, node], place: node.position}
        )
      }
    })
  }
)

export default remarkLintNoEmptyUrl

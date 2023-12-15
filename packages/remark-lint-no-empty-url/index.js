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
 * @example
 *   {"name": "ok.md"}
 *
 *   [alpha](http://bravo.com).
 *
 *   ![charlie](http://delta.com/echo.png "foxtrot").
 *
 *   [golf][hotel].
 *
 *   [india]: http://juliett.com
 *
 * @example
 *   {"name": "not-ok.md", "label": "input"}
 *
 *   [alpha]().
 *
 *   ![bravo](#).
 *
 *   [charlie]: <>
 *
 * @example
 *   {"name": "not-ok.md", "label": "output"}
 *
 *   1:1-1:10: Don’t use links without URL
 *   3:1-3:12: Don’t use images without URL
 *   5:1-5:14: Don’t use definitions without URL
 */

/**
 * @typedef {import('mdast').Root} Root
 */

import {lintRule} from 'unified-lint-rule'
import {position} from 'unist-util-position'
import {visit} from 'unist-util-visit'

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
    visit(tree, function (node) {
      const place = position(node)

      if (
        (node.type === 'definition' ||
          node.type === 'image' ||
          node.type === 'link') &&
        place &&
        (!node.url || node.url === '#' || node.url === '?')
      ) {
        file.message('Don’t use ' + node.type + 's without URL', place)
      }
    })
  }
)

export default remarkLintNoEmptyUrl

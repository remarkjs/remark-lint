/**
 * ## When should I use this?
 *
 * You can use this package to check that URLs are defined once.
 *
 * ## API
 *
 * There are no options.
 *
 * ## Recommendation
 *
 * It’s likely a mistake when the same URL is defined with different
 * identifiers.
 *
 * @module no-duplicate-defined-urls
 * @summary
 *   remark-lint rule to warn when URLs are defined multiple times.
 * @author Titus Wormer
 * @copyright 2020 Titus Wormer
 * @license MIT
 * @example
 *   {"name": "ok.md"}
 *
 *   [alpha]: alpha.com
 *   [bravo]: bravo.com
 *
 * @example
 *   {"name": "not-ok.md", "label": "input"}
 *
 *   [alpha]: alpha.com
 *   [bravo]: alpha.com
 *
 * @example
 *   {"name": "not-ok.md", "label": "output"}
 *
 *   2:1-2:19: Do not use different definitions with the same URL (1:1)
 */

/**
 * @typedef {import('mdast').Root} Root
 */

import {lintRule} from 'unified-lint-rule'
import {pointStart, position} from 'unist-util-position'
import {stringifyPosition} from 'unist-util-stringify-position'
import {visit} from 'unist-util-visit'

const remarkLintNoDuplicateDefinedUrls = lintRule(
  {
    origin: 'remark-lint:no-duplicate-defined-urls',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-no-duplicate-defined-urls#readme'
  },
  /**
   * @param {Root} tree
   *   Tree.
   * @returns {undefined}
   *   Nothing.
   */
  function (tree, file) {
    /** @type {Map<string, string>} */
    const map = new Map()

    visit(tree, 'definition', function (node) {
      const place = position(node)
      const start = pointStart(node)

      if (place && start && node.url) {
        const url = String(node.url).toUpperCase()
        const duplicate = map.get(url)

        if (duplicate) {
          file.message(
            'Do not use different definitions with the same URL (' +
              duplicate +
              ')',
            place
          )
        }

        map.set(url, stringifyPosition(start))
      }
    })
  }
)

export default remarkLintNoDuplicateDefinedUrls

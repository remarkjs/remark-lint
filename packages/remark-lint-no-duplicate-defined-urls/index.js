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
import {pointStart} from 'unist-util-position'
import {generated} from 'unist-util-generated'
import {stringifyPosition} from 'unist-util-stringify-position'
import {visit} from 'unist-util-visit'

const remarkLintNoDuplicateDefinedUrls = lintRule(
  {
    origin: 'remark-lint:no-duplicate-defined-urls',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-no-duplicate-defined-urls#readme'
  },
  /** @type {import('unified-lint-rule').Rule<Root, void>} */
  (tree, file) => {
    /** @type {Record<string, string>} */
    const map = Object.create(null)

    visit(tree, 'definition', (node) => {
      if (!generated(node) && node.url) {
        const url = String(node.url).toUpperCase()
        const duplicate = map[url]

        if (duplicate) {
          file.message(
            'Do not use different definitions with the same URL (' +
              duplicate +
              ')',
            node
          )
        }

        map[url] = stringifyPosition(pointStart(node))
      }
    })
  }
)

export default remarkLintNoDuplicateDefinedUrls

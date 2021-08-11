/**
 * @author Titus Wormer
 * @copyright 2020 Titus Wormer
 * @license MIT
 * @module no-duplicate-defined-urls
 * @fileoverview
 *   Warn when definitions define the same URL.
 *
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

import {lintRule} from 'unified-lint-rule'
import {pointStart} from 'unist-util-position'
import {generated} from 'unist-util-generated'
import {stringifyPosition} from 'unist-util-stringify-position'
import {visit} from 'unist-util-visit'

const remarkLintNoDuplicateDefinedUrls = lintRule(
  'remark-lint:no-duplicate-defined-urls',
  (tree, file) => {
    const map = Object.create(null)

    visit(tree, 'definition', (node) => {
      if (!generated(node) && node.url) {
        const url = String(node.url).toUpperCase()
        const duplicate = map[url]

        if (duplicate) {
          file.message(
            'Do not use different definitions with the same URL (' +
              stringifyPosition(pointStart(duplicate)) +
              ')',
            node
          )
        }

        map[url] = node
      }
    })
  }
)

export default remarkLintNoDuplicateDefinedUrls

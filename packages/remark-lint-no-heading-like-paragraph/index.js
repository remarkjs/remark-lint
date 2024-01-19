/**
 * remark-lint rule to warn when “headings” have too many hashes.
 *
 * ## What is this?
 *
 * This package checks for broken headings.
 *
 * ## When should I use this?
 *
 * You can use this rule to check markdown code style.
 *
 * ## API
 *
 * ### `unified().use(remarkLintNoHeadingLikeParagraph)`
 *
 * Warn when “headings” have too many hashes.
 *
 * ###### Parameters
 *
 * There are no options.
 *
 * ###### Returns
 *
 * Transform ([`Transformer` from `unified`][github-unified-transformer]).
 *
 * [api-remark-lint-no-heading-like-paragraph]: #unifieduseremarklintnoheadinglikeparagraph
 * [github-unified-transformer]: https://github.com/unifiedjs/unified#transformer
 *
 * @module no-heading-like-paragraph
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 *
 * @example
 *   {"name": "ok.md"}
 *
 *   ###### Venus
 *
 *   Mercury.
 *
 * @example
 *   {"label": "input", "name": "not-ok.md"}
 *
 *   ####### Venus
 *
 *   Mercury.
 *
 *   ######## Earth
 *
 *   Mars.
 * @example
 *   {"label": "output", "name": "not-ok.md"}
 *
 *   1:8: Unexpected `7` hashes starting paragraph looking like a heading, expected up to `6` hashes, remove `1` hash
 *   5:9: Unexpected `8` hashes starting paragraph looking like a heading, expected up to `6` hashes, remove `2` hashes
 */

/**
 * @typedef {import('mdast').Root} Root
 */

import pluralize from 'pluralize'
import {lintRule} from 'unified-lint-rule'
import {pointStart} from 'unist-util-position'
import {visitParents} from 'unist-util-visit-parents'

const max = 6

const remarkLintNoHeadingLikeParagraph = lintRule(
  {
    origin: 'remark-lint:no-heading-like-paragraph',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-no-heading-like-paragraph#readme'
  },
  /**
   * @param {Root} tree
   *   Tree.
   * @returns {undefined}
   *   Nothing.
   */
  function (tree, file) {
    visitParents(tree, 'paragraph', function (node, parents) {
      const head = node.children[0]

      if (head && head.type === 'text') {
        const start = pointStart(node)
        let size = 0

        while (head.value.charCodeAt(size) === 35 /* `#` */) {
          size++
        }

        if (start && typeof start.offset === 'number' && size > max) {
          const extra = size - max

          file.message(
            'Unexpected `' +
              size +
              '` hashes starting paragraph looking like a heading, expected up to `' +
              max +
              '` hashes, remove `' +
              extra +
              '` ' +
              pluralize('hash', extra),
            {
              ancestors: [...parents, node, head],
              place: {
                line: start.line,
                column: start.column + size,
                offset: start.offset + size
              }
            }
          )
        }
      }
    })
  }
)

export default remarkLintNoHeadingLikeParagraph

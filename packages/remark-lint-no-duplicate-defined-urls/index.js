/**
 * remark-lint rule to warn when URLs are defined multiple times.
 *
 * ## What is this?
 *
 * This package checks that defined URLs are unique.
 *
 * ## When should I use this?
 *
 * You can use this package to check that definitions are useful.
 *
 * ## API
 *
 * ### `unified().use(remarkLintNoDuplicateDefinedUrls)`
 *
 * Warn when URLs are defined multiple times.
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
 * It’s likely a mistake when the same URL is defined with different
 * identifiers.
 *
 * [api-remark-lint-no-duplicate-defined-urls]: #unifieduseremarklintnoduplicatedefinedurls
 * [github-unified-transformer]: https://github.com/unifiedjs/unified#transformer
 *
 * @module no-duplicate-defined-urls
 * @author Titus Wormer
 * @copyright 2020 Titus Wormer
 * @license MIT
 *
 * @example
 *   {"name": "ok.md"}
 *
 *   The first planet is [mercury][].
 *
 *   [mercury]: https://example.com/mercury/
 *   [venus]: https://example.com/venus/
 *
 * @example
 *   {"label": "input", "name": "not-ok.md"}
 *
 *   [mercury]: https://example.com/mercury/
 *   [venus]: https://example.com/mercury/
 * @example
 *   {"label": "output", "name": "not-ok.md"}
 *
 *   2:1-2:38: Unexpected definition with an already defined URL (as `mercury`), expected unique URLs
 */

/**
 * @typedef {import('mdast').Nodes} Nodes
 * @typedef {import('mdast').Root} Root
 */

import {ok as assert} from 'devlop'
import {phrasing} from 'mdast-util-phrasing'
import {lintRule} from 'unified-lint-rule'
import {SKIP, visitParents} from 'unist-util-visit-parents'
import {VFileMessage} from 'vfile-message'

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
    /** @type {Map<string, Array<Nodes>>} */
    const map = new Map()

    visitParents(tree, function (node, parents) {
      // Do not walk into phrasing.
      if (phrasing(node)) {
        return SKIP
      }

      if (node.type !== 'definition') return
      const ancestors = [...parents, node]

      if (node.position && node.url) {
        const urlNormal = String(node.url).toUpperCase()
        const duplicateAncestors = map.get(urlNormal)

        if (duplicateAncestors) {
          const duplicate = duplicateAncestors.at(-1)
          assert(duplicate) // Always defined.
          assert(duplicate.type === 'definition') // Always tail.

          file.message(
            'Unexpected definition with an already defined URL (as `' +
              duplicate.identifier +
              '`), expected unique URLs',
            {
              ancestors,
              cause: new VFileMessage('URL already defined here', {
                ancestors: duplicateAncestors,
                place: duplicate.position,
                source: 'remark-lint',
                ruleId: 'no-duplicate-defined-urls'
              }),
              place: node.position
            }
          )
        }

        map.set(urlNormal, ancestors)
      }
    })
  }
)

export default remarkLintNoDuplicateDefinedUrls

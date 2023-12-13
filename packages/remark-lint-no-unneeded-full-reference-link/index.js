/**
 * remark-lint rule to warn when unneeded full reference links are used.
 *
 * ## What is this?
 *
 * This package checks for unneeded full reference links.
 *
 * ## When should I use this?
 *
 * You can use this package to check that reference links are consistent.
 *
 * ## API
 *
 * ### `unified().use(remarkLintNoUnneededFullReferenceLink)`
 *
 * Warn when unneeded full reference links are used.
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
 * Full reference syntax (`[Text][text]`) is quite verbose compared to
 * the concise collapsed reference syntax (`[Text][]`).
 *
 * [api-remark-lint-no-unneeded-full-reference-link]: #unifieduseremarklintnounneededfullreferencelink
 * [github-unified-transformer]: https://github.com/unifiedjs/unified#transformer
 *
 * @module no-unneeded-full-reference-link
 * @author Titus Wormer
 * @copyright 2019 Titus Wormer
 * @license MIT
 * @example
 *   {"name": "ok.md"}
 *
 *   [alpha][]
 *   [Bravo][]
 *   [Charlie][delta]
 *
 *   This only works if the link text is a `text` node:
 *   [`echo`][]
 *   [*foxtrot*][]
 *
 *   [alpha]: a
 *   [bravo]: b
 *   [delta]: d
 *   [`echo`]: e
 *   [*foxtrot*]: f
 *
 * @example
 *   {"name": "not-ok.md", "label": "input"}
 *
 *   [alpha][alpha]
 *   [Bravo][bravo]
 *   [charlie][Charlie]
 *
 *   [alpha]: a
 *   [bravo]: b
 *   [charlie]: c
 *
 * @example
 *   {"name": "not-ok.md", "label": "output"}
 *
 *   1:1-1:15: Remove the link label as it matches the reference text
 *   2:1-2:15: Remove the link label as it matches the reference text
 *   3:1-3:19: Remove the link label as it matches the reference text
 */

/**
 * @typedef {import('mdast').Root} Root
 */

import {normalizeIdentifier} from 'micromark-util-normalize-identifier'
import {lintRule} from 'unified-lint-rule'
import {position} from 'unist-util-position'
import {visit} from 'unist-util-visit'

const remarkLintNoUnneededFullReferenceLink = lintRule(
  {
    origin: 'remark-lint:no-unneeded-full-reference-link',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-no-unneeded-full-reference-link#readme'
  },
  /**
   * @param {Root} tree
   *   Tree.
   * @returns {undefined}
   *   Nothing.
   */
  function (tree, file) {
    visit(tree, 'linkReference', function (node) {
      const place = position(node)
      if (
        !place ||
        node.referenceType !== 'full' ||
        node.children.length !== 1 ||
        node.children[0].type !== 'text' ||
        normalizeIdentifier(node.children[0].value) !==
          node.identifier.toUpperCase()
      ) {
        return
      }

      file.message(
        'Remove the link label as it matches the reference text',
        place
      )
    })
  }
)

export default remarkLintNoUnneededFullReferenceLink

/**
 * ## When should I use this?
 *
 * You can use this package to check that collapsed reference links are
 * used instead of full references where possible.
 *
 * ## API
 *
 * There are no options.
 *
 * ## Recommendation
 *
 * Full reference syntax (`![Alt][alt]`) is quite verbose compared to
 * the concise collapsed reference syntax (`![Alt][]`).
 *
 * @module no-unneeded-full-reference-link
 * @summary
 *   remark-lint rule to warn when full reference links are used that
 *   could be collapsed.
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

import {lintRule} from 'unified-lint-rule'
import {visit} from 'unist-util-visit'
import {generated} from 'unist-util-generated'
import {normalizeIdentifier} from 'micromark-util-normalize-identifier'

const remarkLintNoUnneededFullReferenceLink = lintRule(
  {
    origin: 'remark-lint:no-unneeded-full-reference-link',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-no-unneeded-full-reference-link#readme'
  },
  /** @type {import('unified-lint-rule').Rule<Root, void>} */
  (tree, file) => {
    visit(tree, 'linkReference', (node) => {
      if (
        generated(node) ||
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
        node
      )
    })
  }
)

export default remarkLintNoUnneededFullReferenceLink

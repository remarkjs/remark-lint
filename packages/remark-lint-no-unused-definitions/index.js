/**
 * ## When should I use this?
 *
 * You can use this package to check definitions are referenced.
 *
 * ## API
 *
 * There are no options.
 *
 * ## Recommendation
 *
 * Unused definitions do not contribute anything, so they can be removed.
 *
 * @module no-unused-definitions
 * @summary
 *   remark-lint rule to warn when unreferenced definitions are used.
 * @author Titus Wormer
 * @copyright 2016 Titus Wormer
 * @license MIT
 * @example
 *   {"name": "ok.md"}
 *
 *   [foo][]
 *
 *   [foo]: https://example.com
 *
 * @example
 *   {"name": "not-ok.md", "label": "input"}
 *
 *   [bar]: https://example.com
 *
 * @example
 *   {"name": "not-ok.md", "label": "output"}
 *
 *   1:1-1:27: Found unused definition
 */

/**
 * @typedef {import('mdast').Root} Root
 * @typedef {import('mdast').DefinitionContent} DefinitionContent
 */

import {lintRule} from 'unified-lint-rule'
import {generated} from 'unist-util-generated'
import {visit} from 'unist-util-visit'

const own = {}.hasOwnProperty

const remarkLintNoUnusedDefinitions = lintRule(
  {
    origin: 'remark-lint:no-unused-definitions',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-no-unused-definitions#readme'
  },
  /** @type {import('unified-lint-rule').Rule<Root, void>} */
  (tree, file) => {
    /** @type {Record<string, {node: DefinitionContent, used: boolean}>} */
    const map = Object.create(null)

    visit(tree, (node) => {
      if (
        (node.type === 'definition' || node.type === 'footnoteDefinition') &&
        !generated(node)
      ) {
        map[node.identifier.toUpperCase()] = {node, used: false}
      }
    })

    visit(tree, (node) => {
      if (
        node.type === 'imageReference' ||
        node.type === 'linkReference' ||
        node.type === 'footnoteReference'
      ) {
        const info = map[node.identifier.toUpperCase()]

        if (!generated(node) && info) {
          info.used = true
        }
      }
    })

    /** @type {string} */
    let identifier

    for (identifier in map) {
      if (own.call(map, identifier)) {
        const entry = map[identifier]

        if (!entry.used) {
          file.message('Found unused definition', entry.node)
        }
      }
    }
  }
)

export default remarkLintNoUnusedDefinitions

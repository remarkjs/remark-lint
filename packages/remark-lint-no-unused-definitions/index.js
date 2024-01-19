/**
 * remark-lint rule to warn when unreferenced definitions are used.
 *
 * ## What is this?
 *
 * This package checks that definitions are referenced.
 *
 * ## When should I use this?
 *
 * You can use this package to check definitions.
 *
 * ## API
 *
 * ### `unified().use(remarkLintNoUnusedDefinitions)`
 *
 * Warn when unreferenced definitions are used.
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
 * Unused definitions do not contribute anything, so they can be removed.
 *
 * [api-remark-lint-no-unused-definitions]: #unifieduseremarklintnounuseddefinitions
 * [github-unified-transformer]: https://github.com/unifiedjs/unified#transformer
 *
 * @module no-unused-definitions
 * @author Titus Wormer
 * @copyright 2016 Titus Wormer
 * @license MIT
 * @example
 *   {"name": "ok.md"}
 *
 *   [Mercury][]
 *
 *   [mercury]: https://example.com/mercury/
 *
 * @example
 *   {"label": "input", "name": "not-ok.md"}
 *
 *   [mercury]: https://example.com/mercury/
 *
 * @example
 *   {"label": "output", "name": "not-ok.md"}
 *
 *   1:1-1:40: Unexpected unused definition, expected no definition or one or more references to `mercury`
 *
 * @example
 *   {"gfm": true, "label": "input", "name": "gfm.md"}
 *
 *   Mercury[^mercury] is a planet.
 *
 *   [^Mercury]:
 *       **Mercury** is the first planet from the Sun and the smallest
 *       in the Solar System.
 *   [^Venus]:
 *       **Venus** is the second planet from
 *       the Sun.
 * @example
 *   {"gfm": true, "label": "output", "name": "gfm.md"}
 *
 *   6:1-8:13: Unexpected unused footnote definition, expected no definition or one or more footnote references to `venus`
 */

/**
 * @typedef {import('mdast').Nodes} Nodes
 * @typedef {import('mdast').Root} Root
 */

import {ok as assert} from 'devlop'
import {lintRule} from 'unified-lint-rule'
import {visitParents} from 'unist-util-visit-parents'

const remarkLintNoUnusedDefinitions = lintRule(
  {
    origin: 'remark-lint:no-unused-definitions',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-no-unused-definitions#readme'
  },
  /**
   * @param {Root} tree
   *   Tree.
   * @returns {undefined}
   *   Nothing.
   */
  function (tree, file) {
    /** @type {Map<string, {ancestors: Array<Nodes> | undefined, used: boolean}>} */
    const footnoteDefinitions = new Map()
    /** @type {Map<string, {ancestors: Array<Nodes> | undefined, used: boolean}>} */
    const definitions = new Map()

    visitParents(tree, function (node, parents) {
      if ('identifier' in node) {
        const map =
          node.type === 'footnoteDefinition' ||
          node.type === 'footnoteReference'
            ? footnoteDefinitions
            : definitions
        let entry = map.get(node.identifier)

        if (!entry) {
          entry = {ancestors: undefined, used: false}
          map.set(node.identifier, entry)
        }

        if (node.type === 'definition' || node.type === 'footnoteDefinition') {
          entry.ancestors = [...parents, node]
        } else if (
          node.type === 'imageReference' ||
          node.type === 'linkReference' ||
          node.type === 'footnoteReference'
        ) {
          entry.used = true
        }
      }
    })

    const entries = [...footnoteDefinitions.values(), ...definitions.values()]

    for (const entry of entries) {
      if (!entry.used) {
        assert(entry.ancestors) // Always defined if `used`.
        const node = entry.ancestors.at(-1)
        assert(node) // Always defined.
        assert(node.type === 'footnoteDefinition' || node.type === 'definition') // Always definition.

        if (node.position) {
          const prefix = node.type === 'footnoteDefinition' ? 'footnote ' : ''

          file.message(
            'Unexpected unused ' +
              prefix +
              'definition, expected no definition or one or more ' +
              prefix +
              'references to `' +
              node.identifier +
              '`',
            {ancestors: entry.ancestors, place: node.position}
          )
        }
      }
    }
  }
)

export default remarkLintNoUnusedDefinitions

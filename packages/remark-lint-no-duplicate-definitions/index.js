/**
 * remark-lint rule to warn when identifiers are defined multiple times.
 *
 * ## What is this?
 *
 * This package checks that defined identifiers are unique.
 *
 * ## When should I use this?
 *
 * You can use this package to check that definitions are useful.
 *
 * ## API
 *
 * ### `unified().use(remarkLintNoDuplicateDefinitions)`
 *
 * Warn when identifiers are defined multiple times.
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
 * It’s a mistake when the same identifier is defined multiple times.
 *
 * [api-remark-lint-no-duplicate-definitions]: #unifieduseremarklintnoduplicatedefinitions
 * [github-unified-transformer]: https://github.com/unifiedjs/unified#transformer
 *
 * @module no-duplicate-definitions
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @example
 *   {"name": "ok.md"}
 *
 *   [foo]: bar
 *   [baz]: qux
 *
 * @example
 *   {"name": "not-ok.md", "label": "input"}
 *
 *   [foo]: bar
 *   [foo]: qux
 *
 * @example
 *   {"name": "not-ok.md", "label": "output"}
 *
 *   2:1-2:11: Do not use definitions with the same identifier (1:1)
 *
 * @example
 *   {"gfm": true, "label": "input", "name": "gfm.md"}
 *
 *   GFM footnote definitions are checked too[^a].
 *
 *   [^a]: alpha
 *   [^a]: bravo
 *
 * @example
 *   {"gfm": true, "label": "output", "name": "gfm.md"}
 *
 *   4:1-4:12: Do not use footnote definitions with the same identifier (3:1)
 */

/**
 * @typedef {import('mdast').Root} Root
 */

import {lintRule} from 'unified-lint-rule'
import {pointStart, position} from 'unist-util-position'
import {stringifyPosition} from 'unist-util-stringify-position'
import {visit} from 'unist-util-visit'

/** @type {ReadonlyArray<never>} */
const empty = []

const remarkLintNoDuplicateDefinitions = lintRule(
  {
    origin: 'remark-lint:no-duplicate-definitions',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-no-duplicate-definitions#readme'
  },
  /**
   * @param {Root} tree
   *   Tree.
   * @returns {undefined}
   *   Nothing.
   */
  function (tree, file) {
    /** @type {Map<string, string>} */
    const definitions = new Map()
    /** @type {Map<string, string>} */
    const footnoteDefinitions = new Map()

    visit(tree, function (node) {
      const place = position(node)
      const start = pointStart(node)
      const [map, identifier] =
        node.type === 'definition'
          ? [definitions, node.identifier]
          : node.type === 'footnoteDefinition'
            ? [footnoteDefinitions, node.identifier]
            : empty

      if (map && identifier && place && start) {
        const duplicate = map.get(identifier)

        if (duplicate) {
          file.message(
            'Do not use' +
              (node.type === 'footnoteDefinition' ? ' footnote' : '') +
              ' definitions with the same identifier (' +
              duplicate +
              ')',
            place
          )
        }

        map.set(identifier, stringifyPosition(start))
      }
    })
  }
)

export default remarkLintNoDuplicateDefinitions

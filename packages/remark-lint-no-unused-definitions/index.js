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
 *
 * @example
 *   {"name": "footnote.md", "gfm": true, "label": "input"}
 *
 *   a[^x].
 *
 *   [^x]: ok
 *   [^y]: not ok
 *
 * @example
 *   {"name": "footnote.md", "gfm": true, "label": "output"}
 *
 *   4:1-4:13: Found unused definition
 */

/**
 * @typedef {import('mdast').DefinitionContent} DefinitionContent
 * @typedef {import('mdast').Root} Root
 */

/**
 * @typedef Info
 *   Info.
 * @property {DefinitionContent | undefined} node
 *   Definition.
 * @property {boolean} used
 *   Whether the definition is used.
 */

import {lintRule} from 'unified-lint-rule'
import {position} from 'unist-util-position'
import {visit} from 'unist-util-visit'

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
    /** @type {Map<string, Info>} */
    const map = new Map()

    // To do: separate maps for footnotes/definitions.
    visit(tree, function (node) {
      if ('identifier' in node) {
        const id = node.identifier.toLowerCase()
        let entry = map.get(id)

        if (!entry) {
          entry = {node: undefined, used: false}
          map.set(id, entry)
        }

        if (node.type === 'definition' || node.type === 'footnoteDefinition') {
          entry.node = node
        } else if (
          node.type === 'imageReference' ||
          node.type === 'linkReference' ||
          node.type === 'footnoteReference'
        ) {
          entry.used = true
        }
      }
    })

    for (const entry of map.values()) {
      const place = position(entry.node)

      if (place && !entry.used) {
        file.message('Found unused definition', place)
      }
    }
  }
)

export default remarkLintNoUnusedDefinitions

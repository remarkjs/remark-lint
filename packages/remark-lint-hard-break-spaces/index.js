/**
 * remark-lint rule to warn when more spaces are used than needed
 * for hard breaks.
 *
 * ## What is this?
 *
 * This package checks the whitespace of hard breaks.
 *
 * ## When should I use this?
 *
 * You can use this package to check that the number of spaces in hard breaks
 * are consistent.
 *
 * ## API
 *
 * ### `unified().use(remarkLintHardBreakSpaces)`
 *
 * Warn when more spaces are used than needed for hard breaks.
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
 * Less than two spaces do not create a hard breaks and more than two spaces
 * have no effect.
 * Due to this, it’s recommended to turn this rule on.
 *
 * [api-remark-lint-hard-break-spaces]: #unifieduseremarklinthardbreakspaces
 * [github-unified-transformer]: https://github.com/unifiedjs/unified#transformer
 *
 * @module hard-break-spaces
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @example
 *   {"name": "ok.md"}
 *
 *   **Mercury** is the first planet from the Sun␠␠
 *   and the smallest in the Solar System.
 *
 * @example
 *   {"label": "input", "name": "not-ok.md"}
 *
 *   **Mercury** is the first planet from the Sun␠␠␠
 *   and the smallest in the Solar System.
 * @example
 *   {"label": "output", "name": "not-ok.md"}
 *
 *   1:45-2:1: Unexpected `3` spaces for hard break, expected `2` spaces
 *
 * @example
 *   {"gfm": true, "label": "input", "name": "containers.md"}
 *
 *   [^mercury]:
 *       > * > * **Mercury** is the first planet from the Sun␠␠␠
 *       >   >   and the smallest in the Solar System.
 * @example
 *   {"gfm": true, "label": "output", "name": "containers.md"}
 *
 *   2:57-3:1: Unexpected `3` spaces for hard break, expected `2` spaces
 */

/**
 * @typedef {import('mdast').Root} Root
 */

import {lintRule} from 'unified-lint-rule'
import {pointEnd, pointStart} from 'unist-util-position'
import {visit} from 'unist-util-visit'

const remarkLintHardBreakSpaces = lintRule(
  {
    origin: 'remark-lint:hard-break-spaces',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-hard-break-spaces#readme'
  },
  /**
   * @param {Root} tree
   *   Tree.
   * @returns {undefined}
   *   Nothing.
   */
  function (tree, file) {
    const value = String(file)

    visit(tree, 'break', function (node) {
      const end = pointEnd(node)
      const start = pointStart(node)

      if (
        end &&
        start &&
        typeof end.offset === 'number' &&
        typeof start.offset === 'number'
      ) {
        const slice = value.slice(start.offset, end.offset)

        let actual = 0
        while (slice.charCodeAt(actual) === 32) actual++

        if (actual > 2) {
          file.message(
            'Unexpected `' +
              actual +
              '` spaces for hard break, expected `2` spaces',
            node
          )
        }
      }
    })
  }
)

export default remarkLintHardBreakSpaces

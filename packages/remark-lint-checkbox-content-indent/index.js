/**
 * remark-lint rule to warn when GFM tasklist checkboxes are followed by
 * more than one space.
 *
 * ## What is this?
 *
 * This package checks the space after checkboxes.
 *
 * ## When should I use this?
 *
 * You can use this package to check that the style of GFM tasklists is
 * a single space.
 *
 * ## API
 *
 * ### `unified().use(remarkLintCheckboxContentIndent)`
 *
 * Warn when GFM tasklist checkboxes are followed by more than one space.
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
 * GFM allows zero or more spaces and tabs after checkboxes.
 * No space at all arguably looks rather ugly:
 *
 * ```markdown
 * * [x]Pluto
 * ```
 *
 * More that one space is superfluous:
 *
 * ```markdown
 * * [x]   Jupiter
 * ```
 *
 * Due to this, it’s recommended to turn this rule on.
 *
 * ## Fix
 *
 * [`remark-stringify`][github-remark-stringify] formats checkboxes and the
 * content after them with a single space between.
 *
 * [api-remark-lint-checkbox-content-indent]: #unifieduseremarklintcheckboxcontentindent
 * [github-remark-stringify]: https://github.com/remarkjs/remark/tree/main/packages/remark-stringify
 * [github-unified-transformer]: https://github.com/unifiedjs/unified#transformer
 *
 * @module checkbox-content-indent
 * @author Titus Wormer
 * @copyright Titus Wormer
 * @license MIT
 *
 * @example
 *   {"gfm": true, "name": "ok.md"}
 *
 *   - [ ] Mercury.
 *   +  [x] Venus.
 *   *   [X] Earth.
 *   -    [ ] Mars.
 *
 * @example
 *   {"gfm": true, "label": "input", "name": "not-ok.md"}
 *
 *   - [ ] Mercury.
 *   + [x]  Venus.
 *   * [X]   Earth.
 *   - [ ]    Mars.
 * @example
 *   {"gfm": true, "label": "output", "name": "not-ok.md"}
 *
 *   2:8: Unexpected `2` spaces between checkbox and content, expected `1` space, remove `1` space
 *   3:9: Unexpected `3` spaces between checkbox and content, expected `1` space, remove `2` spaces
 *   4:10: Unexpected `4` spaces between checkbox and content, expected `1` space, remove `3` spaces
 *
 * @example
 *   {"gfm": true, "label": "input", "name": "tab.md"}
 *
 *   - [ ]␉Mercury.
 *   + [x]␉␉Venus.
 * @example
 *   {"gfm": true, "label": "output", "name": "tab.md"}
 *
 *   2:8: Unexpected `2` spaces between checkbox and content, expected `1` space, remove `1` space
 */

/**
 * @import {Root} from 'mdast'
 */

import {phrasing} from 'mdast-util-phrasing'
import pluralize from 'pluralize'
import {lintRule} from 'unified-lint-rule'
import {pointStart} from 'unist-util-position'
import {SKIP, visitParents} from 'unist-util-visit-parents'

const remarkLintCheckboxContentIndent = lintRule(
  {
    origin: 'remark-lint:checkbox-content-indent',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-checkbox-content-indent#readme'
  },
  /**
   * @param {Root} tree
   *   Tree.
   * @returns {undefined}
   *   Nothing.
   */
  function (tree, file) {
    const value = String(file)

    visitParents(tree, function (node, parents) {
      // Do not walk into phrasing.
      if (phrasing(node)) {
        return SKIP
      }

      if (node.type !== 'listItem') return

      const head = node.children[0]
      const headStart = pointStart(head)

      // Exit early for items without checkbox.
      // A list item cannot be checked and empty according to GFM.
      if (
        !head ||
        !headStart ||
        typeof node.checked !== 'boolean' ||
        typeof headStart.offset !== 'number'
      ) {
        return
      }

      // Assume we start with a checkbox as `checked` is set.
      const match = /\[([\t xX])]/.exec(
        value.slice(headStart.offset - 4, headStart.offset + 1)
      )

      /* c8 ignore next -- make sure we don’t crash if there actually isn’t a checkbox. */
      if (!match) return

      // Move past checkbox.
      let final = headStart.offset
      let code = value.charCodeAt(final)

      while (code === 9 || code === 32) {
        final++
        code = value.charCodeAt(final)
      }

      const size = final - headStart.offset

      if (size) {
        file.message(
          'Unexpected `' +
            (size + 1) +
            '` ' +
            pluralize('space', size + 1) +
            ' between checkbox and content, expected `1` space, remove `' +
            size +
            '` ' +
            pluralize('space', size),
          {
            ancestors: [...parents, node],
            place: {
              line: headStart.line,
              column: headStart.column + size,
              offset: headStart.offset + size
            }
          }
        )
      }
    })
  }
)

export default remarkLintCheckboxContentIndent

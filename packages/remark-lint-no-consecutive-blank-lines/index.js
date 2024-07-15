/**
 * remark-lint rule to warn when multiple blank lines are used.
 *
 * ## What is this?
 *
 * This package checks the number of blank lines.
 *
 * ## When should I use this?
 *
 * You can use this package to check that there are no unneeded blank lines.
 *
 * ## API
 *
 * ### `unified().use(remarkLintNoConsecutiveBlankLines)`
 *
 * Warn when multiple blank lines are used.
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
 * More than one blank line has no effect between blocks.
 *
 * ## Fix
 *
 * [`remark-stringify`][github-remark-stringify] adds exactly one blank line
 * between any block.
 * It has a `join` option to configure more complex cases.
 *
 * [api-remark-lint-no-consecutive-blank-lines]: #unifieduseremarklintnoconsecutiveblanklines
 * [github-remark-stringify]: https://github.com/remarkjs/remark/tree/main/packages/remark-stringify
 * [github-unified-transformer]: https://github.com/unifiedjs/unified#transformer
 *
 * @module no-consecutive-blank-lines
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 *
 * @example
 *   {"name": "ok.md"}
 *
 *   # Planets
 *
 *   Mercury.
 *
 *   Venus.
 *
 * @example
 *   {"label": "input", "name": "not-ok.md"}
 *
 *   # Planets
 *
 *
 *   Mercury.
 *
 *
 *
 *   Venus.
 * @example
 *   {"label": "output", "name": "not-ok.md"}
 *
 *   4:1: Unexpected `2` blank lines before node, expected up to `1` blank line, remove `1` blank line
 *   8:1: Unexpected `3` blank lines before node, expected up to `1` blank line, remove `2` blank lines
 *
 * @example
 *   {"label": "input", "name": "initial.md"}
 *
 *   ␊Mercury.
 * @example
 *   {"label": "output", "name": "initial.md"}
 *
 *   2:1: Unexpected `1` blank line before node, expected `0` blank lines, remove `1` blank line
 *
 * @example
 *   {"name": "final-one.md"}
 *
 *   Mercury.␊
 *
 * @example
 *   {"label": "input", "name": "final-more.md"}
 *
 *   Mercury.␊␊
 * @example
 *   {"label": "output", "name": "final-more.md"}
 *
 *   1:9: Unexpected `1` blank line after node, expected `0` blank lines, remove `1` blank line
 *
 * @example
 *   {"name": "empty-document.md"}
 *
 * @example
 *   {"label": "input", "name": "block-quote.md"}
 *
 *   > Mercury.
 *
 *   Venus.
 *
 *   >
 *   > Earth.
 *   >
 * @example
 *   {"label": "output", "name": "block-quote.md"}
 *
 *   6:3: Unexpected `1` blank line before node, expected `0` blank lines, remove `1` blank line
 *   6:9: Unexpected `1` blank line after node, expected `0` blank lines, remove `1` blank line
 *
 * @example
 *   {"directive": true, "label": "input", "name": "directive.md"}
 *
 *   :::mercury
 *   Venus.
 *
 *
 *   Earth.
 *   :::
 * @example
 *   {"directive": true, "label": "output", "name": "directive.md"}
 *
 *   5:1: Unexpected `2` blank lines before node, expected up to `1` blank line, remove `1` blank line
 *
 * @example
 *   {"gfm": true, "label": "input", "name": "footnote.md"}
 *
 *   [^x]:
 *       Mercury.
 *
 *   Venus.
 *
 *   [^y]:
 *
 *       Earth.
 *
 *
 *       Mars.
 * @example
 *   {"gfm": true, "label": "output", "name": "footnote.md"}
 *
 *   8:5: Unexpected `1` blank line before node, expected `0` blank lines, remove `1` blank line
 *   11:5: Unexpected `2` blank lines before node, expected up to `1` blank line, remove `1` blank line
 *
 * @example
 *   {"label": "input", "mdx": true, "name": "jsx.md"}
 *
 *   <Mercury>
 *     Venus.
 *
 *
 *     Earth.
 *   </Mercury>
 * @example
 *   {"label": "output", "mdx": true, "name": "jsx.md"}
 *
 *   5:3: Unexpected `2` blank lines before node, expected up to `1` blank line, remove `1` blank line
 *
 * @example
 *   {"label": "input", "name": "list.md"}
 *
 *   * Mercury.
 *   * Venus.
 *
 *   ***
 *
 *   * Mercury.
 *
 *   * Venus.
 *
 *   ***
 *
 *   * Mercury.
 *
 *
 *   * Venus.
 * @example
 *   {"label": "output", "name": "list.md"}
 *
 *   15:1: Unexpected `2` blank lines before node, expected up to `1` blank line, remove `1` blank line
 *
 * @example
 *   {"label": "input", "name": "list-item.md"}
 *
 *   * Mercury.
 *     Venus.
 *
 *   ***
 *
 *   * Mercury.
 *
 *     Venus.
 *
 *   ***
 *
 *   * Mercury.
 *
 *
 *     Venus.
 *
 *   ***
 *
 *   *
 *     Mercury.
 * @example
 *   {"label": "output", "name": "list-item.md"}
 *
 *   15:3: Unexpected `2` blank lines before node, expected up to `1` blank line, remove `1` blank line
 *   20:3: Unexpected `1` blank line before node, expected `0` blank lines, remove `1` blank line
 *
 * @example
 *   {"label": "input", "name": "deep-block-quote.md"}
 *
 *   * > * > # Venus␊␊
 * @example
 *   {"label": "output", "name": "deep-block-quote.md"}
 *
 *   1:16: Unexpected `1` blank line after node, expected `0` blank lines, remove `1` blank line
 *
 * @example
 *   {"label": "input", "name": "deep-list-item.md"}
 *
 *   > * > * # Venus␊␊
 * @example
 *   {"label": "output", "name": "deep-list-item.md"}
 *
 *   1:16: Unexpected `1` blank line after node, expected `0` blank lines, remove `1` blank line
 */

/**
 * @import {Nodes, Root} from 'mdast'
 * @import {} from 'mdast-util-directive'
 * @import {} from 'mdast-util-mdx'
 */

import {phrasing} from 'mdast-util-phrasing'
import pluralize from 'pluralize'
import {lintRule} from 'unified-lint-rule'
import {pointEnd, pointStart} from 'unist-util-position'
import {SKIP, visitParents} from 'unist-util-visit-parents'

const remarkLintNoConsecutiveBlankLines = lintRule(
  {
    origin: 'remark-lint:no-consecutive-blank-lines',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-no-consecutive-blank-lines#readme'
  },
  /**
   * @param {Root} tree
   *   Tree.
   * @returns {undefined}
   *   Nothing.
   */
  function (tree, file) {
    visitParents(tree, function (node, parents) {
      const parent = parents.at(-1)

      // Ignore phrasing nodes and non-parents.
      if (!parent) return

      // Do not walk into phrasing.
      if (phrasing(node)) {
        return SKIP
      }

      const siblings = /** @type {Array<Nodes>} */ (parent.children)
      const index = siblings.indexOf(node)

      // Compare parent and first child.
      if (
        index === 0 &&
        // Container directives and JSX have arbitrary opening length.
        parent.type !== 'containerDirective' &&
        parent.type !== 'mdxJsxFlowElement'
      ) {
        const parentStart = pointStart(parent)
        const start = pointStart(node)

        if (parentStart && start) {
          // For footnote definitions, the first line with the label can
          // otherwise be empty.
          const difference =
            start.line -
            parentStart.line -
            (parent.type === 'footnoteDefinition' ? 1 : 0)

          if (difference > 0) {
            file.message(
              'Unexpected `' +
                difference +
                '` blank ' +
                pluralize('line', difference) +
                ' before node, expected `0` blank lines, remove `' +
                difference +
                '` blank ' +
                pluralize('line', difference),
              {ancestors: [...parents, node], place: start}
            )
          }
        }
      }

      const next = siblings[index + 1]
      const end = pointEnd(node)
      const nextStart = pointStart(next)

      // Compare child and next sibling.
      if (end && nextStart) {
        // `2` for line ending after node and optional line ending of blank
        // line.
        const difference = nextStart.line - end.line - 2

        if (difference > 0) {
          const actual = difference + 1

          file.message(
            'Unexpected `' +
              actual +
              '` blank ' +
              pluralize('line', actual) +
              ' before node, expected up to `1` blank line, remove `' +
              difference +
              '` blank ' +
              pluralize('line', difference),
            {ancestors: [...parents, next], place: nextStart}
          )
        }
      }

      const parentEnd = pointEnd(parent)

      // Compare parent and last child.
      if (
        !next &&
        parentEnd &&
        end &&
        // Container directives and JSX have arbitrary closing length.
        parent.type !== 'containerDirective' &&
        parent.type !== 'mdxJsxFlowElement'
      ) {
        // Block quote can have extra blank lines in them if with `>`.
        // Other containers cannot.
        const difference =
          parentEnd.line - end.line - (parent.type === 'blockquote' ? 0 : 1)

        if (difference > 0) {
          file.message(
            'Unexpected `' +
              difference +
              '` blank ' +
              pluralize('line', difference) +
              ' after node, expected `0` blank lines, remove `' +
              difference +
              '` blank ' +
              pluralize('line', difference),
            {ancestors: [...parents, node], place: end}
          )
        }
      }
    })
  }
)

export default remarkLintNoConsecutiveBlankLines

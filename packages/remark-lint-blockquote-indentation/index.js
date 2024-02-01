/**
 * remark-lint rule to warn when block quotes are indented too much or
 * too little.
 *
 * ## What is this?
 *
 * This package checks the “indent” of block quotes: the `>` (greater than)
 * marker *and* the spaces before content.
 *
 * ## When should I use this?
 *
 * You can use this rule to check markdown code style.
 *
 * ## API
 *
 * ### `unified().use(remarkLintBlockquoteIndentation[, options])`
 *
 * Warn when block quotes are indented too much or too little.
 *
 * ###### Parameters
 *
 * * `options` ([`Options`][api-options], default: `'consistent'`)
 *   — either a preferred indent or whether to detect the first style
 *   and warn for further differences
 *
 * ###### Returns
 *
 * Transform ([`Transformer` from `unified`][github-unified-transformer]).
 *
 * ### `Options`
 *
 * Configuration (TypeScript type).
 *
 * ###### Type
 *
 * ```ts
 * type Options = number | 'consistent'
 * ```
 *
 * ## Recommendation
 *
 * CommonMark specifies that when block quotes are used the `>` markers can be
 * followed by an optional space.
 * No space at all arguably looks rather ugly:
 *
 * ```markdown
 * >Mars and
 * >Venus.
 * ```
 *
 * There is no specific handling of more that one space, so if 5 spaces were
 * used after `>`, then indented code kicks in:
 *
 * ```markdown
 * >     neptune()
 * ```
 *
 * Due to this, it’s recommended to configure this rule with `2`.
 *
 * [api-options]: #options
 * [api-remark-lint-blockquote-indentation]: #unifieduseremarklintblockquoteindentation-options
 * [github-unified-transformer]: https://github.com/unifiedjs/unified#transformer
 *
 * @module blockquote-indentation
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 *
 * @example
 *   {"config": 2, "name": "ok-2.md"}
 *
 *   > Mercury.
 *
 *   Venus.
 *
 *   > Earth.
 *
 * @example
 *   {"config": 4, "name": "ok-4.md"}
 *
 *   >   Mercury.
 *
 *   Venus.
 *
 *   >   Earth.
 *
 * @example
 *   { "name": "ok-tab.md"}
 *
 *   >␉Mercury.
 *
 * @example
 *   {"label": "input", "name": "not-ok.md"}
 *
 *   >  Mercury.
 *
 *   Venus.
 *
 *   >   Earth.
 *
 *   Mars.
 *
 *   > Jupiter
 * @example
 *   {"label": "output", "name": "not-ok.md"}
 *
 *   5:5: Unexpected `4` spaces between block quote marker and content, expected `3` spaces, remove `1` space
 *   9:3: Unexpected `2` spaces between block quote marker and content, expected `3` spaces, add `1` space
 *
 * @example
 *   {"config": "🌍", "label": "output", "name": "not-ok-options.md", "positionless": true}
 *
 *   1:1: Unexpected value `🌍` for `options`, expected `number` or `'consistent'`
 */

/**
 * @typedef {import('mdast').Root} Root
 */

/**
 * @typedef {number | 'consistent'} Options
 *   Configuration.
 */

import {phrasing} from 'mdast-util-phrasing'
import pluralize from 'pluralize'
import {lintRule} from 'unified-lint-rule'
import {pointStart} from 'unist-util-position'
import {SKIP, visitParents} from 'unist-util-visit-parents'

const remarkLintBlockquoteIndentation = lintRule(
  {
    origin: 'remark-lint:blockquote-indentation',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-blockquote-indentation#readme'
  },
  /**
   * @param {Root} tree
   *   Tree.
   * @param {Options | null | undefined} [options='consistent']
   *   Configuration (default: `'consistent'`).
   * @returns {undefined}
   *   Nothing.
   */
  function (tree, file, options) {
    /** @type {number | undefined} */
    let expected

    if (options === null || options === undefined || options === 'consistent') {
      // Empty.
    } else if (typeof options === 'number') {
      expected = options
    } else {
      file.fail(
        'Unexpected value `' +
          options +
          "` for `options`, expected `number` or `'consistent'`"
      )
    }

    visitParents(tree, function (node, parents) {
      // Do not walk into phrasing.
      if (phrasing(node)) {
        return SKIP
      }

      if (node.type !== 'blockquote') return

      const start = pointStart(node)
      const headStart = pointStart(node.children[0])

      if (headStart && start) {
        const actual = headStart.column - start.column

        if (expected) {
          const difference = expected - actual
          const differenceAbsolute = Math.abs(difference)

          if (difference !== 0) {
            file.message(
              'Unexpected `' +
                actual +
                '` ' +
                pluralize('space', actual) +
                ' between block quote marker and content, expected `' +
                expected +
                '` ' +
                pluralize('space', expected) +
                ', ' +
                (difference > 0 ? 'add' : 'remove') +
                ' `' +
                differenceAbsolute +
                '` ' +
                pluralize('space', differenceAbsolute),
              {ancestors: [...parents, node], place: headStart}
            )
          }
        } else {
          expected = actual
        }
      }
    })
  }
)

export default remarkLintBlockquoteIndentation

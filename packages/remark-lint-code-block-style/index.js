/**
 * remark-lint rule to warn when code blocks violate a given style.
 *
 * ## What is this?
 *
 * This package checks the style of code blocks.
 *
 * ## When should I use this?
 *
 * You can use this package to check that the style of code blocks is
 * consistent.
 *
 * ## API
 *
 * ### `unified().use(remarkLintCodeBlockStyle[, options])`
 *
 * Warn when code blocks violate a given style.
 *
 * ###### Parameters
 *
 * * `options` ([`Options`][api-options], default: `'consistent'`)
 *   — preferred style or whether to detect the first style and warn for
 *   further differences
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
 * type Options = Style | 'consistent'
 * ```
 *
 * ### `Style`
 *
 * Style (TypeScript type).
 *
 * ###### Type
 *
 * ```ts
 * type Style = 'indented' | 'fenced'
 * ```
 *
 * ## Recommendation
 *
 * Indentation in markdown is complex as lists and indented code interfere in
 * unexpected ways.
 * Fenced code has more features than indented code: it can specify a
 * programming language.
 * Since CommonMark took the idea of fenced code from GFM,
 * fenced code became widely supported.
 * Due to this, it’s recommended to configure this rule with `'fenced'`.
 *
 * ## Fix
 *
 * [`remark-stringify`][github-remark-stringify] always formats code blocks as
 * fenced.
 * Pass `fences: false` to only use fenced code blocks when they have a
 * language and as indented code otherwise.
 *
 * [api-options]: #options
 * [api-remark-lint-code-block-style]: #unifieduseremarklintcodeblockstyle-options
 * [api-style]: #style
 * [github-remark-stringify]: https://github.com/remarkjs/remark/tree/main/packages/remark-stringify
 * [github-unified-transformer]: https://github.com/unifiedjs/unified#transformer
 *
 * @module code-block-style
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 *
 * @example
 *   {"config": "indented", "name": "ok-indented.md"}
 *
 *       venus()
 *
 *   Mercury.
 *
 *       earth()
 *
 * @example
 *   {"config": "fenced", "name": "ok-fenced.md"}
 *
 *   ```
 *   venus()
 *   ```
 *
 *   Mercury.
 *
 *   ```
 *   earth()
 *   ```
 *
 * @example
 *   {"label": "input", "name": "not-ok-consistent.md"}
 *
 *       venus()
 *
 *   Mercury.
 *
 *   ```
 *   earth()
 *   ```
 * @example
 *   {"label": "output", "name": "not-ok-consistent.md"}
 *
 *   5:1-7:4: Unexpected fenced code block, expected indented code blocks
 *
 * @example
 *   {"config": "indented", "label": "input", "name": "not-ok-indented.md"}
 *
 *   ```
 *   venus()
 *   ```
 *
 *   Mercury.
 *
 *   ```
 *   earth()
 *   ```
 * @example
 *   {"config": "indented", "label": "output", "name": "not-ok-indented.md"}
 *
 *   1:1-3:4: Unexpected fenced code block, expected indented code blocks
 *   7:1-9:4: Unexpected fenced code block, expected indented code blocks
 *
 * @example
 *   {"config": "fenced", "label": "input", "name": "not-ok-fenced.md"}
 *
 *       venus()
 *
 *   Mercury.
 *
 *       earth()
 *
 * @example
 *   {"config": "fenced", "label": "output", "name": "not-ok-fenced.md"}
 *
 *   1:1-1:12: Unexpected indented code block, expected fenced code blocks
 *   5:1-5:12: Unexpected indented code block, expected fenced code blocks
 *
 * @example
 *   {"config": "🌍", "label": "output", "name": "not-ok-options.md", "positionless": true}
 *
 *   1:1: Unexpected value `🌍` for `options`, expected `'fenced'`, `'indented'`, or `'consistent'`
 */

/**
 * @typedef {import('mdast').Root} Root
 */

/**
 * @typedef {Style | 'consistent'} Options
 *   Configuration.
 *
 * @typedef {'indented' | 'fenced'} Style
 *   Styles.
 */

import {phrasing} from 'mdast-util-phrasing'
import {lintRule} from 'unified-lint-rule'
import {pointEnd, pointStart} from 'unist-util-position'
import {SKIP, visitParents} from 'unist-util-visit-parents'
import {VFileMessage} from 'vfile-message'

const remarkLintCodeBlockStyle = lintRule(
  {
    origin: 'remark-lint:code-block-style',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-code-block-style#readme'
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
    const value = String(file)
    /** @type {VFileMessage | undefined} */
    let cause
    /** @type {Style | undefined} */
    let expected

    if (options === null || options === undefined || options === 'consistent') {
      // Empty.
    } else if (options === 'indented' || options === 'fenced') {
      expected = options
    } else {
      file.fail(
        'Unexpected value `' +
          options +
          "` for `options`, expected `'fenced'`, `'indented'`, or `'consistent'`"
      )
    }

    visitParents(tree, function (node, parents) {
      // Do not walk into phrasing.
      if (phrasing(node)) {
        return SKIP
      }

      if (node.type !== 'code') return

      const end = pointEnd(node)
      const start = pointStart(node)

      if (
        !start ||
        !end ||
        typeof start.offset !== 'number' ||
        typeof end.offset !== 'number'
      ) {
        return
      }

      const actual =
        node.lang || /^ {0,3}([`~])/.test(value.slice(start.offset, end.offset))
          ? 'fenced'
          : 'indented'

      if (expected) {
        if (expected !== actual) {
          file.message(
            'Unexpected ' +
              actual +
              ' code block, expected ' +
              expected +
              ' code blocks',
            {ancestors: [...parents, node], cause, place: {start, end}}
          )
        }
      } else {
        expected = actual
        cause = new VFileMessage(
          "Code block style `'" +
            actual +
            "'` first defined for `'consistent'` here",
          {
            ancestors: [...parents, node],
            place: {start, end},
            source: 'remark-lint',
            ruleId: 'code-block-style'
          }
        )
      }
    })
  }
)

export default remarkLintCodeBlockStyle

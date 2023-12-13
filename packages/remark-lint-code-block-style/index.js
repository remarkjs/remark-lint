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
 *   {"config": "indented", "name": "ok.md"}
 *
 *       alpha()
 *
 *   Paragraph.
 *
 *       bravo()
 *
 * @example
 *   {"config": "indented", "name": "not-ok.md", "label": "input"}
 *
 *   ```
 *   alpha()
 *   ```
 *
 *   Paragraph.
 *
 *   ```
 *   bravo()
 *   ```
 *
 * @example
 *   {"config": "indented", "name": "not-ok.md", "label": "output"}
 *
 *   1:1-3:4: Code blocks should be indented
 *   7:1-9:4: Code blocks should be indented
 *
 * @example
 *   {"config": "fenced", "name": "ok.md"}
 *
 *   ```
 *   alpha()
 *   ```
 *
 *   Paragraph.
 *
 *   ```
 *   bravo()
 *   ```
 *
 * @example
 *   {"config": "fenced", "name": "not-ok-fenced.md", "label": "input"}
 *
 *       alpha()
 *
 *   Paragraph.
 *
 *       bravo()
 *
 * @example
 *   {"config": "fenced", "name": "not-ok-fenced.md", "label": "output"}
 *
 *   1:1-1:12: Code blocks should be fenced
 *   5:1-5:12: Code blocks should be fenced
 *
 * @example
 *   {"name": "not-ok-consistent.md", "label": "input"}
 *
 *       alpha()
 *
 *   Paragraph.
 *
 *   ```
 *   bravo()
 *   ```
 *
 * @example
 *   {"name": "not-ok-consistent.md", "label": "output"}
 *
 *   5:1-7:4: Code blocks should be indented
 *
 * @example
 *   {"config": "💩", "name": "not-ok-incorrect.md", "label": "output", "positionless": true}
 *
 *   1:1: Incorrect code block style `💩`: use either `'consistent'`, `'fenced'`, or `'indented'`
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

import {lintRule} from 'unified-lint-rule'
import {pointEnd, pointStart} from 'unist-util-position'
import {visit} from 'unist-util-visit'

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
    let option = options || 'consistent'
    const value = String(file)

    if (
      option !== 'consistent' &&
      option !== 'indented' &&
      option !== 'fenced'
    ) {
      file.fail(
        'Incorrect code block style `' +
          option +
          "`: use either `'consistent'`, `'fenced'`, or `'indented'`"
      )
    }

    visit(tree, 'code', function (node) {
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

      const current =
        node.lang ||
        /^\s*([~`])\1{2,}/.test(value.slice(start.offset, end.offset))
          ? 'fenced'
          : 'indented'

      if (option === 'consistent') {
        option = current
      } else if (option !== current) {
        file.message('Code blocks should be ' + option, node)
      }
    })
  }
)

export default remarkLintCodeBlockStyle

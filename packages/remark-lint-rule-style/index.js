/**
 * remark-lint rule to warn when thematic breaks (horizontal rules) are
 * inconsistent.
 *
 * ## What is this?
 *
 * This package checks markers and whitespace of thematic rules.
 *
 * ## When should I use this?
 *
 * You can use this package to check that thematic breaks are consistent.
 *
 * ## API
 *
 * ### `unified().use(remarkLintRuleStyle[, options])`
 *
 * Warn when thematic breaks (horizontal rules) are inconsistent.
 *
 * ###### Parameters
 *
 * * `options` ([`Options`][api-options], default: `'consistent'`)
 *   — preferred style or whether to detect the first style and warn for
 *   further differences
 *
 * ### `Options`
 *
 * Configuration (TypeScript type).
 *
 * * `'consistent'`
 *   — detect the first used style and warn when further rules differ
 * * `string` (example: `'** * **'`, `'___'`)
 *   — thematic break to prefer
 *
 * ###### Type
 *
 * ```ts
 * type Options = string | 'consistent'
 * ```
 *
 * ## Recommendation
 *
 * Rules consist of a `*`, `-`, or `_` character,
 * which occurs at least three times with nothing else except for arbitrary
 * spaces or tabs on a single line.
 * Using spaces, tabs, or more than three markers is unnecessary work to type
 * out.
 * As asterisks can be used as a marker for more markdown constructs,
 * it’s recommended to use that for rules (and lists, emphasis, strong) too.
 * So it’s recommended to pass `'***'`.
 *
 * ## Fix
 *
 * [`remark-stringify`][github-remark-stringify] formats rules with `***` by
 * default.
 * There are three settings to control rules:
 *
 * * `rule` (default: `'*'`) — marker
 * * `ruleRepetition` (default: `3`) — repetitions
 * * `ruleSpaces` (default: `false`) — use spaces between markers
 *
 * [api-options]: #options
 * [api-remark-lint-rule-style]: #unifieduseremarklintrulestyle-options
 * [github-remark-stringify]: https://github.com/remarkjs/remark/tree/main/packages/remark-stringify
 * [github-unified-transformer]: https://github.com/unifiedjs/unified#transformer
 *
 * @module rule-style
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 *
 * @example
 *   {"name": "ok.md"}
 *
 *   Two rules:
 *
 *   * * *
 *
 *   * * *
 *
 * @example
 *   {"config": "_______", "name": "ok.md"}
 *
 *   _______
 *
 *   _______
 *
 * @example
 *   {"label": "input", "name": "not-ok.md"}
 *
 *   ***
 *
 *   * * *
 * @example
 *   {"label": "output", "name": "not-ok.md"}
 *
 *   3:1-3:6: Unexpected thematic rule `* * *`, expected `***`
 *
 * @example
 *   {"config": "🌍", "label": "output", "name": "not-ok.md", "positionless": true}
 *
 *   1:1: Unexpected value `🌍` for `options`, expected thematic rule or `'consistent'`
 */

/**
 * @typedef {import('mdast').Root} Root
 */

/**
 * @typedef {string} Options
 *   Configuration.
 */

import {phrasing} from 'mdast-util-phrasing'
import {lintRule} from 'unified-lint-rule'
import {pointEnd, pointStart} from 'unist-util-position'
import {SKIP, visitParents} from 'unist-util-visit-parents'
import {VFileMessage} from 'vfile-message'

const remarkLintRuleStyle = lintRule(
  {
    origin: 'remark-lint:rule-style',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-rule-style#readme'
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
    /** @type {string | undefined} */
    let expected
    /** @type {VFileMessage | undefined} */
    let cause

    if (options === null || options === undefined || options === 'consistent') {
      // Empty.
    } else if (
      /[^-_* ]/.test(options) ||
      options.at(0) === ' ' ||
      options.at(-1) === ' ' ||
      options.replaceAll(' ', '').length < 3
    ) {
      file.fail(
        'Unexpected value `' +
          options +
          "` for `options`, expected thematic rule or `'consistent'`"
      )
    } else {
      expected = options
    }

    visitParents(tree, function (node, parents) {
      // Do not walk into phrasing.
      if (phrasing(node)) {
        return SKIP
      }

      if (node.type !== 'thematicBreak') return

      const end = pointEnd(node)
      const start = pointStart(node)

      if (
        start &&
        end &&
        typeof start.offset === 'number' &&
        typeof end.offset === 'number'
      ) {
        const place = {start, end}
        const actual = value.slice(start.offset, end.offset)

        if (expected) {
          if (actual !== expected) {
            file.message(
              'Unexpected thematic rule `' +
                actual +
                '`, expected `' +
                expected +
                '`',
              {ancestors: [...parents, node], cause, place}
            )
          }
        } else {
          expected = actual
          cause = new VFileMessage(
            'Thematic rule style `' +
              expected +
              "` first defined for `'consistent'` here",
            {
              ancestors: [...parents, node],
              place,
              ruleId: 'rule-style',
              source: 'remark-lint'
            }
          )
        }
      }
    })
  }
)

export default remarkLintRuleStyle

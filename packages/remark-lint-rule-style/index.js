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
 * @example
 *   {"name": "ok.md", "config": "* * *"}
 *
 *   * * *
 *
 *   * * *
 *
 * @example
 *   {"name": "ok.md", "config": "_______"}
 *
 *   _______
 *
 *   _______
 *
 * @example
 *   {"name": "not-ok.md", "label": "input"}
 *
 *   ***
 *
 *   * * *
 *
 * @example
 *   {"name": "not-ok.md", "label": "output"}
 *
 *   3:1-3:6: Rules should use `***`
 *
 * @example
 *   {"name": "not-ok.md", "label": "output", "config": "💩", "positionless": true}
 *
 *   1:1: Incorrect preferred rule style: provide a correct markdown rule or `'consistent'`
 */

/**
 * @typedef {import('mdast').Root} Root
 */

/**
 * @typedef {string} Options
 *   Configuration.
 */

import {lintRule} from 'unified-lint-rule'
import {pointEnd, pointStart} from 'unist-util-position'
import {visit} from 'unist-util-visit'

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
    let option = options || 'consistent'

    if (option !== 'consistent' && /[^-_* ]/.test(option)) {
      file.fail(
        "Incorrect preferred rule style: provide a correct markdown rule or `'consistent'`"
      )
    }

    visit(tree, 'thematicBreak', function (node) {
      const end = pointEnd(node)
      const start = pointStart(node)

      if (
        start &&
        end &&
        typeof start.offset === 'number' &&
        typeof end.offset === 'number'
      ) {
        const rule = value.slice(start.offset, end.offset)

        if (option === 'consistent') {
          option = rule
        } else if (rule !== option) {
          file.message('Rules should use `' + option + '`', node)
        }
      }
    })
  }
)

export default remarkLintRuleStyle

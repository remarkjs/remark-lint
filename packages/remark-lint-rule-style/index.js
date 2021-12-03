/**
 * ## When should I use this?
 *
 * You can use this package to check that rules (thematic breaks, horizontal
 * rules) are consistent.
 *
 * ## API
 *
 * The following options (default: `'consistent'`) are accepted:
 *
 * *   `string` (example: `'** * **'`, `'___'`)
 *     — thematic break to prefer
 * *   `'consistent'`
 *     — detect the first used style and warn when further rules differ
 *
 * ## Recommendation
 *
 * Rules consist of a `*`, `-`, or `_` character, which occurs at least three
 * times with nothing else except for arbitrary spaces or tabs on a single line.
 * Using spaces, tabs, and more than three markers seems unnecessary work to
 * type out.
 * Because asterisks can be used as a marker for more markdown constructs,
 * it’s recommended to use that for rules (and lists, emphasis, strong) too.
 * Due to this, it’s recommended to pass `'***'`.
 *
 * ## Fix
 *
 * [`remark-stringify`](https://github.com/remarkjs/remark/tree/main/packages/remark-stringify)
 * formats rules with `***` by default.
 * There are three settings to control rules:
 *
 * *   [`rule`](https://github.com/remarkjs/remark/tree/main/packages/remark-stringify#optionsrule)
 *     (default: `'*'`) — marker
 * *   [`ruleRepetition`](https://github.com/remarkjs/remark/tree/main/packages/remark-stringify#optionsrulerepetition)
 *     (default: `3`) — repetitions
 * *   [`ruleSpaces`](https://github.com/remarkjs/remark/tree/main/packages/remark-stringify#optionsrulespaces)
 *     (default: `false`) — use spaces between markers
 *
 * @module rule-style
 * @summary
 *   remark-lint rule to warn when rule markers are inconsistent.
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @example
 *   {"name": "ok.md", "setting": "* * *"}
 *
 *   * * *
 *
 *   * * *
 *
 * @example
 *   {"name": "ok.md", "setting": "_______"}
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
 *   {"name": "not-ok.md", "label": "output", "setting": "💩", "positionless": true}
 *
 *   1:1: Incorrect preferred rule style: provide a correct markdown rule or `'consistent'`
 */

/**
 * @typedef {import('mdast').Root} Root
 * @typedef {string} Options
 */

import {lintRule} from 'unified-lint-rule'
import {visit} from 'unist-util-visit'
import {pointStart, pointEnd} from 'unist-util-position'

const remarkLintRuleStyle = lintRule(
  {
    origin: 'remark-lint:rule-style',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-rule-style#readme'
  },
  /** @type {import('unified-lint-rule').Rule<Root, Options>} */
  (tree, file, option = 'consistent') => {
    const value = String(file)

    if (option !== 'consistent' && /[^-_* ]/.test(option)) {
      file.fail(
        "Incorrect preferred rule style: provide a correct markdown rule or `'consistent'`"
      )
    }

    visit(tree, 'thematicBreak', (node) => {
      const initial = pointStart(node).offset
      const final = pointEnd(node).offset

      if (typeof initial === 'number' && typeof final === 'number') {
        const rule = value.slice(initial, final)

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

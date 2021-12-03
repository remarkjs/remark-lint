/**
 * ## When should I use this?
 *
 * You can use this package to check that heading text is within reason.
 *
 * ## API
 *
 * The following options (default: `60`) are accepted:
 *
 * *   `number` (example: `72`)
 *     — max number of characters to accept in heading text
 *
 * Ignores syntax, only checks the plain text content.
 *
 * ## Recommendation
 *
 * While this rule is sometimes annoying, reasonable size headings
 * do help SEO purposes (bots prefer reasonable headings), visual users
 * (headings are typically displayed quite large), and users of screen readers
 * (who typically use “jump to heading” features to navigate within a page,
 * which reads every heading out loud).
 *
 * @module maximum-heading-length
 * @summary
 *   remark-lint rule to warn when headings are too long.
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @example
 *   {"name": "ok.md"}
 *
 *   # Alpha bravo charlie delta echo foxtrot golf hotel
 *
 *   # ![Alpha bravo charlie delta echo foxtrot golf hotel](http://example.com/nato.png)
 *
 * @example
 *   {"name": "not-ok.md", "setting": 40, "label": "input"}
 *
 *   # Alpha bravo charlie delta echo foxtrot golf hotel
 *
 * @example
 *   {"name": "not-ok.md", "setting": 40, "label": "output"}
 *
 *   1:1-1:52: Use headings shorter than `40`
 */

/**
 * @typedef {import('mdast').Root} Root
 * @typedef {number} Options
 */

import {lintRule} from 'unified-lint-rule'
import {visit} from 'unist-util-visit'
import {generated} from 'unist-util-generated'
import {toString} from 'mdast-util-to-string'

const remarkLintMaximumHeadingLength = lintRule(
  {
    origin: 'remark-lint:maximum-heading-length',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-maximum-heading-length#readme'
  },
  /** @type {import('unified-lint-rule').Rule<Root, Options>} */
  (tree, file, option = 60) => {
    visit(tree, 'heading', (node) => {
      if (!generated(node) && toString(node).length > option) {
        file.message('Use headings shorter than `' + option + '`', node)
      }
    })
  }
)

export default remarkLintMaximumHeadingLength

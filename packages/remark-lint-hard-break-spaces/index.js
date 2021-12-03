/**
 * ## When should I use this?
 *
 * You can use this package to check that hard breaks use two spaces and
 * not more.
 *
 * ## API
 *
 * There are no options.
 *
 * ## Recommendation
 *
 * Less than two spaces do not create a hard breaks and more than two spaces
 * have no effect.
 * Due to this, it’s recommended to turn this rule on.
 *
 * @module hard-break-spaces
 * @summary
 *   remark-lint rule to warn when more spaces are used than needed
 *   for hard breaks.
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @example
 *   {"name": "ok.md"}
 *
 *   Lorem ipsum··
 *   dolor sit amet
 *
 * @example
 *   {"name": "not-ok.md", "label": "input"}
 *
 *   Lorem ipsum···
 *   dolor sit amet.
 *
 * @example
 *   {"name": "not-ok.md", "label": "output"}
 *
 *   1:12-2:1: Use two spaces for hard line breaks
 */

/**
 * @typedef {import('mdast').Root} Root
 */

import {lintRule} from 'unified-lint-rule'
import {visit} from 'unist-util-visit'
import {pointStart, pointEnd} from 'unist-util-position'
import {generated} from 'unist-util-generated'

const remarkLintHardBreakSpaces = lintRule(
  {
    origin: 'remark-lint:hard-break-spaces',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-hard-break-spaces#readme'
  },
  /** @type {import('unified-lint-rule').Rule<Root, void>} */
  (tree, file) => {
    const value = String(file)

    visit(tree, 'break', (node) => {
      if (!generated(node)) {
        const slice = value
          .slice(pointStart(node).offset, pointEnd(node).offset)
          .split('\n', 1)[0]
          .replace(/\r$/, '')

        if (slice.length > 2) {
          file.message('Use two spaces for hard line breaks', node)
        }
      }
    })
  }
)

export default remarkLintHardBreakSpaces

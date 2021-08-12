/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module maximum-heading-length
 * @fileoverview
 *   Warn when headings are too long.
 *
 *   Options: `number`, default: `60`.
 *
 *   Ignores Markdown syntax, only checks the plain text content.
 *
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
  'remark-lint:maximum-heading-length',
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

/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module blockquote-indentation
 * @fileoverview
 *   Warn when block quotes are indented too much or too little.
 *
 *   Options: `number` or `'consistent'`, default: `'consistent'`.
 *
 *   `'consistent'` detects the first used indentation and will warn when
 *   other block quotes use a different indentation.
 *
 * @example {"name": "ok.md", "setting": 4}
 *
 *   >   Hello
 *
 *   Paragraph.
 *
 *   >   World
 *
 * @example {"name": "ok.md", "setting": 2}
 *
 *   > Hello
 *
 *   Paragraph.
 *
 *   > World
 *
 * @example {"name": "not-ok.md", "label": "input"}
 *
 *   >  Hello
 *
 *   Paragraph.
 *
 *   >   World
 *
 *   Paragraph.
 *
 *   > World
 *
 * @example {"name": "not-ok.md", "label": "output"}
 *
 *   5:5: Remove 1 space between block quote and content
 *   9:3: Add 1 space between block quote and content
 */

import {lintRule} from 'unified-lint-rule'
import plural from 'pluralize'
import {visit} from 'unist-util-visit'
import {pointStart} from 'unist-util-position'
import {generated} from 'unist-util-generated'

const remarkLintBlockquoteIndentation = lintRule(
  'remark-lint:blockquote-indentation',
  blockquoteIndentation
)

export default remarkLintBlockquoteIndentation

function blockquoteIndentation(tree, file, option) {
  var preferred = typeof option === 'number' && !isNaN(option) ? option : null

  visit(tree, 'blockquote', visitor)

  function visitor(node) {
    var abs
    var diff
    var reason

    if (generated(node) || node.children.length === 0) {
      return
    }

    if (preferred) {
      diff = preferred - check(node)

      if (diff !== 0) {
        abs = Math.abs(diff)
        reason =
          (diff > 0 ? 'Add' : 'Remove') +
          ' ' +
          abs +
          ' ' +
          plural('space', abs) +
          ' between block quote and content'

        file.message(reason, pointStart(node.children[0]))
      }
    } else {
      preferred = check(node)
    }
  }
}

function check(node) {
  return pointStart(node.children[0]).column - pointStart(node).column
}

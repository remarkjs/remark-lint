/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module no-missing-blank-lines
 * @fileoverview
 *   Warn when missing blank lines before block content (and frontmatter
 *   content).
 *
 *   This rule can be configured to allow tight list items without blank lines
 *   between their contents by passing `{exceptTightLists: true}` (default:
 *   `false`).
 *
 *   ## Fix
 *
 *   [`remark-stringify`](https://github.com/remarkjs/remark/tree/HEAD/packages/remark-stringify)
 *   always uses one blank line between blocks if possible, or two lines when
 *   needed.
 *   The style of the list items persists.
 *
 *   See [Using remark to fix your Markdown](https://github.com/remarkjs/remark-lint#using-remark-to-fix-your-markdown)
 *   on how to automatically fix warnings for this rule.
 *
 * @example
 *   {"name": "ok.md"}
 *
 *   # Foo
 *
 *   ## Bar
 *
 *   - Paragraph
 *
 *     + List.
 *
 *   Paragraph.
 *
 * @example
 *   {"name": "not-ok.md", "label": "input"}
 *
 *   # Foo
 *   ## Bar
 *
 *   - Paragraph
 *     + List.
 *
 *   Paragraph.
 *
 * @example
 *   {"name": "not-ok.md", "label": "output"}
 *
 *   2:1-2:7: Missing blank line before block node
 *   5:3-5:10: Missing blank line before block node
 *
 * @example
 *   {"name": "tight.md", "setting": {"exceptTightLists": true}, "label": "input"}
 *
 *   # Foo
 *   ## Bar
 *
 *   - Paragraph
 *     + List.
 *
 *   Paragraph.
 *
 * @example
 *   {"name": "tight.md", "setting": {"exceptTightLists": true}, "label": "output"}
 *
 *   2:1-2:7: Missing blank line before block node
 */

/**
 * @typedef {import('mdast').Root} Root
 *
 * @typedef Options
 * @property {boolean} [exceptTightLists=false]
 */

import {lintRule} from 'unified-lint-rule'
import {visit} from 'unist-util-visit'
import {pointStart, pointEnd} from 'unist-util-position'
import {generated} from 'unist-util-generated'

const types = new Set([
  'paragraph',
  'heading',
  'thematicBreak',
  'blockquote',
  'list',
  'table',
  'html',
  'code',
  'yaml'
])

const remarkLintNoMissingBlankLines = lintRule(
  'remark-lint:no-missing-blank-lines',
  /** @type {import('unified-lint-rule').Rule<Root, Options>} */
  (tree, file, option = {}) => {
    const {exceptTightLists} = option

    visit(tree, (node, index, parent) => {
      if (
        parent &&
        typeof index === 'number' &&
        !generated(node) &&
        (!exceptTightLists || parent.type !== 'listItem')
      ) {
        const next = parent.children[index + 1]

        if (
          next &&
          types.has(next.type) &&
          pointStart(next).line === pointEnd(node).line + 1
        ) {
          file.message('Missing blank line before block node', next)
        }
      }
    })
  }
)

export default remarkLintNoMissingBlankLines

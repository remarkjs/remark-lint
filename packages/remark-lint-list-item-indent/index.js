/**
 * remark-lint rule to warn when the whitespace after list item markers violate
 * a given style.
 *
 * ## What is this?
 *
 * This package checks the style of whitespace after list item markers.
 *
 * ## When should I use this?
 *
 * You can use this package to check that the style of whitespace after list
 * item markers and before content is consistent.
 *
 * ## API
 *
 * ### `unified().use(remarkLintListItemIndent[, options])`
 *
 * Warn when the whitespace after list item markers violate a given style.
 *
 * ###### Parameters
 *
 * * `options` ([`Options`][api-options], default: `'tab-size'`)
 *   — preferred style
 *
 * ###### Returns
 *
 * Transform ([`Transformer` from `unified`][github-unified-transformer]).
 *
 * ### `Options`
 *
 * Configuration (TypeScript type).
 *
 * * `'space'`
 *   — prefer a single space
 * * `'tab-size'`
 *   — prefer spaces the size of the next tab stop
 * * `'mixed'`
 *   — prefer `'space'` for tight lists and `'tab-size'` for loose lists
 *
 * ###### Type
 *
 * ```ts
 * type Options = 'mixed' | 'space' | 'tab-size'
 * ```
 *
 * ## Recommendation
 *
 * First some background.
 * The number of spaces that occur after list markers (`*`, `-`, and `+` for
 * unordered lists and `.` and `)` for unordered lists) and before the content
 * on the first line,
 * defines how much indentation can be used for further lines.
 * At least one space is required and up to 4 spaces are allowed.
 * If there is no further content after the marker then it’s a blank line which
 * is handled as if there was one space.
 * If there are 5 or more spaces and then content then it’s also seen as one
 * space and the rest is seen as indented code.
 *
 * Regardless of ordered and unordered,
 * there are two kinds of lists in markdown,
 * tight and loose.
 * Lists are tight by default but if there is a blank line between two list
 * items or between two blocks inside an item,
 * that turns the whole list into a loose list.
 * When turning markdown into HTML,
 * paragraphs in tight lists are not wrapped in `<p>` tags.
 *
 * How indentation of lists works in markdown has historically been a mess,
 * especially with how they interact with indented code.
 * CommonMark made that a *lot* better,
 * but there remain (documented but complex) edge cases and some behavior
 * intuitive.
 * Due to this, the default of this list is `'tab-size'`, which worked the best
 * in most markdown parsers *and* in CommonMark.
 * Currently the situation between markdown parsers is better,
 * so choosing `'space'`, which seems to be the most common style used by
 * authors,
 * is okay.
 *
 * ## Fix
 *
 * [`remark-stringify`][github-remark-stringify] uses `listItemIndent: 'one'`,
 * for `'space'`,
 * by default.
 * `listItemIndent: 'mixed'` or `listItemIndent: 'tab'` (for `'tab-size'`) is
 * also supported.
 *
 * [api-options]: #options
 * [api-remark-lint-list-item-indent]: #unifieduseremarklintlistitemindent-options
 * [github-remark-stringify]: https://github.com/remarkjs/remark/tree/main/packages/remark-stringify
 * [github-unified-transformer]: https://github.com/unifiedjs/unified#transformer
 *
 * @module list-item-indent
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @example
 *   {"name": "ok.md"}
 *
 *   *␠␠␠List
 *   ␠␠␠␠item.
 *
 *   Paragraph.
 *
 *   11.␠List
 *   ␠␠␠␠item.
 *
 *   Paragraph.
 *
 *   *␠␠␠List
 *   ␠␠␠␠item.
 *
 *   *␠␠␠List
 *   ␠␠␠␠item.
 *
 * @example
 *   {"name": "ok.md", "config": "mixed"}
 *
 *   *␠List item.
 *
 *   Paragraph.
 *
 *   11.␠List item
 *
 *   Paragraph.
 *
 *   *␠␠␠List
 *   ␠␠␠␠item.
 *
 *   *␠␠␠List
 *   ␠␠␠␠item.
 *
 * @example
 *   {"name": "ok.md", "config": "space"}
 *
 *   *␠List item.
 *
 *   Paragraph.
 *
 *   11.␠List item
 *
 *   Paragraph.
 *
 *   *␠List
 *   ␠␠item.
 *
 *   *␠List
 *   ␠␠item.
 *
 * @example
 *   {"name": "not-ok.md", "config": "space", "label": "input"}
 *
 *   *␠␠␠List
 *   ␠␠␠␠item.
 *
 * @example
 *   {"name": "not-ok.md", "config": "space", "label": "output"}
 *
 *    1:5: Incorrect list-item indent: remove 2 spaces
 *
 * @example
 *   {"name": "not-ok.md", "config": "tab-size", "label": "input"}
 *
 *   *␠List
 *   ␠␠item.
 *
 * @example
 *   {"name": "not-ok.md", "config": "tab-size", "label": "output"}
 *
 *    1:3: Incorrect list-item indent: add 2 spaces
 *
 * @example
 *   {"name": "not-ok.md", "config": "mixed", "label": "input"}
 *
 *   *␠␠␠List item.
 *
 * @example
 *   {"name": "not-ok.md", "config": "mixed", "label": "output"}
 *
 *    1:5: Incorrect list-item indent: remove 2 spaces
 *
 * @example
 *   {"name": "not-ok.md", "config": "💩", "label": "output", "positionless": true}
 *
 *    1:1: Incorrect list-item indent style `💩`: use either `'tab-size'`, `'space'`, or `'mixed'`
 */

/**
 * @typedef {import('mdast').Root} Root
 */

/**
 * @typedef {'mixed' | 'space' | 'tab-size'} Options
 *   Configuration.
 */

import plural from 'pluralize'
import {lintRule} from 'unified-lint-rule'
import {pointStart} from 'unist-util-position'
import {visit} from 'unist-util-visit'

const remarkLintListItemIndent = lintRule(
  {
    origin: 'remark-lint:list-item-indent',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-list-item-indent#readme'
  },
  /**
   * @param {Root} tree
   *   Tree.
   * @param {Options | null | undefined} [options='tab-size']
   *   Configuration (default: `'tab-size'`).
   * @returns {undefined}
   *   Nothing.
   */
  function (tree, file, options) {
    const value = String(file)
    const option = options || 'tab-size'

    if (option !== 'mixed' && option !== 'space' && option !== 'tab-size') {
      file.fail(
        'Incorrect list-item indent style `' +
          option +
          "`: use either `'tab-size'`, `'space'`, or `'mixed'`"
      )
    }

    visit(tree, 'list', function (node) {
      const spread = node.spread
      let index = -1

      while (++index < node.children.length) {
        const item = node.children[index]
        const head = item.children[0]
        const start = pointStart(item)
        const final = pointStart(head)

        if (
          start &&
          final &&
          typeof start.offset === 'number' &&
          typeof final.offset === 'number'
        ) {
          const marker = value
            .slice(start.offset, final.offset)
            .replace(/\[[x ]?]\s*$/i, '')

          const bulletSize = marker.replace(/\s+$/, '').length

          const style =
            option === 'tab-size' || (option === 'mixed' && spread)
              ? Math.ceil(bulletSize / 4) * 4
              : bulletSize + 1

          if (marker.length !== style) {
            const diff = style - marker.length
            const abs = Math.abs(diff)

            file.message(
              'Incorrect list-item indent: ' +
                (diff > 0 ? 'add' : 'remove') +
                ' ' +
                abs +
                ' ' +
                plural('space', abs),
              final
            )
          }
        }
      }
    })
  }
)

export default remarkLintListItemIndent

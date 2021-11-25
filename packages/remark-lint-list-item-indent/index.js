/**
 * ## When should I use this?
 *
 * You can use this package to check that the spacing between list item markers
 * and content is inconsistent.
 *
 * ## API
 *
 * The following options (default: `'tab-size'`) are accepted:
 *
 * *   `'space'`
 *     — prefer a single space
 * *   `'tab-size'`
 *     — prefer spaces the size of the next tab stop
 * *   `'mixed'`
 *     — prefer `'space'` for tight lists and `'tab-size'` for loose lists
 *
 * ## Recommendation
 *
 * First, some background.
 * The number of spaces that occur after list markers (`*`, `-`, and `+` for
 * unordered lists, or `.` and `)` for unordered lists) and before the content
 * on the first line, defines how much indentation can be used for further
 * lines.
 * At least one space is required and up to 4 spaces are allowed (if there is no
 * further content after the marker then it’s a blank line which is handled as
 * if there was one space; if there are 5 or more spaces and then content, it’s
 * also seen as one space and the rest is seen as indented code).
 *
 * There are two types of lists in markdown (other than ordered and unordered):
 * tight and loose lists.
 * Lists are tight by default but if there is a blank line between two list
 * items or between two blocks inside an item, that turns the whole list into a
 * loose list.
 * When turning markdown into HTML, paragraphs in tight lists are not wrapped
 * in `<p>` tags.
 *
 * Historically, how indentation of lists works in markdown has been a mess,
 * especially with how they interact with indented code.
 * CommonMark made that a *lot* better, but there remain (documented but
 * complex) edge cases and some behavior intuitive.
 * Due to this, the default of this list is `'tab-size'`, which worked the best
 * in most markdown parsers.
 * Currently, the situation between markdown parsers is better, so choosing
 * `'space'` (which seems to be the most common style used by authors) should
 * be okay.
 *
 * ## Fix
 *
 * [`remark-stringify`](https://github.com/remarkjs/remark/tree/main/packages/remark-stringify)
 * uses `'tab-size'` (named `'tab'` there) by default.
 * [`listItemIndent: '1'` (for `'space'`) or `listItemIndent: 'mixed'`](https://github.com/remarkjs/remark/tree/main/packages/remark-stringify#optionslistitemindent)
 * is supported.
 *
 * @module list-item-indent
 * @summary
 *   remark-lint rule to warn when spacing between list item markers and
 *   content is inconsistent.
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @example
 *   {"name": "ok.md"}
 *
 *   *···List
 *   ····item.
 *
 *   Paragraph.
 *
 *   11.·List
 *   ····item.
 *
 *   Paragraph.
 *
 *   *···List
 *   ····item.
 *
 *   *···List
 *   ····item.
 *
 * @example
 *   {"name": "ok.md", "setting": "mixed"}
 *
 *   *·List item.
 *
 *   Paragraph.
 *
 *   11.·List item
 *
 *   Paragraph.
 *
 *   *···List
 *   ····item.
 *
 *   *···List
 *   ····item.
 *
 * @example
 *   {"name": "ok.md", "setting": "space"}
 *
 *   *·List item.
 *
 *   Paragraph.
 *
 *   11.·List item
 *
 *   Paragraph.
 *
 *   *·List
 *   ··item.
 *
 *   *·List
 *   ··item.
 *
 * @example
 *   {"name": "not-ok.md", "setting": "space", "label": "input"}
 *
 *   *···List
 *   ····item.
 *
 * @example
 *   {"name": "not-ok.md", "setting": "space", "label": "output"}
 *
 *    1:5: Incorrect list-item indent: remove 2 spaces
 *
 * @example
 *   {"name": "not-ok.md", "setting": "tab-size", "label": "input"}
 *
 *   *·List
 *   ··item.
 *
 * @example
 *   {"name": "not-ok.md", "setting": "tab-size", "label": "output"}
 *
 *    1:3: Incorrect list-item indent: add 2 spaces
 *
 * @example
 *   {"name": "not-ok.md", "setting": "mixed", "label": "input"}
 *
 *   *···List item.
 *
 * @example
 *   {"name": "not-ok.md", "setting": "mixed", "label": "output"}
 *
 *    1:5: Incorrect list-item indent: remove 2 spaces
 *
 * @example
 *   {"name": "not-ok.md", "setting": "💩", "label": "output", "positionless": true}
 *
 *    1:1: Incorrect list-item indent style `💩`: use either `'tab-size'`, `'space'`, or `'mixed'`
 */

/**
 * @typedef {import('mdast').Root} Root
 * @typedef {'tab-size'|'space'|'mixed'} Options
 */

import {lintRule} from 'unified-lint-rule'
import plural from 'pluralize'
import {visit} from 'unist-util-visit'
import {pointStart} from 'unist-util-position'
import {generated} from 'unist-util-generated'

const remarkLintListItemIndent = lintRule(
  {
    origin: 'remark-lint:list-item-indent',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-list-item-indent#readme'
  },
  /** @type {import('unified-lint-rule').Rule<Root, Options>} */
  (tree, file, option = 'tab-size') => {
    const value = String(file)

    if (option !== 'tab-size' && option !== 'space' && option !== 'mixed') {
      file.fail(
        'Incorrect list-item indent style `' +
          option +
          "`: use either `'tab-size'`, `'space'`, or `'mixed'`"
      )
    }

    visit(tree, 'list', (node) => {
      if (generated(node)) return

      const spread = node.spread
      let index = -1

      while (++index < node.children.length) {
        const item = node.children[index]
        const head = item.children[0]
        const final = pointStart(head)

        const marker = value
          .slice(pointStart(item).offset, final.offset)
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
    })
  }
)

export default remarkLintListItemIndent

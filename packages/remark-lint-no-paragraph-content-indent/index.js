/**
 * ## When should I use this?
 *
 * You can use this package to check that content in paragraphs is not
 * indented.
 *
 * ## API
 *
 * There are no options.
 *
 * ## Recommendation
 *
 * Indenting further lines in a paragraph has no effect.
 * Due to this, it’s recommended to turn this rule on.
 *
 * @module no-paragraph-content-indent
 * @summary
 *   remark-lint rule to warn when content in paragraphs is indented.
 * @author Titus Wormer
 * @copyright 2017 Titus Wormer
 * @license MIT
 * @example
 *   {"name": "ok.md"}
 *
 *   Alpha
 *
 *   Bravo
 *   Charlie.
 *   **Delta**.
 *
 *   *   Echo
 *       Foxtrot.
 *
 *   > Golf
 *   > Hotel.
 *
 *   `india()`
 *   juliett.
 *
 *   -   `kilo()`
 *       lima.
 *
 *   -   `mike()` - november.
 *
 *   ![image]() text
 *
 *   ![image reference][] text
 *
 *   [![][text]][text]
 *
 * @example
 *   {"name": "not-ok.md", "label": "input"}
 *
 *   ·Alpha
 *
 *   Bravo
 *   ·Charlie.
 *
 *   *   Delta
 *       ·Echo.
 *
 *   > Foxtrot
 *   > ·Golf.
 *
 *   `hotel()`
 *   ·india.
 *
 *   -   `juliett()`
 *       ·kilo.
 *
 *   ·![lima]() mike
 *
 *   * november
 *   oscar
 *     ·papa.
 *
 * @example
 *   {"name": "not-ok.md", "label": "output"}
 *
 *   1:2: Expected no indentation in paragraph content
 *   4:2: Expected no indentation in paragraph content
 *   7:6: Expected no indentation in paragraph content
 *   10:4: Expected no indentation in paragraph content
 *   13:2: Expected no indentation in paragraph content
 *   16:6: Expected no indentation in paragraph content
 *   18:2: Expected no indentation in paragraph content
 *   22:4: Expected no indentation in paragraph content
 */

/**
 * @typedef {import('mdast').Root} Root
 */

import {lintRule} from 'unified-lint-rule'
import {visit, SKIP} from 'unist-util-visit'
import {pointStart, pointEnd} from 'unist-util-position'
import {location} from 'vfile-location'

const remarkLintNoParagraphContentIndent = lintRule(
  {
    origin: 'remark-lint:no-paragraph-content-indent',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-no-paragraph-content-indent#readme'
  },
  /** @type {import('unified-lint-rule').Rule<Root, void>} */
  (tree, file) => {
    const value = String(file)
    const loc = location(value)

    visit(tree, 'paragraph', (node, _, parent) => {
      const end = pointEnd(node).line
      let line = pointStart(node).line
      let column = 0

      if (parent && parent.type === 'root') {
        column = 1
      } else if (parent && parent.type === 'blockquote') {
        column = pointStart(parent).column + 2
      } else if (parent && parent.type === 'listItem') {
        column = pointStart(parent.children[0]).column

        // Skip past the first line if we’re the first child of a list item.
        if (parent.children[0] === node) {
          line++
        }
      }

      // In a parent we don’t know, exit.
      if (!column || !line) {
        return
      }

      while (line <= end) {
        let offset = loc.toOffset({line, column})
        const lineColumn = offset

        while (/[ \t]/.test(value.charAt(offset - 1))) {
          offset--
        }

        // Exit if we find some other content before this line.
        // This might be because the paragraph line is lazy, which isn’t this
        // rule.
        if (!offset || /[\r\n>]/.test(value.charAt(offset - 1))) {
          offset = lineColumn

          while (/[ \t]/.test(value.charAt(offset))) {
            offset++
          }

          if (lineColumn !== offset) {
            file.message(
              'Expected no indentation in paragraph content',
              loc.toPoint(offset)
            )
          }
        }

        line++
      }

      return SKIP
    })
  }
)

export default remarkLintNoParagraphContentIndent

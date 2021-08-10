/**
 * @author Titus Wormer
 * @copyright 2017 Titus Wormer
 * @license MIT
 * @module no-paragraph-content-indent
 * @fileoverview
 *   Warn when the content in paragraphs is indented.
 *
 * @example {"name": "ok.md"}
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
 * @example {"name": "not-ok.md", "label": "input"}
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
 * @example {"name": "not-ok.md", "label": "output"}
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

import {lintRule} from 'unified-lint-rule'
import {visit, SKIP} from 'unist-util-visit'
import {pointStart, pointEnd} from 'unist-util-position'
import {location} from 'vfile-location'

const remarkLintNoParagraphContentIndent = lintRule(
  'remark-lint:no-paragraph-content-indent',
  noParagraphContentIndent
)

export default remarkLintNoParagraphContentIndent

var reason = 'Expected no indentation in paragraph content'

function noParagraphContentIndent(tree, file) {
  var content = String(file)
  var loc = location(content)

  visit(tree, 'paragraph', visitor)

  function visitor(node, _, parent) {
    var line = pointStart(node).line
    var end = pointEnd(node).line
    var column
    var offset
    var lineColumn

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
      offset = loc.toOffset({line: line, column: column})
      lineColumn = offset

      while (/[ \t]/.test(content.charAt(offset - 1))) {
        offset--
      }

      // Exit if we find some other content before this line.
      // This might be because the paragraph line is lazy, which isn’t this
      // rule.
      if (!offset || /[\r\n>]/.test(content.charAt(offset - 1))) {
        offset = lineColumn

        while (/[ \t]/.test(content.charAt(offset))) {
          offset++
        }

        if (lineColumn !== offset) {
          file.message(reason, loc.toPoint(offset))
        }
      }

      line++
    }

    return SKIP
  }
}

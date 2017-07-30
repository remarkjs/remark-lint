/**
 * @author Titus Wormer
 * @copyright 2017 Titus Wormer
 * @license MIT
 * @module no-paragraph-content-indent
 * @fileoverview
 *   Warn when warn when the content in paragraphs are indented.
 *
 * @example {"name": "valid.md"}
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
 * @example {"name": "invalid.md", "label": "input"}
 *
 *   <!--Note: `·` represents ` `-->
 *
 *   ·Alpha
 *
 *   Bravo
 *   ·Charlie.
 *   **·Delta**.
 *
 *   *   Echo
 *       ·Foxtrot.
 *
 *   > Golf
 *   > ·Hotel.
 *
 *   `india()`
 *   ·juliett.
 *
 *   -   `kilo()`
 *       ·lima.
 *
 *   ![ image]() text
 *
 *   ![ image reference][] text
 *
 * @example {"name": "invalid.md", "label": "output"}
 *
 *   3:1: Expected no indentation in paragraph content
 *   6:1: Expected no indentation in paragraph content
 *   7:3: Expected no indentation in paragraph content
 *   10:5: Expected no indentation in paragraph content
 *   13:3: Expected no indentation in paragraph content
 *   16:1: Expected no indentation in paragraph content
 *   19:5: Expected no indentation in paragraph content
 *   21:1: Expected no indentation in paragraph content
 *   23:1: Expected no indentation in paragraph content
 */

'use strict';

var rule = require('unified-lint-rule');
var visit = require('unist-util-visit');
var position = require('unist-util-position');

module.exports = rule('remark-lint:no-paragraph-content-indent', noParagraphContentIndent);

var message = 'Expected no indentation in paragraph content';

function noParagraphContentIndent(tree, file) {
  visit(tree, 'paragraph', visitor);

  function visitor(node) {
    var first = true;

    visit(node, check);

    function check(node, pos, parent) {
      var start = position.start(node);
      var value;
      var index;
      var line;
      var cumulative;
      var indent;

      if (!applicable(node)) {
        return;
      }

      if (!start.line || !node.position.indent) {
        first = false;
        return;
      }

      if (first === true && ws(toString(node).charAt(0))) {
        file.message(message, node.position.start);
      }

      first = false;
      value = toString(node);
      index = value.indexOf('\n');
      line = 0;
      cumulative = 0;
      indent = node.position.indent;

      while (index !== -1) {
        cumulative += indent[line];

        if (ws(value.charAt(index + 1))) {
          file.message(
            message,
            {
              line: start.line + line + 1,
              column: indent[line],
              offset: start.offset + index + cumulative
            }
          );
        }

        index = value.indexOf('\n', index + 1);
        line++;
      }

      if (value.charAt(value.length - 1) === '\n') {
        node = head(parent.children[pos + 1]);

        if (node && ws(toString(node).charAt(0))) {
          file.message(message, node.position.start);
        }
      }
    }
  }
}

function ws(character) {
  return character === ' ' || character === '\t';
}

function head(node) {
  while (node && 'children' in node) {
    node = node.children[0];
  }

  /* istanbul ignore if - shouldn’t happen by default, could happen for void
   * nodes though. */
  if (!node || !applicable(node)) {
    return null;
  }

  return node;
}

function applicable(node) {
  return 'value' in node || 'alt' in node;
}

function toString(node) {
  return 'value' in node ? node.value : node.alt;
}

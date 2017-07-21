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
 * @example {"name": "invalid.md", "label": "output"}
 *
 *   3:1: Expected no indentation in paragraph content
 *   6:1: Expected no indentation in paragraph content
 *   7:3: Expected no indentation in paragraph content
 *   10:5: Expected no indentation in paragraph content
 *   13:3: Expected no indentation in paragraph content
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
    var prev;

    visit(node, 'text', check);

    function check(node) {
      var value = node.value;
      var start = position.start(node);
      var offset = start.column;
      var index = value.indexOf('\n');
      var line = 0;
      var cumulative = 0;
      var indent;

      if (!start.line || !node.position.indent) {
        return;
      }

      if (
        (
          prev === undefined ||
          (prev && prev.value.charAt(prev.value.length - 1) === '\n')
        ) &&
        ws(value.charAt(0))
      ) {
        file.message(message, start);
      }

      prev = node;
      indent = node.position.indent;

      while (index !== -1) {
        cumulative += indent[line];

        if (ws(value.charAt(index + 1))) {
          file.message(
            message,
            {
              line: start.line + line + 1,
              column: offset,
              offset: start.offset + index + cumulative
            }
          );
        }

        index = value.indexOf('\n', index + 1);
        offset = indent[line];
        line++;
      }
    }
  }
}

function ws(character) {
  return character === ' ' || character === '\t';
}

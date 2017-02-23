/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module first-heading-level
 * @fileoverview
 *   Warn when the first heading has a level other than a specified value.
 *
 *   Options: `number`, default: `1`.
 *
 * @example {"name": "valid.md"}
 *
 *   # The default is to expect a level one heading
 *
 * @example {"name": "invalid.md", "label": "input"}
 *
 *   <!-- Also invalid by default. -->
 *
 *   ## Bravo
 *
 *   Paragraph.
 *
 * @example {"name": "invalid.md", "label": "output"}
 *
 *   3:1-3:9: First heading level should be `1`
 *
 * @example {"name": "valid.md", "setting": 2}
 *
 *   ## Bravo
 *
 *   Paragraph.
 *
 * @example {"name": "invalid.md", "setting": 2, "label": "input"}
 *
 *   # Bravo
 *
 *   Paragraph.
 *
 * @example {"name": "invalid.md", "setting": 2, "label": "output"}
 *
 *   1:1-1:8: First heading level should be `2`
 */

'use strict';

var rule = require('unified-lint-rule');
var visit = require('unist-util-visit');
var generated = require('unist-util-generated');

module.exports = rule('remark-lint:first-heading-level', firstHeadingLevel);

function firstHeadingLevel(ast, file, preferred) {
  var style = preferred && preferred !== true ? preferred : 1;

  visit(ast, 'heading', visitor);

  function visitor(node) {
    if (generated(node)) {
      return;
    }

    if (node.depth !== style) {
      file.message('First heading level should be `' + style + '`', node);
    }

    return false;
  }
}

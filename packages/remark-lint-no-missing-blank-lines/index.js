/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module no-missing-blank-lines
 * @fileoverview
 *   Warn when missing blank lines before a block node.
 *
 *   This rule can be configured to allow tight list items without blank lines
 *   between their contents by passing `{exceptTightLists: true}` (default:
 *   `false`).
 *
 *   ## Fix
 *
 *   [`remark-stringify`](https://github.com/wooorm/remark/tree/master/packages/remark-stringify)
 *   always uses one blank line between blocks if possible, or two lines when
 *   needed. The style of the list-items persists.
 *
 *   See [Using remark to fix your markdown](https://github.com/wooorm/remark-lint/tree/formatting#using-remark-to-fix-your-markdown)
 *   on how to automatically fix warnings for this rule.
 *
 * @example {"name": "valid.md"}
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
 * @example {"name": "invalid.md", "label": "input"}
 *
 *   # Foo
 *   ## Bar
 *
 *   - Paragraph
 *     + List.
 *
 *   Paragraph.
 *
 * @example {"name": "invalid.md", "label": "output"}
 *
 *   2:1-2:7: Missing blank line before block node
 *   5:3-5:10: Missing blank line before block node
 *
 * @example {"name": "tight.md", "setting": {"exceptTightLists": true}, "label": "input"}
 *
 *   # Foo
 *   ## Bar
 *
 *   - Paragraph
 *     + List.
 *
 *   Paragraph.
 *
 * @example {"name": "tight.md", "setting": {"exceptTightLists": true}, "label": "output"}
 *
 *   2:1-2:7: Missing blank line before block node
 */

'use strict';

var rule = require('unified-lint-rule');
var visit = require('unist-util-visit');
var position = require('unist-util-position');
var generated = require('unist-util-generated');

module.exports = rule('remark-lint:no-missing-blank-lines', noMissingBlankLines);

function noMissingBlankLines(ast, file, options) {
  var allow = (options || {}).exceptTightLists;

  visit(ast, visitor);

  function visitor(node, index, parent) {
    var next = parent && parent.children[index + 1];

    if (generated(node)) {
      return;
    }

    if (allow && parent && parent.type === 'listItem') {
      return;
    }

    if (
      next &&
      applicable(node) &&
      applicable(next) &&
      position.start(next).line === position.end(node).line + 1
    ) {
      file.message('Missing blank line before block node', next);
    }
  }
}

function applicable(node) {
  return [
    'paragraph',
    'blockquote',
    'heading',
    'code',
    'yaml',
    'html',
    'list',
    'table',
    'thematicBreak'
  ].indexOf(node.type) !== -1;
}

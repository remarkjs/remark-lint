/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module no-shortcut-reference-link
 * @fileoverview
 *   Warn when shortcut reference links are used.
 *
 *   Shortcut references render as links when a definition is found, and as
 *   plain text without definition.  Sometimes, you don’t intend to create a
 *   link from the reference, but this rule still warns anyway.  In that case,
 *   you can escape the reference like so: `\[foo]`.
 *
 * @example {"name": "valid.md"}
 *
 *   [foo][]
 *
 *   [foo]: http://foo.bar/baz
 *
 * @example {"name": "invalid.md", "label": "input"}
 *
 *   [foo]
 *
 *   [foo]: http://foo.bar/baz
 *
 * @example {"name": "invalid.md", "label": "output"}
 *
 *   1:1-1:6: Use the trailing [] on reference links
 */

'use strict';

var rule = require('unified-lint-rule');
var visit = require('unist-util-visit');
var generated = require('unist-util-generated');

module.exports = rule('remark-lint:no-shortcut-reference-link', noShortcutReferenceLink);

function noShortcutReferenceLink(ast, file) {
  visit(ast, 'linkReference', visitor);

  function visitor(node) {
    if (generated(node)) {
      return;
    }

    if (node.referenceType === 'shortcut') {
      file.message('Use the trailing [] on reference links', node);
    }
  }
}

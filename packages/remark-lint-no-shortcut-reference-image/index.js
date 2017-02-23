/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module no-shortcut-reference-image
 * @fileoverview
 *   Warn when shortcut reference images are used.
 *
 * @example {"name": "valid.md"}
 *
 *   ![foo][]
 *
 *   [foo]: http://foo.bar/baz.png
 *
 * @example {"name": "invalid.md", "label": "input"}
 *
 *   ![foo]
 *
 *   [foo]: http://foo.bar/baz.png
 *
 * @example {"name": "invalid.md", "label": "output"}
 *
 *   1:1-1:7: Use the trailing [] on reference images
 */

'use strict';

var rule = require('unified-lint-rule');
var visit = require('unist-util-visit');
var generated = require('unist-util-generated');

module.exports = rule('remark-lint:no-shortcut-reference-image', noShortcutReferenceImage);

function noShortcutReferenceImage(ast, file) {
  visit(ast, 'imageReference', visitor);

  function visitor(node) {
    if (generated(node)) {
      return;
    }

    if (node.referenceType === 'shortcut') {
      file.message('Use the trailing [] on reference images', node);
    }
  }
}

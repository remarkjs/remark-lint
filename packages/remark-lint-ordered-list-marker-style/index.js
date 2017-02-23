/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module ordered-list-marker-style
 * @fileoverview
 *   Warn when the list-item marker style of ordered lists violate a given
 *   style.
 *
 *   Options: `string`, either `'consistent'`, `'.'`, or `')'`,
 *   default: `'consistent'`.
 *
 *   Note that `)` is only supported in CommonMark.
 *
 *   The default value, `consistent`, detects the first used list
 *   style, and will warn when a subsequent list uses a different
 *   style.
 *
 * @example {"name": "valid.md"}
 *
 *   By default (`consistent`), if one style used throughout the file,
 *   that’s OK.
 *
 *   1.  Foo
 *
 *
 *   1.  Bar
 *
 *   Unordered lists are not affected by this rule.
 *
 *   * Foo
 *
 * @example {"name": "valid.md", "setting": "."}
 *
 *   1.  Foo
 *
 *   2.  Bar
 *
 * @example {"name": "valid.md", "setting": ")", "config": {"commonmark": true}}
 *
 *   <!-- This is also valid when `consistent`.
 *        But it does require commonmark. -->
 *
 *   1)  Foo
 *
 *   2)  Bar
 *
 * @example {"name": "invalid.md", "label": "input", "config": {"commonmark": true}}
 *
 *   1.  Foo
 *
 *   2)  Bar
 *
 * @example {"name": "invalid.md", "label": "output"}
 *
 *   3:1-3:8: Marker style should be `.`
 *
 * @example {"name": "invalid.md", "label": "output", "setting": "!", "config": {"positionless": true}}
 *
 *   1:1: Invalid ordered list-item marker style `!`: use either `'.'` or `')'`
 */

'use strict';

var rule = require('unified-lint-rule');
var visit = require('unist-util-visit');
var position = require('unist-util-position');
var generated = require('unist-util-generated');

module.exports = rule('remark-lint:ordered-list-marker-style', orderedListMarkerStyle);

var start = position.start;

var STYLES = {
  ')': true,
  '.': true,
  null: true
};

function orderedListMarkerStyle(ast, file, preferred) {
  var contents = file.toString();

  preferred = typeof preferred !== 'string' || preferred === 'consistent' ? null : preferred;

  if (STYLES[preferred] !== true) {
    file.fail('Invalid ordered list-item marker style `' + preferred + '`: use either `\'.\'` or `\')\'`');
  }

  visit(ast, 'list', visitor);

  function visitor(node) {
    var items = node.children;

    if (!node.ordered) {
      return;
    }

    items.forEach(each);

    function each(item) {
      var head = item.children[0];
      var initial = start(item).offset;
      var final = start(head).offset;
      var marker;

      if (generated(item)) {
        return;
      }

      marker = contents.slice(initial, final).replace(/\s|\d/g, '');

      /* Support checkboxes. */
      marker = marker.replace(/\[[x ]?]\s*$/i, '');

      if (!preferred) {
        preferred = marker;
      } else if (marker !== preferred) {
        file.message('Marker style should be `' + preferred + '`', item);
      }
    }
  }
}

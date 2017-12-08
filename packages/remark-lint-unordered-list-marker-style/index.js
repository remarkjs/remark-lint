/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module unordered-list-marker-style
 * @fileoverview
 *   Warn when the list-item marker style of unordered lists violate a given
 *   style.
 *
 *   Options: `'consistent'`, `'-'`, `'*'`, or `'*'`, default: `'consistent'`.
 *
 *   `'consistent'` detects the first used list style and warns when subsequent
 *   lists use different styles.
 *
 *   ## Fix
 *
 *   [`remark-stringify`](https://github.com/remarkjs/remark/tree/master/packages/remark-stringify)
 *   formats unordered lists using a hyphen-minus (`-`) by default. Pass
 *   [`bullet: '*'` or `bullet: '+'`](https://github.com/remarkjs/remark/tree/master/packages/remark-stringify#optionsbullet)
 *   to use asterisks or plusses instead.
 *
 *   See [Using remark to fix your markdown](https://github.com/remarkjs/remark-lint/tree/formatting#using-remark-to-fix-your-markdown)
 *   on how to automatically fix warnings for this rule.
 *
 * @example {"name": "valid.md"}
 *
 *   By default (`'consistent'`), if the file uses only one marker,
 *   that’s OK.
 *
 *   * Foo
 *   * Bar
 *   * Baz
 *
 *   Ordered lists are not affected.
 *
 *   1. Foo
 *   2. Bar
 *   3. Baz
 *
 * @example {"name": "valid.md", "setting": "*"}
 *
 *   * Foo
 *
 * @example {"name": "valid.md", "setting": "-"}
 *
 *   - Foo
 *
 * @example {"name": "valid.md", "setting": "+"}
 *
 *   + Foo
 *
 * @example {"name": "invalid.md", "label": "input"}
 *
 *   * Foo
 *   - Bar
 *   + Baz
 *
 * @example {"name": "invalid.md", "label": "output"}
 *
 *   2:1-2:6: Marker style should be `*`
 *   3:1-3:6: Marker style should be `*`
 *
 * @example {"name": "invalid.md", "label": "output", "setting": "!", "config": {"positionless": true}}
 *
 *   1:1: Invalid unordered list-item marker style `!`: use either `'-'`, `'*'`, or `'+'`
 */

'use strict';

var rule = require('unified-lint-rule');
var visit = require('unist-util-visit');
var position = require('unist-util-position');
var generated = require('unist-util-generated');

module.exports = rule('remark-lint:unordered-list-marker-style', unorderedListMarkerStyle);

var start = position.start;

var STYLES = {
  '-': true,
  '*': true,
  '+': true,
  null: true
};

function unorderedListMarkerStyle(ast, file, preferred) {
  var contents = file.toString();

  preferred = typeof preferred !== 'string' || preferred === 'consistent' ? null : preferred;

  if (STYLES[preferred] !== true) {
    file.fail('Invalid unordered list-item marker style `' + preferred + '`: use either `\'-\'`, `\'*\'`, or `\'+\'`');
  }

  visit(ast, 'list', visitor);

  function visitor(node) {
    var items = node.children;

    if (node.ordered) {
      return;
    }

    items.forEach(visitItem);

    function visitItem(item) {
      var head = item.children[0];
      var initial = start(item).offset;
      var final = start(head).offset;
      var marker;

      if (generated(item)) {
        return;
      }

      marker = contents.slice(initial, final).replace(/\s/g, '');

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

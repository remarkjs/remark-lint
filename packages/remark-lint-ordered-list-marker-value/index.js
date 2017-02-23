/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module ordered-list-marker-value
 * @fileoverview
 *   Warn when the list-item marker values of ordered lists violate a
 *   given style.
 *
 *   Options: `string`, either `'single'`, `'one'`, or `'ordered'`,
 *   default: `'ordered'`.
 *
 *   When set to `'ordered'`, list-item bullets should increment by one,
 *   relative to the starting point.  When set to `'single'`, bullets should
 *   be the same as the relative starting point.  When set to `'one'`, bullets
 *   should always be `1`.
 *
 * @example {"name": "valid.md"}
 *
 *   The default value is `ordered`, so unless changed, the below
 *   is OK.
 *
 *   1.  Foo
 *   2.  Bar
 *   3.  Baz
 *
 *   Paragraph.
 *
 *   3.  Alpha
 *   4.  Bravo
 *   5.  Charlie
 *
 *   Unordered lists are not affected by this rule.
 *
 *   *   Anton
 *
 * @example {"name": "valid.md", "setting": "one"}
 *
 *   1.  Foo
 *   1.  Bar
 *   1.  Baz
 *
 *   Paragraph.
 *
 *   1.  Alpha
 *   1.  Bravo
 *   1.  Charlie
 *
 * @example {"name": "valid.md", "setting": "single"}
 *
 *   1.  Foo
 *   1.  Bar
 *   1.  Baz
 *
 *   Paragraph.
 *
 *   3.  Alpha
 *   3.  Bravo
 *   3.  Charlie
 *
 * @example {"name": "valid.md", "setting": "ordered"}
 *
 *   1.  Foo
 *   2.  Bar
 *   3.  Baz
 *
 *   Paragraph.
 *
 *   3.  Alpha
 *   4.  Bravo
 *   5.  Charlie
 *
 * @example {"name": "invalid.md", "setting": "one", "label": "input"}
 *
 *   1.  Foo
 *   2.  Bar
 *
 * @example {"name": "invalid.md", "setting": "one", "label": "output"}
 *
 *   2:1-2:8: Marker should be `1`, was `2`
 *
 * @example {"name": "invalid.md", "setting": "ordered", "label": "input"}
 *
 *   1.  Foo
 *   1.  Bar
 *
 * @example {"name": "invalid.md", "setting": "ordered", "label": "output"}
 *
 *   2:1-2:8: Marker should be `2`, was `1`
 *
 * @example {"name": "invalid.md", "setting": "invalid", "label": "output", "config": {"positionless": true}}
 *
 *   1:1: Invalid ordered list-item marker value `invalid`: use either `'ordered'` or `'one'`
 */

'use strict';

var rule = require('unified-lint-rule');
var visit = require('unist-util-visit');
var position = require('unist-util-position');
var generated = require('unist-util-generated');

module.exports = rule('remark-lint:ordered-list-marker-value', orderedListMarkerValue);

var start = position.start;

var STYLES = {
  ordered: true,
  single: true,
  one: true
};

function orderedListMarkerValue(ast, file, preferred) {
  var contents = file.toString();

  preferred = typeof preferred === 'string' ? preferred : 'ordered';

  if (STYLES[preferred] !== true) {
    file.fail('Invalid ordered list-item marker value `' + preferred + '`: use either `\'ordered\'` or `\'one\'`');
  }

  visit(ast, 'list', visitor);

  function visitor(node) {
    var items = node.children;
    var shouldBe = (preferred === 'one' ? 1 : node.start) || 1;

    /* Ignore unordered lists. */
    if (!node.ordered) {
      return;
    }

    items.forEach(each);

    function each(item, index) {
      var head = item.children[0];
      var initial = start(item).offset;
      var final = start(head).offset;
      var marker;

      /* Ignore first list item. */
      if (index === 0) {
        return;
      }

      /* Increase the expected line number when in
       * `ordered` mode. */
      if (preferred === 'ordered') {
        shouldBe++;
      }

      /* Ignore generated nodes. */
      if (generated(item)) {
        return;
      }

      marker = contents.slice(initial, final).replace(/[\s.)]/g, '');

      /* Support checkboxes. */
      marker = Number(marker.replace(/\[[x ]?]\s*$/i, ''));

      if (marker !== shouldBe) {
        file.message('Marker should be `' + shouldBe + '`, was `' + marker + '`', item);
      }
    }
  }
}

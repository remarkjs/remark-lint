/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module no-duplicate-headings-in-section
 * @fileoverview
 *   Warn when duplicate headings are found,
 *   but only when on the same level, “in”
 *   the same section.
 *
 * @example {"name": "valid.md"}
 *
 *   ## Alpha
 *
 *   ### Bravo
 *
 *   ## Charlie
 *
 *   ### Bravo
 *
 *   ### Delta
 *
 *   #### Bravo
 *
 *   #### Echo
 *
 *   ##### Bravo
 *
 * @example {"name": "invalid.md", "label": "input"}
 *
 *   ## Foxtrot
 *
 *   ### Golf
 *
 *   ### Golf
 *
 * @example {"name": "invalid.md", "label": "output"}
 *
 *   5:1-5:9: Do not use headings with similar content per section (3:1)
 */

'use strict';

/* Dependencies. */
var position = require('unist-util-position');
var visit = require('unist-util-visit');
var toString = require('mdast-util-to-string');

/* Expose. */
module.exports = noDuplicateHeadingsInSection;

/* Warn when headings with equal content are found in
 * a section.  Case-insensitive. */
function noDuplicateHeadingsInSection(tree, file) {
  var stack = [{}];

  visit(tree, 'heading', function (node) {
    var depth = node.depth;
    var siblings = stack[depth - 1] || {};
    var value = toString(node).toUpperCase();
    var duplicate = siblings[value];
    var pos;

    stack = stack.slice(0, depth);
    stack[depth] = {};
    siblings[value] = node;

    if (!position.generated(node) && duplicate && duplicate.type === 'heading') {
      pos = position.start(duplicate);
      file.message(
        'Do not use headings with similar content per section (' +
        pos.line + ':' + pos.column + ')',
        node
      );
    }
  });
}

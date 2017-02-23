/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module fenced-code-marker
 * @fileoverview
 *   Warn for violating fenced code markers.
 *
 *   Options: `string`, either `` '`' ``, or `'~'`, default: `'consistent'`.
 *
 *   The default value, `consistent`, detects the first used fenced code
 *   marker style, and will warn when a subsequent fenced code uses a
 *   different style.
 *
 * @example {"name": "valid.md"}
 *
 *   Indented code blocks are not affected by this rule:
 *
 *       bravo();
 *
 * @example {"name": "valid.md", "setting": "`"}
 *
 *   <!-- This is also valid by default. -->
 *
 *   ```alpha
 *   bravo();
 *   ```
 *
 *   ```
 *   charlie();
 *   ```
 *
 * @example {"name": "valid.md", "setting": "~"}
 *
 *   <!-- This is also valid by default. -->
 *
 *   ~~~alpha
 *   bravo();
 *   ~~~
 *
 *   ~~~
 *   charlie();
 *   ~~~
 *
 * @example {"name": "invalid.md", "label": "input"}
 *
 *   <!-- This is always invalid. -->
 *
 *   ```alpha
 *   bravo();
 *   ```
 *
 *   ~~~
 *   charlie();
 *   ~~~
 *
 * @example {"name": "invalid.md", "label": "output"}
 *
 *   7:1-9:4: Fenced code should use ` as a marker
 *
 * @example {"name": "invalid.md", "setting": "!", "label": "output", "config": {"positionless": true}}
 *
 *   1:1: Invalid fenced code marker `!`: use either `'consistent'`, `` '`' ``, or `'~'`
 */

'use strict';

var rule = require('unified-lint-rule');
var visit = require('unist-util-visit');
var position = require('unist-util-position');
var generated = require('unist-util-generated');

module.exports = rule('remark-lint:fenced-code-marker', fencedCodeMarker);

var MARKERS = {
  '`': true,
  '~': true,
  null: true
};

function fencedCodeMarker(ast, file, preferred) {
  var contents = file.toString();

  preferred = typeof preferred !== 'string' || preferred === 'consistent' ? null : preferred;

  if (MARKERS[preferred] !== true) {
    file.fail('Invalid fenced code marker `' + preferred + '`: use either `\'consistent\'`, `` \'`\' ``, or `\'~\'`');
  }

  visit(ast, 'code', visitor);

  function visitor(node) {
    var marker = contents.substr(position.start(node).offset, 4);

    if (generated(node)) {
      return;
    }

    marker = marker.trimLeft().charAt(0);

    /* Ignore unfenced code blocks. */
    if (MARKERS[marker] !== true) {
      return;
    }

    if (preferred) {
      if (marker !== preferred) {
        file.message('Fenced code should use ' + preferred + ' as a marker', node);
      }
    } else {
      preferred = marker;
    }
  }
}

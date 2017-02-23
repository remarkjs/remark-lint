/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module link-title-style
 * @fileoverview
 *   Warn when link and definition titles occur with incorrect quotes.
 *
 *   Options: `string`, either `'consistent'`, `'"'`, `'\''`, or
 *   `'()'`, default: `'consistent'`.
 *
 *   The default value, `consistent`, detects the first used quote
 *   style, and will warn when a subsequent titles use a different
 *   style.
 *
 * @example {"name": "valid.md", "setting": "\""}
 *
 *   <!--Also valid when `consistent`-->
 *
 *   [Example](http://example.com "Example Domain")
 *   [Example](http://example.com "Example Domain")
 *
 * @example {"name": "valid.md", "setting": "'"}
 *
 *   <!--Also valid when `consistent`-->
 *
 *   ![Example](http://example.com/image.png 'Example Domain')
 *   ![Example](http://example.com/image.png 'Example Domain')
 *
 * @example {"name": "valid.md", "setting": "()"}
 *
 *   <!--Also valid when `consistent`-->
 *
 *   [Example](http://example.com (Example Domain) )
 *   [Example](http://example.com (Example Domain) )
 *
 * @example {"name": "invalid.md", "label": "input", "setting": "\""}
 *
 *   [Example]: http://example.com 'Example Domain'
 *
 * @example {"name": "invalid.md", "label": "output", "setting": "\""}
 *
 *   1:47: Titles should use `"` as a quote
 *
 * @example {"name": "invalid.md", "label": "input"}
 *
 *   <!--Always invalid-->
 *
 *   [Example](http://example.com "Example Domain")
 *   [Example](http://example.com#without-title)
 *   [Example](http://example.com 'Example Domain')
 *
 * @example {"name": "invalid.md", "label": "output"}
 *
 *   5:46: Titles should use `"` as a quote
 *
 * @example {"name": "invalid.md", "label": "input", "setting": "()"}
 *
 *   <!--Always invalid-->
 *
 *   [Example](http://example.com (Example Domain))
 *   [Example](http://example.com 'Example Domain')
 *
 * @example {"name": "invalid.md", "label": "output", "setting": "()"}
 *
 *   4:46: Titles should use `()` as a quote
 *
 * @example {"name": "invalid.md", "setting": ".", "label": "output", "config": {"positionless": true}}
 *
 *   1:1: Invalid link title style marker `.`: use either `'consistent'`, `'"'`, `'\''`, or `'()'`
 */

'use strict';

var rule = require('unified-lint-rule');
var vfileLocation = require('vfile-location');
var visit = require('unist-util-visit');
var position = require('unist-util-position');
var generated = require('unist-util-generated');

module.exports = rule('remark-lint:link-title-style', linkTitleStyle);

var end = position.end;

var MARKERS = {
  '"': true,
  '\'': true,
  ')': true,
  null: true
};

function linkTitleStyle(ast, file, preferred) {
  var contents = file.toString();
  var location = vfileLocation(file);

  preferred = typeof preferred !== 'string' || preferred === 'consistent' ? null : preferred;

  if (preferred === '()' || preferred === '(') {
    preferred = ')';
  }

  if (MARKERS[preferred] !== true) {
    file.fail('Invalid link title style marker `' + preferred + '`: use either `\'consistent\'`, `\'"\'`, `\'\\\'\'`, or `\'()\'`');
  }

  visit(ast, 'link', validate);
  visit(ast, 'image', validate);
  visit(ast, 'definition', validate);

  return;

  function validate(node) {
    var last = end(node).offset - 1;
    var character;
    var pos;

    if (generated(node)) {
      return;
    }

    if (node.type !== 'definition') {
      last--;
    }

    while (last) {
      character = contents.charAt(last);

      if (/\s/.test(character)) {
        last--;
      } else {
        break;
      }
    }

    /* Not a title. */
    if (!(character in MARKERS)) {
      return;
    }

    if (!preferred) {
      preferred = character;
    } else if (preferred !== character) {
      pos = location.toPosition(last + 1);
      file.message('Titles should use `' + (preferred === ')' ? '()' : preferred) + '` as a quote', pos);
    }
  }
}

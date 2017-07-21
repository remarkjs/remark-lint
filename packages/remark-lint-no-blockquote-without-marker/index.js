/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module no-blockquote-without-marker
 * @fileoverview
 *   Warn when blank lines without markers (`>`) are found in a blockquote.
 *
 * @example {"name": "valid.md"}
 *
 *   > Foo...
 *   >
 *   > ...Bar.
 *
 * @example {"name": "invalid.md", "label": "input"}
 *
 *   > Foo...
 *
 *   > ...Bar.
 *
 * @example {"name": "invalid.md", "label": "output"}
 *
 *   2:1: Missing marker in blockquote
 */

'use strict';

var rule = require('unified-lint-rule');
var vfileLocation = require('vfile-location');
var visit = require('unist-util-visit');
var position = require('unist-util-position');
var generated = require('unist-util-generated');

module.exports = rule('remark-lint:no-blockquote-without-marker', noBlockquoteWithoutMarker);

function noBlockquoteWithoutMarker(ast, file) {
  var contents = file.toString();
  var location = vfileLocation(file);
  var last = contents.length;

  visit(ast, 'blockquote', visitor);

  function visitor(node) {
    var start = position.start(node).line;
    var indent = node.position && node.position.indent;

    if (generated(node) || !indent || indent.length === 0) {
      return;
    }

    indent.forEach(eachLine);

    function eachLine(column, n) {
      var character;
      var line = start + n + 1;
      var offset = location.toOffset({
        line: line,
        column: column
      }) - 1;

      while (++offset < last) {
        character = contents.charAt(offset);

        if (character === '>') {
          return;
        }

        /* istanbul ignore else - just for safety */
        if (character !== ' ' && character !== '\t') {
          break;
        }
      }

      file.message('Missing marker in blockquote', {
        line: line,
        column: column
      });
    }
  }
}

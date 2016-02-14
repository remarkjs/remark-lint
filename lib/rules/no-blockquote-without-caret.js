/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module no-blockquote-without-caret
 * @fileoverview
 *   Warn when blank lines without carets are found in a blockquote.
 * @example
 *   <!-- Valid: -->
 *   > Foo...
 *   >
 *   > ...Bar.
 *
 *   <!-- Invalid: -->
 *   > Foo...
 *
 *   > ...Bar.
 */

'use strict';

/* eslint-env commonjs */

/*
 * Dependencies.
 */

var vfileLocation = require('vfile-location');
var visit = require('unist-util-visit');
var position = require('mdast-util-position');

/**
 * Warn when blank lines without carets are found in a
 * blockquote.
 *
 * @param {Node} ast - Root node.
 * @param {File} file - Virtual file.
 * @param {*} preferred - Ignored.
 * @param {Function} done - Callback.
 */
function noBlockquoteWithoutCaret(ast, file, preferred, done) {
    var contents = file.toString();
    var location = vfileLocation(file);
    var last = contents.length;

    visit(ast, 'blockquote', function (node) {
        var start = position.start(node).line;
        var indent = node.position && node.position.indent;

        if (position.generated(node) || !indent || !indent.length) {
            return;
        }

        indent.forEach(function (column, n) {
            var character;
            var line = start + n + 1;
            var offset = location.toOffset({
                'line': line,
                'column': column
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

            file.warn('Missing caret in blockquote', {
                'line': line,
                'column': column
            });
        });
    });

    done();
}

/*
 * Expose.
 */

module.exports = noBlockquoteWithoutCaret;

/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module no-heading-indent
 * @fileoverview
 *   Warn when a heading is indented.
 * @example
 *   <!-- Note: the middle-dots represent spaces -->
 *   <!-- Invalid: -->
 *   ···# Hello world
 *
 *   ·Foo
 *   -----
 *
 *   ·# Hello world #
 *
 *   ···Bar
 *   =====
 *
 *   <!-- Valid: -->
 *   # Hello world
 *
 *   Foo
 *   -----
 *
 *   # Hello world #
 *
 *   Bar
 *   =====
 */

'use strict';

/* eslint-env commonjs */

/*
 * Dependencies.
 */

var visit = require('unist-util-visit');
var plural = require('plur');
var position = require('mdast-util-position');

/*
 * Methods.
 */

var start = position.start;

/**
 * Warn when a heading has too much space before the
 * initial hashes.
 *
 * @param {Node} ast - Root node.
 * @param {File} file - Virtual file.
 * @param {*} preferred - Ignored.
 * @param {Function} done - Callback.
 */
function noHeadingIndent(ast, file, preferred, done) {
    var contents = file.toString();
    var length = contents.length;

    visit(ast, 'heading', function (node) {
        var initial = start(node);
        var begin = initial.offset;
        var index = begin - 1;
        var character;
        var diff;

        if (position.generated(node)) {
            return;
        }

        while (++index < length) {
            character = contents.charAt(index);

            if (character !== ' ' && character !== '\t') {
                break;
            }
        }

        diff = index - begin;

        if (diff) {
            file.warn(
                'Remove ' + diff + ' ' + plural('space', diff) +
                ' before this heading',
                {
                    'line': initial.line,
                    'column': initial.column + diff
                }
            );
        }
    });

    done();
}

/*
 * Expose.
 */

module.exports = noHeadingIndent;

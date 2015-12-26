/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module no-heading-content-indent
 * @fileoverview
 *   Warn when a heading’s content is indented.
 * @example
 *   <!-- Note: the middle-dots represent spaces -->
 *   <!-- Invalid: -->
 *   #··Foo
 *
 *   ## Bar··##
 *
 *     ##··Baz
 *
 *   <!-- Valid: -->
 *   #·Foo
 *
 *   ## Bar·##
 *
 *     ##·Baz
 */

'use strict';

/* eslint-env commonjs */

/*
 * Dependencies.
 */

var visit = require('unist-util-visit');
var style = require('mdast-util-heading-style');
var plural = require('plur');
var position = require('mdast-util-position');

/*
 * Methods.
 */

var start = position.start;
var end = position.end;

/**
 * Warn when a (closed) ATX-heading has too much space
 * between the initial hashes and the content, or the
 * content and the final hashes.
 *
 * @param {Node} ast - Root node.
 * @param {File} file - Virtual file.
 * @param {*} preferred - Ignored.
 * @param {Function} done - Callback.
 */
function noHeadingContentIndent(ast, file, preferred, done) {
    var contents = file.toString();

    visit(ast, 'heading', function (node) {
        var depth = node.depth;
        var children = node.children;
        var type = style(node, 'atx');
        var initial;
        var final;
        var diff;
        var word;
        var index;

        if (position.generated(node)) {
            return;
        }

        if (type === 'atx' || type === 'atx-closed') {
            initial = start(node);
            index = initial.offset;

            while (contents.charAt(index) !== '#') {
                index++;
            }

            index = depth + (index - initial.offset);
            diff = start(children[0]).column - initial.column - 1 - index;

            if (diff) {
                word = diff > 0 ? 'Remove' : 'Add';
                diff = Math.abs(diff);

                file.warn(
                    word + ' ' + diff + ' ' + plural('space', diff) +
                    ' before this heading’s content',
                    start(children[0])
                );
            }
        }

        /*
         * Closed ATX-heading always must have a space
         * between their content and the final hashes,
         * thus, there is no `add x spaces`.
         */

        if (type === 'atx-closed') {
            final = end(children[children.length - 1]);
            diff = end(node).column - final.column - 1 - depth;

            if (diff) {
                file.warn(
                    'Remove ' + diff + ' ' + plural('space', diff) +
                    ' after this heading’s content',
                    final
                );
            }
        }
    });

    done();
}

/*
 * Expose.
 */

module.exports = noHeadingContentIndent;

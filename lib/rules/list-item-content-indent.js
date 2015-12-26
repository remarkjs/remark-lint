/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module list-item-content-indent
 * @fileoverview
 *   Warn when the content of a list item has mixed indentation.
 * @example
 *   <!-- Valid -->
 *   *   List item
 *
 *       *   Nested list item indented by 4 spaces
 *
 *   <!-- Invalid -->
 *   *   List item
 *
 *      *   Nested list item indented by 3 spaces
 */

'use strict';

/* eslint-env commonjs */

/*
 * Dependencies.
 */

var visit = require('unist-util-visit');
var position = require('mdast-util-position');
var plural = require('plur');

/*
 * Methods.
 */

var start = position.start;

/**
 * Warn when the content of a list item has mixed
 * indentation.
 *
 * @param {Node} ast - Root node.
 * @param {File} file - Virtual file.
 * @param {*} preferred - Ignored.
 * @param {Function} done - Callback.
 */
function listItemContentIndent(ast, file, preferred, done) {
    var contents = file.toString();

    visit(ast, 'listItem', function (node) {
        var style;

        node.children.forEach(function (item, index) {
            var begin = start(item);
            var column = begin.column;
            var char;
            var diff;
            var word;

            if (position.generated(item)) {
                return;
            }

            /*
             * Get indentation for the first child.
             * Only the first item can have a checkbox,
             * so here we remove that from the column.
             */

            if (index === 0) {
                if (Boolean(node.checked) === node.checked) {
                    char = begin.offset;

                    while (contents.charAt(char) !== '[') {
                        char--;
                    }

                    column -= begin.offset - char;
                }

                style = column;

                return;
            }

            /*
             * Warn for violating children.
             */

            if (column !== style) {
                diff = style - column;
                word = diff > 0 ? 'add' : 'remove';

                diff = Math.abs(diff);

                file.warn(
                    'Don’t use mixed indentation for children, ' + word +
                    ' ' + diff + ' ' + plural('space', diff),
                    {
                        'line': start(item).line,
                        'column': column
                    }
                );
            }
        });
    });

    done();
}

/*
 * Expose.
 */

module.exports = listItemContentIndent;

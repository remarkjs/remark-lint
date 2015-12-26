/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module list-item-spacing
 * @fileoverview
 *   Warn when list looseness is incorrect, such as being tight
 *   when it should be loose, and vice versa.
 * @example
 *   <!-- Valid: -->
 *   -   Wrapped
 *       item
 *
 *   -   item 2
 *
 *   -   item 3
 *
 *   <!-- Valid: -->
 *   -   item 1
 *   -   item 2
 *   -   item 3
 *
 *   <!-- Invalid: -->
 *   -   Wrapped
 *       item
 *   -   item 2
 *   -   item 3
 *
 *   <!-- Invalid: -->
 *   -   item 1
 *
 *   -   item 2
 *
 *   -   item 3
 */

'use strict';

/* eslint-env commonjs */

/*
 * Dependencies.
 */

var visit = require('unist-util-visit');
var position = require('mdast-util-position');

/*
 * Methods.
 */

var start = position.start;
var end = position.end;

/**
 * Warn when list items looseness is incorrect, such as
 * being tight when it should be loose, and vice versa.
 *
 * @param {Node} ast - Root node.
 * @param {File} file - Virtual file.
 * @param {*} preferred - Ignored.
 * @param {Function} done - Callback.
 */
function listItemSpacing(ast, file, preferred, done) {
    visit(ast, 'list', function (node) {
        var items = node.children;
        var isTightList = true;
        var indent = start(node).column;
        var type;

        if (position.generated(node)) {
            return;
        }

        items.forEach(function (item) {
            var content = item.children;
            var head = content[0];
            var tail = content[content.length - 1];
            var isLoose = (end(tail).line - start(head).line) > 0;

            if (isLoose) {
                isTightList = false;
            }
        });

        type = isTightList ? 'tight' : 'loose';

        items.forEach(function (item, index) {
            var next = items[index + 1];
            var isTight = end(item).column > indent;

            /*
             * Ignore last.
             */

            if (!next) {
                return;
            }

            /*
             * Check if the list item's state does (not)
             * match the list's state.
             */

            if (isTight !== isTightList) {
                file.warn('List item should be ' + type + ', isn’t', {
                    'start': end(item),
                    'end': start(next)
                });
            }
        });
    });

    done();
}

/*
 * Expose.
 */

module.exports = listItemSpacing;

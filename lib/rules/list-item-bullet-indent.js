/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer. All rights reserved.
 * @module list-item-bullet-indent
 * @fileoverview
 *   Warn when list item bullets are indented.
 * @example
 *   <!-- Valid -->
 *   * List item
 *   * List item
 *
 *   <!-- Invalid -->
 *     * List item
 *     * List item
 */

'use strict';

/*
 * Dependencies.
 */

var visit = require('../utilities/visit');
var position = require('../utilities/position');
var plural = require('../utilities/plural');

/*
 * Methods.
 */

var start = position.start;

/**
 * Warn when list item bullets are indented.
 *
 * @param {Node} ast - Root node.
 * @param {File} file - Virtual file.
 * @param {*} preferred - Ignored.
 * @param {Function} done - Callback.
 */
function listItemBulletIndent(ast, file, preferred, done) {
    var contents = file.toString();

    visit(ast, 'list', function (node) {
        var items = node.children;

        items.forEach(function (item) {
            var head = item.children[0];
            var initial = start(item).offset;
            var final = start(head).offset;
            var indent;

            if (position.isGenerated(node)) {
                return;
            }

            indent = contents.slice(initial, final).match(/^\s*/)[0].length;

            if (indent !== 0) {
                initial = start(head);

                file.warn('Incorrect indentation before bullet: remove ' + indent + ' ' + plural('space', indent), {
                    'line': initial.line,
                    'column': initial.column - indent
                });
            }
        });
    });

    done();
}

/*
 * Expose.
 */

module.exports = listItemBulletIndent;

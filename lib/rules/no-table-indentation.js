/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module no-table-indentation
 * @fileoverview
 *   Warn when tables are indented.
 * @example
 *   <!-- Invalid: -->
 *       | A     | B     |
 *       | ----- | ----- |
 *       | Alpha | Bravo |
 *
 *   <!-- Valid: -->
 *   | A     | B     |
 *   | ----- | ----- |
 *   | Alpha | Bravo |
 */

'use strict';

/* eslint-env commonjs */

/*
 * Dependencies.
 */

var visit = require('unist-util-visit');
var position = require('mdast-util-position');

/**
 * Warn when a table has a too much indentation.
 *
 * @param {Node} ast - Root node.
 * @param {File} file - Virtual file.
 * @param {*} preferred - Ignored.
 * @param {Function} done - Callback.
 */
function noTableIndentation(ast, file, preferred, done) {
    visit(ast, 'table', function (node) {
        var contents = file.toString();

        if (position.generated(node)) {
            return;
        }

        node.children.forEach(function (row) {
            var fence = contents.slice(position.start(row).offset, position.start(row.children[0]).offset);

            if (fence.indexOf('|') > 1) {
                file.warn('Do not indent table rows', row);
            }
        });
    });

    done();
}

/*
 * Expose.
 */

module.exports = noTableIndentation;

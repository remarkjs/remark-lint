/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module table-pipes
 * @fileoverview
 *   Warn when table rows are not fenced with pipes.
 * @example
 *   <!-- Valid: -->
 *   | A     | B     |
 *   | ----- | ----- |
 *   | Alpha | Bravo |
 *
 *   <!-- Invalid: -->
 *   A     | B
 *   ----- | -----
 *   Alpha | Bravo
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
 * Warn when a table rows are not fenced with pipes.
 *
 * @param {Node} ast - Root node.
 * @param {File} file - Virtual file.
 * @param {*} preferred - Ignored.
 * @param {Function} done - Callback.
 */
function tablePipes(ast, file, preferred, done) {
    visit(ast, 'table', function (node) {
        var contents = file.toString();

        node.children.forEach(function (row) {
            var cells = row.children;
            var head = cells[0];
            var tail = cells[cells.length - 1];
            var initial = contents.slice(start(row).offset, start(head).offset);
            var final = contents.slice(end(tail).offset, end(row).offset);

            if (position.generated(row)) {
                return;
            }

            if (initial.indexOf('|') === -1) {
                file.warn('Missing initial pipe in table fence', start(row));
            }

            if (final.indexOf('|') === -1) {
                file.warn('Missing final pipe in table fence', end(row));
            }
        });
    });

    done();
}

/*
 * Expose.
 */

module.exports = tablePipes;

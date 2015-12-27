/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module hard-break-spaces
 * @fileoverview
 *   Warn when too many spaces are used to create a hard break.
 * @example
 *   <!-- Note: the middle-dots represent spaces -->
 *
 *   <!-- Valid: -->
 *   Lorem ipsum··
 *   dolor sit amet
 *
 *   <!-- Invalid: -->
 *   Lorem ipsum···
 *   dolor sit amet.
 */

'use strict';

/* eslint-env commonjs */

/*
 * Dependencies.
 */

var visit = require('unist-util-visit');
var position = require('mdast-util-position');

/**
 * Warn when too many spaces are used to create a
 * hard break.
 *
 * @param {Node} ast - Root node.
 * @param {File} file - Virtual file.
 * @param {*} preferred - Ignored.
 * @param {Function} done - Callback.
 */
function hardBreakSpaces(ast, file, preferred, done) {
    var contents = file.toString();

    visit(ast, 'break', function (node) {
        var start = position.start(node).offset;
        var end = position.end(node).offset;
        var value;

        if (position.generated(node)) {
            return;
        }

        value = contents.slice(start, end).split('\n', 1)[0];

        if (value.length > 2) {
            file.warn('Use two spaces for hard line breaks', node);
        }
    });

    done();
}

/*
 * Expose.
 */

module.exports = hardBreakSpaces;

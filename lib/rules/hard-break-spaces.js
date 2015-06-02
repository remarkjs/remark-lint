/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer. All rights reserved.
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

/*
 * Dependencies.
 */

var visit = require('../utilities/visit');
var position = require('../utilities/position');

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

        if (position.isGenerated(node)) {
            return;
        }

        if (contents.slice(start, end).length > 3) {
            file.warn('Use two spaces for hard line breaks', node);
        }
    });

    done();
}

/*
 * Expose.
 */

module.exports = hardBreakSpaces;

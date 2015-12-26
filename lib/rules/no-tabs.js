/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module no-tabs
 * @fileoverview
 *   Warn when hard-tabs instead of spaces
 * @example
 *   <!-- Note: the double guillemet (`»`) and middle-dots represent a tab -->
 *   <!-- Invalid: -->
 *   Foo»Bar
 *
 *   »···Foo
 *
 *   <!-- Valid: -->
 *   Foo Bar
 *
 *       Foo
 */

'use strict';

/* eslint-env commonjs */

/**
 * Warn when hard-tabs instead of spaces are used.
 *
 * @param {Node} ast - Root node.
 * @param {File} file - Virtual file.
 * @param {*} preferred - Ignored.
 * @param {Function} done - Callback.
 */
function noTabs(ast, file, preferred, done) {
    var content = file.toString();
    var index = -1;
    var length = content.length;

    while (++index < length) {
        if (content.charAt(index) === '\t') {
            file.warn('Use spaces instead of hard-tabs', file.offsetToPosition(index));
        }
    }

    done();
}

/*
 * Expose.
 */

module.exports = noTabs;

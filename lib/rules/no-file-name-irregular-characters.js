/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module no-file-name-irregular-characters
 * @fileoverview
 *   Warn when file names contain irregular characters: characters other
 *   than alpha-numericals, dashes, and dots (full-stops).
 * @example
 *   Invalid: plug_ins.md, plug ins.md.
 *   Valid: plug-ins.md, plugins.md.
 */

'use strict';

/* eslint-env commonjs */

/**
 * Warn when file names contain characters other than
 * alpha-numericals, dashes, and dots (full-stops).
 *
 * @param {Node} ast - Root node.
 * @param {File} file - Virtual file.
 * @param {*} preferred - Ignored.
 * @param {Function} done - Callback.
 */
function noFileNameIrregularCharacters(ast, file, preferred, done) {
    var match = file.filename && file.filename.match(/[^.a-zA-Z0-9-]/);

    if (match) {
        file.warn('Do not use `' + match[0] + '` in a file name');
    }

    done();
}

/*
 * Expose.
 */

module.exports = noFileNameIrregularCharacters;

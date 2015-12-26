/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module no-file-name-outer-dashes
 * @fileoverview
 *   Warn when file names contain initial or final dashes.
 * @example
 *   Invalid: -readme.md, readme-.md
 *   Valid: readme.md
 */

'use strict';

/* eslint-env commonjs */

/**
 * Warn when file names contain initial or final dashes.
 *
 * @param {Node} ast - Root node.
 * @param {File} file - Virtual file.
 * @param {*} preferred - Ignored.
 * @param {Function} done - Callback.
 */
function noFileNameOuterDashes(ast, file, preferred, done) {
    if (file.filename && /^-|-$/.test(file.filename)) {
        file.warn('Do not use initial or final dashes in a file name');
    }

    done();
}

/*
 * Expose.
 */

module.exports = noFileNameOuterDashes;

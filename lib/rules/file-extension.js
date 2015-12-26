/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module file-extension
 * @fileoverview
 *   Warn when the document’s extension differs from the given preferred
 *   extension.
 *
 *   Does not warn when given documents have no file extensions (such as
 *   `AUTHORS` or `LICENSE`).
 *
 *   Options: `string`, default: `'md'` — Expected file extension.
 * @example
 *   Invalid (when `'md'`): readme.mkd, readme.markdown, etc.
 *   Valid (when `'md'`): readme, readme.md
 */

'use strict';

/* eslint-env commonjs */

/**
 * Check file extensions.
 *
 * @param {Node} ast - Root node.
 * @param {File} file - Virtual file.
 * @param {string?} [preferred='md'] - Expected file
 *   extension.
 * @param {Function} done - Callback.
 */
function fileExtension(ast, file, preferred, done) {
    var ext = file.extension;

    preferred = typeof preferred === 'string' ? preferred : 'md';

    if (ext !== '' && ext !== preferred) {
        file.warn('Invalid extension: use `' + preferred + '`');
    }

    done();
}

/*
 * Expose.
 */

module.exports = fileExtension;

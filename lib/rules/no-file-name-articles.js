/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module no-file-name-articles
 * @fileoverview
 *   Warn when file name start with an article.
 * @example
 *   Valid: article.md
 *   Invalid: an-article.md, a-article.md, , the-article.md
 */

'use strict';

/* eslint-env commonjs */

/**
 * Warn when file name start with an article.
 *
 * @param {Node} ast - Root node.
 * @param {File} file - Virtual file.
 * @param {*} preferred - Ignored.
 * @param {Function} done - Callback.
 */
function noFileNameArticles(ast, file, preferred, done) {
    var match = file.filename && file.filename.match(/^(the|an?)\b/i);

    if (match) {
        file.warn('Do not start file names with `' + match[0] + '`');
    }

    done();
}

/*
 * Expose.
 */

module.exports = noFileNameArticles;

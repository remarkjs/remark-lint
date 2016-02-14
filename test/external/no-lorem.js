/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module remark:lint:test:no-lorem
 * @fileoverview
 *   Warn when `lorem` is used in a document.
 * @example
 *   <!-- Invalid: -->
 *   lorem
 *
 *   <!-- Valid: -->
 *   ipsum
 */

'use strict';

/* eslint-env commonjs */

/*
 * Dependencies.
 */

var vfileLocation = require('vfile-location');

/**
 * Warn when `lorem` is used in a document.
 *
 * @param {Node} ast - Root node.
 * @param {File} file - Virtual file.
 * @param {*} preferred - Ignored.
 * @param {Function} done - Callback.
 */
function noLorem(ast, file, preferred, done) {
    var content = file.toString();
    var expression = /\blorem\b/gi;
    var location = vfileLocation(file);

    while (expression.exec(content)) {
        file.warn('Do not use lorem', location.toPosition(expression.lastIndex));
    }

    done();
}

/*
 * Expose.
 */

module.exports = noLorem;

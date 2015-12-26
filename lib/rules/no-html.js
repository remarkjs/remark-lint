/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module no-html
 * @fileoverview
 *   Warn when HTML nodes are used.
 *
 *   Ignores comments, because they are used by this tool, remark, and
 *   because markdown doesn’t have native comments.
 * @example
 *   <!-- Invalid: -->
 *   <h1>Hello</h1>
 *
 *   <!-- Valid: -->
 *   # Hello
 */

'use strict';

/* eslint-env commonjs */

/*
 * Dependencies.
 */

var visit = require('unist-util-visit');
var position = require('mdast-util-position');

/**
 * Warn when HTML nodes are used.
 *
 * @param {Node} ast - Root node.
 * @param {File} file - Virtual file.
 * @param {*} preferred - Ignored.
 * @param {Function} done - Callback.
 */
function html(ast, file, preferred, done) {
    visit(ast, 'html', function (node) {
        if (!position.generated(node) && !/^\s*<!--/.test(node.value)) {
            file.warn('Do not use HTML in markdown', node);
        }
    });

    done();
}

module.exports = html;

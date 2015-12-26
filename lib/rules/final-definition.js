/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module final-definition
 * @fileoverview
 *   Warn when definitions are not placed at the end of the file.
 * @example
 *   <!-- Valid: -->
 *   ...
 *
 *   [example] http://example.com "Example Domain"
 *
 *   <!-- Invalid: -->
 *   ...
 *
 *   [example] http://example.com "Example Domain"
 *
 *   A trailing paragraph.
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

/**
 * Warn when definitions are not placed at the end of
 * the file.
 *
 * @param {Node} ast - Root node.
 * @param {File} file - Virtual file.
 * @param {*} preferred - Ignored.
 * @param {Function} done - Callback.
 */
function finalDefinition(ast, file, preferred, done) {
    var last = null;

    visit(ast, function (node) {
        var line = start(node).line;

        /*
         * Ignore generated nodes.
         */

        if (node.type === 'root' || position.generated(node)) {
            return;
        }

        if (node.type === 'definition') {
            if (last !== null && last > line) {
                file.warn('Move definitions to the end of the file (after the node at line `' + last + '`)', node);
            }
        } else if (last === null) {
            last = line;
        }
    }, true);

    done();
}

/*
 * Expose.
 */

module.exports = finalDefinition;

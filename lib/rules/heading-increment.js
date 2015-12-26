/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module heading-increment
 * @fileoverview
 *   Warn when headings increment with more than 1 level at a time.
 * @example
 *   <!-- Valid: -->
 *   # Foo
 *
 *   ## Bar
 *
 *   <!-- Invalid: -->
 *   # Foo
 *
 *   ### Bar
 */

'use strict';

/* eslint-env commonjs */

/*
 * Dependencies.
 */

var visit = require('unist-util-visit');
var position = require('mdast-util-position');

/**
 * Warn when headings increment with more than 1 level at
 * a time.
 *
 * Never warns for the first heading.
 *
 * @param {Node} ast - Root node.
 * @param {File} file - Virtual file.
 * @param {*} preferred - Ignored.
 * @param {Function} done - Callback.
 */
function headingIncrement(ast, file, preferred, done) {
    var prev = null;

    visit(ast, 'heading', function (node) {
        var depth = node.depth;

        if (position.generated(node)) {
            return;
        }

        if (prev && depth > prev + 1) {
            file.warn('Heading levels should increment by one level at a time', node);
        }

        prev = depth;
    });

    done();
}

/*
 * Expose.
 */

module.exports = headingIncrement;

/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module no-duplicate-headings
 * @fileoverview
 *   Warn when duplicate headings are found.
 * @example
 *   <!-- Valid: -->
 *   # Foo
 *
 *   ## Bar
 *
 *   <!-- Invalid: -->
 *   # Foo
 *
 *   ## Foo
 *
 *   ## [Foo](http://foo.com/bar)
 */

'use strict';

/* eslint-env commonjs */

/*
 * Dependencies.
 */

var position = require('mdast-util-position');
var visit = require('unist-util-visit');
var toString = require('mdast-util-to-string');

/**
 * Warn when headings with equal content are found.
 *
 * Matches case-insensitive.
 *
 * @param {Node} ast - Root node.
 * @param {File} file - Virtual file.
 * @param {*} preferred - Ignored.
 * @param {Function} done - Callback.
 */
function noDuplicateHeadings(ast, file, preferred, done) {
    var map = {};

    visit(ast, 'heading', function (node) {
        var value = toString(node).toUpperCase();
        var duplicate = map[value];
        var pos;

        if (position.generated(node)) {
            return;
        }

        if (duplicate && duplicate.type === 'heading') {
            pos = position.start(duplicate);

            file.warn(
                'Do not use headings with similar content (' +
                pos.line + ':' + pos.column + ')',
                node
            );
        }

        map[value] = node;
    });

    done();
}

/*
 * Expose.
 */

module.exports = noDuplicateHeadings;

/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer. All rights reserved.
 * @module no-multiple-toplevel-headings
 * @fileoverview
 *   Warn when multiple top-level headings are used.
 * @example
 *   <!-- Invalid: -->
 *   # Foo
 *
 *   # Bar
 *
 *   <!-- Valid: -->
 *   # Foo
 *
 *   ## Bar
 */

'use strict';

/*
 * Dependencies.
 */

var visit = require('../utilities/visit');
var position = require('../utilities/position');

/**
 * Warn when multiple top-level headings are used.
 *
 * @param {Node} ast - Root node.
 * @param {File} file - Virtual file.
 * @param {*} preferred - Ignored.
 * @param {Function} done - Callback.
 */
function noMultipleToplevelHeadings(ast, file, preferred, done) {
    var topLevelheading = false;

    visit(ast, 'heading', function (node) {
        var pos;

        if (position.isGenerated(node)) {
            return;
        }

        if (node.depth === 1) {
            if (topLevelheading) {
                pos = position.start(node);

                file.warn('Don’t use multiple top level headings (' + pos.line + ':' + pos.column + ')', node);
            }

            topLevelheading = node;
        }
    });

    done();
}

module.exports = noMultipleToplevelHeadings;

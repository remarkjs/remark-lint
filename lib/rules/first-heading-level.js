/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer. All rights reserved.
 * @module first-heading-level
 * @fileoverview
 *   Warn when the first heading has a level other than `1`.
 * @example
 *   <!-- Valid: -->
 *   # Foo
 *
 *   ## Bar
 *
 *   <!-- Invalid: -->
 *   ## Foo
 *
 *   # Bar
 */

'use strict';

/*
 * Dependencies.
 */

var visit = require('mdast-util-visit');
var position = require('mdast-util-position');

/**
 * Warn when the first heading has a level other than `1`.
 *
 * @param {Node} ast - Root node.
 * @param {File} file - Virtual file.
 * @param {*} preferred - Ignored.
 * @param {Function} done - Callback.
 */
function firstHeadingLevel(ast, file, preferred, done) {
    visit(ast, 'heading', function (node) {
        if (position.generated(node)) {
            return null;
        }

        if (node.depth !== 1) {
            file.warn('First heading level should be `1`', node);
        }

        return false;
    });

    done();
}

module.exports = firstHeadingLevel;

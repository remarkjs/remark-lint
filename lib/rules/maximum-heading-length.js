/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer. All rights reserved.
 * @module maximum-heading-length
 * @fileoverview
 *   Warn when headings are too long.
 *
 *   Options: `number`, default: `60`.
 *
 *   Ignores markdown syntax, only checks the plain text content.
 * @example
 *   <!-- Valid, when set to `40` -->
 *   # Alpha bravo charlie delta echo
 *   # ![Alpha bravo charlie delta echo](http://example.com/nato.png)
 *
 *   <!-- Invalid, when set to `40` -->
 *   # Alpha bravo charlie delta echo foxtrot
 */

'use strict';

/*
 * Dependencies.
 */

var visit = require('../utilities/visit');
var toString = require('../utilities/to-string');
var position = require('../utilities/position');

/**
 * Warn when headings are too long.
 *
 * @param {Node} ast - Root node.
 * @param {File} file - Virtual file.
 * @param {number?} [preferred=60] - Maximum content
 *   length.
 * @param {Function} done - Callback.
 */
function maximumHeadingLength(ast, file, preferred, done) {
    preferred = isNaN(preferred) || typeof preferred !== 'number' ? 60 : preferred;

    visit(ast, 'heading', function (node) {
        if (position.isGenerated(node)) {
            return;
        }

        if (toString(node).length > preferred) {
            file.warn('Use headings shorter than `' + preferred + '`', node);
        }
    });

    done();
}

/*
 * Expose.
 */

module.exports = maximumHeadingLength;

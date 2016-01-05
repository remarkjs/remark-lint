/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module emphasis-marker
 * @fileoverview
 *   Warn for violating emphasis markers.
 *
 *   Options: `string`, either `'consistent'`, `'*'`, or `'_'`,
 *   default: `'consistent'`.
 *
 *   The default value, `consistent`, detects the first used emphasis
 *   style, and will warn when a subsequent emphasis uses a different
 *   style.
 * @example
 *   <!-- Valid when set to `consistent` or `*` -->
 *   *foo*
 *   *bar*
 *
 *   <!-- Valid when set to `consistent` or `_` -->
 *   _foo_
 *   _bar_
 */

'use strict';

/* eslint-env commonjs */

/*
 * Dependencies.
 */

var visit = require('unist-util-visit');
var position = require('mdast-util-position');

/*
 * Map of valid markers.
 */

var MARKERS = {
    '*': true,
    '_': true,
    'null': true
};

/**
 * Warn when an `emphasis` node has an incorrect marker.
 *
 * @param {Node} ast - Root node.
 * @param {File} file - Virtual file.
 * @param {string?} [preferred='consistent'] - Preferred
 *   marker, either `'*'` or `'_'`, or `'consistent'`.
 * @param {Function} done - Callback.
 */
function emphasisMarker(ast, file, preferred, done) {
    preferred = typeof preferred !== 'string' || preferred === 'consistent' ? null : preferred;

    if (MARKERS[preferred] !== true) {
        file.fail('Invalid emphasis marker `' + preferred + '`: use either `\'consistent\'`, `\'*\'`, or `\'_\'`');
        done();

        return;
    }

    visit(ast, 'emphasis', function (node) {
        var marker = file.toString().charAt(position.start(node).offset);

        if (position.generated(node)) {
            return;
        }

        if (preferred) {
            if (marker !== preferred) {
                file.warn('Emphasis should use `' + preferred + '` as a marker', node);
            }
        } else {
            preferred = marker;
        }
    });

    done();
}

/*
 * Expose.
 */

module.exports = emphasisMarker;

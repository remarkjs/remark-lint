/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module heading-style
 * @fileoverview
 *   Warn when a heading does not conform to a given style.
 *
 *   Options: `string`, either `'consistent'`, `'atx'`, `'atx-closed'`,
 *   or `'setext'`, default: `'consistent'`.
 *
 *   The default value, `consistent`, detects the first used heading
 *   style, and will warn when a subsequent heading uses a different
 *   style.
 * @example
 *   <!-- Valid when `consistent` or `atx` -->
 *   # Foo
 *
 *   ## Bar
 *
 *   ### Baz
 *
 *   <!-- Valid when `consistent` or `atx-closed` -->
 *   # Foo #
 *
 *   ## Bar #
 *
 *   ### Baz ###
 *
 *   <!-- Valid when `consistent` or `setext` -->
 *   Foo
 *   ===
 *
 *   Bar
 *   ---
 *
 *   ### Baz
 *
 *   <!-- Invalid -->
 *   Foo
 *   ===
 *
 *   ## Bar
 *
 *   ### Baz ###
 */

'use strict';

/* eslint-env commonjs */

/*
 * Dependencies.
 */

var visit = require('unist-util-visit');
var style = require('mdast-util-heading-style');
var position = require('mdast-util-position');

/*
 * Types.
 */

var TYPES = ['atx', 'atx-closed', 'setext'];

/**
 * Warn when a heading does not conform to a given style.
 *
 * @param {Node} ast - Root node.
 * @param {File} file - Virtual file.
 * @param {string} [preferred='consistent'] - Preferred
 *   style, one of `atx`, `atx-closed`, or `setext`.
 *   Other values default to `'consistent'`, which will
 *   detect the first used style.
 * @param {Function} done - Callback.
 */
function headingStyle(ast, file, preferred, done) {
    preferred = TYPES.indexOf(preferred) === -1 ? null : preferred;

    visit(ast, 'heading', function (node) {
        if (position.generated(node)) {
            return;
        }

        if (preferred) {
            if (style(node, preferred) !== preferred) {
                file.warn('Headings should use ' + preferred, node);
            }
        } else {
            preferred = style(node, preferred);
        }
    });

    done();
}

/*
 * Expose.
 */

module.exports = headingStyle;

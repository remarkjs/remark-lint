/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module fenced-code-marker
 * @fileoverview
 *   Warn for violating fenced code markers.
 *
 *   Options: `string`, either `` '`' ``, or `'~'`, default: `'consistent'`.
 *
 *   The default value, `consistent`, detects the first used fenced code
 *   marker style, and will warn when a subsequent fenced code uses a
 *   different style.
 * @example
 *   <!-- Valid by default and `` '`' ``: -->
 *   ```foo
 *   bar();
 *   ```
 *
 *   ```
 *   baz();
 *   ```
 *
 *   <!-- Valid by default and `'~'`: -->
 *   ~~~foo
 *   bar();
 *   ~~~
 *
 *   ~~~
 *   baz();
 *   ~~~
 *
 *   <!-- Always invalid: -->
 *   ~~~foo
 *   bar();
 *   ~~~
 *
 *   ```
 *   baz();
 *   ```
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
    '`': true,
    '~': true,
    'null': true
};

/**
 * Warn for violating fenced code markers.
 *
 * @param {Node} ast - Root node.
 * @param {File} file - Virtual file.
 * @param {string?} [preferred='consistent'] - Preferred
 *   marker, either `` '`' `` or `~`, or `'consistent'`.
 * @param {Function} done - Callback.
 */
function fencedCodeMarker(ast, file, preferred, done) {
    var contents = file.toString();

    preferred = typeof preferred !== 'string' || preferred === 'consistent' ? null : preferred;

    if (MARKERS[preferred] !== true) {
        file.fail('Invalid fenced code marker `' + preferred + '`: use either `\'consistent\'`, `` \'\`\' ``, or `\'~\'`');
        done();

        return;
    }

    visit(ast, 'code', function (node) {
        var marker = contents.substr(position.start(node).offset, 4);

        if (position.generated(node)) {
            return;
        }

        marker = marker.trimLeft().charAt(0);

        /*
         * Ignore unfenced code blocks.
         */

        if (MARKERS[marker] !== true) {
            return;
        }

        if (preferred) {
            if (marker !== preferred) {
                file.warn('Fenced code should use ' + preferred + ' as a marker', node);
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

module.exports = fencedCodeMarker;

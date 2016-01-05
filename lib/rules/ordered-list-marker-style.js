/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module ordered-list-marker-style
 * @fileoverview
 *   Warn when the list-item marker style of ordered lists violate a given
 *   style.
 *
 *   Options: `string`, either `'consistent'`, `'.'`, or `')'`,
 *   default: `'consistent'`.
 *
 *   Note that `)` is only supported in CommonMark.
 *
 *   The default value, `consistent`, detects the first used list
 *   style, and will warn when a subsequent list uses a different
 *   style.
 * @example
 *   <!-- Valid when set to `consistent` or `.` -->
 *   1.  Foo
 *
 *   2.  Bar
 *
 *   <!-- Valid when set to `consistent` or `)` -->
 *   1)  Foo
 *
 *   2)  Bar
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

/*
 * Valid styles.
 */

var STYLES = {
    ')': true,
    '.': true,
    'null': true
};

/**
 * Warn when the list-item marker style of ordered lists
 * violate a given style.
 *
 * @param {Node} ast - Root node.
 * @param {File} file - Virtual file.
 * @param {string?} [preferred='consistent'] - Ordered list
 *   marker style, either `'.'` or `')'`, defaulting to the
 *   first found style.
 * @param {Function} done - Callback.
 */
function orderedListMarkerStyle(ast, file, preferred, done) {
    var contents = file.toString();

    preferred = typeof preferred !== 'string' || preferred === 'consistent' ? null : preferred;

    if (STYLES[preferred] !== true) {
        file.fail('Invalid ordered list-item marker style `' + preferred + '`: use either `\'.\'` or `\')\'`');
        done();

        return;
    }

    visit(ast, 'list', function (node) {
        var items = node.children;

        if (!node.ordered) {
            return;
        }

        items.forEach(function (item) {
            var head = item.children[0];
            var initial = start(item).offset;
            var final = start(head).offset;
            var marker;

            if (position.generated(item)) {
                return;
            }

            marker = contents.slice(initial, final).replace(/\s|\d/g, '');

            /*
             * Support checkboxes.
             */

            marker = marker.replace(/\[[x ]?\]\s*$/i, '');

            if (!preferred) {
                preferred = marker;
            } else if (marker !== preferred) {
                file.warn('Marker style should be `' + preferred + '`', item);
            }
        });
    });

    done();
}

/*
 * Expose.
 */

module.exports = orderedListMarkerStyle;

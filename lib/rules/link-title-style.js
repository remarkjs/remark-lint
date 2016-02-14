/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module link-title-style
 * @fileoverview
 *   Warn when link and definition titles occur with incorrect quotes.
 *
 *   Options: `string`, either `'consistent'`, `'"'`, `'\''`, or
 *   `'()'`, default: `'consistent'`.
 *
 *   The default value, `consistent`, detects the first used quote
 *   style, and will warn when a subsequent titles use a different
 *   style.
 * @example
 *   <!-- Valid when `consistent` or `"` -->
 *   [Example](http://example.com "Example Domain")
 *   [Example](http://example.com "Example Domain")
 *
 *   <!-- Valid when `consistent` or `'` -->
 *   [Example](http://example.com 'Example Domain')
 *   [Example](http://example.com 'Example Domain')
 *
 *   <!-- Valid when `consistent` or `()` -->
 *   [Example](http://example.com (Example Domain))
 *   [Example](http://example.com (Example Domain))
 *
 *   <!-- Always invalid -->
 *   [Example](http://example.com "Example Domain")
 *   [Example](http://example.com 'Example Domain')
 *   [Example](http://example.com (Example Domain))
 */

'use strict';

/* eslint-env commonjs */

/*
 * Dependencies.
 */

var vfileLocation = require('vfile-location');
var visit = require('unist-util-visit');
var position = require('mdast-util-position');

/*
 * Map of valid markers.
 */

var MARKERS = {
    '"': true,
    '\'': true,
    ')': true,
    'null': true
};

/*
 * Methods.
 */

var end = position.end;

/**
 * Warn for fenced code blocks without language flag.
 *
 * @param {Node} ast - Root node.
 * @param {File} file - Virtual file.
 * @param {string?} [preferred='consistent'] - Preferred
 *   marker, either `'"'`, `'\''`, `'()'`, or `'consistent'`.
 * @param {Function} done - Callback.
 */
function linkTitleStyle(ast, file, preferred, done) {
    var contents = file.toString();
    var location = vfileLocation(file);

    preferred = typeof preferred !== 'string' || preferred === 'consistent' ? null : preferred;

    if (preferred === '()' || preferred === '(') {
        preferred = ')';
    }

    if (MARKERS[preferred] !== true) {
        file.fail('Invalid link title style marker `' + preferred + '`: use either `\'consistent\'`, `\'"\'`, `\'\\\'\'`, or `\'()\'`');
        done();

        return;
    }

    /**
     * Validate a single node.
     *
     * @param {Node} node - Node.
     */
    function validate(node) {
        var last = end(node).offset - 1;
        var character;
        var pos;

        if (position.generated(node)) {
            return;
        }

        if (node.type !== 'definition') {
            last--;
        }

        while (last) {
            character = contents.charAt(last);

            if (/\s/.test(character)) {
                last--;
            } else {
                break;
            }
        }

        /*
         * Not a title.
         */

        if (!(character in MARKERS)) {
            return;
        }

        if (!preferred) {
            preferred = character;
        } else if (preferred !== character) {
            pos = location.toPosition(last + 1);
            file.warn('Titles should use `' + (preferred === ')' ? '()' : preferred) + '` as a quote', pos);
        }
    }

    visit(ast, 'link', validate);
    visit(ast, 'image', validate);
    visit(ast, 'definition', validate);

    done();
}

/*
 * Expose.
 */

module.exports = linkTitleStyle;

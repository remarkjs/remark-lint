/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module no-heading-punctuation
 * @fileoverview
 *   Warn when a heading ends with a a group of characters.
 *   Defaults to `'.,;:!?'`.
 *
 *   Options: `string`, default: `'.,;:!?'`.
 *
 *   Note that these are added to a regex, in a group (`'[' + char + ']'`),
 *   be careful for escapes and dashes.
 * @example
 *   <!-- Invalid: -->
 *   # Hello:
 *
 *   # Hello?
 *
 *   # Hello!
 *
 *   # Hello,
 *
 *   # Hello;
 *
 *   <!-- Valid: -->
 *   # Hello
 */

'use strict';

/* eslint-env commonjs */

/*
 * Dependencies.
 */

var visit = require('unist-util-visit');
var position = require('mdast-util-position');
var toString = require('mdast-util-to-string');

/**
 * Warn when headings end in some characters.
 *
 * @param {Node} ast - Root node.
 * @param {File} file - Virtual file.
 * @param {string?} [preferred='\\.,;:!?'] - Group of characters.
 * @param {Function} done - Callback.
 */
function noHeadingPunctuation(ast, file, preferred, done) {
    preferred = typeof preferred === 'string' ? preferred : '\\.,;:!?';

    visit(ast, 'heading', function (node) {
        var value = toString(node);

        if (position.generated(node)) {
            return;
        }

        value = value.charAt(value.length - 1);

        if (new RegExp('[' + preferred + ']').test(value)) {
            file.warn('Don’t add a trailing `' + value + '` to headings', node);
        }
    });

    done();
}

/*
 * Expose.
 */

module.exports = noHeadingPunctuation;

/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module fenced-code-flag
 * @fileoverview
 *   Warn when fenced code blocks occur without language flag.
 *
 *   Options: `Array.<string>` or `Object`.
 *
 *   Providing an array, is a shortcut for just providing the `flags`
 *   property on the object.
 *
 *   The object can have an array of flags which are deemed valid.
 *   In addition it can have the property `allowEmpty` (`boolean`)
 *   which signifies whether or not to warn for fenced code-blocks without
 *   languge flags.
 * @example
 *   <!-- Valid: -->
 *   ```hello
 *   world();
 *   ```
 *
 *   <!-- Valid: -->
 *      Hello
 *
 *   <!-- Invalid: -->
 *   ```
 *   world();
 *   ```
 *
 *   <!-- Valid when given `{allowEmpty: true}`: -->
 *   ```
 *   world();
 *   ```
 *
 *   <!-- Invalid when given `["world"]`: -->
 *   ```hello
 *   world();
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
 * Methods.
 */

var start = position.start;
var end = position.end;

/**
 * Warn for fenced code blocks without language flag.
 *
 * @param {Node} ast - Root node.
 * @param {File} file - Virtual file.
 * @param {Object|Array.<string>} [preferred] - List
 *   of flags deemed valid.
 * @param {Function} done - Callback.
 */
function fencedCodeFlag(ast, file, preferred, done) {
    var contents = file.toString();
    var allowEmpty = false;
    var flags = [];

    if (typeof preferred === 'object' && !('length' in preferred)) {
        allowEmpty = Boolean(preferred.allowEmpty);

        preferred = preferred.flags;
    }

    if (typeof preferred === 'object' && 'length' in preferred) {
        flags = String(preferred).split(',');
    }

    visit(ast, 'code', function (node) {
        var value = contents.slice(start(node).offset, end(node).offset);

        if (position.generated(node)) {
            return;
        }

        if (node.lang) {
            if (flags.length && flags.indexOf(node.lang) === -1) {
                file.warn('Invalid code-language flag', node);
            }
        } else if (/^\ {0,3}([~`])\1{2,}/.test(value) && !allowEmpty) {
            file.warn('Missing code-language flag', node);
        }
    });

    done();
}

/*
 * Expose.
 */

module.exports = fencedCodeFlag;

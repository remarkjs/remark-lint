/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module code-block-style
 * @fileoverview
 *   Warn when code-blocks do not adhere to a given style.
 *
 *   Options: `string`, either `'consistent'`, `'fenced'`, or `'indented'`,
 *   default: `'consistent'`.
 *
 *   The default value, `consistent`, detects the first used code-block
 *   style, and will warn when a subsequent code-block uses a different
 *   style.
 * @example
 *   <!-- Valid, when set to `indented` or `consistent`, invalid when set to `fenced` -->
 *      Hello
 *
 *   ...
 *
 *      World
 *
 *   <!-- Valid, when set to `fenced` or `consistent`, invalid when set to `indented` -->
 *   ```
 *   Hello
 *   ```
 *   ...
 *   ```bar
 *   World
 *   ```
 *
 *   <!-- Always invalid -->
 *       Hello
 *   ...
 *   ```
 *   World
 *     ```
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

/*
 * Valid styles.
 */

var STYLES = {
    'null': true,
    'fenced': true,
    'indented': true
};

/**
 * Warn for violating code-block style.
 *
 * @param {Node} ast - Root node.
 * @param {File} file - Virtual file.
 * @param {string?} [preferred='consistent'] - Preferred
 *   code block style.  Defaults to `'consistent'` when
 *   not a a string.  Otherwise, should be one of
 *   `'fenced'` or `'indented'`.
 * @param {Function} done - Callback.
 */
function codeBlockStyle(ast, file, preferred, done) {
    var contents = file.toString();

    preferred = typeof preferred !== 'string' || preferred === 'consistent' ? null : preferred;

    if (STYLES[preferred] !== true) {
        file.fail('Invalid code block style `' + preferred + '`: use either `\'consistent\'`, `\'fenced\'`, or `\'indented\'`');
        done();
        return;
    }

    /**
     * Get the style of `node`.
     *
     * @param {Node} node - Node.
     * @return {string?} - `'fenced'`, `'indented'`, or
     *   `null`.
     */
    function check(node) {
        var initial = start(node).offset;
        var final = end(node).offset;

        if (position.generated(node)) {
            return null;
        }

        if (
            node.lang ||
            /^\s*([~`])\1{2,}/.test(contents.slice(initial, final))
        ) {
            return 'fenced';
        }

        return 'indented';
    }

    visit(ast, 'code', function (node) {
        var current = check(node);

        if (!current) {
            return;
        }

        if (!preferred) {
            preferred = current;
        } else if (preferred !== current) {
            file.warn('Code blocks should be ' + preferred, node);
        }
    });

    done();
}

/*
 * Expose.
 */

module.exports = codeBlockStyle;

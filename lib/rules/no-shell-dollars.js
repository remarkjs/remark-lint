/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module no-shell-dollars
 * @fileoverview
 *   Warn when shell code is prefixed by dollar-characters.
 *
 *   Ignored indented code blocks and fenced code blocks without language
 *   flag.
 * @example
 *   <!-- Invalid: -->
 *   ```bash
 *   $ echo a
 *   $ echo a > file
 *   ```
 *
 *   <!-- Valid: -->
 *   ```sh
 *   echo a
 *   echo a > file
 *   ```
 *
 *   <!-- Also valid: -->
 *   ```zsh
 *   $ echo a
 *   a
 *   $ echo a > file
 *   ```
 */

'use strict';

/* eslint-env commonjs */

/*
 * Dependencies.
 */

var visit = require('unist-util-visit');
var position = require('mdast-util-position');

/**
 * List of shell script file extensions (also used as code
 * flags for syntax highlighting on GitHub):
 *
 * @see https://github.com/github/linguist/blob/5bf8cf5/lib/linguist/languages.yml#L3002
 */

var flags = [
    'sh',
    'bash',
    'bats',
    'cgi',
    'command',
    'fcgi',
    'ksh',
    'tmux',
    'tool',
    'zsh'
];

/**
 * Warn when shell code is prefixed by dollar-characters.
 *
 * @param {Node} ast - Root node.
 * @param {File} file - Virtual file.
 * @param {*} preferred - Ignored.
 * @param {Function} done - Callback.
 */
function noShellDollars(ast, file, preferred, done) {
    visit(ast, 'code', function (node) {
        var language = node.lang;
        var value = node.value;
        var warn;

        if (!language || position.generated(node)) {
            return;
        }

        /*
         * Check both known shell-code and unknown code.
         */

        if (flags.indexOf(language) !== -1) {
            warn = value.length && value.split('\n').every(function (line) {
                return Boolean(!line.trim() || line.match(/^\s*\$\s*/));
            });

            if (warn) {
                file.warn('Do not use dollar signs before shell-commands', node);
            }
        }
    });

    done();
}

/*
 * Expose.
 */

module.exports = noShellDollars;

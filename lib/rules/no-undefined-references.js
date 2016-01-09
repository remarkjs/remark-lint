/**
 * @author Titus Wormer
 * @copyright 2016 Titus Wormer
 * @license MIT
 * @module no-unused-definitions
 * @fileoverview
 *   Warn when references to undefined definitions are found.
 * @example
 *   <!-- Valid: -->
 *   [foo][]
 *
 *   [foo]: https://example.com
 *
 *   <!-- Invalid: -->
 *   [bar][]
 */

'use strict';

/* eslint-env commonjs */

/*
 * Dependencies.
 */

var position = require('mdast-util-position');
var visit = require('unist-util-visit');

/**
 * Warn when references to undefined definitions are found.
 *
 * @param {Node} ast - Root node.
 * @param {File} file - Virtual file.
 * @param {*} preferred - Ignored.
 * @param {Function} done - Callback.
 */
function noUnusedDefinitions(ast, file, preferred, done) {
    var map = {};

    /**
     * Check `node`.
     *
     * @param {Node} node - Node.
     */
    function mark(node) {
        if (position.generated(node)) {
            return;
        }

        map[node.identifier.toUpperCase()] = true;
    }

    /**
     * Mark `node`.
     *
     * @param {Node} node - Node.
     */
    function find(node) {
        if (position.generated(node)) {
            return;
        }

        if (!map[node.identifier.toUpperCase()]) {
            file.warn('Found reference to undefined definition', node);
        }
    }

    visit(ast, 'definition', mark);
    visit(ast, 'footnoteDefinition', mark);

    visit(ast, 'imageReference', find);
    visit(ast, 'linkReference', find);
    visit(ast, 'footnoteReference', find);

    done();
}

/*
 * Expose.
 */

module.exports = noUnusedDefinitions;

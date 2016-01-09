/**
 * @author Titus Wormer
 * @copyright 2016 Titus Wormer
 * @license MIT
 * @module no-unused-definitions
 * @fileoverview
 *   Warn when unused definitions are found.
 * @example
 *   <!-- Valid: -->
 *   [foo][]
 *
 *   [foo]: https://example.com
 *
 *   <!-- Invalid: -->
 *   [bar]: https://example.com
 */

'use strict';

/* eslint-env commonjs */

/*
 * Dependencies.
 */

var position = require('mdast-util-position');
var visit = require('unist-util-visit');

/**
 * Warn when unused definitions are found.
 *
 * @param {Node} ast - Root node.
 * @param {File} file - Virtual file.
 * @param {*} preferred - Ignored.
 * @param {Function} done - Callback.
 */
function noUnusedDefinitions(ast, file, preferred, done) {
    var map = {};
    var identifier;

    /**
     * Check `node`.
     *
     * @param {Node} node - Node.
     */
    function find(node) {
        if (position.generated(node)) {
            return;
        }

        map[node.identifier.toUpperCase()] = {
            'node': node,
            'used': false
        };
    }

    /**
     * Mark `node`.
     *
     * @param {Node} node - Node.
     */
    function mark(node) {
        var info = map[node.identifier.toUpperCase()];

        if (position.generated(node) || !info) {
            return;
        }

        info.used = true;
    }

    visit(ast, 'definition', find);
    visit(ast, 'footnoteDefinition', find);

    visit(ast, 'imageReference', mark);
    visit(ast, 'linkReference', mark);
    visit(ast, 'footnoteReference', mark);

    for (identifier in map) {
        if (!map[identifier].used) {
            file.warn('Found unused definition', map[identifier].node);
        }
    }

    done();
}

/*
 * Expose.
 */

module.exports = noUnusedDefinitions;

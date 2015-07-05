/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer. All rights reserved.
 * @module Clean
 * @fileoverview mdast plug-in used to remove positional
 *   information from mdast’s syntax tree.
 * @todo Externalise into its own repository.
 */

'use strict';

/*
 * Dpendencies.
 */

var visit = require('mdast-util-visit');

/**
 * Delete the `position` key for each node.
 *
 * @param {Node} ast - Root node.
 */
function transformer(ast) {
    visit(ast, function (node) {
        node.position = undefined;
    });
}

/**
 * Return `transformer`.
 *
 * @return {Function} - See `transformer`.
 */
function attacher() {
    return transformer;
}

/*
 * Expose.
 */

module.exports = attacher;

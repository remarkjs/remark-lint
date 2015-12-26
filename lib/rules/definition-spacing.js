/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module definition-spacing
 * @fileoverview
 *   Warn when consecutive white space is used in a definition.
 * @example
 *   <!-- Valid -->
 *   [example domain] http://example.com "Example Domain"
 *
 *   <!-- Invalid -->
 *   ![example    image] http://example.com/favicon.ico "Example image"
 */

'use strict';

/* eslint-env commonjs */

/*
 * Dependencies.
 */

var visit = require('unist-util-visit');
var position = require('mdast-util-position');

/*
 * Expressions.
 */

var LABEL = /^\s*\[((?:\\[\s\S]|[^\[\]])+)\]/;

/**
 * Warn when consecutive white space is used in a
 * definition.
 *
 * @param {Node} ast - Root node.
 * @param {File} file - Virtual file.
 * @param {*} preferred - Ignored.
 * @param {Function} done - Callback.
 */
function definitionSpacing(ast, file, preferred, done) {
    var contents = file.toString();

    /**
     * Validate a node, either a normal definition or
     * a footnote definition.
     *
     * @param {Node} node - Node.
     */
    function validate(node) {
        var start = position.start(node).offset;
        var end = position.end(node).offset;
        var label;

        if (position.generated(node)) {
            return;
        }

        label = contents.slice(start, end).match(LABEL)[1];

        if (/[ \t\n]{2,}/.test(label)) {
            file.warn('Do not use consecutive white-space in definition labels', node);
        }
    }

    visit(ast, 'definition', validate);
    visit(ast, 'footnoteDefinition', validate);

    done();
}

/*
 * Expose.
 */

module.exports = definitionSpacing;

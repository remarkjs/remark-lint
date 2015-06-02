/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer. All rights reserved.
 * @module definition-case
 * @fileoverview
 *   Warn when definition labels are not lower-case.
 * @example
 *   <!-- Valid -->
 *   [example] http://example.com "Example Domain"
 *
 *   <!-- Invalid -->
 *   ![Example] http://example.com/favicon.ico "Example image"
 */

'use strict';

/*
 * Dependencies.
 */

var visit = require('../utilities/visit');
var position = require('../utilities/position');

/*
 * Expressions.
 */

var LABEL = /^\s*\[((?:\\[\s\S]|[^\[\]])+)\]/;

/**
 * Warn when definitions are not placed at the end of the
 * file.
 *
 * @param {Node} ast - Root node.
 * @param {File} file - Virtual file.
 * @param {*} preferred - Ignored.
 * @param {Function} done - Callback.
 */
function definitionCase(ast, file, preferred, done) {
    var contents = file.toString();

    /**
     * Validate a node, either a normal definition or
     * a footnote definition.
     *
     * @param {Node} node
     */
    function validate(node) {
        var start = position.start(node).offset;
        var end = position.end(node).offset;
        var label;

        if (position.isGenerated(node)) {
            return;
        }

        label = contents.slice(start, end).match(LABEL)[1];

        if (label !== label.toLowerCase()) {
            file.warn('Do not use uppper-case characters in definition labels', node);
        }
    }

    visit(ast, 'definition', validate);
    visit(ast, 'footnoteDefinition', validate);

    done();
}

/*
 * Expose.
 */

module.exports = definitionCase;

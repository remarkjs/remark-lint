/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer. All rights reserved.
 * @module no-auto-link-without-protocol
 * @fileoverview
 *   Warn for angle-bracketed links without protocol.
 * @example
 *   <!-- Valid: -->
 *   <http://www.example.com>
 *   <mailto:foo@bar.com>
 *
 *   <!-- Invalid: -->
 *   <www.example.com>
 *   <foo@bar.com>
 */

'use strict';

/*
 * Dependencies.
 */

var visit = require('../utilities/visit');
var toString = require('../utilities/to-string');
var position = require('../utilities/position');

/*
 * Methods.
 */

var start = position.start;
var end = position.end;

/**
 * Protocol expression.
 *
 * @type {RegExp}
 * @see http://en.wikipedia.org/wiki/URI_scheme#Generic_syntax
 */

var PROTOCOL = /^[a-z][a-z+.-]+:\/?/i;

/**
 * Assert `node`s reference starts with a protocol.
 *
 * @param {Node} node
 * @return {boolean}
 */
function hasProtocol(node) {
    return PROTOCOL.test(toString(node));
}

/**
 * Warn for angle-bracketed links without protocol.
 *
 * @param {Node} ast - Root node.
 * @param {File} file - Virtual file.
 * @param {*} preferred - Ignored.
 * @param {Function} done - Callback.
 */
function noAutoLinkWithoutProtocol(ast, file, preferred, done) {
    visit(ast, 'link', function (node) {
        var head = start(node.children[0]).column;
        var tail = end(node.children[node.children.length - 1]).column;
        var initial = start(node).column;
        var final = end(node).column;

        if (position.isGenerated(node)) {
            return;
        }

        if (initial === head - 1 && final === tail + 1 && !hasProtocol(node)) {
            file.warn('All automatic links must start with a protocol', node);
        }
    });

    done();
}

/*
 * Expose.
 */

module.exports = noAutoLinkWithoutProtocol;

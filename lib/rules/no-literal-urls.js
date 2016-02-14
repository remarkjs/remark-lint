/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module no-literal-urls
 * @fileoverview
 *   Warn when URLs without angle-brackets are used.
 * @example
 *   <!-- Invalid: -->
 *   http://foo.bar/baz
 *
 *   <!-- Valid: -->
 *   <http://foo.bar/baz>
 */

'use strict';

/* eslint-env commonjs */

/*
 * Dependencies.
 */

var visit = require('unist-util-visit');
var toString = require('mdast-util-to-string');
var position = require('mdast-util-position');

/*
 * Methods.
 */

var start = position.start;
var end = position.end;

/*
 * Constants.
 */

var MAILTO = 'mailto:';

/**
 * Warn for literal URLs without angle-brackets.
 *
 * @param {Node} ast - Root node.
 * @param {File} file - Virtual file.
 * @param {*} preferred - Ignored.
 * @param {Function} done - Callback.
 */
function noLiteralURLs(ast, file, preferred, done) {
    visit(ast, 'link', function (node) {
        var head = start(node.children[0]).column;
        var tail = end(node.children[node.children.length - 1]).column;
        var initial = start(node).column;
        var final = end(node).column;
        var value = toString(node);

        if (position.generated(node)) {
            return;
        }

        if (
            initial === head &&
            final === tail &&
            (value === node.url || value == MAILTO + node.url)
        ) {
            file.warn('Don’t use literal URLs without angle brackets', node);
        }
    });

    done();
}

/*
 * Expose.
 */

module.exports = noLiteralURLs;

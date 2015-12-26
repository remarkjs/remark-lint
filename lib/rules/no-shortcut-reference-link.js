/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module no-shortcut-reference-link
 * @fileoverview
 *   Warn when shortcut reference links are used.
 * @example
 *   <!-- Invalid: -->
 *   [foo]
 *
 *   [foo]: http://foo.bar/baz
 *
 *   <!-- Valid: -->
 *   [foo][]
 *
 *   [foo]: http://foo.bar/baz
 */

'use strict';

/* eslint-env commonjs */

/*
 * Dependencies.
 */

var visit = require('unist-util-visit');
var position = require('mdast-util-position');

/**
 * Warn when shortcut reference links are used.
 *
 * @param {Node} ast - Root node.
 * @param {File} file - Virtual file.
 * @param {*} preferred - Ignored.
 * @param {Function} done - Callback.
 */
function noShortcutReferenceLink(ast, file, preferred, done) {
    visit(ast, 'linkReference', function (node) {
        if (position.generated(node)) {
            return;
        }

        if (node.referenceType === 'shortcut') {
            file.warn('Use the trailing [] on reference links', node);
        }
    });

    done();
}

/*
 * Expose.
 */

module.exports = noShortcutReferenceLink;

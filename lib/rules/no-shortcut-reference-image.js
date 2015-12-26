/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module no-shortcut-reference-image
 * @fileoverview
 *   Warn when shortcut reference images are used.
 * @example
 *   <!-- Invalid: -->
 *   ![foo]
 *
 *   [foo]: http://foo.bar/baz.png
 *
 *   <!-- Valid: -->
 *   ![foo][]
 *
 *   [foo]: http://foo.bar/baz.png
 */

'use strict';

/* eslint-env commonjs */

/*
 * Dependencies.
 */

var visit = require('unist-util-visit');
var position = require('mdast-util-position');

/**
 * Warn when shortcut reference images are used.
 *
 * @param {Node} ast - Root node.
 * @param {File} file - Virtual file.
 * @param {*} preferred - Ignored.
 * @param {Function} done - Callback.
 */
function noShortcutReferenceImage(ast, file, preferred, done) {
    visit(ast, 'imageReference', function (node) {
        if (position.generated(node)) {
            return;
        }

        if (node.referenceType === 'shortcut') {
            file.warn('Use the trailing [] on reference images', node);
        }
    });

    done();
}

/*
 * Expose.
 */

module.exports = noShortcutReferenceImage;

/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module no-inline-padding
 * @fileoverview
 *   Warn when inline nodes are padded with spaces between markers and
 *   content.
 *
 *   Warns for emphasis, strong, delete, image, and link.
 * @example
 *   <!-- Invalid: -->
 *   * Hello *, [ world ](http://foo.bar/baz)
 *
 *   <!-- Valid: -->
 *   *Hello*, [world](http://foo.bar/baz)
 */

'use strict';

/* eslint-env commonjs */

/*
 * Dependencies.
 */

var visit = require('unist-util-visit');
var position = require('mdast-util-position');
var toString = require('mdast-util-to-string');

/**
 * Warn when inline nodes are padded with spaces between
 * markers and content.
 *
 * @param {Node} ast - Root node.
 * @param {File} file - Virtual file.
 * @param {*} preferred - Ignored.
 * @param {Function} done - Callback.
 */
function noInlinePadding(ast, file, preferred, done) {
    visit(ast, function (node) {
        var type = node.type;
        var contents;

        if (position.generated(node)) {
            return;
        }

        if (
            type === 'emphasis' ||
            type === 'strong' ||
            type === 'delete' ||
            type === 'image' ||
            type === 'link'
        ) {
            contents = toString(node);

            if (contents.charAt(0) === ' ' || contents.charAt(contents.length - 1) === ' ') {
                file.warn('Don’t pad `' + type + '` with inner spaces', node);
            }
        }
    });

    done();
}

/*
 * Expose.
 */

module.exports = noInlinePadding;

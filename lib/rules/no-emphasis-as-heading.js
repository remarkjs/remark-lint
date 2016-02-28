/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module no-emphasis-as-heading
 * @fileoverview
 *   Warn when emphasis (including strong), instead of a heading, introduces
 *   a paragraph.
 * @example
 *   <!-- Valid: -->
 *   # Foo
 *
 *   Bar.
 *
 *   <!-- Invalid: -->
 *   *Foo*
 *
 *   Bar.
 */

'use strict';

/* eslint-env commonjs */

/*
 * Dependencies.
 */

var visit = require('unist-util-visit');
var position = require('mdast-util-position');

/**
 * Warn when a section (a new paragraph) is introduced
 * by emphasis (or strong) and a colon.
 *
 * @param {Node} ast - Root node.
 * @param {File} file - Virtual file.
 * @param {*} preferred - Ignored.
 * @param {Function} done - Callback.
 */
function noEmphasisAsHeading(ast, file, preferred, done) {
    visit(ast, 'paragraph', function (node, index, parent) {
        var children = node.children;
        var child = children[0];
        var prev = parent.children[index - 1];
        var next = parent.children[index + 1];

        if (position.generated(node)) {
            return;
        }

        if (
            (!prev || prev.type !== 'heading') &&
            next &&
            next.type === 'paragraph' &&
            children.length === 1 &&
            (child.type === 'emphasis' || child.type === 'strong')
        ) {
            file.warn('Don’t use emphasis to introduce a section, use a heading', node);
        }
    });

    done();
}

/*
 * Expose.
 */

module.exports = noEmphasisAsHeading;

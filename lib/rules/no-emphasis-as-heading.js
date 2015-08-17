/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module no-emphasis-as-heading
 * @fileoverview
 *   Warn when emphasis (including strong), instead of a heading, introduces
 *   a paragraph.
 *
 *   Currently, only warns when a colon (`:`) is also included, maybe that
 *   could be omitted.
 * @example
 *   <!-- Valid: -->
 *   # Foo:
 *
 *   Bar.
 *
 *   <!-- Invalid: -->
 *   *Foo:*
 *
 *   Bar.
 */

'use strict';

/*
 * Dependencies.
 */

var visit = require('unist-util-visit');
var toString = require('mdast-util-to-string');
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
        var value;

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
            value = toString(child);

            /*
             * TODO: See if removing the punctuation
             * necessity is possible?
             */

            if (value.charAt(value.length - 1) === ':') {
                file.warn('Don’t use emphasis to introduce a section, use a heading', node);
            }
        }
    });

    done();
}

/*
 * Expose.
 */

module.exports = noEmphasisAsHeading;

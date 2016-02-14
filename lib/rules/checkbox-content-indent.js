/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module checkbox-content-indent
 * @fileoverview
 *   Warn when list item checkboxes are followed by too much white-space.
 * @example
 *   <!-- Valid: -->
 *   - [ ] List item
 *   +  [x] List item
 *   *   [X] List item
 *   -    [ ] List item
 *
 *   <!-- Invalid: -->
 *   - [ ] List item
 *   + [x]  List item
 *   * [X]   List item
 *   - [ ]    List item
 */

'use strict';

/* eslint-env commonjs */

/*
 * Dependencies.
 */

var vfileLocation = require('vfile-location');
var visit = require('unist-util-visit');
var position = require('mdast-util-position');

/*
 * Methods.
 */

var start = position.start;
var end = position.end;

/**
 * Warn when list item checkboxes are followed by too much white-space.
 *
 * @param {Node} ast - Root node.
 * @param {File} file - Virtual file.
 * @param {*} preferred - Ignored.
 * @param {Function} done - Callback.
 */
function checkboxContentIndent(ast, file, preferred, done) {
    var contents = file.toString();
    var location = vfileLocation(file);

    visit(ast, 'listItem', function (node) {
        var initial;
        var final;
        var value;

        /*
         * Exit early for items without checkbox.
         */

        if (
            node.checked !== Boolean(node.checked) ||
            position.generated(node)
        ) {
            return;
        }

        initial = start(node).offset;
        final = (node.children.length ? start(node.children[0]) : end(node)).offset;

        while (/[^\S\n]/.test(contents.charAt(final))) {
            final++;
        }

        /*
         * For a checkbox to be parsed, it must be followed
         * by a white space.
         */

        value = contents.slice(initial, final);

        value = value.slice(value.indexOf(']') + 1);

        if (value.length === 1) {
            return;
        }

        file.warn('Checkboxes should be followed by a single character', {
            'start': location.toPosition(final - value.length + 1),
            'end': location.toPosition(final)
        });
    });

    done();
}

/*
 * Expose.
 */

module.exports = checkboxContentIndent;

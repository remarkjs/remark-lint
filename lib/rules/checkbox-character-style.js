/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module checkbox-character-style
 * @fileoverview
 *   Warn when list item checkboxes violate a given style.
 *
 *   The default value, `consistent`, detects the first used checked
 *   and unchecked checkbox styles, and will warn when a subsequent
 *   checkboxes uses a different style.
 *
 *   These values can also be passed in as an object, such as:
 *
 *   ```json
 *   {
 *      "checked": "x",
 *      "unchecked": " "
 *   }
 *   ```
 * @example
 *   <!-- Note: the double guillemet (`»`) and middle-dots represent a tab -->
 *
 *   <!-- Valid by default, `'consistent'`, or `{'checked': 'x'}` -->
 *   - [x] List item
 *   - [x] List item
 *
 *   <!-- Valid by default, `'consistent'`, or `{'checked': 'X'}` -->
 *   - [X] List item
 *   - [X] List item
 *
 *   <!-- Valid by default, `'consistent'`, or `{'unchecked': ' '}` -->
 *   - [ ] List item
 *   - [ ] List item
 *
 *   <!-- Valid by default, `'consistent'`, or `{'unchecked': '»'}` -->
 *   - [»···] List item
 *   - [»···] List item
 *
 *   <!-- Always invalid -->
 *   - [x] List item
 *   - [X] List item
 *   - [ ] List item
 *   - [»···] List item
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

var CHECKED = {
    'x': true,
    'X': true
};

var UNCHECKED = {
    ' ': true,
    '	': true
};

/**
 * Warn when list item checkboxes violate a given style.
 *
 * @param {Node} ast - Root node.
 * @param {File} file - Virtual file.
 * @param {Object?} preferred - An object with `checked`
 *   and `unchecked` properties, each set to null to default to
 *   the first found style, or set to `'x'` or `'X'` for checked,
 *   or `' '` (space) or `'\t'` (tab) for unchecked.
 * @param {Function} done - Callback.
 */
function checkboxCharacterStyle(ast, file, preferred, done) {
    var contents = file.toString();
    var location = vfileLocation(file);

    if (preferred === 'consistent' || typeof preferred !== 'object') {
        preferred = {};
    }

    if (!preferred.unchecked) {
        preferred.unchecked = null;
    }

    if (!preferred.checked) {
        preferred.checked = null;
    }

    if (
        preferred.unchecked !== null &&
        UNCHECKED[preferred.unchecked] !== true
    ) {
        file.fail(
            'Invalid unchecked checkbox marker `' +
            preferred.unchecked +
            '`: use either `\'\\t\'`, or `\' \'`'
        );
    }

    if (
        preferred.checked !== null &&
        CHECKED[preferred.checked] !== true
    ) {
        file.fail(
            'Invalid checked checkbox marker `' +
            preferred.checked +
            '`: use either `\'x\'`, or `\'X\'`'
        );
    }

    visit(ast, 'listItem', function (node) {
        var type;
        var initial;
        var final;
        var stop;
        var value;
        var style;
        var character;

        /*
         * Exit early for items without checkbox.
         */

        if (
            node.checked !== Boolean(node.checked) ||
            position.generated(node)
        ) {
            return;
        }

        type = node.checked ? 'checked' : 'unchecked';

        initial = start(node).offset;
        final = (node.children.length ? start(node.children[0]) : end(node)).offset;

        /*
         * For a checkbox to be parsed, it must be followed
         * by a white space.
         */

        value = contents.slice(initial, final).trimRight().slice(0, -1);

        /*
         * The checkbox character is behind a square
         * bracket.
         */

        character = value.charAt(value.length - 1);
        style = preferred[type];

        if (style === null) {
            preferred[type] = character;
        } else if (character !== style) {
            stop = initial + value.length;

            file.warn(
                type.charAt(0).toUpperCase() + type.slice(1) +
                ' checkboxes should use `' + style + '` as a marker',
                {
                    'start': location.toPosition(stop - 1),
                    'end': location.toPosition(stop)
                }
            );
        }
    });

    done();
}

/*
 * Expose.
 */

module.exports = checkboxCharacterStyle;

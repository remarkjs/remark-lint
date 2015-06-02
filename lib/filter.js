/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer. All rights reserved.
 * @module Filter
 * @fileoverview mdast plug-in used internally by
 *   mdast-lint to filter ruleId’s by enabled and disabled
 *   ranges.
 * @todo Externalise into its own repository.
 */

'use strict';

/**
 * Sort all `file`s messages by line/column.  Note that
 * this works as a plugin, and will also sort warnings
 * added by other plug-ins before `mdast-lint` was added.
 *
 * @param {Node} ast - Root node.
 * @param {File} file - Virtual file.
 */
function transformer(ast, file) {
    if (!file || !file.messages || !file.messages.length) {
        return;
    }

    file.messages = file.messages.filter(function (message) {
        var ranges = file.lintRanges[message.ruleId];
        var index = ranges && ranges.length;
        var length = -1;
        var range;

        if (!message.line) {
            message.line = 1;
        }

        if (!message.column) {
            message.column = 1;
        }

        while (--index > length) {
            range = ranges[index];

            if (
                range.position.line < message.line ||
                (
                    range.position.line === message.line &&
                    range.position.column < message.column
                )
            ) {
                return range.state === true;
            }
        }

        /* xistanbul ignore next - Just to be safe */
        return true;
    });
}

/**
 * Return `transformer`.
 *
 * @return {Function} - See `transformer`.
 */
function attacher() {
    return transformer;
}

/*
 * Expose.
 */

module.exports = attacher;

/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer. All rights reserved.
 * @module Sort
 * @fileoverview mdast plug-in used internally by
 *   mdast-lint to sort warnings.
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
    file.messages.sort(function (a, b) {
        /* istanbul ignore if - Useful when externalised */
        if (a.line === undefined || b.line === undefined) {
            return -1;
        }

        return a.line === b.line ? a.column - b.column : a.line - b.line;
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

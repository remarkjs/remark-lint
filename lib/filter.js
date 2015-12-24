/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module remark:lint:filter
 * @fileoverview remark plug-in used internally by
 *   remark-lint to filter ruleId’s by enabled and disabled
 *   ranges, or by gaps.
 * @todo Externalise into its own repository.
 */

'use strict';

var position = require('mdast-util-position');
var visit = require('unist-util-visit');

/**
 * Remove warnings which are disabled, or are in gaps.
 *
 * @param {Node} ast - Root node.
 * @param {File} file - Virtual file.
 */
function transformer(ast, file) {
    var lastNode = ast.children[ast.children.length - 1];
    var gaps = [];
    var offset = 0;
    var isGap = false;
    var scope = file.namespace('remark-lint').ranges;

    if (!file || !file.messages || !file.messages.length) {
        return;
    }

    /**
     * Patch a new position.
     *
     * @param {number?} [latest] - Last found position.
     */
    function update(latest) {
        if (latest === undefined || latest === null) {
            isGap = true;

            return;
        }

        if (offset > latest) {
            return;
        }

        if (isGap) {
            gaps.push({
                'start': offset,
                'end': latest
            });

            isGap = false;
        }

        offset = latest;
    }

    visit(ast, function (node) {
        var start = position.start(node);
        var end = position.end(node);

        update(start && start.offset);

        if (!node.children) {
            update(end && end.offset);
        }
    });

    if (offset === position.end(lastNode).offset) {
        update();
        update(file.toString().length - 1);
    }

    file.messages = file.messages.filter(function (message) {
        var ranges = scope[message.ruleId];
        var index = ranges && ranges.length;
        var gapIndex = gaps.length;
        var length = -1;
        var pos;
        var range;

        if (!message.line) {
            message.line = 1;
        }

        if (!message.column) {
            message.column = 1;
        }

        pos = file.positionToOffset(message);

        while (gapIndex--) {
            if (
                gaps[gapIndex].start <= pos &&
                gaps[gapIndex].end > pos
            ) {
                return false;
            }
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

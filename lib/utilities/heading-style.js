/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer. All rights reserved.
 * @module headingStyle
 * @fileoverview Utility to check which style a heading
 *   node is in.
 */

'use strict';

/*
 * Dependencies.
 */

var end = require('./position').end;

/**
 * Get the probable style of an atx-heading, depending on
 * preferred style.
 *
 * @example
 *   consolidate(1, 'setext') // 'atx'
 *   consolidate(1, 'atx') // 'atx'
 *   consolidate(3, 'setext') // 'setext'
 *   consolidate(3, 'atx') // 'atx'
 *
 * @param {number} depth
 * @param {string?} relative
 * @return {string?} - Type.
 */
function consolidate(depth, relative) {
    return depth < 3 ? 'atx' :
        relative === 'atx' || relative === 'setext' ? relative : null;
}

/**
 * Check the style of a heading.
 *
 * @param {Node} node
 * @param {string?} relative - heading type which we'd wish
 *   this to be.
 * @return {string?} - Type, either `'atx-closed'`,
 *   `'atx'`, or `'setext'`.
 */
function style(node, relative) {
    var last = node.children[node.children.length - 1];
    var depth = node.depth;

    /*
     * This can only occur for atx and `'atx-closed'`
     * headings.  This might incorrectly match `'atx'`
     * headings with lots of trailing white space as an
     * `'atx-closed'` heading.
     */

    if (!last) {
        if (end(node).column < depth * 2) {
            return consolidate(depth, relative);
        }

        return 'atx-closed';
    }

    if (end(last).line + 1 === end(node).line) {
        return 'setext';
    }

    if (end(last).column + depth < end(node).column) {
        return 'atx-closed';
    }

    return consolidate(depth, relative);
}

/*
 * Expose.
 */

module.exports = style;

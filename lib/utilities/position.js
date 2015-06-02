/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer. All rights reserved.
 * @module Position
 * @fileoverview Utility to get either the starting or the
 *   ending position of a node, and if its generated
 *   or not.
 */

'use strict';

/**
 * Factory to get a position at `type`.
 *
 * @param {string} type - Either `'start'` or `'end'`.
 * @return {function(Node): Object}
 */
function positionFactory(type) {
    /**
     * Fet a position in `node` at a bound `type`.
     *
     * @param {Node} node
     * @return {Object}
     */
    return function (node) {
        return (node && node.position && node.position[type]) || {};
    };
}

/*
 * Getters.
 */

var start = positionFactory('start');
var end = positionFactory('end');

/**
 * Detect if a node is generated.
 *
 * @param {Node} node
 * @return {boolean} - Whether or not `node` is generated.
 */
function isGenerated(node) {
    var initial = start(node);
    var final = end(node);

    return initial.line === undefined || initial.column === undefined ||
        final.line === undefined || final.column === undefined;
}

/*
 * Exports.
 */

var position = {
    'start': start,
    'end': end,
    'isGenerated': isGenerated
};

/*
 * Expose.
 */

module.exports = position;

/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer. All rights reserved.
 * @module Plural
 * @fileoverview Simple functional utility to pluralise
 *   a word based on a count.
 */

'use strict';

/**
 * Simple utility to pluralise `word`, by adding `'s'`,
 * when the given `count` is not `1`.
 *
 * @example
 *   plural('foo', 0); // 'foos'
 *   plural('foo', 1); // 'foo'
 *   plural('foo', 2); // 'foos'
 *
 * @param {string} word - Singular form.
 * @param {number} count - Relative number.
 * @return {string} - Original word with an `s` on the end
 *   if count is not one.
 */
function plural(word, count) {
    return (count === 1 ? word : word + 's');
}

/*
 * Expose.
 */

module.exports = plural;

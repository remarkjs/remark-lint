/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module no-file-name-outer-dashes
 * @fileoverview
 *   Warn when file names contain initial or final dashes.
 * @example
 *   Invalid: -readme.md, readme-.md
 *   Valid: readme.md
 */

'use strict';

/* Expose. */
module.exports = noFileNameOuterDashes;

/**
 * Warn when file names contain initial or final dashes.
 *
 * @param {Node} ast - Root node.
 * @param {File} file - Virtual file.
 */
function noFileNameOuterDashes(ast, file) {
  if (file.filename && /^-|-$/.test(file.filename)) {
    file.warn('Do not use initial or final dashes in a file name');
  }
}

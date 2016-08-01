/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module no-file-name-articles
 * @fileoverview
 *   Warn when file name start with an article.
 * @example
 *   Valid: article.md
 *   Invalid: an-article.md, a-article.md, , the-article.md
 */

'use strict';

/* Expose. */
module.exports = noFileNameArticles;

/**
 * Warn when file name start with an article.
 *
 * @param {Node} ast - Root node.
 * @param {File} file - Virtual file.
 */
function noFileNameArticles(ast, file) {
  var match = file.filename && file.filename.match(/^(the|an?)\b/i);

  if (match) {
    file.warn('Do not start file names with `' + match[0] + '`');
  }
}

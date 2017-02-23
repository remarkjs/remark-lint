/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module final-newline
 * @fileoverview
 *   Warn when a newline at the end of a file is missing.
 *
 *   This rule allows empty files.
 *
 *   See [StackExchange](http://unix.stackexchange.com/questions/18743) for
 *   why.
 */

'use strict';

var rule = require('unified-lint-rule');

module.exports = rule('remark-lint:final-newline', finalNewline);

function finalNewline(ast, file) {
  var contents = file.toString();
  var last = contents.length - 1;

  if (last > -1 && contents.charAt(last) !== '\n') {
    file.message('Missing newline character at end of file');
  }
}

/**
 * @author Titus Wormer
 * @copyright 2016 Titus Wormer
 * @license MIT
 * @module remark:lint:script:util:rules
 * @fileoverview Get a list of rules.
 */

'use strict';

/* Dependencies. */
var fs = require('fs');
var path = require('path');

/* Expose. */
module.exports = rulesSync;

/**
 * Get a list of rules in a package.
 *
 * @param {string} filePath - Package to look into.
 */
function rulesSync(filePath) {
  var basePath = path.join(filePath, 'lib', 'rules');

  return fs.readdirSync(basePath)
    .filter(function (basename) {
      return path.extname(basename) === '.js';
    })
    .map(function (basename) {
      return path.join(basePath, basename);
    });
}

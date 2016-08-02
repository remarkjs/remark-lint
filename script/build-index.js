/**
 * @author Titus Wormer
 * @copyright 2016 Titus Wormer
 * @license MIT
 * @module remark:lint:script:build-indices
 * @fileoverview Creates `index.js` files for rules.
 */

'use strict';

/* Dependencies. */
var fs = require('fs');
var path = require('path');
var chalk = require('chalk');
var rules = require('./util/rules');

/* Generate. */
[path.join(process.cwd())].forEach(function (filePath) {
  var base = path.resolve(filePath, 'lib', 'rules.js');
  var doc = [];

  rules(filePath).forEach(function (rulePath) {
    var name = path.basename(rulePath);
    var relative = './' + path.relative(path.dirname(base), rulePath);

    name = name.slice(0, name.indexOf('.'));

    doc.push(
      '  \'' + name + '\': require(\'' + relative + '\')'
    );
  });

  doc = [].concat(
    [
      '/* This file is generated. */',
      '\'use strict\';',
      'module.exports = {'
    ],
    doc.join(',\n'),
    [
      '};',
      ''
    ]
  ).join('\n');

  fs.writeFileSync(path.join(base), doc);

  console.log(
    chalk.green('✓') +
    ' wrote `index.js` in ' + path.basename(filePath)
  );
});

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
var inspect = require('util').inspect;
var u = require('unist-builder');
var chalk = require('chalk');
var remark = require('remark');
var decamelize = require('decamelize-keys');
var remote = require('../package.json').repository;

var root = path.join(process.cwd(), 'packages');

/* Generate. */
fs
  .readdirSync(root)
  .filter(function (basename) {
    return /remark-preset/.test(basename);
  })
  .forEach(function (basename) {
    var base = path.resolve(root, basename);
    var pack = require(path.join(base, 'package.json'));
    var value = decamelize(require(base).plugins.lint, '-');
    var doc;
    var rows = [];

    rows.push(u('tableRow', [
      u('tableCell', [u('text', 'Rule')]),
      u('tableCell', [u('text', 'Setting')])
    ]));

    Object.keys(value).forEach(function (rule) {
      var url = remote + '/blob/master/doc/rules.md#' + rule;

      rows.push(u('tableRow', [
        u('tableCell', [
          u('link', {url: url, title: null}, [u('inlineCode', rule)])
        ]),
        u('tableCell', [u('inlineCode', inspect(value[rule]))])
      ]));
    });

    doc = u('root', [
      u('html', '<!--This file is generated-->'),
      u('heading', {depth: 1}, [u('text', pack.name)]),
      u('paragraph', [u('text', pack.description + '.')]),
      u('heading', {depth: 2}, [u('text', 'Install')]),
      u('paragraph', [u('text', 'npm:')]),
      u('code', {lang: 'sh'}, 'npm install --save ' + pack.name),
      u('paragraph', [u('text', 'Then, add the following to your config file:')]),
      u('code', {lang: 'diff'}, [
        '   ...',
        '   "remarkConfig": {',
        '+    "presets": [',
        '+      "' + pack.name + '"',
        '+    ]',
        '   }',
        '   ...'
      ].join('\n')),
      u('heading', {depth: 2}, [u('text', 'Rules')]),
      u('paragraph', [
        u('text', 'This preset configures '),
        u('link', {url: remote}, [u('text', 'remark-lint')]),
        u('text', ' with the following rules:')
      ]),
      u('table', {align: []}, rows)
    ]);

    fs.writeFileSync(
      path.join(base, 'readme.md'),
      remark().stringify(doc)
    );

    console.log(
      chalk.green('✓') + ' wrote `readme.md` in `' + basename + '`'
    );
  });

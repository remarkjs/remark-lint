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
var parseAuthor = require('parse-author');
var remote = require('../package.json').repository;
var rules = require('./util/rules');
var rule = require('./util/rule');

var root = path.join(process.cwd(), 'packages');

/* Generate. */
rules(root).forEach(function (basename) {
  var base = path.resolve(root, basename);
  var pack = require(path.join(base, 'package.json'));
  var info = rule(base);
  var tests = info.tests;
  var author = parseAuthor(pack.author);
  var children = [
    u('html', '<!--This file is generated-->'),
    u('heading', {depth: 1}, [u('text', pack.name)])
  ];

  children = children.concat(
    remark().parse(info.description).children,
    u('heading', {depth: 2}, [u('text', 'Install')]),
    u('code', {lang: 'sh'}, 'npm install --save ' + pack.name),
    u('heading', {depth: 2}, [u('text', 'Example')])
  );

  Object.keys(tests).forEach(function (setting) {
    var fixtures = tests[setting];

    Object.keys(fixtures).forEach(function (fileName) {
      var fixture = fixtures[fileName];
      var label = inspect(JSON.parse(setting));
      var sentence;

      if (label === 'true') {
        label = u('text', 'turned on');
      } else {
        label = u('inlineCode', label);
      }

      sentence = [
        u('text', 'When this rule is '),
        label,
        u('text', ', the following file\n'),
        u('inlineCode', fileName),
        u('text', ' is ')
      ];

      if (fixture.output.length !== 0) {
        sentence.push(
          u('strong', [u('text', 'not')]),
          u('text', ' ')
        );
      }

      sentence.push(u('text', 'ok:'));

      if (fixture.input == null) {
        children.push(
          u('paragraph', [
            u('text', 'When '),
            label,
            u('text', ' is passed in, the following error is given:')
          ])
        );
      } else {
        children.push(
          u('paragraph', sentence),
          u('code', {lang: 'markdown'}, fixture.input)
        );
      }

      if (fixture.output.length !== 0) {
        children.push(
          u('code', {lang: 'text'}, fixture.output.join('\n'))
        );
      }
    });
  });

  children = children.concat([
    u('heading', {depth: 2}, [u('text', 'License')]),
    u('paragraph', [
      u('link', {url: remote + '/blob/master/LICENSE'}, [u('text', pack.license)]),
      u('text', ' © '),
      u('link', {url: author.url}, [u('text', author.name)])
    ])
  ]);

  fs.writeFileSync(
    path.join(base, 'readme.md'),
    remark().stringify(u('root', children))
  );

  console.log(
    chalk.green('✓') + ' wrote `readme.md` in `' + basename + '`'
  );
});

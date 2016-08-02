/**
 * @author Titus Wormer
 * @copyright 2016 Titus Wormer
 * @license MIT
 * @module remark:lint:script:build-docs
 * @fileoverview Creates `rules.md` files.
 */

'use strict';

/* Dependencies. */
var fs = require('fs');
var path = require('path');
var inspect = require('util').inspect;
var chalk = require('chalk');
var remark = require('remark');
var toc = require('remark-toc');
var u = require('unist-builder');
var rules = require('./util/rules');
var rule = require('./util/rule');

/* Processor. */
var markdown = remark().use(toc);

/* Generate. */
[path.join(process.cwd())].forEach(function (filePath) {
  var children = [];
  var all = rules(filePath);
  var root;

  rules(filePath).forEach(function (rulePath) {
    var info = rule(rulePath);
    var tests = info.tests;

    children = children.concat(
      u('heading', {depth: 2}, [
        u('inlineCode', info.ruleId)
      ]),
      markdown.parse(info.description).children
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

        if (fixture.output.length) {
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

        if (fixture.output.length) {
          children.push(
            u('code', {lang: 'text'}, fixture.output.join('\n'))
          );
        }
      });
    });
  });

  root = u('root', [].concat(
    markdown.parse([
      '<!-- This file is generated -->',
      '',
      '# List of Rules',
      '',
      'This document describes all (' + all.length + ')',
      'available rules, what they check for, examples of',
      'what they warn for, and how to fix their warnings.',
      '',
      'Note: both camel-cased and dash-cases versions of rule id’s',
      'are supported in configuration objects:',
      '',
      '```json',
      '{',
      '  "final-newline": false',
      '}',
      '```',
      '',
      '...is treated the same as:',
      '',
      '```json',
      '{',
      '  "finalNewline": false',
      '}',
      '```',
      '',
      '## Table of Contents',
      '',
      '## `reset`',
      '',
      'By default, all rules are turned on unless explicitly',
      'set to `false`.  When `reset: true`, the opposite is',
      '`true`: all rules are turned off, unless when given a',
      'non-nully and non-false value.',
      '',
      'Options: `boolean`, default: `false`.',
      '',
      'Explicitly activate rules:',
      '',
      '```json',
      '{',
      '  "reset": true,',
      '  "final-newline": true',
      '}',
      '```',
      '',
      '## `external`',
      '',
      'External contains a list of extra rules to load.  These are,',
      'or refer to, an object mapping `ruleId`s to rules.',
      '',
      'Note that in Node.js, a `string` can be given (a module name',
      'or a file path), but in the browser an object must be passed',
      'in.',
      '',
      'When using a globally installed remark-lint, globally installed',
      'external rules are also loaded.',
      '',
      'The prefix `remark-lint-` can be omitted.',
      '',
      '```js',
      '{',
      '  external: [\'no-empty-sections\', \'./a-local-file.js\']',
      '}',
      '```',
      '',
      'Read more about external rules in',
      '[`doc/external.md`](./external.md).',
      '',
      ''
    ].join('\n')).children,
    children
  ));

  markdown.run(root);

  fs.writeFileSync(
    path.join(filePath, 'doc', 'rules.md'),
    markdown.stringify(root)
  );

  console.log(
    chalk.green('✓') +
    ' wrote docs for ' + all.length + ' rules in ' +
    path.basename(filePath)
  );
});

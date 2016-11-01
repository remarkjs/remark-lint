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
[
  path.join(process.cwd(), 'packages', 'remark-lint')
].forEach(function (filePath) {
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
      'Both camel-cased and dash-cases versions of rule id’s',
      'are supported in configuration objects:',
      '',
      '```json',
      '{',
      '  "final-newline": true',
      '}',
      '```',
      '',
      '...is treated the same as:',
      '',
      '```json',
      '{',
      '  "finalNewline": true',
      '}',
      '```',
      '',
      'Additionally, each rule can be configured with a severity',
      'instead of a boolean as well.  The following is handled the',
      'same as passing `false`:',
      '',
      '```json',
      '{',
      '  "final-newline": [0]',
      '}',
      '```',
      '',
      '...and passing `[1]` is as passing `true`.  To trigger an',
      'error instead of a warning, pass `2`:',
      '',
      '```json',
      '{',
      '  "final-newline": [2]',
      '}',
      '```',
      '',
      'It’s also possible to pass both a severity and configuration:',
      '',
      '```json',
      '{',
      '  "maximum-line-length": [2, 70]',
      '}',
      '```',
      '',
      'Lastly, strings can also be passed, instead of numbers:',
      '`off` instead of `0`, `warn` or `on` instead of `1`, and',
      '`error` instead of `2`.',
      '',
      'For example, as follows:',
      '',
      '```json',
      '{',
      '  "maximum-line-length": ["error", 70]',
      '}',
      '```',
      '',
      '## Table of Contents',
      '',
      '## `reset`',
      '',
      'Since version 5.0.0, **reset** is no longer available, and',
      'it is now the default behaviour.',
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
    path.join(process.cwd(), 'doc', 'rules.md'),
    markdown.stringify(root)
  );

  console.log(
    chalk.green('✓') +
    ' wrote docs for ' + all.length + ' rules in ' +
    path.basename(filePath)
  );
});

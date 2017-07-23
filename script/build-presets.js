'use strict';

var fs = require('fs');
var path = require('path');
var u = require('unist-builder');
var dox = require('dox');
var chalk = require('chalk');
var remark = require('remark');
var strip = require('strip-indent');
var trim = require('trim');
var remote = require('../package.json').repository;
var find = require('./util/find');

var root = path.join(process.cwd(), 'packages');

fs
  .readdirSync(root)
  .filter(function (basename) {
    return /remark-preset/.test(basename);
  })
  .forEach(function (basename) {
    var base = path.resolve(root, basename);
    var pack = require(path.join(base, 'package.json'));
    var doc = fs.readFileSync(path.join(base, 'index.js'), 'utf8');
    var tags = dox.parseComments(doc)[0].tags;
    var description = trim(strip(find(tags, 'fileoverview')));
    var rows = [];
    var children;

    rows.push(u('tableRow', [
      u('tableCell', [u('text', 'Rule')]),
      u('tableCell', [u('text', 'Setting')])
    ]));

    doc.replace(/require\('remark-lint-([^']+)'\)(?:, ([^\]]+)])?/g, function ($0, rule, option) {
      var url = remote + '/tree/master/packages/remark-lint-' + rule;

      rows.push(u('tableRow', [
        u('tableCell', [
          u('link', {url: url, title: null}, [u('inlineCode', rule)])
        ]),
        u('tableCell', option ? [u('inlineCode', option)] : [])
      ]));

      return '';
    });

    children = [
      u('html', '<!--This file is generated-->'),
      u('heading', {depth: 1}, [u('text', pack.name)])
    ];

    children = children.concat(remark().parse(description).children);

    children.push(
      u('heading', {depth: 2}, [u('text', 'Install')]),
      u('paragraph', [u('text', 'npm:')]),
      u('code', {lang: 'sh'}, 'npm install ' + pack.name),
      u('paragraph', [u('text', 'You probably want to use it on the CLI through a config file:')]),
      u('code', {lang: 'diff'}, [
        ' ...',
        ' "remarkConfig": {',
        '+  "plugins": ["' + pack.name + '"]',
        ' }',
        ' ...'
      ].join('\n')),
      u('paragraph', [u('text', 'Or use it on the CLI directly')]),
      u('code', {lang: 'sh'}, 'remark -u ' + pack.name + ' readme.md'),
      u('paragraph', [u('text', 'Or use this on the API:')]),
      u('code', {lang: 'diff'}, [
        ' var remark = require(\'remark\');',
        ' var report = require(\'vfile-reporter\');',
        '',
        ' var file = remark()',
        '+  .use(require(\'' + pack.name + '\'))',
        '   .processSync(\'_Emphasis_ and **importance**\')',
        '',
        ' console.error(report(file));'
      ].join('\n')),
      u('heading', {depth: 2}, [u('text', 'Rules')]),
      u('paragraph', [
        u('text', 'This preset configures '),
        u('link', {url: remote}, [u('text', 'remark-lint')]),
        u('text', ' with the following rules:')
      ]),
      u('table', {align: []}, rows)
    );

    fs.writeFileSync(
      path.join(base, 'readme.md'),
      remark().stringify(u('root', children))
    );

    console.log(chalk.green('✓') + ' wrote `readme.md` in `' + basename + '`');
  });

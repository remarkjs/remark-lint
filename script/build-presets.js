'use strict'

var fs = require('fs')
var path = require('path')
var u = require('unist-builder')
var dox = require('dox')
var chalk = require('chalk')
var remark = require('remark')
var strip = require('strip-indent')
var trim = require('trim')
var parseAuthor = require('parse-author')
var remote = require('../package.json').repository
var find = require('./util/find')
var presets = require('./util/presets')

var root = path.join(process.cwd(), 'packages')

presets(root).forEach(function(basename) {
  var base = path.resolve(root, basename)
  var pack = require(path.join(base, 'package.json'))
  var doc = fs.readFileSync(path.join(base, 'index.js'), 'utf8')
  var tags = dox.parseComments(doc)[0].tags
  var author = parseAuthor(pack.author)
  var description = trim(strip(find(tags, 'fileoverview')))
  var rows = []
  var children
  var short = basename.replace(/^remark-/, '')

  if (basename !== pack.name) {
    throw new Error(
      'Expected package name (`' +
        pack.name +
        '`) to be the same as ' +
        'directory name (`' +
        basename +
        '`)'
    )
  }

  rows.push(
    u('tableRow', [
      u('tableCell', [u('text', 'Rule')]),
      u('tableCell', [u('text', 'Setting')])
    ])
  )

  doc.replace(/require\('remark-lint-([^']+)'\)(?:, ([^\]]+)])?/g, function(
    $0,
    rule,
    option
  ) {
    var url = remote + '/tree/master/packages/remark-lint-' + rule

    rows.push(
      u('tableRow', [
        u('tableCell', [
          u('link', {url: url, title: null}, [u('inlineCode', rule)])
        ]),
        u('tableCell', option ? [u('inlineCode', option)] : [])
      ])
    )

    return ''
  })

  children = [
    u('html', '<!--This file is generated-->'),
    u('heading', {depth: 1}, [u('text', basename)])
  ]

  children = children.concat(remark().parse(description).children)

  children.push(
    u('heading', {depth: 2}, [u('text', 'Rules')]),
    u('paragraph', [
      u('text', 'This preset configures '),
      u('link', {url: remote}, [u('inlineCode', 'remark-lint')]),
      u('text', ' with the following rules:')
    ]),
    u('table', {align: []}, rows),
    u('heading', {depth: 2}, [u('text', 'Install')]),
    u('paragraph', [u('text', 'npm:')]),
    u('code', {lang: 'sh'}, 'npm install ' + basename),
    u('heading', {depth: 2}, [u('text', 'Usage')]),
    u('paragraph', [
      u('text', 'You probably want to use it on the CLI through a config file:')
    ]),
    u(
      'code',
      {lang: 'diff'},
      [
        ' ...',
        ' "remarkConfig": {',
        '+  "plugins": ["' + short + '"]',
        ' }',
        ' ...'
      ].join('\n')
    ),
    u('paragraph', [u('text', 'Or use it on the CLI directly')]),
    u('code', {lang: 'sh'}, 'remark -u ' + short + ' readme.md'),
    u('paragraph', [u('text', 'Or use this on the API:')]),
    u(
      'code',
      {lang: 'diff'},
      [
        " var remark = require('remark');",
        " var report = require('vfile-reporter');",
        '',
        ' remark()',
        "+  .use(require('" + basename + "'))",
        "   .process('_Emphasis_ and **importance**', function (err, file) {",
        '     console.error(report(err || file));',
        '   });'
      ].join('\n')
    ),
    u('heading', {depth: 2}, [u('text', 'License')]),
    u('paragraph', [
      u('link', {url: remote + '/blob/master/LICENSE'}, [
        u('text', pack.license)
      ]),
      u('text', ' © '),
      u('link', {url: author.url}, [u('text', author.name)])
    ])
  )

  fs.writeFileSync(
    path.join(base, 'readme.md'),
    remark().stringify(u('root', children))
  )

  console.log(chalk.green('✓') + ' wrote `readme.md` in `' + basename + '`')
})

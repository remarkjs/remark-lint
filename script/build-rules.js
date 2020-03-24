'use strict'

var fs = require('fs')
var path = require('path')
var inspect = require('util').inspect
var u = require('unist-builder')
var chalk = require('chalk')
var remark = require('remark')
var parseAuthor = require('parse-author')
var remote = require('../package.json').repository
var rules = require('./util/rules')
var rule = require('./util/rule')
var presets = require('./util/presets')
var chars = require('./characters')

var root = path.join(process.cwd(), 'packages')

presets = presets(root).map(function (name) {
  var doc = fs.readFileSync(path.join(root, name, 'index.js'), 'utf8')
  var packages = {}

  doc.replace(/require\('(remark-lint-[^']+)'\)(?:, ([^\]]+)])?/g, function (
    $0,
    rule,
    option
  ) {
    packages[rule] = option || null
    return ''
  })

  return {
    name: name,
    packages: packages
  }
})

rules(root).forEach(function (basename) {
  var base = path.resolve(root, basename)
  var pack = require(path.join(base, 'package.json'))
  var info = rule(base)
  var tests = info.tests
  var author = parseAuthor(pack.author)
  var short = basename.replace(/^remark-/, '')
  var org = remote.split('/').slice(0, -1).join('/')
  var master = remote + '/blob/master'
  var health = org + '/.github'
  var hMaster = health + '/blob/master'
  var slug = remote.split('/').slice(-2).join('/')
  var includes
  var children = [
    u('html', '<!--This file is generated-->'),
    u('heading', {depth: 1}, [u('text', basename)]),
    u('paragraph', [
      u('linkReference', {identifier: 'build'}, [
        u('imageReference', {identifier: 'build-badge', alt: 'Build'})
      ]),
      u('text', '\n'),
      u('linkReference', {identifier: 'coverage'}, [
        u('imageReference', {identifier: 'coverage-badge', alt: 'Coverage'})
      ]),
      u('text', '\n'),
      u('linkReference', {identifier: 'downloads'}, [
        u('imageReference', {identifier: 'downloads-badge', alt: 'Downloads'})
      ]),
      u('text', '\n'),
      u('linkReference', {identifier: 'size'}, [
        u('imageReference', {identifier: 'size-badge', alt: 'Size'})
      ]),
      u('text', '\n'),
      u('linkReference', {identifier: 'collective'}, [
        u('imageReference', {identifier: 'sponsors-badge', alt: 'Sponsors'})
      ]),
      u('text', '\n'),
      u('linkReference', {identifier: 'collective'}, [
        u('imageReference', {identifier: 'backers-badge', alt: 'Backers'})
      ]),
      u('text', '\n'),
      u('linkReference', {identifier: 'chat'}, [
        u('imageReference', {identifier: 'chat-badge', alt: 'Chat'})
      ])
    ])
  ].concat(remark().parse(info.description).children)

  if (basename !== pack.name) {
    throw new Error(
      'Expected package name (`' +
        pack.name +
        '`) to be the same as directory name (`' +
        basename +
        '`)'
    )
  }

  includes = presets.filter(function (preset) {
    return basename in preset.packages
  })

  children.push(u('heading', {depth: 2}, [u('text', 'Presets')]))

  if (includes.length === 0) {
    children.push(
      u('paragraph', [
        u('text', 'This rule is not included in any default preset')
      ])
    )
  } else {
    children.push(
      u('paragraph', [
        u('text', 'This rule is included in the following presets:')
      ]),
      u(
        'table',
        {align: []},
        [
          u('tableRow', [
            u('tableCell', [u('text', 'Preset')]),
            u('tableCell', [u('text', 'Setting')])
          ])
        ].concat(
          includes.map(function (preset) {
            var url = remote + '/tree/master/packages/' + preset.name
            var option = preset.packages[pack.name]

            return u('tableRow', [
              u('tableCell', [
                u('link', {url: url, title: null}, [
                  u('inlineCode', preset.name)
                ])
              ]),
              u('tableCell', option ? [u('inlineCode', option)] : [])
            ])
          })
        )
      )
    )
  }

  Object.keys(tests).forEach(function (setting, index) {
    var fixtures = tests[setting]

    if (index === 0) {
      children.push(u('heading', {depth: 2}, [u('text', 'Example')]))
    }

    Object.keys(fixtures).forEach(function (fileName) {
      var fixture = fixtures[fileName]
      var label = inspect(JSON.parse(setting))
      var clean = fixture.input

      children.push(u('heading', {depth: 5}, [u('inlineCode', fileName)]))

      if (label !== 'true') {
        children.push(
          u('paragraph', [
            u('text', 'When configured with '),
            u('inlineCode', label),
            u('text', '.')
          ])
        )
      }

      if (fixture.input != null && fixture.input.trim() !== '') {
        children.push(u('heading', {depth: 6}, [u('text', 'In')]))

        chars.forEach(function (char) {
          var next = clean.replace(char.in, char.out)

          if (clean !== next) {
            children.push(
              u('paragraph', [
                u('text', 'Note: '),
                u('inlineCode', char.char),
                u('text', ' represents ' + char.name + '.')
              ])
            )

            clean = next
          }
        })

        children.push(u('code', {lang: 'markdown'}, fixture.input))
      }

      children.push(u('heading', {depth: 6}, [u('text', 'Out')]))

      if (fixture.output.length === 0) {
        children.push(u('paragraph', [u('text', 'No messages.')]))
      } else {
        children.push(u('code', {lang: 'text'}, fixture.output.join('\n')))
      }
    })
  })

  children = children.concat([
    u('heading', {depth: 2}, [u('text', 'Install')]),
    u('paragraph', [
      u('linkReference', {identifier: 'npm', referenceType: 'collapsed'}, [
        u('text', 'npm')
      ]),
      u('text', ':')
    ]),
    u('code', {lang: 'sh'}, 'npm install ' + basename),
    u('heading', {depth: 2}, [u('text', 'Use')]),
    u('paragraph', [
      u('text', 'You probably want to use it on the CLI through a config file:')
    ]),
    u(
      'code',
      {lang: 'diff'},
      [
        ' …',
        ' "remarkConfig": {',
        '   "plugins": [',
        '     …',
        '     "lint",',
        '+    "' + short + '",',
        '     …',
        '   ]',
        ' }',
        ' …'
      ].join('\n')
    ),
    u('paragraph', [u('text', 'Or use it on the CLI directly')]),
    u('code', {lang: 'sh'}, 'remark -u lint -u ' + short + ' readme.md'),
    u('paragraph', [u('text', 'Or use this on the API:')]),
    u(
      'code',
      {lang: 'diff'},
      [
        " var remark = require('remark')",
        " var report = require('vfile-reporter')",
        '',
        ' remark()',
        "   .use(require('remark-lint'))",
        "+  .use(require('" + basename + "'))",
        "   .process('_Emphasis_ and **importance**', function (err, file) {",
        '     console.error(report(err || file))',
        '   })'
      ].join('\n')
    ),
    u('heading', {depth: 2}, [u('text', 'Contribute')]),
    u('paragraph', [
      u('text', 'See '),
      u('linkReference', {identifier: 'contributing'}, [
        u('inlineCode', 'contributing.md')
      ]),
      u('text', ' in '),
      u('linkReference', {identifier: 'health'}, [
        u('inlineCode', health.split('/').slice(-2).join('/'))
      ]),
      u('text', ' for ways\nto get started.\nSee '),
      u('linkReference', {identifier: 'support'}, [
        u('inlineCode', 'support.md')
      ]),
      u('text', ' for ways to get help.')
    ]),
    u('paragraph', [
      u('text', 'This project has a '),
      u('linkReference', {identifier: 'coc'}, [u('text', 'code of conduct')]),
      u(
        'text',
        '.\nBy interacting with this repository, organization, or community you agree to\nabide by its terms.'
      )
    ]),
    u('heading', {depth: 2}, [u('text', 'License')]),
    u('paragraph', [
      u('linkReference', {identifier: 'license'}, [u('text', pack.license)]),
      u('text', ' © '),
      u('linkReference', {identifier: 'author'}, [u('text', author.name)])
    ]),
    u('definition', {
      identifier: 'build-badge',
      url: 'https://img.shields.io/travis/' + slug + '/master.svg'
    }),
    u('definition', {
      identifier: 'build',
      url: 'https://travis-ci.org/' + slug
    }),
    u('definition', {
      identifier: 'coverage-badge',
      url: 'https://img.shields.io/codecov/c/github/' + slug + '.svg'
    }),
    u('definition', {
      identifier: 'coverage',
      url: 'https://codecov.io/github/' + slug
    }),
    u('definition', {
      identifier: 'downloads-badge',
      url: 'https://img.shields.io/npm/dm/' + basename + '.svg'
    }),
    u('definition', {
      identifier: 'downloads',
      url: 'https://www.npmjs.com/package/' + basename
    }),
    u('definition', {
      identifier: 'size-badge',
      url: 'https://img.shields.io/bundlephobia/minzip/' + basename + '.svg'
    }),
    u('definition', {
      identifier: 'size',
      url: 'https://bundlephobia.com/result?p=' + basename
    }),
    u('definition', {
      identifier: 'sponsors-badge',
      url: 'https://opencollective.com/unified/sponsors/badge.svg'
    }),
    u('definition', {
      identifier: 'backers-badge',
      url: 'https://opencollective.com/unified/backers/badge.svg'
    }),
    u('definition', {
      identifier: 'collective',
      url: 'https://opencollective.com/unified'
    }),
    u('definition', {
      identifier: 'chat-badge',
      url: 'https://img.shields.io/badge/chat-spectrum.svg'
    }),
    u('definition', {
      identifier: 'chat',
      url: 'https://spectrum.chat/unified/remark'
    }),
    u('definition', {
      identifier: 'npm',
      url: 'https://docs.npmjs.com/cli/install'
    }),
    u('definition', {identifier: 'health', url: health}),
    u('definition', {
      identifier: 'contributing',
      url: hMaster + '/contributing.md'
    }),
    u('definition', {identifier: 'support', url: hMaster + '/support.md'}),
    u('definition', {
      identifier: 'coc',
      url: hMaster + '/code-of-conduct.md'
    }),
    u('definition', {identifier: 'license', url: master + '/license'}),
    u('definition', {identifier: 'author', url: author.url})
  ])

  fs.writeFileSync(
    path.join(base, 'readme.md'),
    remark().stringify(u('root', children))
  )

  console.log(chalk.green('✓') + ' wrote `readme.md` in `' + basename + '`')
})

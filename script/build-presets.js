import fs from 'fs'
import path from 'path'
import {inspect} from 'util'
import u from 'unist-builder'
import dox from 'dox'
import remark from 'remark'
import gfm from 'remark-gfm'
import strip from 'strip-indent'
import parseAuthor from 'parse-author'
import {find} from './util/find.js'
import {presets} from './util/presets.js'

const pkg = JSON.parse(fs.readFileSync('package.json'))
const remote = pkg.repository

var root = path.join(process.cwd(), 'packages')

const presetObjects = await presets(root)

presetObjects.forEach(function ({name, packages}) {
  var base = path.resolve(root, name)
  var pack = JSON.parse(fs.readFileSync(path.join(base, 'package.json')))
  var doc = fs.readFileSync(path.join(base, 'index.js'), 'utf8')
  var tags = dox.parseComments(doc)[0].tags
  var author = parseAuthor(pack.author)
  var description = strip(find(tags, 'fileoverview')).trim()
  var rows = []
  var children
  var short = name.replace(/^remark-/, '')
  var org = remote.split('/').slice(0, -1).join('/')
  var main = remote + '/blob/main'
  var health = org + '/.github'
  var hMain = health + '/blob/HEAD'
  var slug = remote.split('/').slice(-2).join('/')

  if (name !== pack.name) {
    throw new Error(
      'Expected package name (`' +
        pack.name +
        '`) to be the same as ' +
        'directory name (`' +
        name +
        '`)'
    )
  }

  rows.push(
    u('tableRow', [
      u('tableCell', [u('text', 'Rule')]),
      u('tableCell', [u('text', 'Setting')])
    ])
  )

  let rule

  for (rule in packages) {
    var url = remote + '/tree/main/packages/' + rule
    const option = packages[rule]

    if (rule === 'remark-lint') continue

    rows.push(
      u('tableRow', [
        u('tableCell', [
          u('link', {url: url, title: null}, [u('inlineCode', rule)])
        ]),
        u('tableCell', option ? [u('inlineCode', inspect(option))] : [])
      ])
    )
  }

  children = [
    u('html', '<!--This file is generated-->'),
    u('heading', {depth: 1}, [u('text', name)]),
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
    u('paragraph', [
      u('linkReference', {identifier: 'npm', referenceType: 'collapsed'}, [
        u('text', 'npm')
      ]),
      u('text', ':')
    ]),
    u('code', {lang: 'sh'}, 'npm install ' + name),
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
        '+  "plugins": ["' + short + '"]',
        ' }',
        ' …'
      ].join('\n')
    ),
    u('paragraph', [u('text', 'Or use it on the CLI directly')]),
    u('code', {lang: 'sh'}, 'remark -u ' + short + ' readme.md'),
    u('paragraph', [u('text', 'Or use this on the API:')]),
    u(
      'code',
      {lang: 'diff'},
      [
        " var remark = require('remark')",
        " var report = require('vfile-reporter')",
        '',
        ' remark()',
        "+  .use(require('" + name + "'))",
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
      url: 'https://github.com/' + slug + '/workflows/main/badge.svg'
    }),
    u('definition', {
      identifier: 'build',
      url: 'https://github.com/' + slug + '/actions'
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
      url: 'https://img.shields.io/npm/dm/' + name + '.svg'
    }),
    u('definition', {
      identifier: 'downloads',
      url: 'https://www.npmjs.com/package/' + name
    }),
    u('definition', {
      identifier: 'size-badge',
      url: 'https://img.shields.io/bundlephobia/minzip/' + name + '.svg'
    }),
    u('definition', {
      identifier: 'size',
      url: 'https://bundlephobia.com/result?p=' + name
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
      url: 'https://img.shields.io/badge/chat-discussions-success.svg'
    }),
    u('definition', {
      identifier: 'chat',
      url: 'https://github.com/remarkjs/remark/discussions'
    }),
    u('definition', {
      identifier: 'npm',
      url: 'https://docs.npmjs.com/cli/install'
    }),
    u('definition', {identifier: 'health', url: health}),
    u('definition', {
      identifier: 'contributing',
      url: hMain + '/contributing.md'
    }),
    u('definition', {identifier: 'support', url: hMain + '/support.md'}),
    u('definition', {
      identifier: 'coc',
      url: hMain + '/code-of-conduct.md'
    }),
    u('definition', {identifier: 'license', url: main + '/license'}),
    u('definition', {identifier: 'author', url: author.url})
  )

  fs.writeFileSync(
    path.join(base, 'readme.md'),
    remark().use(gfm).stringify(u('root', children))
  )

  console.log('✓ wrote `readme.md` in `' + name + '`')
})

import fs from 'fs'
import path from 'path'
import {inspect} from 'util'
import {u} from 'unist-builder'
import {remark} from 'remark'
import remarkGfm from 'remark-gfm'
import parseAuthor from 'parse-author'
import {rules} from './util/rules.js'
import {rule} from './util/rule.js'
import {presets} from './util/presets.js'
import {characters} from './characters.js'

const own = {}.hasOwnProperty

const pkg = JSON.parse(fs.readFileSync('package.json'))
const remote = pkg.repository
const root = path.join(process.cwd(), 'packages')

presets(root).then((presetObjects) => {
  const allRules = rules(root)
  let index = -1

  while (++index < allRules.length) {
    const basename = allRules[index]
    const base = path.resolve(root, basename)
    const pack = JSON.parse(fs.readFileSync(path.join(base, 'package.json')))
    const info = rule(base)
    const tests = info.tests
    const author = parseAuthor(pack.author)
    const short = basename.replace(/^remark-/, '')
    const camelcased = basename.replace(/-(\w)/g, (_, $1) => $1.toUpperCase())
    const org = remote.split('/').slice(0, -1).join('/')
    const main = remote + '/blob/main'
    const health = org + '/.github'
    const hMain = health + '/blob/HEAD'
    const slug = remote.split('/').slice(-2).join('/')
    let hasGfm = false
    let children = [
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

    const includes = presetObjects.filter((preset) => {
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
            includes.map((preset) => {
              const url = remote + '/tree/main/packages/' + preset.name
              const option = preset.packages[pack.name]

              return u('tableRow', [
                u('tableCell', [
                  u('link', {url, title: null}, [u('inlineCode', preset.name)])
                ]),
                u('tableCell', option ? [u('inlineCode', inspect(option))] : [])
              ])
            })
          )
        )
      )
    }

    let setting
    let first = true

    for (setting in tests) {
      if (own.call(tests, setting)) {
        const fixtures = tests[setting]

        if (first) {
          children.push(u('heading', {depth: 2}, [u('text', 'Example')]))
          first = false
        }

        let fileName

        for (fileName in fixtures) {
          if (own.call(fixtures, fileName)) {
            const fixture = fixtures[fileName]
            const label = inspect(JSON.parse(setting))
            let clean = fixture.input

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

            if (
              fixture.input !== null &&
              fixture.input !== undefined &&
              fixture.input.trim() !== ''
            ) {
              children.push(u('heading', {depth: 6}, [u('text', 'In')]))

              if (fixture.gfm) {
                hasGfm = true
                children.push(
                  u('paragraph', [
                    u('text', 'Note: this example uses '),
                    u(
                      'linkReference',
                      {label: 'GFM', referenceType: 'collapsed'},
                      [u('text', 'GFM')]
                    ),
                    u('text', '.')
                  ])
                )
              }

              let index = -1
              while (++index < characters.length) {
                const char = characters[index]
                const next = clean.replace(char.in, char.out)

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
              }

              children.push(u('code', {lang: 'markdown'}, fixture.input))
            }

            children.push(u('heading', {depth: 6}, [u('text', 'Out')]))

            if (fixture.output.length === 0) {
              children.push(u('paragraph', [u('text', 'No messages.')]))
            } else {
              children.push(
                u('code', {lang: 'text'}, fixture.output.join('\n'))
              )
            }
          }
        }
      }
    }

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
        u(
          'text',
          'You probably want to use it on the CLI through a config file:'
        )
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
          " import {remark} from 'remark'",
          " import {reporter} from 'vfile-reporter'",
          " import remarkLint from 'remark-lint'",
          ' import ' + camelcased + " from '" + basename + "'",
          '',
          ' remark()',
          '   .use(remarkLint)',
          '+  .use(' + camelcased + ')',
          "   .process('_Emphasis_ and **importance**')",
          '   .then((file) => {',
          '     console.error(reporter(file))',
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
    ])

    if (hasGfm) {
      children.push(
        u('definition', {
          identifier: 'gfm',
          url: 'https://github.com/remarkjs/remark-gfm'
        })
      )
    }

    fs.writeFileSync(
      path.join(base, 'readme.md'),
      remark().use(remarkGfm).stringify(u('root', children))
    )

    console.log('✓ wrote `readme.md` in `' + basename + '`')
  }
})

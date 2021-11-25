/**
 * @typedef {import('type-fest').PackageJson} PackageJson
 * @typedef {import('mdast').BlockContent|import('mdast').DefinitionContent} BlockContent
 * @typedef {import('mdast').TableContent} TableContent
 */

import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import {inspect} from 'node:util'
import {remark} from 'remark'
import remarkGfm from 'remark-gfm'
import parseAuthor from 'parse-author'
import {rules} from './util/rules.js'
import {rule} from './util/rule.js'
import {presets} from './util/presets.js'
import {repoUrl} from './util/repo-url.js'
import {characters} from './characters.js'

const own = {}.hasOwnProperty

const remote = repoUrl('package.json')

const root = path.join(process.cwd(), 'packages')

// eslint-disable-next-line complexity
presets(root).then((presetObjects) => {
  const allRules = rules(root)
  let index = -1

  while (++index < allRules.length) {
    const basename = allRules[index]
    const base = path.resolve(root, basename)
    /** @type {PackageJson} */
    const pack = JSON.parse(
      String(fs.readFileSync(path.join(base, 'package.json')))
    )
    const info = rule(base)
    const tests = info.tests
    const author =
      typeof pack.author === 'string' ? parseAuthor(pack.author) : pack.author
    const short = basename.replace(/^remark-/, '')
    const camelcased = basename.replace(
      /-(\w)/g,
      (_, /** @type {string} */ $1) => $1.toUpperCase()
    )
    const org = remote.split('/').slice(0, -1).join('/')
    const main = remote + '/blob/main'
    const health = org + '/.github'
    const hMain = health + '/blob/HEAD'
    const slug = remote.split('/').slice(-2).join('/')
    let hasGfm = false

    /** @type {Array<BlockContent>} */
    // @ts-expect-error: fine.
    const descriptionContent = remark().parse(info.description).children

    if (basename !== pack.name) {
      throw new Error(
        'Expected package name (`' +
          pack.name +
          '`) to be the same as directory name (`' +
          basename +
          '`)'
      )
    }

    const includes = presetObjects.filter(
      (preset) => basename in preset.packages
    )

    /** @type {Array<BlockContent>} */
    const children = [
      {type: 'html', value: '<!--This file is generated-->'},
      {
        type: 'heading',
        depth: 1,
        children: [{type: 'text', value: basename}]
      },
      {
        type: 'paragraph',
        children: [
          {
            type: 'linkReference',
            identifier: 'build',
            referenceType: 'full',
            children: [
              {
                type: 'imageReference',
                identifier: 'build-badge',
                referenceType: 'full',
                alt: 'Build'
              }
            ]
          },
          {type: 'text', value: '\n'},
          {
            type: 'linkReference',
            identifier: 'coverage',
            referenceType: 'full',
            children: [
              {
                type: 'imageReference',
                identifier: 'coverage-badge',
                referenceType: 'full',
                alt: 'Coverage'
              }
            ]
          },
          {type: 'text', value: '\n'},
          {
            type: 'linkReference',
            identifier: 'downloads',
            referenceType: 'full',
            children: [
              {
                type: 'imageReference',
                identifier: 'downloads-badge',
                referenceType: 'full',
                alt: 'Downloads'
              }
            ]
          },
          {type: 'text', value: '\n'},
          {
            type: 'linkReference',
            identifier: 'size',
            referenceType: 'full',
            children: [
              {
                type: 'imageReference',
                identifier: 'size-badge',
                referenceType: 'full',
                alt: 'Size'
              }
            ]
          },
          {type: 'text', value: '\n'},
          {
            type: 'linkReference',
            identifier: 'collective',
            referenceType: 'full',
            children: [
              {
                type: 'imageReference',
                identifier: 'sponsors-badge',
                referenceType: 'full',
                alt: 'Sponsors'
              }
            ]
          },
          {type: 'text', value: '\n'},
          {
            type: 'linkReference',
            identifier: 'collective',
            referenceType: 'full',
            children: [
              {
                type: 'imageReference',
                identifier: 'backers-badge',
                referenceType: 'full',
                alt: 'Backers'
              }
            ]
          },
          {type: 'text', value: '\n'},
          {
            type: 'linkReference',
            identifier: 'chat',
            referenceType: 'full',
            children: [
              {
                type: 'imageReference',
                identifier: 'chat-badge',
                referenceType: 'full',
                alt: 'Chat'
              }
            ]
          }
        ]
      },
      ...descriptionContent
    ]

    if (!info.deprecated) {
      children.push({
        type: 'heading',
        depth: 2,
        children: [{type: 'text', value: 'Presets'}]
      })

      if (includes.length === 0) {
        children.push({
          type: 'paragraph',
          children: [
            {
              type: 'text',
              value: 'This rule is not included in any default preset'
            }
          ]
        })
      } else {
        children.push(
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                value: 'This rule is included in the following presets:'
              }
            ]
          },
          {
            type: 'table',
            align: [],
            children: [
              {
                type: 'tableRow',
                children: [
                  {
                    type: 'tableCell',
                    children: [{type: 'text', value: 'Preset'}]
                  },
                  {
                    type: 'tableCell',
                    children: [{type: 'text', value: 'Setting'}]
                  }
                ]
              },
              ...includes.map((preset) => {
                const option = preset.packages[basename]

                /** @type {TableContent} */
                const row = {
                  type: 'tableRow',
                  children: [
                    {
                      type: 'tableCell',
                      children: [
                        {
                          type: 'link',
                          url: remote + '/tree/main/packages/' + preset.name,
                          title: null,
                          children: [{type: 'inlineCode', value: preset.name}]
                        }
                      ]
                    },
                    {
                      type: 'tableCell',
                      children: option
                        ? [{type: 'inlineCode', value: inspect(option)}]
                        : []
                    }
                  ]
                }

                return row
              })
            ]
          }
        )
      }

      let first = true
      /** @type {string} */
      let setting

      for (setting in tests) {
        if (own.call(tests, setting)) {
          const fixtures = tests[setting]

          if (first) {
            children.push({
              type: 'heading',
              depth: 2,
              children: [{type: 'text', value: 'Example'}]
            })
            first = false
          }

          /** @type {string} */
          let fileName

          for (fileName in fixtures) {
            if (own.call(fixtures, fileName)) {
              const fixture = fixtures[fileName]
              const label = inspect(JSON.parse(setting))
              let clean = fixture.input

              children.push({
                type: 'heading',
                depth: 5,
                children: [{type: 'inlineCode', value: fileName}]
              })

              if (label !== 'true') {
                children.push({
                  type: 'paragraph',
                  children: [
                    {type: 'text', value: 'When configured with '},
                    {type: 'inlineCode', value: label},
                    {type: 'text', value: '.'}
                  ]
                })
              }

              if (
                fixture.input !== null &&
                fixture.input !== undefined &&
                fixture.input.trim() !== ''
              ) {
                children.push({
                  type: 'heading',
                  depth: 6,
                  children: [{type: 'text', value: 'In'}]
                })

                if (fixture.gfm) {
                  hasGfm = true
                  children.push({
                    type: 'paragraph',
                    children: [
                      {type: 'text', value: 'Note: this example uses '},
                      {
                        type: 'linkReference',
                        label: 'GFM',
                        identifier: 'gfm',
                        referenceType: 'collapsed',
                        children: [{type: 'text', value: 'GFM'}]
                      },
                      {type: 'text', value: '.'}
                    ]
                  })
                }

                let index = -1
                while (++index < characters.length) {
                  const char = characters[index]
                  const next = clean.replace(char.in, char.out)

                  if (clean !== next) {
                    children.push({
                      type: 'paragraph',
                      children: [
                        {type: 'text', value: 'Note: '},
                        {type: 'inlineCode', value: char.char},
                        {type: 'text', value: ' represents ' + char.name + '.'}
                      ]
                    })

                    clean = next
                  }
                }

                children.push({
                  type: 'code',
                  lang: 'markdown',
                  value: fixture.input
                })
              }

              children.push({
                type: 'heading',
                depth: 6,
                children: [{type: 'text', value: 'Out'}]
              })

              if (fixture.output.length === 0) {
                children.push({
                  type: 'paragraph',
                  children: [{type: 'text', value: 'No messages.'}]
                })
              } else {
                children.push({
                  type: 'code',
                  lang: 'text',
                  value: fixture.output.join('\n')
                })
              }
            }
          }
        }
      }

      children.push(
        {
          type: 'heading',
          depth: 2,
          children: [{type: 'text', value: 'Install'}]
        },
        {
          type: 'paragraph',
          children: [
            {type: 'text', value: 'This package is '},
            {
              type: 'linkReference',
              identifier: 'esm',
              referenceType: 'full',
              children: [{type: 'text', value: 'ESM only'}]
            },
            {
              type: 'text',
              value: ':\nNode 12+ is needed to use it and it must be '
            },
            {type: 'inlineCode', value: 'imported'},
            {type: 'text', value: 'ed instead of '},
            {type: 'inlineCode', value: 'required'},
            {type: 'text', value: 'd.'}
          ]
        },
        {
          type: 'paragraph',
          children: [
            {
              type: 'linkReference',
              identifier: 'npm',
              referenceType: 'collapsed',
              children: [{type: 'text', value: 'npm'}]
            },
            {type: 'text', value: ':'}
          ]
        },
        {type: 'code', lang: 'sh', value: 'npm install ' + basename},
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              value:
                'This package exports no identifiers.\nThe default export is '
            },
            {
              type: 'inlineCode',
              value: basename.replace(/-(\w)/g, (_, /** @type {string} */ $1) =>
                $1.toUpperCase()
              )
            },
            {type: 'text', value: '.'}
          ]
        },
        {type: 'heading', depth: 2, children: [{type: 'text', value: 'Use'}]},
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              value:
                'You probably want to use it on the CLI through a config file:'
            }
          ]
        },
        {
          type: 'code',
          lang: 'diff',
          value: [
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
        },
        {
          type: 'paragraph',
          children: [{type: 'text', value: 'Or use it on the CLI directly'}]
        },
        {
          type: 'code',
          lang: 'sh',
          value: 'remark -u lint -u ' + short + ' readme.md'
        },
        {
          type: 'paragraph',
          children: [{type: 'text', value: 'Or use this on the API:'}]
        },
        {
          type: 'code',
          lang: 'diff',
          value: [
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
        }
      )
    }

    children.push(
      {
        type: 'heading',
        depth: 2,
        children: [{type: 'text', value: 'Contribute'}]
      },
      {
        type: 'paragraph',
        children: [
          {type: 'text', value: 'See '},
          {
            type: 'linkReference',
            referenceType: 'collapsed',
            identifier: 'contributing',
            children: [{type: 'inlineCode', value: 'contributing.md'}]
          },
          {type: 'text', value: ' in '},
          {
            type: 'linkReference',
            referenceType: 'collapsed',
            identifier: 'health',
            children: [
              {type: 'inlineCode', value: health.split('/').slice(-2).join('/')}
            ]
          },
          {type: 'text', value: ' for ways\nto get started.\nSee '},
          {
            type: 'linkReference',
            referenceType: 'collapsed',
            identifier: 'support',
            children: [{type: 'inlineCode', value: 'support.md'}]
          },
          {type: 'text', value: ' for ways to get help.'}
        ]
      },
      {
        type: 'paragraph',
        children: [
          {type: 'text', value: 'This project has a '},
          {
            type: 'linkReference',
            referenceType: 'collapsed',
            identifier: 'coc',
            children: [{type: 'text', value: 'code of conduct'}]
          },
          {
            type: 'text',
            value:
              '.\nBy interacting with this repository, organization, or community you agree to\nabide by its terms.'
          }
        ]
      },
      {type: 'heading', depth: 2, children: [{type: 'text', value: 'License'}]},
      {
        type: 'paragraph',
        children: [
          {
            type: 'linkReference',
            referenceType: 'collapsed',
            identifier: 'license',
            children: [{type: 'text', value: String(pack.license || '')}]
          },
          {type: 'text', value: ' © '},
          {
            type: 'linkReference',
            referenceType: 'collapsed',
            identifier: 'author',
            children: [
              {type: 'text', value: String((author && author.name) || '')}
            ]
          }
        ]
      },
      {
        type: 'definition',
        identifier: 'build-badge',
        url: 'https://github.com/' + slug + '/workflows/main/badge.svg'
      },
      {
        type: 'definition',
        identifier: 'build',
        url: 'https://github.com/' + slug + '/actions'
      },
      {
        type: 'definition',
        identifier: 'coverage-badge',
        url: 'https://img.shields.io/codecov/c/github/' + slug + '.svg'
      },
      {
        type: 'definition',
        identifier: 'coverage',
        url: 'https://codecov.io/github/' + slug
      },
      {
        type: 'definition',
        identifier: 'downloads-badge',
        url: 'https://img.shields.io/npm/dm/' + basename + '.svg'
      },
      {
        type: 'definition',
        identifier: 'downloads',
        url: 'https://www.npmjs.com/package/' + basename
      },
      {
        type: 'definition',
        identifier: 'size-badge',
        url: 'https://img.shields.io/bundlephobia/minzip/' + basename + '.svg'
      },
      {
        type: 'definition',
        identifier: 'size',
        url: 'https://bundlephobia.com/result?p=' + basename
      },
      {
        type: 'definition',
        identifier: 'sponsors-badge',
        url: 'https://opencollective.com/unified/sponsors/badge.svg'
      },
      {
        type: 'definition',
        identifier: 'backers-badge',
        url: 'https://opencollective.com/unified/backers/badge.svg'
      },
      {
        type: 'definition',
        identifier: 'collective',
        url: 'https://opencollective.com/unified'
      },
      {
        type: 'definition',
        identifier: 'chat-badge',
        url: 'https://img.shields.io/badge/chat-discussions-success.svg'
      },
      {
        type: 'definition',
        identifier: 'chat',
        url: 'https://github.com/remarkjs/remark/discussions'
      }
    )

    if (!info.deprecated) {
      children.push(
        {
          type: 'definition',
          identifier: 'esm',
          url: 'https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c'
        },
        {
          type: 'definition',
          identifier: 'npm',
          url: 'https://docs.npmjs.com/cli/install'
        }
      )
    }

    children.push(
      {
        type: 'definition',
        identifier: 'health',
        url: health
      },
      {
        type: 'definition',
        identifier: 'contributing',
        url: hMain + '/contributing.md'
      },
      {
        type: 'definition',
        identifier: 'support',
        url: hMain + '/support.md'
      },
      {
        type: 'definition',
        identifier: 'coc',
        url: hMain + '/code-of-conduct.md'
      },
      {
        type: 'definition',
        identifier: 'license',
        url: main + '/license'
      },
      {
        type: 'definition',
        identifier: 'author',
        url: String((author && author.url) || '')
      }
    )

    if (hasGfm) {
      children.push({
        type: 'definition',
        identifier: 'gfm',
        url: 'https://github.com/remarkjs/remark-gfm'
      })
    }

    fs.writeFileSync(
      path.join(base, 'readme.md'),
      remark().use(remarkGfm).stringify({type: 'root', children})
    )

    console.log('✓ wrote `readme.md` in `' + basename + '`')
  }
})

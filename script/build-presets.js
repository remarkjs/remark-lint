/**
 * @typedef {import('type-fest').PackageJson} PackageJson
 * @typedef {import('mdast').TableContent} TableContent
 * @typedef {import('mdast').BlockContent|import('mdast').DefinitionContent} BlockContent
 */

import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import {inspect} from 'node:util'
import {parse} from 'comment-parser'
import {remark} from 'remark'
import remarkGfm from 'remark-gfm'
import strip from 'strip-indent'
import parseAuthor from 'parse-author'
import {presets} from './util/presets.js'
import {repoUrl} from './util/repo-url.js'

const remote = repoUrl('package.json')

const own = {}.hasOwnProperty

const root = path.join(process.cwd(), 'packages')

presets(root).then((presetObjects) => {
  let index = -1

  while (++index < presetObjects.length) {
    const {name, packages} = presetObjects[index]
    const base = path.resolve(root, name)
    /** @type {PackageJson} */
    const pack = JSON.parse(
      String(fs.readFileSync(path.join(base, 'package.json')))
    )
    const doc = fs.readFileSync(path.join(base, 'index.js'), 'utf8')
    const tags = parse(doc, {spacing: 'preserve'})[0].tags
    const author =
      typeof pack.author === 'string' ? parseAuthor(pack.author) : pack.author
    const fileoverviewTag = tags.find((d) => d.tag === 'fileoverview')

    if (!fileoverviewTag) {
      throw new Error('Expected `@fileoverview` in jsdoc')
    }

    const description = strip(fileoverviewTag.description).trim()
    const short = name.replace(/^remark-/, '')
    const camelcased = name.replace(/-(\w)/g, (_, /** @type {string} */ $1) =>
      $1.toUpperCase()
    )
    const org = remote.split('/').slice(0, -1).join('/')
    const main = remote + '/blob/main'
    const health = org + '/.github'
    const hMain = health + '/blob/HEAD'
    const slug = remote.split('/').slice(-2).join('/')

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

    /** @type {Array<TableContent>} */
    const rows = []

    rows.push({
      type: 'tableRow',
      children: [
        {type: 'tableCell', children: [{type: 'text', value: 'Rule'}]},
        {type: 'tableCell', children: [{type: 'text', value: 'Setting'}]}
      ]
    })

    /** @type {string} */
    let rule

    for (rule in packages) {
      if (own.call(packages, rule)) {
        const url = remote + '/tree/main/packages/' + rule
        const option = packages[rule]

        if (rule === 'remark-lint') continue

        rows.push({
          type: 'tableRow',
          children: [
            {
              type: 'tableCell',
              children: [
                {
                  type: 'link',
                  url,
                  title: null,
                  children: [{type: 'inlineCode', value: rule}]
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
        })
      }
    }

    /** @type {Array<BlockContent>} */
    // @ts-expect-error: fine.
    const descriptionContent = remark().parse(description).children

    /** @type {Array<BlockContent>} */
    const children = [
      {type: 'html', value: '<!--This file is generated-->'},
      {
        type: 'heading',
        depth: 1,
        children: [{type: 'text', value: name}]
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
      ...descriptionContent,
      {
        type: 'heading',
        depth: 2,
        children: [{type: 'text', value: 'Rules'}]
      },
      {
        type: 'paragraph',
        children: [
          {type: 'text', value: 'This preset configures '},
          {
            type: 'link',
            url: remote,
            children: [{type: 'inlineCode', value: 'remark-lint'}]
          },
          {type: 'text', value: ' with the following rules:'}
        ]
      },
      {type: 'table', align: [], children: rows},
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
      {type: 'code', lang: 'sh', value: 'npm install ' + name},
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
            value: name.replace(/-(\w)/g, (_, /** @type {string} */ $1) =>
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
          '+  "plugins": ["' + short + '"]',
          ' }',
          ' …'
        ].join('\n')
      },
      {
        type: 'paragraph',
        children: [{type: 'text', value: 'Or use it on the CLI directly'}]
      },
      {type: 'code', lang: 'sh', value: 'remark -u ' + short + ' readme.md'},
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
          ' import ' + camelcased + " from '" + name + "'",
          '',
          ' remark()',
          '+  .use(' + camelcased + ')',
          "   .process('_Emphasis_ and **importance**')",
          '   .then((file) => {',
          '     console.error(reporter(file))',
          '   })'
        ].join('\n')
      },
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
        url: 'https://img.shields.io/npm/dm/' + name + '.svg'
      },
      {
        type: 'definition',
        identifier: 'downloads',
        url: 'https://www.npmjs.com/package/' + name
      },
      {
        type: 'definition',
        identifier: 'size-badge',
        url: 'https://img.shields.io/bundlephobia/minzip/' + name + '.svg'
      },
      {
        type: 'definition',
        identifier: 'size',
        url: 'https://bundlephobia.com/result?p=' + name
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
      },
      {
        type: 'definition',
        identifier: 'esm',
        url: 'https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c'
      },
      {
        type: 'definition',
        identifier: 'npm',
        url: 'https://docs.npmjs.com/cli/install'
      },
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
    ]

    fs.writeFileSync(
      path.join(base, 'readme.md'),
      remark().use(remarkGfm).stringify({type: 'root', children})
    )

    console.log('✓ wrote `readme.md` in `' + name + '`')
  }
})

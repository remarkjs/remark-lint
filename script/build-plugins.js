/**
 * @typedef {import('mdast').TableContent} TableContent
 * @typedef {import('mdast').TopLevelContent} TopLevelContent
 *
 * @typedef {import('type-fest').PackageJson} PackageJson
 */

import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import {inspect} from 'node:util'
import {slug as githubSlug} from 'github-slugger'
import {findAndReplace} from 'mdast-util-find-and-replace'
import {fromMarkdown} from 'mdast-util-from-markdown'
import {gfmToMarkdown} from 'mdast-util-gfm'
import {toMarkdown} from 'mdast-util-to-markdown'
import {toString} from 'mdast-util-to-string'
import parseAuthor from 'parse-author'
import {packagesUrl, plugins, presets} from './info.js'
import {characters} from './characters.js'

/** @type {PackageJson} */
const pack = JSON.parse(await fs.readFile('package.json', 'utf8'))
assert(pack.repository && typeof pack.repository === 'object')
const remote = pack.repository.url

let index = -1

while (++index < plugins.length) {
  const info = plugins[index]
  const packageUrl = new URL(info.name + '/', packagesUrl)
  /** @type {PackageJson} */
  const pack = JSON.parse(
    await fs.readFile(new URL('package.json', packageUrl), 'utf8')
  )
  const version = (pack.version || '0').split('.')[0]
  const author =
    typeof pack.author === 'string' ? parseAuthor(pack.author) : pack.author
  const camelcased = info.name.replace(
    /-(\w)/g,
    function (_, /** @type {string} */ $1) {
      return $1.toUpperCase()
    }
  )
  const org = remote.split('/').slice(0, -1).join('/')
  const main = remote + '/blob/main'
  const health = org + '/.github'
  const hMain = health + '/blob/main'
  const slug = remote.split('/').slice(-2).join('/')
  let hasGfm = false
  const descriptionTree = fromMarkdown(info.description)
  const summaryTree = fromMarkdown(info.summary || '')

  // Autolink `remark-lint`
  findAndReplace(summaryTree, [
    /remark-lint/g,
    function () {
      return {
        type: 'linkReference',
        identifier: 'mono',
        referenceType: 'full',
        children: [{type: 'inlineCode', value: 'remark-lint'}]
      }
    }
  ])

  const descriptionContent = /** @type {Array<TopLevelContent>} */ (
    descriptionTree.children
  )
  const summaryContent = /** @type {Array<TopLevelContent>} */ (
    summaryTree.children
  )

  assert.equal(info.name, pack.name, 'expected correct package name')

  /** @type {Map<string, Array<TopLevelContent>>} */
  const categories = new Map()
  let category = 'Intro'
  let contentIndex = -1

  while (++contentIndex < descriptionContent.length) {
    const node = descriptionContent[contentIndex]

    if (node.type === 'heading' && node.depth === 2) {
      category = githubSlug(toString(node))
    }

    let list = categories.get(category)

    if (!list) {
      list = []
      categories.set(category, list)
    }

    list.push(node)
  }

  const includes = presets.filter(function (preset) {
    return preset.plugins.find(function (d) {
      return d[0] === info.name
    })
  })

  /** @type {Array<TopLevelContent>} */
  const children = [
    {type: 'html', value: '<!--This file is generated-->'},
    {
      type: 'heading',
      depth: 1,
      children: [{type: 'text', value: info.name}]
    }
  ]

  if (info.deprecated) {
    children.push(...descriptionContent)
  } else {
    children.push(
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
      ...summaryContent,
      {
        type: 'heading',
        depth: 2,
        children: [{type: 'text', value: 'Contents'}]
      },
      {
        type: 'heading',
        depth: 2,
        children: [{type: 'text', value: 'What is this?'}]
      },
      {
        type: 'paragraph',
        children: [
          {type: 'text', value: 'This package is a '},
          {
            type: 'linkReference',
            identifier: 'unified',
            referenceType: 'collapsed',
            children: [{type: 'text', value: 'unified'}]
          },
          {type: 'text', value: ' ('},
          {
            type: 'linkReference',
            identifier: 'remark',
            referenceType: 'collapsed',
            children: [{type: 'text', value: 'remark'}]
          },
          {
            type: 'text',
            value: ') plugin, specifically a '
          },
          {
            type: 'inlineCode',
            value: 'remark-lint'
          },
          {
            type: 'text',
            value: '\nrule.\nLint rules check markdown code style.'
          }
        ]
      },
      ...(categories.get('when-should-i-use-this') || []),
      {
        type: 'heading',
        depth: 2,
        children: [{type: 'text', value: 'Presets'}]
      }
    )

    if (includes.length === 0) {
      children.push({
        type: 'paragraph',
        children: [
          {
            type: 'text',
            value: 'This rule is not included in a preset maintained here.'
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
            ...includes.map(function (preset) {
              const tuple = preset.plugins.find(function (d) {
                return d[0] === info.name
              })
              assert(tuple)
              const option = tuple[1]

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
            value:
              '.\nIn Node.js (version 12.20+, 14.14+, or 16.0+), ' +
              'install with '
          },
          {
            type: 'linkReference',
            identifier: 'npm',
            referenceType: 'collapsed',
            children: [{type: 'text', value: 'npm'}]
          },
          {type: 'text', value: ':'}
        ]
      },
      {type: 'code', lang: 'sh', value: 'npm install ' + info.name},
      {
        type: 'paragraph',
        children: [
          {type: 'text', value: 'In Deno with '},
          {
            type: 'linkReference',
            identifier: 'esmsh',
            label: 'esmsh',
            referenceType: 'full',
            children: [{type: 'inlineCode', value: 'esm.sh'}]
          },
          {type: 'text', value: ':'}
        ]
      },
      {
        type: 'code',
        lang: 'js',
        value:
          'import ' +
          camelcased +
          " from 'https://esm.sh/" +
          info.name +
          '@' +
          version +
          "'"
      },
      {
        type: 'paragraph',
        children: [
          {type: 'text', value: 'In browsers with '},
          {
            type: 'linkReference',
            identifier: 'esmsh',
            label: 'esmsh',
            referenceType: 'full',
            children: [{type: 'inlineCode', value: 'esm.sh'}]
          },
          {type: 'text', value: ':'}
        ]
      },
      {
        type: 'code',
        lang: 'html',
        value:
          '<script type="module">\n  import ' +
          camelcased +
          " from 'https://esm.sh/" +
          info.name +
          '@' +
          version +
          "?bundle'\n</script>"
      },
      {
        type: 'heading',
        depth: 2,
        children: [{type: 'text', value: 'Use'}]
      },
      {
        type: 'paragraph',
        children: [{type: 'text', value: 'On the API:'}]
      },
      {
        type: 'code',
        lang: 'js',
        value: [
          "import {remark} from 'remark'",
          "import remarkLint from 'remark-lint'",
          'import ' + camelcased + " from '" + info.name + "'",
          "import {read} from 'to-vfile'",
          "import {reporter} from 'vfile-reporter'",
          '',
          "const file = await read('example.md')",
          '',
          'await remark()',
          '  .use(remarkLint)',
          '  .use(' + camelcased + ')',
          '  .process(file)',
          '',
          'console.error(reporter(file))'
        ].join('\n')
      },
      {
        type: 'paragraph',
        children: [{type: 'text', value: 'On the CLI:'}]
      },
      {
        type: 'code',
        lang: 'sh',
        value: 'remark --use remark-lint --use ' + info.name + ' example.md'
      },
      {
        type: 'paragraph',
        children: [
          {
            type: 'text',
            value: 'On the CLI in a config file (here a '
          },
          {
            type: 'inlineCode',
            value: 'package.json'
          },
          {
            type: 'text',
            value: '):'
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
          '     "remark-lint",',
          '+    "' + info.name + '",',
          '     …',
          '   ]',
          ' }',
          ' …'
        ].join('\n')
      }
    )

    const apiCategory = categories.get('api')

    if (apiCategory) {
      const [apiHeading, ...apiBody] = apiCategory

      children.push(
        apiHeading,
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              value:
                'This package exports no identifiers.\nThe default export is '
            },
            {type: 'inlineCode', value: camelcased},
            {type: 'text', value: '.'}
          ]
        },
        {
          type: 'heading',
          depth: 3,
          children: [
            {
              type: 'inlineCode',
              value: 'unified().use(' + camelcased + '[, config])'
            }
          ]
        },
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              value:
                'This rule supports standard configuration that all remark lint rules accept\n(such as '
            },
            {type: 'inlineCode', value: 'false'},
            {type: 'text', value: ' to turn it off or '},
            {type: 'inlineCode', value: '[1, options]'},
            {type: 'text', value: ' to configure it).'}
          ]
        },
        ...apiBody
      )
    }

    children.push(
      ...(categories.get('recommendation') || []),
      ...(categories.get('fix') || []),
      ...(categories.get('example') || [])
    )

    let first = true

    for (const check of info.checks) {
      if (first) {
        children.push({
          type: 'heading',
          depth: 2,
          children: [{type: 'text', value: 'Examples'}]
        })
        first = false
      }

      /** @type {{config: unknown}} */
      const {config} = JSON.parse(check.configuration)
      let clean = check.input

      children.push({
        type: 'heading',
        depth: 5,
        children: [{type: 'inlineCode', value: check.name}]
      })

      if (config !== true) {
        children.push({
          type: 'paragraph',
          children: [
            {type: 'text', value: 'When configured with '},
            {type: 'inlineCode', value: inspect(config)},
            {type: 'text', value: '.'}
          ]
        })
      }

      if (check.input.trim() !== '') {
        children.push({
          type: 'heading',
          depth: 6,
          children: [{type: 'text', value: 'In'}]
        })

        if (check.gfm) {
          hasGfm = true
          children.push({
            type: 'blockquote',
            children: [
              {
                type: 'paragraph',
                children: [
                  {type: 'text', value: '👉 '},
                  {
                    type: 'strong',
                    children: [{type: 'text', value: 'Note'}]
                  },
                  {type: 'text', value: ': this example uses GFM ('},
                  {
                    type: 'linkReference',
                    identifier: 'gfm',
                    referenceType: 'full',
                    children: [{type: 'inlineCode', value: 'remark-gfm'}]
                  },
                  {type: 'text', value: ').'}
                ]
              }
            ]
          })
        }

        let index = -1
        while (++index < characters.length) {
          const char = characters[index]
          const next = clean.replace(char.in, char.out)

          if (clean !== next) {
            children.push({
              type: 'blockquote',
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {type: 'text', value: '👉 '},
                    {
                      type: 'strong',
                      children: [{type: 'text', value: 'Note'}]
                    },
                    {type: 'text', value: ': '},
                    {type: 'inlineCode', value: char.char},
                    {
                      type: 'text',
                      value: ' represents ' + char.name + '.'
                    }
                  ]
                }
              ]
            })

            clean = next
          }
        }

        children.push({
          type: 'code',
          lang: 'markdown',
          value: check.input
        })
      }

      children.push({
        type: 'heading',
        depth: 6,
        children: [{type: 'text', value: 'Out'}]
      })

      if (check.output.length === 0) {
        children.push({
          type: 'paragraph',
          children: [{type: 'text', value: 'No messages.'}]
        })
      } else {
        children.push({
          type: 'code',
          lang: 'text',
          value: check.output.join('\n')
        })
      }
    }

    children.push(
      {
        type: 'heading',
        depth: 2,
        children: [{type: 'text', value: 'Compatibility'}]
      },
      {
        type: 'paragraph',
        children: [
          {
            type: 'text',
            value:
              'Projects maintained by the unified collective are compatible with all maintained\nversions of Node.js.\nAs of now, that is Node.js 12.20+, 14.14+, and 16.0+.\nOur projects sometimes work with older versions, but this is not guaranteed.'
          }
        ]
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
              {
                type: 'inlineCode',
                value: health.split('/').slice(-2).join('/')
              }
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
      }
    )
  }

  children.push(
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
    }
  )

  if (!info.deprecated) {
    children.push(
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
        url: 'https://img.shields.io/npm/dm/' + info.name + '.svg'
      },
      {
        type: 'definition',
        identifier: 'downloads',
        url: 'https://www.npmjs.com/package/' + info.name
      },
      {
        type: 'definition',
        identifier: 'size-badge',
        url: 'https://img.shields.io/bundlephobia/minzip/' + info.name + '.svg'
      },
      {
        type: 'definition',
        identifier: 'size',
        url: 'https://bundlephobia.com/result?p=' + info.name
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
        identifier: 'unified',
        url: 'https://github.com/unifiedjs/unified'
      },
      {
        type: 'definition',
        identifier: 'remark',
        url: 'https://github.com/remarkjs/remark'
      },
      {
        type: 'definition',
        identifier: 'mono',
        url: 'https://github.com/' + slug
      },
      {
        type: 'definition',
        identifier: 'esm',
        url: 'https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c'
      },
      {
        type: 'definition',
        identifier: 'esmsh',
        url: 'https://esm.sh'
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
      }
    )
  }

  children.push(
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

  await fs.writeFile(
    new URL('readme.md', packageUrl),
    toMarkdown({type: 'root', children}, {extensions: [gfmToMarkdown()]})
  )

  console.log('✓ wrote `readme.md` in `' + info.name + '`')
}

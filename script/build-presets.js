/**
 * @typedef {import('mdast').TableContent} TableContent
 * @typedef {import('mdast').TopLevelContent} TopLevelContent
 *
 * @typedef {import('type-fest').PackageJson} PackageJson
 */

import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import {inspect} from 'node:util'
import {parse} from 'comment-parser'
import {findAndReplace} from 'mdast-util-find-and-replace'
import {fromMarkdown} from 'mdast-util-from-markdown'
import {gfmToMarkdown} from 'mdast-util-gfm'
import {toMarkdown} from 'mdast-util-to-markdown'
import parseAuthor from 'parse-author'
import stripIndent from 'strip-indent'
import {packagesUrl, presets} from './info.js'

/** @type {PackageJson} */
const pack = JSON.parse(await fs.readFile('package.json', 'utf8'))
assert(pack.repository && typeof pack.repository === 'object')
const remote = pack.repository.url

for (const {name, plugins} of presets) {
  const packageUrl = new URL(name + '/', packagesUrl)
  /** @type {PackageJson} */
  const pack = JSON.parse(
    await fs.readFile(new URL('package.json', packageUrl), 'utf8')
  )
  const version = (pack.version || '0').split('.')[0]

  const doc = await fs.readFile(new URL('index.js', packageUrl), 'utf8')
  const fileInfo = parse(doc, {spacing: 'preserve'})[0]
  const tags = fileInfo.tags
  const summaryTag = tags.find(function (d) {
    return d.tag === 'summary'
  })
  const author =
    typeof pack.author === 'string' ? parseAuthor(pack.author) : pack.author
  const descriptionTree = fromMarkdown(stripIndent(fileInfo.description).trim())
  const summaryTree = fromMarkdown(
    stripIndent(summaryTag ? summaryTag.description : '').trim()
  )

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

  const camelcased = name.replace(
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

  assert.equal(name, pack.name, 'expected correct package name')

  const descriptionContent = /** @type {Array<TopLevelContent>} */ (
    descriptionTree.children
  )
  const summaryContent = /** @type {Array<TopLevelContent>} */ (
    summaryTree.children
  )

  /** @type {Array<TableContent>} */
  const rows = []

  rows.push({
    type: 'tableRow',
    children: [
      {type: 'tableCell', children: [{type: 'text', value: 'Rule'}]},
      {type: 'tableCell', children: [{type: 'text', value: 'Setting'}]}
    ]
  })

  for (const [rule, option] of plugins) {
    if (rule === 'remark-lint') continue

    rows.push({
      type: 'tableRow',
      children: [
        {
          type: 'tableCell',
          children: [
            {
              type: 'link',
              url: remote + '/tree/main/packages/' + rule,
              children: [{type: 'inlineCode', value: rule}]
            }
          ]
        },
        {
          type: 'tableCell',
          children: option ? [{type: 'inlineCode', value: inspect(option)}] : []
        }
      ]
    })
  }

  /** @type {Array<TopLevelContent>} */
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
          value: ') preset, specifically consisting of\n'
        },
        {
          type: 'inlineCode',
          value: 'remark-lint'
        },
        {
          type: 'text',
          value: ' rules.\nLint rules check markdown code style.'
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
          type: 'linkReference',
          identifier: 'mono',
          referenceType: 'full',
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
    {type: 'code', lang: 'sh', value: 'npm install ' + name},
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
        name +
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
        name +
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
        'import ' + camelcased + " from '" + name + "'",
        "import {read} from 'to-vfile'",
        "import {reporter} from 'vfile-reporter'",
        '',
        "const file = await read('example.md')",
        '',
        'await remark()',
        '  .use(' + camelcased + ')',
        "  .process(await read('example.md'))",
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
      value: 'remark --use ' + name + ' example.md'
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
        '+    "' + name + '",',
        '     …',
        '   ]',
        ' }',
        ' …'
      ].join('\n')
    },
    {type: 'heading', depth: 2, children: [{type: 'text', value: 'API'}]},
    {
      type: 'paragraph',
      children: [
        {
          type: 'text',
          value: 'This package exports no identifiers.\nThe default export is '
        },
        {type: 'inlineCode', value: camelcased},
        {type: 'text', value: '.'}
      ]
    },
    {
      type: 'heading',
      depth: 3,
      children: [
        {type: 'inlineCode', value: 'unified().use(' + camelcased + ')'}
      ]
    },
    {
      type: 'paragraph',
      children: [
        {
          type: 'text',
          value:
            'Use the preset.\nPresets don’t have options.\nYou can reconfigure rules in them by using the afterwards with different\noptions.'
        }
      ]
    },
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

  await fs.writeFile(
    new URL('readme.md', packageUrl),
    toMarkdown({type: 'root', children}, {extensions: [gfmToMarkdown()]})
  )

  console.log('✓ wrote `readme.md` in `' + name + '`')
}

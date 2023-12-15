/**
 * @typedef {import('mdast').Paragraph} Paragraph
 * @typedef {import('mdast').PhrasingContent} PhrasingContent
 * @typedef {import('mdast').Root} Root
 * @typedef {import('mdast').TableContent} TableContent
 * @typedef {import('mdast').TopLevelContent} TopLevelContent
 * @typedef {import('parse-author').Author} Author
 * @typedef {import('type-fest').PackageJson} PackageJson
 */

/**
 * @typedef Specifiers
 *   Parsed specifiers of a module.
 * @property {string | undefined} default
 *   Name of default export.
 * @property {Array<string>} named
 *   Names of named exports.
 *
 * @typedef State
 *   Info passed around.
 * @property {Author} author
 *   Author.
 * @property {string} id
 *   Name of package as a JS identifier.
 * @property {string} license
 *   SPDX.
 * @property {string} name
 *   Name.
 * @property {string | undefined} origin
 *   Name of package as a source + rule id.
 * @property {string} remote
 *   URL to monorepo on GH.
 * @property {Array<string>} types
 *   Names of types.
 * @property {Map<string, string>} urls
 *   Possible definitions for link references.
 * @property {string} versionMajor
 *   Major version of package.
 */

import assert from 'node:assert/strict'
import {exec as execCallback} from 'node:child_process'
import {relative, sep} from 'node:path'
import {fileURLToPath} from 'node:url'
import {inspect, promisify} from 'node:util'
import {parse} from 'comment-parser'
import {name as isIdentifierName} from 'estree-util-is-identifier-name'
import {slug} from 'github-slugger'
import {findAndReplace} from 'mdast-util-find-and-replace'
import {fromMarkdown} from 'mdast-util-from-markdown'
import {gfmFromMarkdown, gfmToMarkdown} from 'mdast-util-gfm'
import {toMarkdown} from 'mdast-util-to-markdown'
import {toString} from 'mdast-util-to-string'
import {gfm} from 'micromark-extension-gfm'
import {normalizeIdentifier} from 'micromark-util-normalize-identifier'
import parseAuthor from 'parse-author'
import stripIndent from 'strip-indent'
import {read} from 'to-vfile'
import {visit} from 'unist-util-visit'
import {VFile} from 'vfile'
import {findDownAll} from 'vfile-find-down'
import {ancestorPackage, packagesUrl, plugins, presets} from './info.js'

const exec = promisify(execCallback)

const collator = new Intl.Collator('en')

/**
 * @param {string} name
 *   Name.
 * @returns {Promise<Array<VFile>>}
 *   Promise to `package.json`s and other metadata files.
 */
export async function pipelinePackage(name) {
  const [[types, dtsFile], packageFile] = await Promise.all([
    readIndexDts(name),
    generatePackageJson(name)
  ])

  /** @type {PackageJson} */
  const packageJson = JSON.parse(String(packageFile))

  /** @type {Author | undefined} */
  let author

  if (typeof packageJson.author === 'string') {
    author = parseAuthor(packageJson.author)
  } else {
    packageFile.message('Expected `author` in local `package.json` as a string')
  }

  assert(author)

  const remote = ancestorPackage.repository
  assert(remote, 'expected `remote` set in monorepo `package.json`')
  assert(
    typeof remote === 'string',
    'expected `remote` as string in monorepo `package.json`'
  )

  const pluginInfo = plugins.find((d) => d.name === name)

  /** @type {State} */
  const state = {
    author,
    id: name.replace(/-([a-z])/g, function (_, /** @type {string} */ $1) {
      return $1.toUpperCase()
    }),
    license: packageJson.license || 'MIT',
    name,
    origin:
      pluginInfo && pluginInfo.ruleId
        ? 'remark-lint:' + pluginInfo.ruleId
        : undefined,
    remote,
    types,
    urls: new Map(),
    versionMajor: (packageJson.version || '0').split('.')[0]
  }

  return [
    dtsFile,
    packageFile,
    generateNmrc(state),
    ...(await generateReadme(state))
  ]
}

/**
 * @param {string} name
 *   Name.
 * @returns {Promise<VFile>}
 *   Files.
 */
async function generatePackageJson(name) {
  const packageUrl = new URL(name + '/', packagesUrl)
  const folderPath = relative(
    fileURLToPath(new URL('../', packagesUrl)),
    fileURLToPath(packageUrl)
  )

  const [files, file, commitResult] = await Promise.all([
    findDownAll(['.js', '.map', '.ts'], fileURLToPath(packageUrl)),
    read(new URL('package.json', packageUrl)),
    exec('git log --all --format="%cN <%cE>" "' + folderPath + '"')
  ])

  const codePaths = files.map(function (file) {
    return relative(fileURLToPath(packageUrl), file.path)
  })

  /** @type {PackageJson} */
  const previousPackage = JSON.parse(String(file))
  assert(ancestorPackage.author)

  const gitContributors = [...new Set(commitResult.stdout.split('\n'))]
    .sort()
    .filter(Boolean)
    .filter(function (d) {
      return !d.includes('<noreply')
    })

  // @ts-expect-error: `type-fest` has bugs.
  /** @satisfies {Partial<PackageJson>} */
  const packageJson = {
    name,
    version: previousPackage.version,
    description: previousPackage.description,
    license: ancestorPackage.license,
    keywords: (previousPackage.keywords || []).sort(),
    repository: ancestorPackage.repository + '/tree/main/' + folderPath,
    bugs: ancestorPackage.bugs,
    funding: ancestorPackage.funding,
    author: ancestorPackage.author,
    contributors:
      gitContributors.length > 0 ? gitContributors : [ancestorPackage.author],
    sideEffects: false,
    type: 'module',
    exports: './index.js',
    files: codePaths
      .map((d) => {
        const index = d.indexOf(sep)
        return index === -1 ? d : d.slice(0, index + 1)
      })
      .filter(function (d, index, all) {
        return all.indexOf(d) === index
      })
      .sort(),
    dependencies: previousPackage.dependencies,
    scripts: {},
    typeCoverage: {
      atLeast: 100,
      detail: true,
      ignoreCatch: true,
      strict: true
    },
    xo: previousPackage.xo || {
      prettier: true,
      rules: {'capitalized-comments': 'off'}
    }
  }

  file.value = JSON.stringify(packageJson, undefined, 2) + '\n'
  file.data.changed = true

  return file
}

/**
 * @param {string} name
 *   Name.
 * @returns {Promise<[Array<string>, VFile]>}
 *   Files.
 */
async function readIndexDts(name) {
  const file = await read(new URL(name + '/index.d.ts', packagesUrl), 'utf8')
  const value = String(file.value)
  /** @type {Array<string>} */
  const symbols = []
  // Note: this is super naïve of course.
  const matches = value.matchAll(/export type (\w+) = (?!import\('[@a-z])/g)

  for (const match of matches) {
    const symbol = match[1]

    if (isIdentifierName(symbol)) {
      const head = symbol.charAt(0)
      assert(head === head.toUpperCase())
      symbols.push(symbol)
    } else {
      const message = file.message('Expected a valid type `' + symbol + '`')
      message.fatal = true
    }
  }

  return [symbols, file]
}

/**
 * @param {State} state
 *   Info passed around.
 * @returns {VFile}
 *   File.
 */
function generateNmrc(state) {
  const file = new VFile({
    path: new URL(state.name + '/.npmrc', packagesUrl),
    value: ['ignore-scripts=true', 'package-lock=false', ''].join('\n')
  })

  file.data.changed = true

  return file
}

/**
 * @param {State} state
 *   Info passed around.
 * @returns {Promise<Array<VFile>>}
 *   Files.
 */
// eslint-disable-next-line complexity
async function generateReadme(state) {
  const packageUrl = new URL(state.name + '/', packagesUrl)
  const moduleUrl = new URL('index.js', packageUrl)
  /** @type {[VFile, Record<string, unknown>]} */
  const [indexFile, indexModule] = await Promise.all([
    read(moduleUrl),
    import(moduleUrl.href)
  ])

  const file = new VFile(new URL('readme.md', packageUrl))

  // Check identifier name.
  if (!isIdentifierName(state.id)) {
    const message = indexFile.message('Expected a valid identifier as name')
    message.fatal = true
  }

  if (
    presets.some(function (d) {
      return d.name === state.name
    })
  ) {
    if (
      !('default' in indexModule) ||
      !indexModule.default ||
      typeof indexModule.default !== 'object'
    ) {
      const message = indexFile.message('Expected `export default` in preset')
      message.fatal = true
    }
  } else if (
    plugins.some(function (d) {
      return d.name === state.name
    })
  ) {
    const name = state.name.startsWith('remark-lint-') ? state.origin : state.id

    assert(name)
    if (
      !('default' in indexModule) ||
      !indexModule.default ||
      typeof indexModule.default !== 'function'
    ) {
      const message = indexFile.message('Expected `export default` in plugin')
      message.fatal = true
    } else if (indexModule.default.name !== name) {
      const message = indexFile.message(
        'Unexpected export default `' +
          indexModule.default.name +
          '`, expected `' +
          name +
          '`'
      )
      message.fatal = true
    }
  }

  /** @type {Specifiers} */
  const specifiers = {
    default:
      'default' in indexModule && indexModule.default ? state.id : undefined,
    named: Object.keys(indexModule).filter(function (d) {
      return d !== 'default'
    })
  }

  const block = parse(String(indexFile), {spacing: 'preserve'})
  const fileInfo = block[0] || {}

  const description = stripIndent(fileInfo.description || '').trim()

  const explicitDocs = fromMarkdown(description, {
    extensions: [gfm()],
    mdastExtensions: [gfmFromMarkdown()]
  })

  /** @type {Record<string, Array<TopLevelContent>>} */
  const categories = {}
  let category = 'intro'
  let contentIndex = -1

  while (++contentIndex < explicitDocs.children.length) {
    const node = /** @type {TopLevelContent} */ (
      explicitDocs.children[contentIndex]
    )

    if (node.type === 'heading' && node.depth === 2) {
      category = slug(toString(node))
    }

    if (!(category in categories)) {
      categories[category] = []
    }

    categories[category].push(node)
  }

  if (!categories.intro || categories.intro.length === 0) {
    indexFile.message('Missing `intro` section in description')
  }

  if (!categories.use) {
    if (
      plugins.some(function (d) {
        return d.name === state.name
      }) ||
      presets.some(function (d) {
        return d.name === state.name
      })
    ) {
      categories.use = generateReadmePluggableUseSection(state)
    } else {
      indexFile.message('Missing `use` section in description')
    }
  }

  if (!categories.api) {
    indexFile.message('Missing `api` section in description')
    categories.api = []
  }

  const [apiHeading, ...apiRest] = categories.api || []

  if (categories.intro) {
    state.urls.set('github-remark', 'https://github.com/remarkjs/remark')
    state.urls.set(
      'github-remark-lint',
      'https://github.com/remarkjs/remark-lint'
    )
    state.urls.set('github-unified', 'https://github.com/unifiedjs/unified')
    /** @type {Root} */
    const fragment = {type: 'root', children: categories.intro}
    findAndReplace(
      fragment,
      ['remark-lint', 'remark', 'unified'].map(function (d) {
        return [
          new RegExp('\\b' + d + '\\b(?!-)', 'g'),
          function () {
            const code = d === 'remark-lint'
            /** @type {PhrasingContent} */
            let result = code
              ? {type: 'inlineCode', value: d}
              : {type: 'text', value: d}

            result = {
              type: 'linkReference',
              identifier: 'github-' + d,
              referenceType: code ? 'full' : 'collapsed',
              children: [result]
            }

            if (d === 'remark' || d === 'unified') {
              result = {type: 'strong', children: [result]}
            }

            return result
          }
        ]
      })
    )
  }

  /** @type {Array<TopLevelContent>} */
  const topLevelContent = [
    ...generateReadmeHead(state),
    ...generateReadmeMeta(state),
    ...(categories.intro || []),
    {type: 'heading', depth: 2, children: [{type: 'text', value: 'Contents'}]},
    ...(categories['what-is-this'] || []),
    ...(categories['when-should-i-use-this'] || []),
    ...generateReadmeIncludes(state),
    ...generateReadmeInstall(state, specifiers),
    ...(categories.use || []),
    ...(apiHeading
      ? [apiHeading, ...generateReadmeApiByline(state, specifiers), ...apiRest]
      : []),
    ...(categories.recommendation || []),
    ...(categories.fix || []),
    ...(categories.examples || generateReadmeExample(state)),
    ...generateReadmeTail(state)
  ]

  /** @type {Root} */
  const tree = {type: 'root', children: topLevelContent}
  /** @type {Set<string>} */
  const used = new Set()

  visit(tree, function (node, index, parent) {
    if (node.type === 'definition' && parent && typeof index === 'number') {
      const id = normalizeIdentifier(node.identifier).toLowerCase()
      state.urls.set(id, node.url)
      parent.children.splice(index, 1)
      return index
    }
  })

  visit(tree, function (node) {
    if ('identifier' in node && 'referenceType' in node) {
      const id = normalizeIdentifier(node.identifier).toLowerCase()

      if (state.urls.has(id)) {
        used.add(id)
      } else {
        file.message(
          'Missing link reference in `state.urls` for `' + id + '`',
          node
        )
      }
    }
  })

  for (const identifier of [...used].sort()) {
    const url = state.urls.get(identifier)
    assert(url)
    tree.children.push({type: 'definition', identifier, url})
  }

  file.value = toMarkdown(tree, {extensions: [gfmToMarkdown()]})
  file.data.changed = true

  return [file, indexFile]
}

/**
 * @param {State} state
 *   Info passed around.
 * @returns {Array<TopLevelContent>}
 *   Content.
 */
function generateReadmeHead(state) {
  return [
    {type: 'html', value: '<!--This file is generated-->'},
    {
      type: 'heading',
      depth: 1,
      children: [{type: 'text', value: state.name}]
    }
  ]
}

/**
 * @param {State} state
 *   Info passed around.
 * @returns {Array<TopLevelContent>}
 *   Content.
 */
function generateReadmeMeta(state) {
  const ghSlug = state.remote.split('/').slice(-2).join('/')
  const ghUrl = 'https://github.com/' + ghSlug

  state.urls.set('badge-build-url', ghUrl + '/actions')
  state.urls.set('badge-build-image', ghUrl + '/workflows/main/badge.svg')
  state.urls.set('badge-coverage-url', 'https://codecov.io/github/' + ghSlug)
  state.urls.set(
    'badge-coverage-image',
    'https://img.shields.io/codecov/c/github/' + ghSlug + '.svg'
  )
  state.urls.set(
    'badge-downloads-url',
    'https://www.npmjs.com/package/' + state.name
  )
  state.urls.set(
    'badge-downloads-image',
    'https://img.shields.io/npm/dm/' + state.name + '.svg'
  )
  state.urls.set('badge-size-url', 'https://bundlejs.com/?q=' + state.name)
  state.urls.set(
    'badge-size-image',
    'https://img.shields.io/bundlejs/size/' + state.name
  )
  state.urls.set('badge-funding-url', 'https://opencollective.com/unified')
  state.urls.set(
    'badge-funding-sponsors-image',
    'https://opencollective.com/unified/sponsors/badge.svg'
  )
  state.urls.set(
    'badge-funding-backers-image',
    'https://opencollective.com/unified/backers/badge.svg'
  )
  state.urls.set(
    'badge-chat-url',
    'https://github.com/remarkjs/remark/discussions'
  )
  state.urls.set(
    'badge-chat-image',
    'https://img.shields.io/badge/chat-discussions-success.svg'
  )

  return [
    {
      type: 'paragraph',
      children: [
        {
          type: 'linkReference',
          identifier: 'badge-build-url',
          referenceType: 'full',
          children: [
            {
              type: 'imageReference',
              identifier: 'badge-build-image',
              referenceType: 'full',
              alt: 'Build'
            }
          ]
        },
        {type: 'text', value: '\n'},
        {
          type: 'linkReference',
          identifier: 'badge-coverage-url',
          referenceType: 'full',
          children: [
            {
              type: 'imageReference',
              identifier: 'badge-coverage-image',
              referenceType: 'full',
              alt: 'Coverage'
            }
          ]
        },
        {type: 'text', value: '\n'},
        {
          type: 'linkReference',
          identifier: 'badge-downloads-url',
          referenceType: 'full',
          children: [
            {
              type: 'imageReference',
              identifier: 'badge-downloads-image',
              referenceType: 'full',
              alt: 'Downloads'
            }
          ]
        },
        {type: 'text', value: '\n'},
        {
          type: 'linkReference',
          identifier: 'badge-size-url',
          referenceType: 'full',
          children: [
            {
              type: 'imageReference',
              identifier: 'badge-size-image',
              referenceType: 'full',
              alt: 'Size'
            }
          ]
        },
        {type: 'text', value: '\n'},
        {
          type: 'linkReference',
          identifier: 'badge-funding-url',
          referenceType: 'full',
          children: [
            {
              type: 'imageReference',
              identifier: 'badge-funding-sponsors-image',
              referenceType: 'full',
              alt: 'Sponsors'
            }
          ]
        },
        {type: 'text', value: '\n'},
        {
          type: 'linkReference',
          identifier: 'badge-funding-url',
          referenceType: 'full',
          children: [
            {
              type: 'imageReference',
              identifier: 'badge-funding-backers-image',
              referenceType: 'full',
              alt: 'Backers'
            }
          ]
        },
        {type: 'text', value: '\n'},
        {
          type: 'linkReference',
          identifier: 'badge-chat-url',
          referenceType: 'full',
          children: [
            {
              type: 'imageReference',
              identifier: 'badge-chat-image',
              referenceType: 'full',
              alt: 'Chat'
            }
          ]
        }
      ]
    }
  ]
}

/**
 * @param {State} state
 *   Info passed around.
 * @returns {Array<TopLevelContent>}
 *   Content.
 */
function generateReadmeIncludes(state) {
  /** @type {Array<[presetName: string, options: unknown]>} */
  const inPresets = []
  /** @type {Array<[name: string, options: unknown]>} */
  let pluginsInPreset = []

  for (const preset of presets) {
    if (preset.name === state.name) {
      pluginsInPreset = preset.plugins
    }

    for (const [name, options] of preset.plugins) {
      if (name === state.name) {
        inPresets.push([preset.name, options])
      }
    }
  }

  pluginsInPreset.sort(function (a, b) {
    return collator.compare(a[0], b[0])
  })

  inPresets.sort(function (a, b) {
    return collator.compare(a[0], b[0])
  })

  /** @type {Array<TopLevelContent>} */
  const children = []

  if (
    presets.some(function (d) {
      return d.name === state.name
    })
  ) {
    assert(pluginsInPreset.length > 0, 'expected plugins in preset')
    /** @type {Array<TopLevelContent>} */
    children.push(
      {
        type: 'heading',
        depth: 2,
        children: [{type: 'text', value: 'Plugins'}]
      },
      {
        type: 'paragraph',
        children: [
          {
            type: 'text',
            value: 'This preset includes the following plugins:'
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
                children: [{type: 'text', value: 'Plugin'}]
              },
              {
                type: 'tableCell',
                children: [{type: 'text', value: 'Options'}]
              }
            ]
          },
          ...pluginsInPreset.map(function ([name, options]) {
            /** @type {TableContent} */
            const row = {
              type: 'tableRow',
              children: [
                {
                  type: 'tableCell',
                  children: [
                    {
                      type: 'link',
                      url: state.remote + '/tree/main/packages/' + name,
                      children: [{type: 'inlineCode', value: name}]
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  children: options
                    ? [{type: 'inlineCode', value: inspect(options)}]
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

  if (
    plugins.some(function (d) {
      return d.name === state.name
    })
  ) {
    children.push({
      type: 'heading',
      depth: 2,
      children: [{type: 'text', value: 'Presets'}]
    })

    if (inPresets.length === 0) {
      children.push({
        type: 'paragraph',
        children: [
          {
            type: 'text',
            value: 'This plugin is not included in presets maintained here.'
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
              value: 'This plugin is included in the following presets:'
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
                  children: [{type: 'text', value: 'Options'}]
                }
              ]
            },
            ...inPresets.map(function ([name, options]) {
              /** @type {TableContent} */
              const row = {
                type: 'tableRow',
                children: [
                  {
                    type: 'tableCell',
                    children: [
                      {
                        type: 'link',
                        url: state.remote + '/tree/main/packages/' + name,
                        children: [{type: 'inlineCode', value: name}]
                      }
                    ]
                  },
                  {
                    type: 'tableCell',
                    children: options
                      ? [{type: 'inlineCode', value: inspect(options)}]
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
  }

  return children
}

/**
 * @param {State} state
 *   Info passed around.
 * @param {Specifiers} specifiers
 *   Specifiers.
 * @returns {Array<TopLevelContent>}
 *   Content.
 */
function generateReadmeInstall(state, specifiers) {
  let defaultImportSummary = specifiers.default
  /** @type {string | undefined} */
  let specifiersImportSummary

  const named = [...specifiers.named].sort()

  if (named.length > 3) {
    // Star import will include the default.
    defaultImportSummary = undefined
    specifiersImportSummary = '* as ' + state.id
  } else if (named.length > 0) {
    specifiersImportSummary = '{' + named.join(', ') + '}'
  }

  const importCodeSummary =
    defaultImportSummary && specifiersImportSummary
      ? defaultImportSummary + ', ' + specifiersImportSummary
      : defaultImportSummary || specifiersImportSummary
  assert(importCodeSummary)

  state.urls.set(
    'github-gist-esm',
    'https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c'
  )
  state.urls.set('npm-install', 'https://docs.npmjs.com/cli/install')
  state.urls.set('esm-sh', 'https://esm.sh')

  return [
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
          identifier: 'github-gist-esm',
          referenceType: 'full',
          children: [{type: 'text', value: 'ESM only'}]
        },
        {
          type: 'text',
          value: '.\nIn Node.js (version 16+),\ninstall with '
        },
        {
          type: 'linkReference',
          identifier: 'npm-install',
          referenceType: 'collapsed',
          children: [{type: 'text', value: 'npm'}]
        },
        {type: 'text', value: ':'}
      ]
    },
    {type: 'code', lang: 'sh', value: 'npm install ' + state.name},
    {
      type: 'paragraph',
      children: [
        {type: 'text', value: 'In Deno with '},
        {
          type: 'linkReference',
          identifier: 'esm-sh',
          label: 'esm-sh',
          referenceType: 'full',
          children: [{type: 'inlineCode', value: 'esm.sh'}]
        },
        {type: 'text', value: ':'}
      ]
    },
    {
      type: 'code',
      // Idea: use estree, prettier?
      lang: 'js',
      value:
        'import ' +
        importCodeSummary +
        " from 'https://esm.sh/" +
        state.name +
        '@' +
        state.versionMajor +
        "'"
    },
    {
      type: 'paragraph',
      children: [
        {type: 'text', value: 'In browsers with '},
        {
          type: 'linkReference',
          identifier: 'esm-sh',
          label: 'esm-sh',
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
        importCodeSummary +
        " from 'https://esm.sh/" +
        state.name +
        '@' +
        state.versionMajor +
        "?bundle'\n</script>"
    }
  ]
}

/**
 * @param {State} state
 *   Info passed around.
 * @returns {Array<TopLevelContent>}
 *   Content.
 */
function generateReadmePluggableUseSection(state) {
  const addRemark =
    state.name !== 'remark-lint' &&
    plugins.some(function (d) {
      return d.name === state.name
    })
  /** @type {Array<[string, string]>} */
  const imports = [
    [state.id, state.name],
    ['remarkParse', 'remark-parse'],
    ['remarkStringify', 'remark-stringify'],
    ['{read}', 'to-vfile'],
    ['{unified}', 'unified'],
    ['{reporter}', 'vfile-reporter']
  ]

  if (addRemark) {
    imports.push(['remarkLint', 'remark-lint'])
  }

  imports.sort(function (a, b) {
    return a[1].localeCompare(b[1])
  })

  const apiLines = [
    ...imports.map(function (d) {
      return 'import ' + d[0] + " from '" + d[1] + "'"
    }),
    '',
    "const file = await read('example.md')",
    '',
    'await unified()',
    '  .use(remarkParse)'
  ]

  if (addRemark) {
    apiLines.push('  .use(remarkLint)')
  }

  apiLines.push(
    '  .use(' + state.id + ')',
    '  .use(remarkStringify)',
    '  .process(file)',
    '',
    'console.error(reporter(file))'
  )

  const cliLines = [' …', ' "remarkConfig": {', '   "plugins": [', '     …']

  if (addRemark) {
    cliLines.push('     "remark-lint",')
  }

  cliLines.push('+    "' + state.name + '",', '     …', '   ]', ' }', ' …')

  // Idea: use estree, prettier?
  const api = apiLines.join('\n')
  const cli = cliLines.join('\n')

  return [
    {type: 'heading', depth: 2, children: [{type: 'text', value: 'Use'}]},
    {
      type: 'paragraph',
      children: [{type: 'text', value: 'On the API:'}]
    },
    {
      type: 'code',
      lang: 'js',
      value: api
    },
    {type: 'paragraph', children: [{type: 'text', value: 'On the CLI:'}]},
    {
      type: 'code',
      lang: 'sh',
      value:
        'remark --frail' +
        (addRemark ? ' --use remark-lint' : '') +
        ' --use ' +
        state.name +
        ' .'
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
      value: cli
    }
  ]
}

/**
 * @param {State} state
 *   Info passed around.
 * @param {Specifiers} specifiers
 *   Specifiers.
 * @returns {Array<TopLevelContent>}
 *   Content.
 */
function generateReadmeApiByline(state, specifiers) {
  /** @type {Paragraph} */
  const byline = {type: 'paragraph', children: []}
  const named = [...specifiers.named].sort()

  if (named.length > 0) {
    byline.children.push({
      type: 'text',
      value:
        'This package exports the identifier' +
        (named.length === 1 ? '' : 's') +
        '\n'
    })

    let index = -1

    while (++index < named.length) {
      if (index !== 0) {
        byline.children.push(
          named.length === 2
            ? {type: 'text', value: ' and\n'}
            : named.length - 1 === index
              ? {type: 'text', value: ', and\n'}
              : {type: 'text', value: ',\n'}
        )
      }

      const specifier = named[index]

      byline.children.push({
        type: 'linkReference',
        identifier: 'api-' + dashCase(specifier),
        referenceType: 'full',
        children: [{type: 'inlineCode', value: specifier}]
      })
    }

    byline.children.push({type: 'text', value: '.'})
  } else {
    byline.children.push({
      type: 'text',
      value: 'This package exports no identifiers.'
    })
  }

  state.urls.set('typescript', 'https://www.typescriptlang.org')

  const types = [...state.types].sort()

  if (types.length === 0) {
    byline.children.push(
      {type: 'text', value: '\nIt exports no additional '},
      {
        type: 'linkReference',
        identifier: 'typescript',
        referenceType: 'collapsed',
        children: [{type: 'text', value: 'TypeScript'}]
      },
      {type: 'text', value: ' types.'}
    )
  } else {
    byline.children.push(
      {type: 'text', value: '\nIt exports the '},
      {
        type: 'linkReference',
        identifier: 'typescript',
        referenceType: 'collapsed',
        children: [{type: 'text', value: 'TypeScript'}]
      },
      {
        type: 'text',
        value: ' type' + (types.length === 1 ? '' : 's') + '\n'
      }
    )

    let index = -1

    while (++index < types.length) {
      if (index !== 0) {
        byline.children.push(
          types.length === 2
            ? {type: 'text', value: ' and\n'}
            : types.length - 1 === index
              ? {type: 'text', value: ', and\n'}
              : {type: 'text', value: ',\n'}
        )
      }

      const type = types[index]

      byline.children.push({
        type: 'linkReference',
        identifier: 'api' + dashCase(type),
        referenceType: 'full',
        children: [{type: 'inlineCode', value: type}]
      })
    }

    byline.children.push({type: 'text', value: '.'})
  }

  if (specifiers.default) {
    byline.children.push(
      {type: 'text', value: '\nThe default export is\n'},
      {
        type: 'linkReference',
        identifier: 'api-' + dashCase(specifiers.default),
        referenceType: 'full',
        children: [{type: 'inlineCode', value: specifiers.default}]
      },
      {type: 'text', value: '.'}
    )
  } else {
    byline.children.push({type: 'text', value: '\nThere is no default export.'})
  }

  return [byline]
}

/**
 * @param {State} state
 *   Info passed around.
 * @returns {Array<TopLevelContent>}
 *   Content.
 */
function generateReadmeExample(state) {
  const info = plugins.find(function (d) {
    return d.name === state.name
  })
  /** @type {Array<TopLevelContent>} */
  const children = []
  const checks = info?.checks || []
  let first = true

  for (const check of checks) {
    if (first) {
      children.push({
        type: 'heading',
        depth: 2,
        children: [{type: 'text', value: 'Examples'}]
      })

      first = false
    }

    children.push({
      type: 'heading',
      depth: 5,
      children: [{type: 'inlineCode', value: check.name}]
    })

    /** @type {{config: unknown}} */
    const {config} = JSON.parse(check.configuration)

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

    const empty = check.input.trim() === ''

    state.urls.set(
      'github-remark-gfm',
      'https://github.com/remarkjs/remark-gfm'
    )
    state.urls.set(
      'github-remark-mdx',
      'https://mdxjs.com/packages/remark-mdx/'
    )

    if (!empty) {
      children.push({
        type: 'heading',
        depth: 6,
        children: [{type: 'text', value: 'In'}]
      })

      /** @type {Array<PhrasingContent>} */
      const phrasing = []

      if (check.gfm) {
        phrasing.push(
          {type: 'text', value: 'GFM ('},
          {
            type: 'linkReference',
            identifier: 'github-remark-gfm',
            referenceType: 'full',
            children: [{type: 'inlineCode', value: 'remark-gfm'}]
          },
          {type: 'text', value: ')'}
        )
      }

      if (check.mdx) {
        if (phrasing.length > 0) {
          phrasing.push({type: 'text', value: ',\n'})
        }

        phrasing.push(
          {type: 'text', value: 'MDX ('},
          {
            type: 'linkReference',
            identifier: 'github-remark-mdx',
            referenceType: 'full',
            children: [{type: 'inlineCode', value: 'remark-mdx'}]
          },
          {type: 'text', value: ')'}
        )
      }

      if (phrasing.length > 0) {
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
                {type: 'text', value: ': this example uses\n'},
                ...phrasing,
                {type: 'text', value: '.'}
              ]
            }
          ]
        })
      }

      children.push({
        type: 'code',
        lang: check.mdx ? 'mdx' : 'markdown',
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

  return children
}

/**
 * @param {State} state
 *   Info passed around.
 * @returns {Array<TopLevelContent>}
 *   Content.
 */
function generateReadmeTail(state) {
  const org = state.remote.split('/').slice(0, -1).join('/')
  const health = org + '/.github'
  const hMain = health + '/blob/main'

  state.urls.set('github-dotfiles-coc', hMain + '/code-of-conduct.md')
  state.urls.set('github-dotfiles-contributing', hMain + '/contributing.md')
  state.urls.set('github-dotfiles-health', health)
  state.urls.set('github-dotfiles-support', hMain + '/support.md')
  state.urls.set('file-license', state.remote + '/blob/main/license')
  state.urls.set('author', String(state.author.url || ''))

  return [
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
            'Projects maintained by the unified collective are compatible with maintained\nversions of Node.js.\n\nWhen we cut a new major release, we drop support for unmaintained versions of\nNode.\nThis means we try to keep the current release line,\n'
        },
        {
          type: 'inlineCode',
          value: state.name + '@' + state.versionMajor
        },
        {
          type: 'text',
          value: ',\ncompatible with Node.js 12.'
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
          referenceType: 'full',
          identifier: 'github-dotfiles-contributing',
          children: [{type: 'inlineCode', value: 'contributing.md'}]
        },
        {type: 'text', value: ' in '},
        {
          type: 'linkReference',
          referenceType: 'full',
          identifier: 'github-dotfiles-health',
          children: [{type: 'inlineCode', value: 'remarkjs/.github'}]
        },
        {type: 'text', value: ' for ways\nto get started.\nSee '},
        {
          type: 'linkReference',
          referenceType: 'full',
          identifier: 'github-dotfiles-support',
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
          referenceType: 'full',
          identifier: 'github-dotfiles-coc',
          children: [{type: 'text', value: 'code of conduct'}]
        },
        {
          type: 'text',
          value:
            '.\nBy interacting with this repository, organization, or community you agree to\nabide by its terms.'
        }
      ]
    },
    {
      type: 'heading',
      depth: 2,
      children: [{type: 'text', value: 'License'}]
    },
    {
      type: 'paragraph',
      children: [
        {
          type: 'linkReference',
          referenceType: 'full',
          identifier: 'file-license',
          children: [{type: 'text', value: String(state.license || '')}]
        },
        {type: 'text', value: ' © '},
        {
          type: 'linkReference',
          referenceType: 'full',
          identifier: 'author',
          children: [{type: 'text', value: String(state.author.name || '')}]
        }
      ]
    }
  ]
}

/**
 * @param {string} value
 * @returns {string}
 */
function dashCase(value) {
  return value.replace(/[A-Z]/g, replacer)

  /**
   * @param {string} $0
   * @returns {string}
   */
  function replacer($0) {
    return '-' + $0.toLowerCase()
  }
}

/**
 * @typedef {import('unified').Preset} Preset
 * @typedef {import('type-fest').PackageJson} PackageJson
 */

/**
 * @typedef Check
 *   Check.
 * @property {string} configuration
 *   Configuration.
 * @property {boolean} directive
 *   Whether to use directives.
 * @property {boolean} frontmatter
 *   Whether to use frontmatter.
 * @property {boolean} gfm
 *   Whether to use GFM.
 * @property {string} input
 *   Input.
 * @property {boolean} math
 *   Whether to use math.
 * @property {boolean} mdx
 *   Whether to use MDX.
 * @property {string} name
 *   Name.
 * @property {Array<string>} output
 *   Output.
 * @property {boolean} positionless
 *   Whether this check also applies without positions.
 *
 * @typedef ExampleInfo
 *   Example.
 * @property {unknown} [config]
 *   Configuration (optional).
 * @property {boolean} [directive]
 *   Whether to use directives (optional).
 * @property {boolean} [frontmatter]
 *   Whether to use frontmatter (optional).
 * @property {boolean} [gfm]
 *   Whether to use GFM (optional).
 * @property {'input' | 'output'} [label]
 *   Label (optional).
 * @property {boolean} [math]
 *   Whether to use math.
 * @property {boolean} [mdx]
 *   Whether to use MDX (optional).
 * @property {boolean} [positionless]
 *   Whether this check also applies without positions (optional).
 * @property {string} name
 *   Name.
 *
 * @typedef PluginInfo
 *   Plugin.
 * @property {string} description
 *   Description.
 * @property {string} name
 *   Name.
 * @property {string | undefined} ruleId
 *   Rule ID.
 * @property {Array<Check>} checks
 *   Checks.
 *
 * @typedef PresetInfo
 *   Preset.
 * @property {string} name
 *   Name.
 * @property {Array<[name: string, options: unknown]>} plugins
 *   Plugins and their configuration.
 */

import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import {parse} from 'comment-parser'
import strip from 'strip-indent'
import {read} from 'to-vfile'

const packagesUrl = new URL('../packages/', import.meta.url)

/** @type {PackageJson} */
export const ancestorPackage = JSON.parse(
  String(await read(new URL('../package.json', packagesUrl)))
)

export {packagesUrl}

/**
 * @type {Array<PluginInfo>}
 *   Plugins.
 */
export const plugins = []

/**
 * @type {Array<PresetInfo>}
 *   Presets.
 */
export const presets = []

const names = await fs.readdir(packagesUrl)

for (const name of names) {
  if (name.startsWith('remark-preset-lint-')) {
    await addPreset(name)
  } else if (name === 'unified-lint-rule') {
    // Empty.
  } else {
    await addPlugin(name)
  }
}

/**
 * @param {string} name
 *   Plugin name.
 * @returns {Promise<undefined>}
 *   Nothing.
 */
// eslint-disable-next-line complexity
async function addPlugin(name) {
  const code = await fs.readFile(
    new URL(name + '/index.js', packagesUrl),
    'utf8'
  )
  const fileInfo = parse(code, {spacing: 'preserve'})[0]
  const tags = fileInfo.tags
  let description = ''
  /** @type {string | undefined} */
  let ruleId

  if (name.startsWith('remark-lint-')) {
    ruleId = name.slice('remark-lint-'.length)

    const moduleTag = tags.find(function (d) {
      return d.tag === 'module'
    })

    assert(moduleTag, 'expected `@module` in JSDoc')
    assert.equal(moduleTag.name, ruleId, 'expected correct `@module`')

    description = fileInfo.description
    assert(description, 'expected description')

    description = strip(description).trim()
  }

  /** @type {PluginInfo} */
  const result = {
    description,
    name,
    ruleId,
    checks: []
  }

  const examples = tags
    .filter(function (d) {
      return d.tag === 'example'
    })
    .map(function (d) {
      return d.description.replace(/^\r?\n|\r?\n$/g, '')
    })

  let index = -1

  while (++index < examples.length) {
    const lines = examples[index].split('\n')
    /** @type {ExampleInfo} */
    let info

    try {
      info = JSON.parse(lines[0])
      lines.splice(0, 1)
      /* c8 ignore next 4 */
    } catch (error) {
      const cause = /** @type {Error} */ (error)
      throw new Error('Could not parse example in `' + ruleId + '`', {cause})
    }

    const exampleValue = strip(
      lines
        .join('\n')
        // Remove head.
        .replace(/^\r?\n/g, '')
        // Remove magic handling of `nul` control picture.
        .replace(/␀/g, '')
    )
    const configuration = JSON.stringify({config: info.config || true})
    const name = info.name

    if (!info.label) {
      result.checks.push({
        configuration,
        directive: info.directive || false,
        frontmatter: info.frontmatter || false,
        gfm: info.gfm || false,
        input: exampleValue,
        math: info.math || false,
        mdx: info.mdx || false,
        name,
        output: [],
        positionless: info.positionless || false
      })

      continue
    }

    assert(info.label === 'input' || info.label === 'output')

    let found = result.checks.find(function (d) {
      return d.configuration === configuration && d.name === name
    })

    if (!found) {
      found = {
        configuration,
        directive: info.directive || false,
        frontmatter: info.frontmatter || false,
        gfm: info.gfm || false,
        input: '',
        math: info.math || false,
        mdx: info.mdx || false,
        name,
        output: [],
        positionless: info.positionless || false
      }
      result.checks.push(found)
    }

    if (info.label === 'input') {
      /* c8 ignore next 11 -- just to be sure */
      if (found.input) {
        console.log(
          'Duplicate input in `' +
            ruleId +
            '` for `' +
            name +
            '` w/ config `' +
            info.config +
            '`'
        )
      }

      found.input = exampleValue
    } else {
      /* c8 ignore next 11 -- just to be sure */
      if (found.output.length > 0) {
        console.log(
          'Duplicate output in `' +
            ruleId +
            '` for `' +
            name +
            '` w/ config `' +
            info.config +
            '`'
        )
      }

      found.output = exampleValue.split('\n')
    }
  }

  plugins.push(result)
}

/**
 * @param {string} name
 *   Preset name.
 * @returns {Promise<undefined>}
 *   Nothing.
 */
async function addPreset(name) {
  /** @type {{default: Preset}} */
  const presetModule = await import(
    new URL(name + '/index.js', packagesUrl).href
  )
  const plugins = presetModule.default.plugins
  assert(plugins, 'expected plugins in preset')
  /** @type {PresetInfo} */
  const presetInfo = {name, plugins: []}

  let index = -1

  while (++index < plugins.length) {
    const plugin = plugins[index]
    /** @type {import('unified').Plugin<[unknown]>} */
    let pluginFunction
    /** @type {unknown} */
    let option

    if (Array.isArray(plugin)) {
      ;[pluginFunction, option] =
        /** @type {import('unified').PluginTuple<[unknown]>} */ (plugin)
    } else {
      assert(typeof plugin === 'function')
      pluginFunction = plugin
    }

    const name = /** @type {string} */ (
      // @ts-expect-error: `displayName`s are fine.
      pluginFunction.displayName || pluginFunction.name
    )

    const pluginName = name
      .replace(
        /[:-](\w)/g,
        function (/** @type {string} */ _, /** @type {string} */ $1) {
          return $1.toUpperCase()
        }
      )
      .replace(/[A-Z]/g, function (/** @type {string} */ $0) {
        return '-' + $0.toLowerCase()
      })

    presetInfo.plugins.push([pluginName, option])
  }

  presets.push(presetInfo)
}

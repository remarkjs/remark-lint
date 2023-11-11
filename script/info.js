/**
 * @typedef {import('unified').Preset} Preset
 */

/**
 * @typedef Check
 *   Check.
 * @property {string} configuration
 *   Configuration.
 * @property {boolean} gfm
 *   Whether to use GFM.
 * @property {string} input
 *   Input.
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
 *   Configuration.
 * @property {boolean} [gfm]
 *   Whether to use GFM.
 * @property {'input' | 'output'} [label]
 *   Label.
 * @property {boolean} [positionless]
 *   Whether this check also applies without positions.
 * @property {string} name
 *   Name.
 *
 * @typedef PluginInfo
 *   Plugin.
 * @property {boolean} deprecated
 *   Whether the plugin is deprecated.
 * @property {string} description
 *   Description.
 * @property {string} name
 *   Name.
 * @property {string} ruleId
 *   Rule ID.
 * @property {string | undefined} summary
 *   Summary.
 * @property {Array<Check>} checks
 *   Checks.
 *
 * @typedef PresetInfo
 *   Preset.
 * @property {string} name
 *   Name.
 * @property {Array<[string, unknown]>} plugins
 *   Plugins and their configuration.
 */

import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import {parse} from 'comment-parser'
import strip from 'strip-indent'

export const packagesUrl = new URL('../packages/', import.meta.url)

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
  if (name.startsWith('remark-lint-')) {
    await addPlugin(name)
  }

  if (name.startsWith('remark-preset-lint-')) {
    await addPreset(name)
  }
}

/**
 * @param {string} name
 *   Plugin name.
 * @returns {Promise<undefined>}
 *   Nothing.
 */
async function addPlugin(name) {
  const ruleId = name.slice('remark-lint-'.length)
  const code = await fs.readFile(
    new URL(name + '/index.js', packagesUrl),
    'utf8'
  )
  const fileInfo = parse(code, {spacing: 'preserve'})[0]
  const tags = fileInfo.tags
  const deprecatedTag = tags.find(function (d) {
    return d.tag === 'deprecated'
  })
  const moduleTag = tags.find(function (d) {
    return d.tag === 'module'
  })
  const summaryTag = tags.find(function (d) {
    return d.tag === 'summary'
  })

  assert(moduleTag, 'expected `@module` in JSDoc')

  assert.equal(moduleTag.name, ruleId, 'expected correct `@module`')

  let description = deprecatedTag
    ? deprecatedTag.description
    : fileInfo.description

  assert(description, 'expected description (or `@deprecated`)')

  description = strip(description)

  /** @type {PluginInfo} */
  const result = {
    deprecated: Boolean(deprecatedTag),
    description: description.trim(),
    name,
    ruleId,
    summary: summaryTag ? strip(summaryTag.description).trim() : undefined,
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

    const exampleValue = strip(lines.join('\n').replace(/^\r?\n/g, ''))
    const configuration = JSON.stringify({config: info.config || true})
    const name = info.name

    if (!info.label) {
      result.checks.push({
        configuration,
        name,
        positionless: info.positionless || false,
        gfm: info.gfm || false,
        input: exampleValue,
        output: []
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
        name,
        positionless: info.positionless || false,
        gfm: info.gfm || false,
        input: '',
        output: []
      }
      result.checks.push(found)
    }

    if (info.label === 'input') {
      found.input = exampleValue
    } else {
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
  const mod = await import(new URL(name + '/index.js', packagesUrl).href)
  const plugins = mod.default.plugins
  assert(plugins, 'expected plugins in preset')
  /** @type {PresetInfo} */
  const presetInfo = {name, plugins: []}

  let index = -1

  while (++index < plugins.length) {
    const plugin = plugins[index]
    /** @type {import('unified').Plugin<[unknown]>} */
    let fn
    /** @type {unknown} */
    let option

    if (Array.isArray(plugin)) {
      ;[fn, option] = /** @type {import('unified').PluginTuple<[unknown]>} */ (
        plugin
      )
    } else {
      assert(typeof plugin === 'function')
      fn = plugin
    }

    // @ts-expect-error: `displayName`s are fine.
    const name = /** @type {string} */ (fn.displayName || fn.name)

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

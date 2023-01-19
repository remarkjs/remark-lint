/**
 * @typedef {import('mdast').PhrasingContent} PhrasingContent
 * @typedef {import('unified').Preset} Preset
 * @typedef {import('unified').Plugin} Plugin
 */

import {promises as fs} from 'node:fs'
import path from 'node:path'
import url from 'node:url'
import {inspect} from 'node:util'
import remarkLint from 'remark-lint'
import {rule} from './rule.js'

/**
 * @param {string} base
 * @returns {Promise<Array<{name: string, packages: Record<string, Array<PhrasingContent>|undefined>, settings: Record<string, unknown>|undefined}>>}
 */
export async function presets(base) {
  const allFiles = await fs.readdir(base)
  const files = allFiles.filter((basename) =>
    /remark-preset-lint/.test(basename)
  )

  return Promise.all(
    files.map(async (name) => {
      const href = url.pathToFileURL(path.join(base, name, 'index.js')).href
      // type-coverage:ignore-next-line
      const presetMod = await import(href)
      /** @type {Preset} */
      // type-coverage:ignore-next-line
      const preset = presetMod.default
      const plugins = preset.plugins || []
      const settings = preset.settings || {}
      /** @type {Record<string, Array<PhrasingContent>|undefined>} */
      const packages = {}

      let index = -1
      while (++index < plugins.length) {
        const plugin = plugins[index]
        /** @type {Plugin} */
        let fn
        /** @type {Array<PhrasingContent>|undefined} */
        let option

        if (typeof plugin === 'function') {
          fn = plugin
        } else if (Array.isArray(plugin)) {
          // Fine:
          // type-coverage:ignore-next-line
          fn = plugin[0]
          // Fine:
          // type-coverage:ignore-next-line
          option = [{type: 'inlineCode', value: inspect(plugin[1])}]
        } else {
          throw new TypeError(
            'Expected plugin, plugin tuple, not `' + plugin + '`'
          )
        }

        if (fn === remarkLint) continue

        const name = (fn.displayName || fn.name)
          .replace(
            /[:-](\w)/g,
            (/** @type {string} */ _, /** @type {string} */ $1) =>
              $1.toUpperCase()
          )
          .replace(
            /[A-Z]/g,
            (/** @type {string} */ $0) => '-' + $0.toLowerCase()
          )

        /** @type {Record<string, unknown>} */
        const filtered = Object.assign(
          {},
          ...Array.from(
            new Set(
              Object.keys(rule(path.join(base, name)).tests).flatMap(
                (configuration) => {
                  /** @type {{settings: Record<string, unknown>}} */
                  const {settings} = JSON.parse(configuration)
                  return Object.keys(settings || {})
                }
              )
            ),
            (name) =>
              settings[name] === undefined ? {} : {[name]: settings[name]}
          )
        )

        packages[name] =
          option ||
          (Object.entries(filtered).length > 0
            ? formatSettings(filtered)
            : undefined)
      }

      return {name, packages, settings: preset.settings}
    })
  )
}

/**
 * @param {Record<string, unknown>} settings
 * @returns {Array<PhrasingContent>}
 */
export function formatSettings(settings) {
  const entries = Object.entries(settings)
  if (entries.length === 1) {
    const [[name, value]] = entries
    return [
      {
        type: 'link',
        url: 'https://github.com/remarkjs/remark-lint#configure',
        title: null,
        children: [
          {
            type: 'inlineCode',
            value: `settings.${name}`
          }
        ]
      },
      {type: 'text', value: ' is '},
      {
        type: 'inlineCode',
        value: inspect(value)
      }
    ]
  }

  return [
    {
      type: 'link',
      url: 'https://github.com/remarkjs/remark-lint#configure',
      title: null,
      children: [
        {
          type: 'inlineCode',
          value: 'settings'
        }
      ]
    },
    {type: 'text', value: ' includes '},
    {
      type: 'inlineCode',
      value: inspect(settings)
    }
  ]
}

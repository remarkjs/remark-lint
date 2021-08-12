/**
 * @typedef {import('unified').Preset} Preset
 * @typedef {import('unified').Plugin} Plugin
 */

import {promises as fs} from 'node:fs'
import path from 'node:path'
import url from 'node:url'

/**
 * @param {string} base
 * @returns {Promise<Array.<{name: string, packages: Record<string, unknown>}>>}
 */
export async function presets(base) {
  const files = (await fs.readdir(base)).filter((basename) =>
    /remark-preset-lint/.test(basename)
  )

  return Promise.all(
    files.map(async (name) => {
      const href = url.pathToFileURL(path.join(base, name, 'index.js')).href
      /** @type {Preset} */
      // type-coverage:ignore-next-line
      const preset = (await import(href)).default
      const plugins = preset.plugins || []
      /** @type {Record<string, unknown>} */
      const packages = {}

      let index = -1
      while (++index < plugins.length) {
        const plugin = plugins[index]
        /** @type {Plugin} */
        let fn
        /** @type {unknown} */
        let option

        if (typeof plugin === 'function') {
          fn = plugin
        } else if (Array.isArray(plugin)) {
          // Fine:
          // type-coverage:ignore-next-line
          fn = plugin[0]
          // Fine:
          // type-coverage:ignore-next-line
          option = plugin[1]
        } else {
          throw new TypeError(
            'Expected plugin, plugin tuple, not `' + plugin + '`'
          )
        }

        /** @type {string} */
        // @ts-expect-error: `displayName`s are fine.
        const name = fn.displayName || fn.name

        packages[
          name
            .replace(
              /[:-](\w)/g,
              (/** @type {string} */ _, /** @type {string} */ $1) =>
                $1.toUpperCase()
            )
            .replace(
              /[A-Z]/g,
              (/** @type {string} */ $0) => '-' + $0.toLowerCase()
            )
        ] = option
      }

      return {name, packages}
    })
  )
}

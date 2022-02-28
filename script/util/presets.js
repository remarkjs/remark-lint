/**
 * @typedef {import('unified').Preset} Preset
 * @typedef {import('unified').Plugin} Plugin
 */

import {toMarkdown} from 'mdast-util-to-markdown'
import {promises as fs} from 'node:fs'
import path from 'node:path'
import url from 'node:url'

/**
 * @param {string} base
 * @returns {Promise<Array<{name: string, packages: Record<string, unknown>, settings: Record<string, unknown>|undefined}>>}
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

      if (typeof settings.fences === 'boolean') {
        packages['remark-lint-code-block-style'] =
          packages['remark-lint-code-block-style'] ||
          (settings.fences ? 'fenced' : 'indented')
      }

      if (settings.emphasis) {
        packages['remark-lint-emphasis-marker'] =
          packages['remark-lint-emphasis-marker'] || settings.emphasis
      }

      if (settings.fence) {
        packages['remark-lint-fenced-code-marker'] =
          packages['remark-lint-fenced-code-marker'] || settings.fence
      }

      if (
        typeof settings.setext === 'boolean' ||
        typeof settings.closeAtx === 'boolean'
      ) {
        packages['remark-lint-heading-style'] =
          packages['remark-lint-heading-style'] ||
          (settings.setext
            ? 'setext'
            : settings.closeAtx
            ? 'atx-closed'
            : 'atx')
      }

      if (settings.quote) {
        packages['remark-lint-link-title-style'] =
          packages['remark-lint-link-title-style'] || settings.quote
      }

      if (settings.listItemIndent) {
        packages['remark-lint-list-item-indent'] =
          packages['remark-lint-list-item-indent'] || settings.listItemIndent
      }

      if (settings.bulletOrdered) {
        packages['remark-lint-ordered-list-marker-style'] =
          packages['remark-lint-ordered-list-marker-style'] ||
          settings.bulletOrdered
      }

      if (typeof settings.incrementListMarker === 'boolean') {
        packages['remark-lint-ordered-list-marker-value'] =
          packages['remark-lint-ordered-list-marker-value'] ||
          (settings.incrementListMarker ? 'ordered' : 'single')
      }

      if (
        settings.rule !== undefined ||
        settings.ruleRepetition !== undefined ||
        typeof settings.ruleSpaces === 'boolean'
      ) {
        packages['remark-lint-rule-style'] =
          packages['remark-lint-rule-style'] ||
          toMarkdown({type: 'thematicBreak'}, settings).slice(0, -1)
      }

      if (settings.strong) {
        packages['remark-lint-strong-marker'] =
          packages['remark-lint-strong-marker'] || settings.strong
      }

      if (settings.bullet) {
        packages['remark-lint-unordered-list-marker-style'] =
          packages['remark-lint-unordered-list-marker-style'] || settings.bullet
      }

      return {name, packages, settings: preset.settings}
    })
  )
}

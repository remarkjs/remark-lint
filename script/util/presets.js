import {promises as fs} from 'fs'
import path from 'path'

export async function presets(base) {
  const files = (await fs.readdir(base)).filter(filter)

  return Promise.all(
    files.map(async function (name) {
      const plugins = (await import(path.join(base, name, 'index.js'))).default
        .plugins
      var packages = {}

      let index = -1
      while (++index < plugins.length) {
        const plugin = plugins[index]
        let fn
        let option

        if (typeof plugin === 'function') {
          fn = plugin
        } else {
          fn = plugin[0]
          option = plugin[1]
        }

        let name = fn.displayName || fn.name

        packages[
          name
            .replace(/[:-](\w)/g, (_, $1) => $1.toUpperCase())
            .replace(/[A-Z]/g, ($0) => '-' + $0.toLowerCase())
        ] = option
      }

      return {name: name, packages: packages}
    })
  )
}

function filter(basename) {
  return /remark-preset-lint/.test(basename)
}

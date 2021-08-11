import fs from 'fs'
import path from 'path'
import {zone} from 'mdast-zone'
import {u} from 'unist-builder'
import {presets} from '../util/presets.js'

const root = path.join(process.cwd(), 'packages')

export default function listOfPresets() {
  const presetPromise = presets(root)

  return async (tree) => {
    const presetObjects = await presetPromise

    zone(tree, 'presets', (start, nodes, end) => {
      return [
        start,
        u(
          'list',
          {ordered: false, spread: false},
          presetObjects.map(({name}) => {
            const pack = JSON.parse(
              fs.readFileSync(path.join(root, name, 'package.json'))
            )
            const description = pack.description.replace(
              /^remark preset to configure remark-lint with ?/i,
              ''
            )

            return u('listItem', {spread: false}, [
              u('paragraph', [
                u('link', {url: pack.repository}, [u('inlineCode', name)]),
                u('text', ' — ' + description)
              ])
            ])
          })
        ),
        end
      ]
    })
  }
}

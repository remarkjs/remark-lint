import fs from 'fs'
import path from 'path'
import {zone} from 'mdast-zone'
import {u} from 'unist-builder'
import {presets} from '../util/presets.js'

var root = path.join(process.cwd(), 'packages')
const presetObjects = await presets(root)

export default function listOfPresets() {
  return transformer
}

function transformer(tree) {
  zone(tree, 'presets', replace)
}

function replace(start, nodes, end) {
  return [
    start,
    u('list', {ordered: false, spread: false}, presetObjects.map(item)),
    end
  ]

  function item({name}) {
    var pack = JSON.parse(
      fs.readFileSync(path.join(root, name, 'package.json'))
    )
    var description = pack.description.replace(
      /^remark preset to configure remark-lint with ?/i,
      ''
    )

    return u('listItem', {spread: false}, [
      u('paragraph', [
        u('link', {url: pack.repository}, [u('inlineCode', name)]),
        u('text', ' — ' + description)
      ])
    ])
  }
}

import fs from 'fs'
import path from 'path'
import zone from 'mdast-zone'
import u from 'unist-builder'
import {rules} from '../util/rules.js'

var root = path.join(process.cwd(), 'packages')

export default function listOfRules() {
  return transformer
}

function transformer(tree) {
  zone(tree, 'rules', replace)
}

function replace(start, nodes, end) {
  return [
    start,
    u('list', {ordered: false, spread: false}, rules(root).map(item)),
    end
  ]

  function item(basename) {
    var name = basename.slice('remark-lint-'.length)
    var pack = JSON.parse(
      fs.readFileSync(path.join(root, basename, 'package.json'))
    )
    var description = pack.description.replace(/^remark-lint rule to ?/i, '')

    return u('listItem', {spread: false}, [
      u('paragraph', [
        u('link', {url: pack.repository}, [u('inlineCode', name)]),
        u('text', ' — ' + description)
      ])
    ])
  }
}

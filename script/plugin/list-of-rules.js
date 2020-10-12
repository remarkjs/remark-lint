'use strict'

var path = require('path')
var zone = require('mdast-zone')
var u = require('unist-builder')
var rules = require('../util/rules')

var root = path.join(process.cwd(), 'packages')

module.exports = listOfRules

function listOfRules() {
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
    var pack = require(path.join(root, basename, 'package.json'))
    var description = pack.description.replace(/^remark-lint rule to ?/i, '')

    return u('listItem', {spread: false}, [
      u('paragraph', [
        u('link', {url: pack.repository}, [u('inlineCode', name)]),
        u('text', ' — ' + description)
      ])
    ])
  }
}

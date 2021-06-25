'use strict'

var path = require('path')
var zone = require('mdast-zone')
var u = require('unist-builder')
var presets = require('../util/presets.js')

var root = path.join(process.cwd(), 'packages')

module.exports = listOfPresets

function listOfPresets() {
  return transformer
}

function transformer(tree) {
  zone(tree, 'presets', replace)
}

function replace(start, nodes, end) {
  return [
    start,
    u('list', {ordered: false, spread: false}, presets(root).map(item)),
    end
  ]

  function item(basename) {
    var pack = require(path.join(root, basename, 'package.json'))
    var description = pack.description.replace(
      /^remark preset to configure remark-lint with ?/i,
      ''
    )

    return u('listItem', {spread: false}, [
      u('paragraph', [
        u('link', {url: pack.repository}, [u('inlineCode', basename)]),
        u('text', ' — ' + description)
      ])
    ])
  }
}

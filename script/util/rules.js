'use strict'

var fs = require('fs')

module.exports = rulesSync

function rulesSync(filePath) {
  return fs.readdirSync(filePath).filter(filter)
}

function filter(basename) {
  return /remark-lint/.test(basename) && basename !== 'remark-lint'
}

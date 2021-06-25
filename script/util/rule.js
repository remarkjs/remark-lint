'use strict'

var fs = require('fs')
var path = require('path')
var dox = require('dox')
var strip = require('strip-indent')
var find = require('./find.js')

module.exports = ruleSync

// Get information for a rule at `filePath`.
function ruleSync(filePath) {
  var ruleId = path.basename(filePath)
  var result = {}
  var tests = {}
  var description
  var code
  var tags
  var name

  ruleId = ruleId.slice('remark-lint-'.length)
  code = fs.readFileSync(path.join(filePath, 'index.js'), 'utf-8')
  tags = dox.parseComments(code)[0].tags
  description = find(tags, 'fileoverview')
  name = find(tags, 'module')

  /* istanbul ignore if */
  if (name !== ruleId) {
    throw new Error(ruleId + ' has an incorrect `@module`: ' + name)
  }

  /* istanbul ignore if */
  if (!description) {
    throw new Error(ruleId + ' is missing a `@fileoverview`')
  }

  description = strip(description)

  result.ruleId = ruleId
  result.description = description.trim()
  result.tests = tests
  result.filePath = filePath

  find.all(tags, 'example').map(strip).forEach(check)

  return result

  function check(example) {
    var lines = example.split('\n')
    var value = strip(lines.slice(1).join('\n'))
    var info
    var setting
    var context
    var name

    try {
      info = JSON.parse(lines[0])
    } catch (error) {
      /* istanbul ignore next */
      throw new Error(
        'Could not parse example in ' + ruleId + ':\n' + error.stack
      )
    }

    setting = JSON.stringify(info.setting || true)
    context = tests[setting]
    name = info.name

    if (!context) {
      context = []
      tests[setting] = context
    }

    if (!info.label) {
      context[name] = {
        positionless: info.positionless,
        gfm: info.gfm,
        setting: setting,
        input: value,
        output: []
      }

      return
    }

    /* istanbul ignore if */
    if (info.label !== 'input' && info.label !== 'output') {
      throw new Error(
        'Expected `input` or `ouput` for `label` in ' +
          ruleId +
          ', not `' +
          info.label +
          '`'
      )
    }

    if (!context[name]) {
      context[name] = {positionless: info.positionless, gfm: info.gfm}
    }

    context[name].setting = setting

    if (info.label === 'output') {
      value = value.split('\n')
    }

    context[name][info.label] = value
  }
}

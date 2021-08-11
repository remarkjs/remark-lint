import fs from 'fs'
import path from 'path'
import dox from 'dox'
import strip from 'strip-indent'
import {find, findAll} from './find.js'

// Get information for a rule at `filePath`.
export function rule(filePath) {
  const ruleId = path.basename(filePath).slice('remark-lint-'.length)
  const result = {}
  const tests = {}
  const code = fs.readFileSync(path.join(filePath, 'index.js'), 'utf-8')
  const tags = dox.parseComments(code)[0].tags
  const name = find(tags, 'module')
  let description = find(tags, 'fileoverview')

  /* c8 ignore next 3 */
  if (name !== ruleId) {
    throw new Error(ruleId + ' has an incorrect `@module`: ' + name)
  }

  /* c8 ignore next 3 */
  if (!description) {
    throw new Error(ruleId + ' is missing a `@fileoverview`')
  }

  description = strip(description)

  result.ruleId = ruleId
  result.description = description.trim()
  result.tests = tests
  result.filePath = filePath

  const examples = findAll(tags, 'example')
  let index = -1

  while (++index < examples.length) {
    const example = strip(examples[index])
    const lines = example.split('\n')
    const value = strip(lines.slice(1).join('\n'))
    let info

    try {
      info = JSON.parse(lines[0])
      /* c8 ignore next 5 */
    } catch (error) {
      throw new Error(
        'Could not parse example in ' + ruleId + ':\n' + error.stack
      )
    }

    const setting = JSON.stringify(info.setting || true)
    const name = info.name
    let context = tests[setting]

    if (!context) {
      context = []
      tests[setting] = context
    }

    if (!info.label) {
      context[name] = {
        positionless: info.positionless,
        gfm: info.gfm,
        setting,
        input: value,
        output: []
      }

      continue
    }

    /* c8 ignore next 9 */
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
      context[name][info.label] = value.split('\n')
    } else {
      context[name][info.label] = value
    }
  }

  return result
}

/**
 * @typedef Rule
 * @property {string} ruleId
 * @property {string} description
 * @property {boolean} deprecated
 * @property {Record<string, Checks>} tests
 * @property {string} filePath
 *
 * @typedef {Record<string, Check>} Checks
 *
 * @typedef Check
 * @property {string} input
 * @property {string[]} output
 * @property {string} setting
 * @property {boolean} gfm
 * @property {boolean} positionless
 */

import fs from 'node:fs'
import path from 'node:path'
import {parse} from 'comment-parser'
import strip from 'strip-indent'

/**
 * Get information for a rule at `filePath`.
 *
 * @param {string} filePath
 * @returns {Rule}
 */
/* eslint-disable-next-line complexity */
export function rule(filePath) {
  const ruleId = path.basename(filePath).slice('remark-lint-'.length)
  /** @type {Record<string, Checks>} */
  const tests = {}
  const code = fs.readFileSync(path.join(filePath, 'index.js'), 'utf-8')
  const tags = parse(code, {spacing: 'preserve'})[0].tags
  const moduleTag = tags.find((d) => d.tag === 'module')
  const fileoverviewTag = tags.find((d) => d.tag === 'fileoverview')
  const deprecatedTag = tags.find((d) => d.tag === 'deprecated')

  /* c8 ignore next 3 */
  if (!moduleTag) {
    throw new Error('Expected `@module` in JSDoc')
  }

  /* c8 ignore next 3 */
  if (!fileoverviewTag && !deprecatedTag) {
    throw new Error('Expected `@fileoverview` (or `@deprecated`) in JSDoc')
  }

  const name = moduleTag.name
  let description =
    (fileoverviewTag && fileoverviewTag.description) ||
    (deprecatedTag && deprecatedTag.description)

  /* c8 ignore next 3 */
  if (name !== ruleId) {
    throw new Error(ruleId + ' has an incorrect `@module`: ' + name)
  }

  /* c8 ignore next 3 */
  if (!description) {
    throw new Error(ruleId + ' is missing a `@fileoverview` or `@deprecated`')
  }

  description = strip(description)

  /** @type {Rule} */
  const result = {
    ruleId,
    description: description.trim(),
    deprecated: Boolean(deprecatedTag),
    tests,
    filePath
  }

  const examples = tags
    .filter((d) => d.tag === 'example')
    .map((d) => d.description.replace(/^\r?\n|\r?\n$/g, ''))
  let index = -1

  while (++index < examples.length) {
    const lines = examples[index].split('\n')
    /** @type {{name: string, label?: 'input'|'output', setting?: unknown, positionless?: boolean, gfm?: boolean}} */
    let info

    try {
      info = JSON.parse(lines[0])
      lines.splice(0, 1)
      /* c8 ignore next 6 */
    } catch (error) {
      const exception = /** @type Error */ (error)
      throw new Error(
        'Could not parse example in ' + ruleId + ':\n' + exception.stack
      )
    }

    const exampleValue = strip(lines.join('\n').replace(/^\r?\n/g, ''))
    const setting = JSON.stringify(info.setting || true)
    const name = info.name
    const context = setting in tests ? tests[setting] : (tests[setting] = {})

    if (!info.label) {
      context[name] = {
        positionless: info.positionless || false,
        gfm: info.gfm || false,
        setting,
        input: exampleValue,
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
      context[name] = {
        positionless: info.positionless || false,
        gfm: info.gfm || false,
        setting: '',
        input: '',
        output: []
      }
    }

    context[name].setting = setting

    if (info.label === 'output') {
      context[name][info.label] = exampleValue.split('\n')
    } else {
      context[name][info.label] = exampleValue
    }
  }

  return result
}

/**
 * @typedef Rule
 * @property {string} ruleId
 * @property {string} description
 * @property {string|undefined} summary
 * @property {boolean} deprecated
 * @property {Record<string, Checks>} tests
 * @property {string} filePath
 *
 * @typedef {Record<string, Check>} Checks
 *
 * @typedef Check
 * @property {string} input
 * @property {Array<string>} output
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
export function rule(filePath) {
  const ruleId = path.basename(filePath).slice('remark-lint-'.length)
  /** @type {Record<string, Checks>} */
  const tests = {}
  const code = fs.readFileSync(path.join(filePath, 'index.js'), 'utf8')
  // Note: To do: `comment-parser` types are wrong.
  /** @type {import('comment-parser/primitives').Block} */
  const fileInfo = parse(code, {spacing: 'preserve'})[0]
  const tags = fileInfo.tags
  const moduleTag = tags.find((d) => d.tag === 'module')
  const summaryTag = tags.find((d) => d.tag === 'summary')
  const deprecatedTag = tags.find((d) => d.tag === 'deprecated')

  /* c8 ignore next 3 */
  if (!moduleTag) {
    throw new Error('Expected `@module` in JSDoc')
  }

  const name = moduleTag.name
  let description =
    (deprecatedTag && deprecatedTag.description) || fileInfo.description

  /* c8 ignore next 3 */
  if (name !== ruleId) {
    throw new Error(ruleId + ' has an incorrect `@module`: ' + name)
  }

  /* c8 ignore next 3 */
  if (!description) {
    throw new Error(ruleId + ' is missing a description or `@deprecated`')
  }

  description = strip(description)

  /** @type {Rule} */
  const result = {
    ruleId,
    description: description.trim(),
    summary: summaryTag ? strip(summaryTag.description).trim() : undefined,
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
    /** @type {{name: string, label?: 'input'|'output', config?: unknown, positionless?: boolean, gfm?: boolean}} */
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
    const configuration = JSON.stringify({config: info.config || true})
    const name = info.name
    const context =
      configuration in tests
        ? tests[configuration]
        : (tests[configuration] = {})

    if (!info.label) {
      context[name] = {
        positionless: info.positionless || false,
        gfm: info.gfm || false,
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
        input: '',
        output: []
      }
    }

    // @ts-expect-error: fine: array for output, string for rest.
    context[name][info.label] =
      info.label === 'output' ? exampleValue.split('\n') : exampleValue
  }

  return result
}

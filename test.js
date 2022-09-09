/**
 * @typedef {import('unified').Plugin} Plugin
 * @typedef {import('vfile-message').VFileMessage} VFileMessage
 * @typedef {import('tape').Test} Test
 * @typedef {import('./script/util/rule').Rule} Rule
 * @typedef {import('./script/util/rule').Check} Check
 */

import url from 'node:url'
import path from 'node:path'
import process from 'node:process'
import test from 'tape'
import {toVFile} from 'to-vfile'
import {removePosition} from 'unist-util-remove-position'
import {remark} from 'remark'
import remarkGfm from 'remark-gfm'
import {lintRule} from 'unified-lint-rule'
import {rules} from './script/util/rules.js'
import {rule} from './script/util/rule.js'
import {characters} from './script/characters.js'
import lint from './packages/remark-lint/index.js'
import noHeadingPunctuation from './packages/remark-lint-no-heading-punctuation/index.js'
import noMultipleToplevelHeadings from './packages/remark-lint-no-multiple-toplevel-headings/index.js'
import noUndefinedReferences from './packages/remark-lint-no-undefined-references/index.js'
import finalNewline from './packages/remark-lint-final-newline/index.js'

const own = {}.hasOwnProperty

test('core', async (t) => {
  const doc = [
    '# A heading',
    '',
    '# Another main heading.',
    '',
    '<!--lint ignore-->',
    '',
    '# Another main heading.'
  ].join('\n')

  let file = await remark()
    .use(noHeadingPunctuation)
    .use(noMultipleToplevelHeadings)
    .use(lint)
    .process(toVFile({path: 'virtual.md', value: doc}))

  t.deepEqual(
    asStrings(file.messages),
    [
      'virtual.md:3:1-3:24: Don’t add a trailing `.` to headings',
      'virtual.md:3:1-3:24: Don’t use multiple top level headings (1:1)'
    ],
    'should support `remark-lint` last'
  )

  file = await remark()
    .use(lint)
    .use(noHeadingPunctuation)
    .use(noMultipleToplevelHeadings)
    .process(toVFile({path: 'virtual.md', value: doc}))

  t.deepEqual(
    asStrings(file.messages),
    [
      'virtual.md:3:1-3:24: Don’t add a trailing `.` to headings',
      'virtual.md:3:1-3:24: Don’t use multiple top level headings (1:1)'
    ],
    'should support `remark-lint` first'
  )

  file = await remark().use(lint).process('.')

  t.deepEqual(asStrings(file.messages), [], 'should support no rules')

  file = await remark().use(finalNewline).process('')

  t.deepEqual(asStrings(file.messages), [], 'should support successful rules')

  file = await remark().use(finalNewline, [2]).process('.')

  t.deepEqual(
    file.messages.map((d) => JSON.parse(JSON.stringify(d))),
    [
      {
        name: '1:1',
        message: 'Missing newline character at end of file',
        reason: 'Missing newline character at end of file',
        line: null,
        column: null,
        source: 'remark-lint',
        ruleId: 'final-newline',
        url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-final-newline#readme',
        position: {
          start: {line: null, column: null},
          end: {line: null, column: null}
        },
        fatal: true
      }
    ],
    'should support a list with a severity'
  )

  file = await remark().use(finalNewline, true).process('.')

  t.deepEqual(
    asStrings(file.messages),
    ['1:1: Missing newline character at end of file'],
    'should support a boolean (`true`)'
  )

  file = await remark().use(finalNewline, false).process('.')

  t.deepEqual(
    asStrings(file.messages),
    [],
    'should support a boolean (`false`)'
  )

  file = await remark().use(finalNewline, [true]).process('.')

  t.deepEqual(
    asStrings(file.messages),
    ['1:1: Missing newline character at end of file'],
    'should support a list with a boolean severity (true, for on)'
  )

  file = await remark().use(finalNewline, [false]).process('.')

  t.deepEqual(
    asStrings(file.messages),
    [],
    'should support a list with boolean severity (false, for off)'
  )

  file = await remark().use(finalNewline, ['error']).process('.')

  t.deepEqual(
    file.messages.map((d) => JSON.parse(JSON.stringify(d))),
    [
      {
        name: '1:1',
        message: 'Missing newline character at end of file',
        reason: 'Missing newline character at end of file',
        line: null,
        column: null,
        source: 'remark-lint',
        ruleId: 'final-newline',
        url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-final-newline#readme',
        position: {
          start: {line: null, column: null},
          end: {line: null, column: null}
        },
        fatal: true
      }
    ],
    'should support a list with string severity (`error`)'
  )

  file = await remark().use(finalNewline, ['on']).process('.')

  t.deepEqual(
    file.messages.map((d) => JSON.parse(JSON.stringify(d))),
    [
      {
        name: '1:1',
        message: 'Missing newline character at end of file',
        reason: 'Missing newline character at end of file',
        line: null,
        column: null,
        source: 'remark-lint',
        ruleId: 'final-newline',
        url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-final-newline#readme',
        position: {
          start: {line: null, column: null},
          end: {line: null, column: null}
        },
        fatal: false
      }
    ],
    'should support a list with string severity (`on`)'
  )

  file = await remark().use(finalNewline, ['warn']).process('.')

  t.deepEqual(
    file.messages.map((d) => JSON.parse(JSON.stringify(d))),
    [
      {
        name: '1:1',
        message: 'Missing newline character at end of file',
        reason: 'Missing newline character at end of file',
        line: null,
        column: null,
        source: 'remark-lint',
        ruleId: 'final-newline',
        url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-final-newline#readme',
        position: {
          start: {line: null, column: null},
          end: {line: null, column: null}
        },
        fatal: false
      }
    ],
    'should support a list with string severity (`warn`)'
  )

  file = await remark().use(finalNewline, ['off']).process('.')

  t.deepEqual(
    asStrings(file.messages),
    [],
    'should support a list with string severity (`off`)'
  )

  t.throws(
    () => {
      remark().use(finalNewline, [3]).freeze()
    },
    /^Error: Incorrect severity `3` for `final-newline`, expected 0, 1, or 2$/,
    'should fail on incorrect severities (too high)'
  )

  t.throws(
    () => {
      remark().use(finalNewline, [-1]).freeze()
    },
    /^Error: Incorrect severity `-1` for `final-newline`, expected 0, 1, or 2$/,
    'should fail on incorrect severities (too low)'
  )

  file = await remark()
    .use(noUndefinedReferences, {allow: [/^b\./i]})
    .process(
      toVFile({
        path: 'virtual.md',
        value: ['[foo][b.c]', '', '[bar][b]'].join('\n')
      })
    )

  t.deepEqual(
    asStrings(file.messages),
    ['virtual.md:3:1-3:9: Found reference to undefined definition'],
    'no-undefined-references allow option should work with native regex'
  )

  file = await remark()
    .use(
      lintRule('test:rule', (tree, file) => {
        file.message('Test message')
      }),
      ['warn']
    )
    .process('.')

  t.deepEqual(
    file.messages.map((d) => JSON.parse(JSON.stringify(d))),
    [
      {
        name: '1:1',
        message: 'Test message',
        reason: 'Test message',
        line: null,
        column: null,
        source: 'test',
        ruleId: 'rule',
        position: {
          start: {line: null, column: null},
          end: {line: null, column: null}
        },
        fatal: false
      }
    ],
    'should support string meta'
  )
})

test('rules', async (t) => {
  const root = path.join(process.cwd(), 'packages')
  const all = rules(root)
  let index = -1

  while (++index < all.length) {
    const basename = all[index]
    const base = path.resolve(root, basename)
    const info = rule(base)
    const href = url.pathToFileURL(base).href + '/index.js'

    // type-coverage:ignore-next-line
    const pluginMod = await import(href)
    /** @type {Plugin} */
    // type-coverage:ignore-next-line
    const fn = pluginMod.default

    if (Object.keys(info.tests).length === 0) {
      t.pass(info.ruleId + ': no tests')
    } else {
      t.test(info.ruleId, (t) => {
        assertRule(t, fn, info)
      })
    }
  }

  t.end()
})

/**
 * Assert a rule.
 *
 * @param {Test} t
 * @param {Plugin} rule
 * @param {Rule} info
 */
function assertRule(t, rule, info) {
  const tests = info.tests
  /** @type {string} */
  let configuration

  for (configuration in tests) {
    if (own.call(tests, configuration)) {
      const checks = tests[configuration]
      /** @type {{config: unknown}} */
      const {config} = JSON.parse(configuration)

      t.test(configuration, (t) => {
        /** @type {string} */
        let name

        for (name in checks) {
          if (own.call(checks, name)) {
            const basename = name
            const check = checks[name]

            t.test(name, (t) => {
              assertFixture(t, rule, info, check, basename, config)
            })
          }
        }
      })
    }
  }

  t.end()
}

/**
 * @param {Test} t
 * @param {Plugin} rule
 * @param {Rule} info
 * @param {Check} fixture
 * @param {string} basename
 * @param {unknown} config
 */
/* eslint-disable-next-line max-params */
function assertFixture(t, rule, info, fixture, basename, config) {
  const ruleId = info.ruleId
  const file = toVFile(basename)
  const expected = fixture.output
  const positionless = fixture.positionless
  let proc = remark().use(rule, config)

  if (fixture.gfm) proc.use(remarkGfm)

  file.value = preprocess(fixture.input || '')

  t.plan(positionless ? 1 : 2)

  try {
    proc.runSync(proc.parse(file), file)
  } catch (error) {
    const exception = /** @type VFileMessage */ (error)
    if (exception && exception.source !== 'remark-lint') {
      throw exception
    }
  }

  let index = -1
  while (++index < file.messages.length) {
    const message = file.messages[index]
    if (message.ruleId !== ruleId) {
      throw new Error(
        'Expected `' +
          ruleId +
          '`, not `' +
          message.ruleId +
          '` as `ruleId` for ' +
          message
      )
    }

    const expectedUrl =
      'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-' +
      ruleId +
      '#readme'
    if (message.url !== expectedUrl) {
      throw new Error(
        'Expected `' +
          expectedUrl +
          '`, not `' +
          message.url +
          '` as `ruleId` for ' +
          message
      )
    }
  }

  t.deepEqual(normalize(file.messages), expected, 'should equal with position')

  if (!positionless) {
    file.messages = []
    proc = remark()
      .use(() => (tree) => removePosition(tree))
      .use(rule, config)
    if (fixture.gfm) proc.use(remarkGfm)
    proc.processSync(file)

    t.deepEqual(normalize(file.messages), [], 'should equal without position')
  }
}

/**
 * @param {Array<VFileMessage>} messages
 * @returns {Array<string>}
 */
function normalize(messages) {
  return asStrings(messages).map((value) => value.slice(value.indexOf(':') + 1))
}

/**
 * @param {Array<VFileMessage>} messages
 * @returns {Array<string>}
 */
function asStrings(messages) {
  return messages.map(String)
}

/**
 * @param {string} value
 * @returns {string}
 */
function preprocess(value) {
  let index = -1

  while (++index < characters.length) {
    value = value.replace(characters[index].in, characters[index].out)
  }

  return value
}

/**
 * @typedef {import('unified').PluggableList} PluggableList
 * @typedef {import('unified').Plugin<[unknown]>} Plugin
 *
 * @typedef {import('./script/info.js').Check} Check
 * @typedef {import('./script/info.js').PluginInfo} PluginInfo
 */

import assert from 'node:assert/strict'
import test from 'node:test'
import {controlPictures} from 'control-pictures'
import {remark} from 'remark'
import remarkGfm from 'remark-gfm'
import remarkLint from 'remark-lint'
import remarkLintFinalNewline from 'remark-lint-final-newline'
import remarkLintNoHeadingPunctuation from 'remark-lint-no-heading-punctuation'
import remarkLintNoMultipleToplevelHeadings from 'remark-lint-no-multiple-toplevel-headings'
import remarkLintNoUndefinedReferences from 'remark-lint-no-undefined-references'
import {lintRule} from 'unified-lint-rule'
import {removePosition} from 'unist-util-remove-position'
import {VFile} from 'vfile'
import {plugins} from './script/info.js'

test('remark-lint', async function (t) {
  await t.test('should expose the public api', async function () {
    assert.deepEqual(Object.keys(await import('remark-lint')).sort(), [
      'default'
    ])
  })

  const doc = [
    '# A heading',
    '',
    '# Another main heading.',
    '',
    '<!--lint ignore-->',
    '',
    '# Another main heading.'
  ].join('\n')

  await t.test('should support `remark-lint` last', async function () {
    const file = await remark()
      .use(remarkLintNoHeadingPunctuation)
      .use(remarkLintNoMultipleToplevelHeadings)
      .use(remarkLint)
      .process({path: 'virtual.md', value: doc})

    assert.deepEqual(file.messages.map(String), [
      'virtual.md:3:1-3:24: Don’t add a trailing `.` to headings',
      'virtual.md:3:1-3:24: Don’t use multiple top level headings (1:1)'
    ])
  })

  await t.test('should support `remark-lint` first', async function () {
    const file = await remark()
      .use(remarkLint)
      .use(remarkLintNoHeadingPunctuation)
      .use(remarkLintNoMultipleToplevelHeadings)
      .process({path: 'virtual.md', value: doc})

    assert.deepEqual(file.messages.map(String), [
      'virtual.md:3:1-3:24: Don’t add a trailing `.` to headings',
      'virtual.md:3:1-3:24: Don’t use multiple top level headings (1:1)'
    ])
  })

  await t.test('should support no rules', async function () {
    const file = await remark().use(remarkLint).process('.')

    assert.deepEqual(file.messages, [])
  })

  await t.test('should support successful rules', async function () {
    const file = await remark().use(remarkLintFinalNewline).process('')

    assert.deepEqual(file.messages, [])
  })

  await t.test('should support a list with a severity', async function () {
    const file = await remark().use(remarkLintFinalNewline, [2]).process('.')

    assert.deepEqual(file.messages.map(jsonClone), [
      {
        fatal: true,
        message: 'Missing newline character at end of file',
        name: '1:1',
        reason: 'Missing newline character at end of file',
        ruleId: 'final-newline',
        source: 'remark-lint',
        url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-final-newline#readme'
      }
    ])
  })

  await t.test('should support a boolean (`true`)', async function () {
    const file = await remark().use(remarkLintFinalNewline, true).process('.')

    assert.deepEqual(file.messages.map(String), [
      '1:1: Missing newline character at end of file'
    ])
  })

  await t.test('should support a boolean (`false`)', async function () {
    const file = await remark().use(remarkLintFinalNewline, false).process('.')

    assert.deepEqual(file.messages, [])
  })

  await t.test(
    'should support a list with a boolean severity (true, for on)',
    async function () {
      const file = await remark()
        .use(remarkLintFinalNewline, [true])
        .process('.')

      assert.deepEqual(file.messages.map(String), [
        '1:1: Missing newline character at end of file'
      ])
    }
  )

  await t.test(
    'should support a list with boolean severity (false, for off)',
    async function () {
      const file = await remark()
        .use(remarkLintFinalNewline, [false])
        .process('.')

      assert.deepEqual(file.messages, [])
    }
  )

  await t.test(
    'should support a list with string severity (`error`)',
    async function () {
      const file = await remark()
        .use(remarkLintFinalNewline, ['error'])
        .process('.')

      assert.deepEqual(file.messages.map(jsonClone), [
        {
          fatal: true,
          message: 'Missing newline character at end of file',
          name: '1:1',
          reason: 'Missing newline character at end of file',
          ruleId: 'final-newline',
          source: 'remark-lint',
          url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-final-newline#readme'
        }
      ])
    }
  )

  await t.test(
    'should support a list with string severity (`on`)',
    async function () {
      const file = await remark()
        .use(remarkLintFinalNewline, ['on'])
        .process('.')

      assert.deepEqual(file.messages.map(jsonClone), [
        {
          fatal: false,
          message: 'Missing newline character at end of file',
          name: '1:1',
          reason: 'Missing newline character at end of file',
          ruleId: 'final-newline',
          source: 'remark-lint',
          url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-final-newline#readme'
        }
      ])
    }
  )

  await t.test(
    'should support a list with string severity (`warn`)',
    async function () {
      const file = await remark()
        .use(remarkLintFinalNewline, ['warn'])
        .process('.')

      assert.deepEqual(file.messages.map(jsonClone), [
        {
          fatal: false,
          message: 'Missing newline character at end of file',
          name: '1:1',
          reason: 'Missing newline character at end of file',
          ruleId: 'final-newline',
          source: 'remark-lint',
          url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-final-newline#readme'
        }
      ])
    }
  )

  await t.test(
    'should support a list with string severity (`off`)',
    async function () {
      const file = await remark()
        .use(remarkLintFinalNewline, ['off'])
        .process('.')

      assert.deepEqual(file.messages, [])
    }
  )

  await t.test(
    'should fail on incorrect severities (too high)',
    async function () {
      assert.throws(function () {
        remark().use(remarkLintFinalNewline, [3]).freeze()
      }, /^Error: Incorrect severity `3` for `final-newline`, expected 0, 1, or 2$/)
    }
  )

  await t.test(
    'should fail on incorrect severities (too low)',
    async function () {
      assert.throws(function () {
        remark().use(remarkLintFinalNewline, [-1]).freeze()
      }, /^Error: Incorrect severity `-1` for `final-newline`, expected 0, 1, or 2$/)
    }
  )

  await t.test(
    'should support regex as options (remark-lint-no-undefined-references)',
    async function () {
      const file = await remark()
        .use(remarkLintNoUndefinedReferences, {allow: [/^b\./i]})
        .process({
          path: 'virtual.md',
          value: ['[foo][b.c]', '', '[bar][b]'].join('\n')
        })

      assert.deepEqual(file.messages.map(String), [
        'virtual.md:3:1-3:9: Found reference to undefined definition'
      ])
    }
  )

  await t.test(
    'should support meta as a string (unified-lint-rule)',
    async function () {
      const file = await remark()
        .use(
          lintRule('test:rule', function (_, file) {
            file.message('Test message')
          }),
          ['warn']
        )
        .process('.')

      assert.deepEqual(file.messages.map(jsonClone), [
        {
          fatal: false,
          message: 'Test message',
          name: '1:1',
          reason: 'Test message',
          ruleId: 'rule',
          source: 'test'
        }
      ])
    }
  )
})

test('plugins', async function (t) {
  for (const plugin of plugins) {
    await t.test(plugin.name, async function () {
      await assertPlugin(plugin)
    })
  }
})

/**
 * @param {PluginInfo} info
 *   Info.
 * @returns {Promise<undefined>}
 *   Nothing.
 */
async function assertPlugin(info) {
  /** @type {{default: Plugin}} */
  const pluginMod = await import(info.name)
  const plugin = pluginMod.default

  for (const check of info.checks) {
    await assertCheck(plugin, info, check)
  }
}

/**
 * @param {Plugin} plugin
 *   Plugin.
 * @param {PluginInfo} info
 *   info.
 * @param {Check} check
 *   Check.
 * @returns {Promise<undefined>}
 *   Nothing.
 */
async function assertCheck(plugin, info, check) {
  /** @type {{config: unknown}} */
  const {config} = JSON.parse(check.configuration)
  /** @type {PluggableList} */
  const extras = check.gfm ? [remarkGfm] : []
  const value = controlPictures(check.input)

  const file = await remark()
    .use(plugin, config)
    .use(extras)
    .process(new VFile({path: check.name, value}))

  for (const message of file.messages) {
    assert.equal(message.ruleId, info.ruleId)
    assert.equal(
      message.url,
      'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-' +
        info.ruleId +
        '#readme'
    )
  }

  assert.deepEqual(
    file.messages.map(String).map(function (value) {
      return value.slice(value.indexOf(':') + 1)
    }),
    check.output
  )

  if (!check.positionless) {
    const file = await remark()
      .use(function () {
        return function (tree) {
          removePosition(tree)
        }
      })
      .use(plugin, config)
      .use(extras)
      .process(new VFile({path: check.name, value}))

    assert.deepEqual(file.messages, [])
  }
}

/**
 * @param {unknown} d
 *   Value.
 * @returns {unknown}
 *   Cloned value.
 */
function jsonClone(d) {
  return JSON.parse(JSON.stringify(d))
}

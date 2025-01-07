/**
 * @import {PluggableList, Plugin} from 'unified'
 * @import {Check, PluginInfo} from './script/info.js'
 */

import assert from 'node:assert/strict'
import test from 'node:test'
import {controlPictures} from 'control-pictures'
import {remark} from 'remark'
import remarkDirective from 'remark-directive'
import remarkFrontmatter from 'remark-frontmatter'
import remarkGfm from 'remark-gfm'
import remarkLint from 'remark-lint'
import remarkLintFinalNewline from 'remark-lint-final-newline'
import remarkLintNoHeadingPunctuation from 'remark-lint-no-heading-punctuation'
import remarkLintNoMultipleToplevelHeadings from 'remark-lint-no-multiple-toplevel-headings'
import remarkLintNoUndefinedReferences from 'remark-lint-no-undefined-references'
import remarkLintFencedCodeFlag, {
  checkGithubLinguistFlag
} from 'remark-lint-fenced-code-flag'
import remarkMath from 'remark-math'
import remarkMdx from 'remark-mdx'
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

  const value = [
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
      .process({path: 'virtual.md', value})

    assert.deepEqual(file.messages.map(String), [
      'virtual.md:3:1-3:24: Unexpected character `.` at end of heading, remove it',
      'virtual.md:3:1-3:24: Unexpected duplicate toplevel heading, exected a single heading with rank `1`'
    ])
  })

  await t.test('should support `remark-lint` first', async function () {
    const file = await remark()
      .use(remarkLint)
      .use(remarkLintNoHeadingPunctuation)
      .use(remarkLintNoMultipleToplevelHeadings)
      .process({path: 'virtual.md', value})

    assert.deepEqual(file.messages.map(String), [
      'virtual.md:3:1-3:24: Unexpected character `.` at end of heading, remove it',
      'virtual.md:3:1-3:24: Unexpected duplicate toplevel heading, exected a single heading with rank `1`'
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
        column: 2,
        fatal: true,
        line: 1,
        message:
          'Unexpected missing final newline character, expected line feed (`\\n`) at end of file',
        name: '1:2',
        place: {column: 2, line: 1, offset: 1},
        reason:
          'Unexpected missing final newline character, expected line feed (`\\n`) at end of file',
        ruleId: 'final-newline',
        source: 'remark-lint',
        url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-final-newline#readme'
      }
    ])
  })

  await t.test('should support a boolean (`true`)', async function () {
    const file = await remark().use(remarkLintFinalNewline, true).process('.')

    assert.deepEqual(file.messages.map(String), [
      '1:2: Unexpected missing final newline character, expected line feed (`\\n`) at end of file'
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
        '1:2: Unexpected missing final newline character, expected line feed (`\\n`) at end of file'
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
          column: 2,
          fatal: true,
          line: 1,
          message:
            'Unexpected missing final newline character, expected line feed (`\\n`) at end of file',
          name: '1:2',
          place: {column: 2, line: 1, offset: 1},
          reason:
            'Unexpected missing final newline character, expected line feed (`\\n`) at end of file',
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
          column: 2,
          fatal: false,
          line: 1,
          message:
            'Unexpected missing final newline character, expected line feed (`\\n`) at end of file',
          name: '1:2',
          place: {column: 2, line: 1, offset: 1},
          reason:
            'Unexpected missing final newline character, expected line feed (`\\n`) at end of file',
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
          column: 2,
          fatal: false,
          line: 1,
          message:
            'Unexpected missing final newline character, expected line feed (`\\n`) at end of file',
          name: '1:2',
          place: {column: 2, line: 1, offset: 1},
          reason:
            'Unexpected missing final newline character, expected line feed (`\\n`) at end of file',
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
        'virtual.md:3:1-3:9: Unexpected reference to undefined definition, expected corresponding definition (`b`) for a link or escaped opening bracket (`\\[`) for regular text'
      ])
    }
  )

  await t.test(
    'should support `checkGithubLinguistFlag` as an option for (remark-lint-fenced-code-flag)',
    async function () {
      const file = await remark()
        .use(remarkLintFencedCodeFlag, checkGithubLinguistFlag)
        .process(
          '```foo\n```\n```.workbook\n``````workbook\n```\n```.md\n```\n```md\n```\n```mdown\n```\n```Markdown\n```\n```text\n```\n'
        )

      assert.deepEqual(file.messages.map(String), [
        '1:1-2:4: Unexpected unknown fenced code language flag `foo` in info string, expected a known language name',
        '3:1-5:4: Unexpected unknown fenced code language flag `.workbook` in info string, expected a known language name such as `markdown`, `md`, `pandoc`, or `rmarkdown`',
        '6:1-7:4: Unexpected unknown fenced code language flag `.md` in info string, expected a known language name such as `gcc-machine-description`, `lfe`, `netlogo`, `newlisp`, `picolisp`, …',
        '10:1-11:4: Unexpected unknown fenced code language flag `mdown` in info string, expected a known language name such as `markdown`, `md`, `pandoc`, or `rmarkdown`',
        '12:1-13:4: Unexpected fenced code language flag `Markdown` in info string, expected a known language name such as `markdown`, `md`, `pandoc`, or `rmarkdown`'
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
    await t.test(plugin.name, async function (t) {
      await assertPlugin(plugin, t)
    })
  }
})

/**
 * @param {PluginInfo} info
 *   Info.
 * @param {any} t
 *   Test context.
 * @returns {Promise<undefined>}
 *   Nothing.
 */
// type-coverage:ignore-next-line -- `TestContext` not exposed from `node:test`.
async function assertPlugin(info, t) {
  /** @type {{default: Plugin<[unknown]>}} */
  const pluginModule = await import(info.name)
  const plugin = pluginModule.default

  for (const check of info.checks) {
    const name = check.name + ':' + check.configuration

    // type-coverage:ignore-next-line -- `TestContext` not exposed from `node:test`.
    await t.test(name, async function () {
      await assertCheck(plugin, info, check)
    })
  }
}

/**
 * @param {Plugin<[unknown]>} plugin
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
  const extras = []
  const value = controlPictures(check.input)

  if (check.directive) extras.push(remarkDirective)
  if (check.frontmatter) extras.push(remarkFrontmatter)
  if (check.gfm) extras.push(remarkGfm)
  if (check.math) extras.push(remarkMath)
  if (check.mdx) extras.push(remarkMdx)

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
  // eslint-disable-next-line unicorn/prefer-structured-clone -- casting as JSON drops instance info.
  return JSON.parse(JSON.stringify(d))
}

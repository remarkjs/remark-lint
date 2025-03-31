/**
 * @import {Node as EstreeNode} from 'estree'
 * @import {Nodes, Root} from 'mdast'
 * @import {
 *   MdxJsxAttribute,
 *   MdxJsxAttributeValueExpression,
 *   MdxJsxExpressionAttribute
 * } from 'mdast-util-mdx-jsx'
 * @import {PluggableList, Plugin} from 'unified'
 * @import {VFileMessage} from 'vfile-message'
 * @import {Check, PluginInfo} from './script/info.js'
 */

import assert from 'node:assert/strict'
import test from 'node:test'
import {controlPictures} from 'control-pictures'
import {visit as visitEstree} from 'estree-util-visit'
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
import stringWidth from 'string-width'
import {lintRule} from 'unified-lint-rule'
import {removePosition} from 'unist-util-remove-position'
import {visit} from 'unist-util-visit'
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

  await t.test('should support async rules with promises', async function () {
    const file = await remark()
      .use(
        lintRule('test:rule', function (_, file) {
          return new Promise(function (resolve) {
            setTimeout(function () {
              file.message('Test')
              resolve()
            }, 4)
          })
        })
      )
      .process('')

    assert.deepEqual(file.messages.map(String), ['1:1: Test'])
  })

  await t.test('should support async rules with callbacks', async function () {
    const file = await remark()
      .use(
        lintRule('test:rule', function (_, file, _options, next) {
          setTimeout(function () {
            file.message('Test')
            next()
          }, 4)
        })
      )
      .process('')

    assert.deepEqual(file.messages.map(String), ['1:1: Test'])
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
    'should capture a variety of references (remark-lint-no-undefined-references)',
    async function () {
      const file = await remark()
        .use(remarkLintNoUndefinedReferences, {allow: [/^b\./i]})
        .process({
          path: 'virtual.md',
          value: [
            '[Mercury] is the first planet from the Sun and the smallest in the Solar',
            'System.',
            '',
            '[Venus][] is the second planet from the Sun.',
            '',
            '[Earth][earth] is the third planet from the Sun and the only astronomical',
            'object known to harbor life.',
            '',
            '![Mars] is the fourth planet from the Sun in the [Solar',
            'System].',
            '',
            '> Jupiter is the fifth planet from the Sun and the largest in the [Solar',
            '> System][].',
            '',
            '[Saturn][ is the sixth planet from the Sun and the second-largest',
            'in the Solar System, after Jupiter.',
            '',
            '[*Uranus*][] is the seventh planet from the Sun.',
            '',
            '[Neptune][neptune][more] is the eighth and farthest planet from the Sun.',
            '',
            '- [Pluto], once considered the ninth planet, is now classified as a [dwarf planet][Pluto].'
          ].join('\n')
        })

      assert.deepEqual(file.messages.map(String), [
        'virtual.md:1:1-1:10: Unexpected reference to undefined definition, expected corresponding definition (`mercury`) for a link or escaped opening bracket (`\\[`) for regular text',
        'virtual.md:4:1-4:10: Unexpected reference to undefined definition, expected corresponding definition (`venus`) for a link or escaped opening bracket (`\\[`) for regular text',
        'virtual.md:6:1-6:15: Unexpected reference to undefined definition, expected corresponding definition (`earth`) for a link or escaped opening bracket (`\\[`) for regular text',
        'virtual.md:9:2-9:8: Unexpected reference to undefined definition, expected corresponding definition (`mars`) for an image or escaped opening bracket (`\\[`) for regular text',
        'virtual.md:9:50-10:8: Unexpected reference to undefined definition, expected corresponding definition (`solar system`) for a link or escaped opening bracket (`\\[`) for regular text',
        'virtual.md:12:67-13:12: Unexpected reference to undefined definition, expected corresponding definition (`solar > system`) for a link or escaped opening bracket (`\\[`) for regular text',
        'virtual.md:15:1-15:9: Unexpected reference to undefined definition, expected corresponding definition (`saturn`) for a link or escaped opening bracket (`\\[`) for regular text',
        'virtual.md:18:1-18:13: Unexpected reference to undefined definition, expected corresponding definition (`*uranus*`) for a link or escaped opening bracket (`\\[`) for regular text',
        'virtual.md:20:1-20:19: Unexpected reference to undefined definition, expected corresponding definition (`neptune`) for a link or escaped opening bracket (`\\[`) for regular text',
        'virtual.md:20:19-20:25: Unexpected reference to undefined definition, expected corresponding definition (`more`) for a link or escaped opening bracket (`\\[`) for regular text',
        'virtual.md:22:3-22:10: Unexpected reference to undefined definition, expected corresponding definition (`pluto`) for a link or escaped opening bracket (`\\[`) for regular text',
        'virtual.md:22:69-22:90: Unexpected reference to undefined definition, expected corresponding definition (`pluto`) for a link or escaped opening bracket (`\\[`) for regular text'
      ])
    }
  )

  await t.test(
    'should support GFM tables (remark-lint-no-undefined-references)',
    async function () {
      const file = await remark()
        .use(remarkGfm)
        .use(remarkLintNoUndefinedReferences)
        .process({
          path: 'virtual.md',
          value: [
            '| [Header 1] | [Header 2] |',
            '|------------|------------|',
            '| [foo][a]   | [bar]      |',
            '',
            '[header 1]: https://example.com',
            '[a]: https://example.com'
          ].join('\n')
        })

      assert.deepEqual(file.messages.map(String), [
        'virtual.md:1:16-1:26: Unexpected reference to undefined definition, expected corresponding definition (`header 2`) for a link or escaped opening bracket (`\\[`) for regular text',
        'virtual.md:3:16-3:21: Unexpected reference to undefined definition, expected corresponding definition (`bar`) for a link or escaped opening bracket (`\\[`) for regular text'
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

  if (config && typeof config === 'object') {
    const record = /** @type {Record<string, unknown>} */ (config)
    /** @type {string} */
    let key

    for (key in record) {
      // Replace the magic value with a function.
      if (record[key] === '__STRING_WIDTH__') {
        record[key] = stringWidth
      }
    }
  }

  const file = await remark()
    .use(plugin, config)
    .use(extras)
    .process(new VFile({path: check.name, value}))

  for (const message of file.messages) {
    assert.equal(message.ruleId, info.ruleId)
    assert.equal(message.source, 'remark-lint')

    if (message.cause) {
      const cause = /** @type {VFileMessage} */ (message.cause)
      assert.equal(cause.ruleId, info.ruleId)
      assert.equal(cause.source, 'remark-lint')
    }

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
        /**
         * @param {Root} tree
         * @returns {undefined}
         */
        return function (tree) {
          removePosition(tree, {force: true})
          visit(tree, cleanUnistNode)
        }
      })
      .use(plugin, config)
      .use(extras)
      .process(new VFile({path: check.name, value}))

    assert.deepEqual(file.messages, [])
  }
}

/**
 * @param {Nodes | MdxJsxAttribute | MdxJsxAttributeValueExpression | MdxJsxExpressionAttribute} node
 *   Node.
 * @returns {undefined}
 *   Nothing.
 */
function cleanUnistNode(node) {
  if (
    node.type === 'mdxJsxAttribute' &&
    'value' in node &&
    node.value &&
    typeof node.value === 'object'
  ) {
    cleanUnistNode(node.value)
  }

  if (
    'attributes' in node &&
    node.attributes &&
    Array.isArray(node.attributes)
  ) {
    for (const attribute of node.attributes) {
      removePosition(attribute, {force: true})
      cleanUnistNode(attribute)
    }
  }

  if (node.data && 'estree' in node.data && node.data.estree) {
    visitEstree(node.data.estree, removeFromEstree)
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

/**
 * @param {EstreeNode} node
 *   estree node.
 * @returns {undefined}
 *   Nothing.
 */
function removeFromEstree(node) {
  delete node.loc
  // @ts-expect-error: acorn.
  delete node.start
  // @ts-expect-error: acorn.
  delete node.end
  delete node.range
}

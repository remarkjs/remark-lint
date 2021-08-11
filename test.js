import url from 'url'
import path from 'path'
import test from 'tape'
import {toVFile} from 'to-vfile'
import {removePosition} from 'unist-util-remove-position'
import {remark} from 'remark'
import remarkGfm from 'remark-gfm'
import {rules} from './script/util/rules.js'
import {rule} from './script/util/rule.js'
import {characters} from './script/characters.js'
import lint from './packages/remark-lint/index.js'
import noHeadingPunctuation from './packages/remark-lint-no-heading-punctuation/index.js'
import noMultipleToplevelHeadings from './packages/remark-lint-no-multiple-toplevel-headings/index.js'
import finalNewline from './packages/remark-lint-final-newline/index.js'

const own = {}.hasOwnProperty

test('core', (t) => {
  t.test('should work', (t) => {
    const doc = [
      '# A heading',
      '',
      '# Another main heading.',
      '',
      '<!--lint ignore-->',
      '',
      '# Another main heading.'
    ].join('\n')

    t.plan(2)

    remark()
      .use(noHeadingPunctuation)
      .use(noMultipleToplevelHeadings)
      .use(lint)
      .process(toVFile({path: 'virtual.md', value: doc}), (error, file) => {
        t.deepEqual(
          [error].concat(file.messages.map((d) => String(d))),
          [
            null,
            'virtual.md:3:1-3:24: Don’t add a trailing `.` to headings',
            'virtual.md:3:1-3:24: Don’t use multiple top level headings (1:1)'
          ],
          'should support `remark-lint` last'
        )
      })

    remark()
      .use(lint)
      .use(noHeadingPunctuation)
      .use(noMultipleToplevelHeadings)
      .process(toVFile({path: 'virtual.md', value: doc}), (error, file) => {
        t.deepEqual(
          [error].concat(file.messages.map((d) => String(d))),
          [
            null,
            'virtual.md:3:1-3:24: Don’t add a trailing `.` to headings',
            'virtual.md:3:1-3:24: Don’t use multiple top level headings (1:1)'
          ],
          'should support `remark-lint` first'
        )
      })
  })

  t.test('should support no rules', (t) => {
    t.plan(1)

    remark()
      .use(lint)
      .process('.', (error, file) => {
        t.deepEqual(
          [error].concat(file.messages.map((d) => String(d))),
          [null],
          'should warn for missing new lines'
        )
      })
  })

  t.test('should support successful rules', (t) => {
    t.plan(1)

    remark()
      .use(finalNewline)
      .process('', (error, file) => {
        t.deepEqual(
          [error].concat(file.messages.map((d) => String(d))),
          [null],
          'should support successful rules'
        )
      })
  })

  t.test('should support a list with a severity', (t) => {
    t.plan(2)

    remark()
      .use(finalNewline, [2])
      .process('.', (error, file) => {
        t.deepEqual(
          [error].concat(file.messages.map((d) => String(d))),
          [null, '1:1: Missing newline character at end of file'],
          'should emit fatally (1)'
        )
        t.equal(file.messages[0].fatal, true, 'should emit fatally (2)')
      })
  })

  t.test('should support a boolean (`true`)', (t) => {
    // Note! This is handled by unified.
    t.plan(1)

    remark()
      .use(finalNewline, true)
      .process('.', (error, file) => {
        t.deepEqual(
          [error].concat(file.messages.map((d) => String(d))),
          [null, '1:1: Missing newline character at end of file'],
          'should emit'
        )
      })
  })

  t.test('should support a boolean (`false`)', (t) => {
    // Note! This is handled by unified.
    t.plan(1)

    remark()
      .use(finalNewline, false)
      .process('.', (error, file) => {
        t.deepEqual(
          [error].concat(file.messages.map((d) => String(d))),
          [null],
          'should not emit'
        )
      })
  })

  t.test(
    'should support a list with a boolean severity (true, for on)',
    (t) => {
      t.plan(1)

      remark()
        .use(finalNewline, [true])
        .process('.', (error, file) => {
          t.deepEqual(
            [error].concat(file.messages.map((d) => String(d))),
            [null, '1:1: Missing newline character at end of file'],
            'should emit'
          )
        })
    }
  )

  t.test(
    'should support a list with boolean severity (false, for off)',
    (t) => {
      t.plan(1)

      remark()
        .use(finalNewline, [false])
        .process('.', (error, file) => {
          t.deepEqual(
            [error].concat(file.messages.map((d) => String(d))),
            [null],
            'should not emit'
          )
        })
    }
  )

  t.test('should support a list with string severity (`error`)', (t) => {
    t.plan(2)

    remark()
      .use(finalNewline, ['error'])
      .process('.', (error, file) => {
        t.deepEqual(
          [error].concat(file.messages.map((d) => String(d))),
          [null, '1:1: Missing newline character at end of file'],
          'should emit fatally (1)'
        )
        t.equal(file.messages[0].fatal, true, 'should emit fatally (2)')
      })
  })

  t.test('should support a list with a string severity (`on`)', (t) => {
    t.plan(2)

    remark()
      .use(finalNewline, ['on'])
      .process('.', (error, file) => {
        t.deepEqual(
          [error].concat(file.messages.map((d) => String(d))),
          [null, '1:1: Missing newline character at end of file'],
          'should message'
        )
        t.equal(file.messages[0].fatal, false, 'should not emit fatally')
      })
  })

  t.test('should support a list with a string severity (`warn`)', (t) => {
    t.plan(2)

    remark()
      .use(finalNewline, ['warn'])
      .process('.', (error, file) => {
        t.deepEqual(
          [error].concat(file.messages.map((d) => String(d))),
          [null, '1:1: Missing newline character at end of file'],
          'should message'
        )
        t.equal(file.messages[0].fatal, false, 'should not emit fatally')
      })
  })

  t.test('should support a list with a string severity (`off`)', (t) => {
    t.plan(1)

    remark()
      .use(finalNewline, ['off'])
      .process('.', (error, file) => {
        t.deepEqual(
          [error].concat(file.messages.map((d) => String(d))),
          [null],
          'should disable `final-newline`'
        )
      })
  })

  t.test('should fail on incorrect severities', (t) => {
    t.throws(
      () => {
        remark().use(finalNewline, [3]).freeze()
      },
      /^Error: Incorrect severity `3` for `final-newline`, expected 0, 1, or 2$/,
      'should throw when too high'
    )

    t.throws(
      () => {
        remark().use(finalNewline, [-1]).freeze()
      },
      /^Error: Incorrect severity `-1` for `final-newline`, expected 0, 1, or 2$/,
      'should throw too low'
    )

    t.end()
  })

  t.end()
})

test('rules', async (t) => {
  const root = path.join(process.cwd(), 'packages')
  const all = rules(root)
  let index = -1

  while (++index < all.length) {
    const basename = all[index]
    const base = path.resolve(root, basename)
    const info = rule(base)
    const fn = (await import(url.pathToFileURL(base).href + '/index.js'))
      .default

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

// Assert a rule.
function assertRule(t, rule, info) {
  const tests = info.tests
  let setting

  for (setting in tests) {
    if (own.call(tests, setting)) {
      const checks = tests[setting]
      const options = JSON.parse(setting)

      t.test(setting, (t) => {
        let name

        for (name in checks) {
          if (own.call(checks, name)) {
            const basename = name
            const check = checks[name]

            t.test(name, (t) => {
              assertFixture(t, rule, info, check, basename, options)
            })
          }
        }
      })
    }
  }

  t.end()
}

/* eslint-disable-next-line max-params */
function assertFixture(t, rule, info, fixture, basename, settings) {
  const ruleId = info.ruleId
  const file = toVFile(basename)
  const expected = fixture.output
  const positionless = fixture.positionless
  let proc = remark().use(rule, settings)

  if (fixture.gfm) proc.use(remarkGfm)

  file.value = preprocess(fixture.input || '')

  t.plan(positionless ? 1 : 2)

  try {
    proc.runSync(proc.parse(file), file)
  } catch (error) {
    if (error && error.source !== 'remark-lint') {
      throw error
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
  }

  t.deepEqual(normalize(file.messages), expected, 'should equal with position')

  if (!positionless) {
    file.messages = []
    proc = remark().use(clear).use(rule, settings)
    if (fixture.gfm) proc.use(remarkGfm)
    proc.processSync(file)

    t.deepEqual(normalize(file.messages), [], 'should equal without position')
  }

  function clear() {
    return removePosition
  }
}

function normalize(messages) {
  return messages.map((message) => {
    const value = String(message)
    return value.slice(value.indexOf(':') + 1)
  })
}

function preprocess(value) {
  let index = -1

  while (++index < characters.length) {
    value = value.replace(characters[index].in, characters[index].out)
  }

  return value
}

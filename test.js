import url from 'url'
import path from 'path'
import test from 'tape'
import vfile from 'to-vfile'
import removePosition from 'unist-util-remove-position'
import remark from 'remark'
import gfm from 'remark-gfm'
import {rules} from './script/util/rules.js'
import {rule} from './script/util/rule.js'
import {characters} from './script/characters.js'
import lint from './packages/remark-lint/index.js'
import noHeadingPunctuation from './packages/remark-lint-no-heading-punctuation/index.js'
import noMultipleToplevelHeadings from './packages/remark-lint-no-multiple-toplevel-headings/index.js'
import finalNewline from './packages/remark-lint-final-newline/index.js'

test('core', function (t) {
  t.test('should work', function (st) {
    var doc = [
      '# A heading',
      '',
      '# Another main heading.',
      '',
      '<!--lint ignore-->',
      '',
      '# Another main heading.'
    ].join('\n')

    st.plan(2)

    remark()
      .use(noHeadingPunctuation)
      .use(noMultipleToplevelHeadings)
      .use(lint)
      .process(
        vfile({path: 'virtual.md', contents: doc}),
        function (error, file) {
          st.deepEqual(
            [error].concat(file.messages.map(String)),
            [
              null,
              'virtual.md:3:1-3:24: Don’t add a trailing `.` to headings',
              'virtual.md:3:1-3:24: Don’t use multiple top level headings (1:1)'
            ],
            'should support `remark-lint` last'
          )
        }
      )

    remark()
      .use(lint)
      .use(noHeadingPunctuation)
      .use(noMultipleToplevelHeadings)
      .process(
        vfile({path: 'virtual.md', contents: doc}),
        function (error, file) {
          st.deepEqual(
            [error].concat(file.messages.map(String)),
            [
              null,
              'virtual.md:3:1-3:24: Don’t add a trailing `.` to headings',
              'virtual.md:3:1-3:24: Don’t use multiple top level headings (1:1)'
            ],
            'should support `remark-lint` first'
          )
        }
      )
  })

  t.test('should support no rules', function (st) {
    st.plan(1)

    remark()
      .use(lint)
      .process('.', function (error, file) {
        st.deepEqual(
          [error].concat(file.messages.map(String)),
          [null],
          'should warn for missing new lines'
        )
      })
  })

  t.test('should support successful rules', function (st) {
    st.plan(1)

    remark()
      .use(finalNewline)
      .process('', function (error, file) {
        st.deepEqual(
          [error].concat(file.messages.map(String)),
          [null],
          'should support successful rules'
        )
      })
  })

  t.test('should support a list with a severity', function (st) {
    st.plan(2)

    remark()
      .use(finalNewline, [2])
      .process('.', function (error, file) {
        st.deepEqual(
          [error].concat(file.messages.map(String)),
          [null, '1:1: Missing newline character at end of file'],
          'should emit fatally (1)'
        )
        st.equal(file.messages[0].fatal, true, 'should emit fatally (2)')
      })
  })

  t.test('should support a boolean (`true`)', function (st) {
    // Note! This is handled by unified.
    st.plan(1)

    remark()
      .use(finalNewline, true)
      .process('.', function (error, file) {
        st.deepEqual(
          [error].concat(file.messages.map(String)),
          [null, '1:1: Missing newline character at end of file'],
          'should emit'
        )
      })
  })

  t.test('should support a boolean (`false`)', function (st) {
    // Note! This is handled by unified.
    st.plan(1)

    remark()
      .use(finalNewline, false)
      .process('.', function (error, file) {
        st.deepEqual(
          [error].concat(file.messages.map(String)),
          [null],
          'should not emit'
        )
      })
  })

  t.test(
    'should support a list with a boolean severity (true, for on)',
    function (st) {
      st.plan(1)

      remark()
        .use(finalNewline, [true])
        .process('.', function (error, file) {
          st.deepEqual(
            [error].concat(file.messages.map(String)),
            [null, '1:1: Missing newline character at end of file'],
            'should emit'
          )
        })
    }
  )

  t.test(
    'should support a list with boolean severity (false, for off)',
    function (st) {
      st.plan(1)

      remark()
        .use(finalNewline, [false])
        .process('.', function (error, file) {
          st.deepEqual(
            [error].concat(file.messages.map(String)),
            [null],
            'should not emit'
          )
        })
    }
  )

  t.test('should support a list with string severity (`error`)', function (st) {
    st.plan(2)

    remark()
      .use(finalNewline, ['error'])
      .process('.', function (error, file) {
        st.deepEqual(
          [error].concat(file.messages.map(String)),
          [null, '1:1: Missing newline character at end of file'],
          'should emit fatally (1)'
        )
        st.equal(file.messages[0].fatal, true, 'should emit fatally (2)')
      })
  })

  t.test('should support a list with a string severity (`on`)', function (st) {
    st.plan(2)

    remark()
      .use(finalNewline, ['on'])
      .process('.', function (error, file) {
        st.deepEqual(
          [error].concat(file.messages.map(String)),
          [null, '1:1: Missing newline character at end of file'],
          'should message'
        )
        st.equal(file.messages[0].fatal, false, 'should not emit fatally')
      })
  })

  t.test(
    'should support a list with a string severity (`warn`)',
    function (st) {
      st.plan(2)

      remark()
        .use(finalNewline, ['warn'])
        .process('.', function (error, file) {
          st.deepEqual(
            [error].concat(file.messages.map(String)),
            [null, '1:1: Missing newline character at end of file'],
            'should message'
          )
          st.equal(file.messages[0].fatal, false, 'should not emit fatally')
        })
    }
  )

  t.test('should support a list with a string severity (`off`)', function (st) {
    st.plan(1)

    remark()
      .use(finalNewline, ['off'])
      .process('.', function (error, file) {
        st.deepEqual(
          [error].concat(file.messages.map(String)),
          [null],
          'should disable `final-newline`'
        )
      })
  })

  t.test('should fail on incorrect severities', function (st) {
    st.throws(
      function () {
        remark().use(finalNewline, [3]).freeze()
      },
      /^Error: Incorrect severity `3` for `final-newline`, expected 0, 1, or 2$/,
      'should throw when too high'
    )

    st.throws(
      function () {
        remark().use(finalNewline, [-1]).freeze()
      },
      /^Error: Incorrect severity `-1` for `final-newline`, expected 0, 1, or 2$/,
      'should throw too low'
    )

    st.end()
  })

  t.end()
})

test('rules', function (t) {
  var root = path.join(process.cwd(), 'packages')
  var all = rules(root)

  t.plan(all.length)

  all.forEach(each)

  async function each(basename) {
    var base = path.resolve(root, basename)
    var info = rule(base)
    var fn = (await import(url.pathToFileURL(base).href + '/index.js')).default
    var handle = Object.keys(info.tests).length === 0 ? ignore : one

    t.test(info.ruleId, handle)

    function one(st) {
      assertRule(st, fn, info)
    }

    function ignore(st) {
      st.pass('no tests')
      st.end()
    }
  }
})

// Assert a rule.
function assertRule(t, rule, info) {
  var tests = info.tests
  var settings = Object.keys(tests)

  t.plan(settings.length)

  settings.forEach(function (setting) {
    var fixture = tests[setting]
    var names = Object.keys(fixture)
    var settings = JSON.parse(setting)

    t.test(setting, function (st) {
      st.plan(names.length)

      names.forEach(function (name) {
        st.test(name, function (sst) {
          assertFixture(sst, rule, info, fixture[name], name, settings)
        })
      })
    })
  })
}

/* eslint-disable-next-line max-params */
function assertFixture(t, rule, info, fixture, basename, settings) {
  var ruleId = info.ruleId
  var file = vfile(basename)
  var expected = fixture.output
  var positionless = fixture.positionless
  var proc = remark().use(rule, settings)

  if (fixture.gfm) proc.use(gfm)

  file.contents = preprocess(fixture.input || '')

  t.plan(positionless ? 1 : 2)

  try {
    proc.runSync(proc.parse(file), file)
  } catch (error) {
    if (error && error.source !== 'remark-lint') {
      throw error
    }
  }

  file.messages.forEach(function (message) {
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
  })

  t.deepEqual(normalize(file.messages), expected, 'should equal with position')

  if (!positionless) {
    file.messages = []
    proc = remark().use(clear).use(rule, settings)
    if (fixture.gfm) proc.use(gfm)
    proc.processSync(file)

    t.deepEqual(normalize(file.messages), [], 'should equal without position')
  }

  function clear() {
    return removePosition
  }
}

function normalize(messages) {
  return messages.map(function (message) {
    var value = String(message)
    return value.slice(value.indexOf(':') + 1)
  })
}

function preprocess(value) {
  characters.forEach(function (char) {
    value = value.replace(char.in, char.out)
  })

  return value
}

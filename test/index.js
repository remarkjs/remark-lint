/**
 * @author Titus Wormer
 * @copyright 2016 Titus Wormer
 * @license MIT
 * @module remark:lint
 * @fileoverview Test suite for `remark-lint`.
 */

'use strict';

/* eslint-disable max-params */

/* Dependencies. */
var path = require('path');
var test = require('tape');
var vfile = require('to-vfile');
var removePosition = require('unist-util-remove-position');
var remark = require('remark');
var lint = require('..');
var rules = require('../script/util/rules');
var rule = require('../script/util/rule');

/* Tests. */
test('core', function (t) {
  t.test('should work', function (st) {
    var doc = vfile('virtual.md');

    st.plan(2);

    doc.contents = [
      '# A heading',
      '',
      '# Another main heading.',
      '',
      '<!--lint ignore-->',
      '',
      '# Another main heading.'
    ].join('\n');

    remark()
      .use(lint, {finalNewline: false})
      .process(doc, function (err) {
        st.ifErr(err, 'should not fail');
        st.deepEqual(
          doc.messages.map(String),
          [
            'virtual.md:3:1-3:24: Don’t add a trailing `.` to headings',
            'virtual.md:3:1-3:24: Don’t use multiple top level headings (3:1)'
          ]);
      });
  });

  t.test('should support no options', function (st) {
    st.plan(2);

    remark().use(lint).process('.', function (err, file) {
      st.ifErr(err, 'should not fail');
      st.deepEqual(
        file.messages.map(String),
        ['1:1: Missing newline character at end of file'],
        'should warn for missing new lines'
      );
    });
  });

  t.test('should support camel-cased rule-id’s', function (st) {
    st.plan(2);

    remark()
      .use(lint, {finalNewline: false})
      .process('.', function (err, file) {
        st.ifErr(err, 'should not fail');
        st.deepEqual(file.messages, [], 'should disable `final-newline`');
      });
  });

  t.test('should support dash-cased rule-id’s', function (st) {
    st.plan(2);

    remark()
      .use(lint, {'final-newline': false})
      .process('.', function (err, file) {
        st.ifErr(err, 'should not fail');
        st.deepEqual(file.messages, [], 'should disable `final-newline`');
      });
  });

  t.test('should support a list with a severity', function (st) {
    st.plan(3);

    remark()
      .use(lint, {reset: true, finalNewline: [2]})
      .process('.', function (err, file) {
        st.ifErr(err, 'should not fail');
        st.equal(
          file.messages.join(),
          '1:1: Missing newline character at end of file',
          'should trigger fatally (1)'
        );
        st.equal(file.messages[0].fatal, true, 'should trigger fatally (2)');
      });
  });

  t.test('should fail on invalid severities', function (st) {
    st.throws(
      function () {
        remark().use(lint, {finalNewline: [3]});
      },
      /^Error: Invalid severity `3` for `final-newline`, expected 0, 1, or 2$/,
      'should throw when too high'
    );

    st.throws(
      function () {
        remark().use(lint, {finalNewline: [-1]});
      },
      /^Error: Invalid severity `-1` for `final-newline`, expected 0, 1, or 2$/,
      'should throw too low'
    );

    st.end();
  });

  t.end();
});

test('external rules', function (t) {
  var tests = {
    'literal external rules': [
      require('remark-lint-no-url-trailing-slash')
    ],
    'external rules by package name': [
      'remark-lint-no-url-trailing-slash'
    ],
    'external rules by prefixless name': [
      'no-url-trailing-slash'
    ],
    'external rules by absolute file-path': [
      path.join(__dirname, 'local-external.js')
    ],
    'external rules by relative file-path': [
      './' + path.relative(
        process.cwd(),
        path.join(__dirname, 'local-external.js')
      )
    ],
    'external rules without extension': [
      path.join(__dirname, 'local-external')
    ]
  };

  t.plan(Object.keys(tests).length);

  Object.keys(tests).forEach(function (label) {
    t.test('should load ' + label, function (st) {
      var doc = '[alpha](https://bravo.charlie/)\n';

      st.plan(2);

      remark()
        .use(lint, {
          external: tests[label]
        })
        .process(doc, function (err, file) {
          st.ifErr(err, 'should not fail');
          st.deepEqual(
            file.messages.map(String),
            ['1:1-1:32: Remove trailing slash (https://bravo.charlie)'],
            'should warn for missing new lines'
          );
        });
    });
  });
});

test('rules', function (t) {
  var all = rules(process.cwd());

  t.plan(all.length);

  all.forEach(function (rulePath) {
    var info = rule(rulePath);

    t.test(info.ruleId, function (sst) {
      assertRule(sst, info);
    });
  });
});

/**
 * Assert a rule.
 *
 * @param {Test} t - Tape test.
 * @param {Object} rule - Rule information.
 */
function assertRule(t, rule) {
  var tests = rule.tests;

  Object.keys(tests).forEach(function (setting) {
    var fixture = tests[setting];
    var config = JSON.parse(setting);

    t.test(setting, function (st) {
      Object.keys(fixture).forEach(function (name) {
        st.test(name, function (sst) {
          assertFixture(sst, rule, fixture[name], name, config);
        });
      });
    });
  });

  t.end();
}

/**
 * Assert a fixture.
 *
 * @param {Test} t - Tape test.
 * @param {Object} rule - Rule information.
 * @param {Object} fixture - Fixture information.
 * @param {string} basename - Name of fixture.
 * @param {*} setting - Configuration.
 */
function assertFixture(t, rule, fixture, basename, setting) {
  var ruleId = rule.ruleId;
  var file = vfile(basename);
  var expected = fixture.output;
  var options = {reset: true};
  var positionless = fixture.config.positionless;

  options[ruleId] = setting;

  file.contents = preprocess(fixture.input || '');

  t.plan(positionless ? 1 : 2);

  try {
    remark().use(lint, options).process(file, fixture.config);
  } catch (err) {}

  file.messages.forEach(function (message) {
    if (message.ruleId !== ruleId) {
      throw new Error(
        'Expected `' + ruleId + '`, not `' +
        message.ruleId + '` as `ruleId` for ' +
        message
      );
    }
  });

  t.deepEqual(
    normalize(file.messages),
    expected,
    'should equal with position'
  );

  if (!positionless) {
    file.messages = [];

    try {
      remark().use(function () {
        return removePosition;
      }).use(lint, options).process(file);
    } catch (err) {}

    t.deepEqual(
      normalize(file.messages),
      [],
      'should equal without position'
    );
  }

  file.messages = [];
}

/**
 * Normalize a list of messages.
 *
 * @param {Array.<VFileMessage>} messages - List of warnings.
 * @return {Array.<VFileMessage>} - Normalized warnings.
 */
function normalize(messages) {
  return messages.map(function (message) {
    var value = String(message);

    return value.slice(value.indexOf(':') + 1);
  });
}

function preprocess(value) {
  return value.replace(/»/g, '\t').replace(/·/g, ' ');
}

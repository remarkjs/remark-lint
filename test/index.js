/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module remark:lint:test
 * @fileoverview Tests for remark-lint.
 */

'use strict';

/* eslint-env node, mocha */

var fs = require('fs');
var path = require('path');
var assert = require('assert');
var remark = require('remark');
var File = require('vfile');
var toc = require('remark-toc');
var github = require('remark-github');
var lint = require('..');
var plural = require('plur');
var clean = require('./clean');

/*
 * Methods.
 */

var read = fs.readFileSync;
var join = path.join;
var basename = path.basename;
var extname = path.extname;
var dirname = path.dirname;
var dequal = assert.deepEqual;

/**
 * Create a `File` from a `filePath`.
 *
 * @param {string} filePath - Path to file.
 * @return {File} - Virtual file representation.
 */
function toFile(filePath) {
    var extension = extname(filePath);
    var directory = dirname(filePath);
    var name = basename(filePath, extension);

    return new File({
        'directory': directory,
        'filename': name,
        'extension': extension.slice(1),
        'contents': read(join('test', 'fixtures', filePath), 'utf-8')
    });
}

/**
 * Shortcut.
 *
 * @param {string} filePath - Path to `file`.
 * @param {Object?} options - Passed to `remark-lint`
 * @param {Object?} settings - Passed to `remark`
 * @param {boolean?} shouldClean - Uses `clean` plugin,
 *   when truthy.
 * @return {Array.<Error>} - Messages.
 */
function process(filePath, options, settings, shouldClean) {
    var file = toFile(filePath);
    var processor = remark();

    if (shouldClean) {
        processor.use(clean);
    }

    processor.use(lint, options);

    file.quiet = true;

    processor.process(file, settings, function (err) {
        if (err) {
            if (file.messages.indexOf(err) !== -1) {
                return;
            }

            throw err;
        }
    });

    return file.messages;
}

/*
 * BDD-like helpers.
 */

var currentRule = null;
var currentSetting = null;

/**
 * Describe a single remark-lint rule.
 *
 * @param {string} ruleId - Rule to turn on when testing.
 * @param {Function} description - Passed to `describe()`.
 */
function describeRule(ruleId, description) {
    currentRule = ruleId;

    describe(ruleId, description);

    currentRule = null;
}

/**
 * Describe how a single remark-lint rule should behave
 * when given a certain `setting`.
 *
 * @param {*} setting - Passed to the rule.
 * @param {Function} description - Passed to `describe()`.
 */
function describeSetting(setting, description) {
    currentSetting = setting;

    describe(JSON.stringify(setting), description);

    currentSetting = null;
}

/**
 * Assert the messages triggered when running a bound rule
 * with a bound setting on `filePath`, are the same as
 * `messages`.  Additionally accepts `settings` which are
 * given to `remark`.
 *
 * @param {string} filePath - Location of file in
 *   `test/fixtures/`.
 * @param {Array.<string>} messages - Assertions.
 * @param {Object?} settings - Passed to `remark`.
 * @param {Object?} overwrite - Passed to `remark-lint`
 *   instead of constructing based on BDD-like tests.
 */
function assertFile(filePath, messages, settings, overwrite) {
    var n = -1;
    var options;
    var results;
    var max;
    var label;

    if (overwrite) {
        options = overwrite;
    } else {
        /*
         * Construct remark-lint options.
         */

        options = {};
        options.reset = true;
        options[currentRule] = currentSetting;
    }

    /*
     * Convert messages to strings.
     */

    results = process(filePath, options, settings).map(String);

    max = (results.length > messages.length ? results : messages).length;

    /*
     * Create descriptive label for the test.
     */

    label = max === 0 ? 'shouldn’t warn' :
        max === 1 ? 'should warn' :
        'should warn ' + max + ' ' + plural('time', max);

    /*
     * Assert.
     */

    it(filePath + ' ' + label, function () {
        while (++n < max) {
            assert.strictEqual(messages[n], results[n]);
        }
    });
}

/*
 * Basic tests.
 */

describe('remark-lint', function () {
    it('should work without `options`', function () {
        assert(process('file-extension-markdown.markdown').length === 1);
    });

    it('should ignore rules when set to `false`', function () {
        assert(process('file-extension-markdown.markdown', {
            'file-extension': false
        }).length === 0);
    });

    it('should ignore all rules when `reset: true`', function () {
        assert(process('file-extension-markdown.markdown', {
            'reset': true
        }).length === 0);
    });

    it('...except for explicitly turned on rules', function () {
        assert(process('file-extension-markdown.markdown', {
            'reset': true,
            'file-extension': 'md'
        }).length === 1);
    });

    it('should accept camel-cased rules', function () {
        dequal(process('maximum-line-length-valid.md', {
            'reset': true,
            'maximumLineLength': 20
        }).map(String), [
            'maximum-line-length-valid.md:1:81: Line must be at most 20 characters',
            'maximum-line-length-valid.md:18:61: Line must be at most 20 characters',
            'maximum-line-length-valid.md:22:40: Line must be at most 20 characters'
        ]);
    });
});

/*
 * Validate external rules.
 */

describe('External', function () {
    describe('Load external rules with require', function () {
        assertFile('lorem-invalid.md', [
            'lorem-invalid.md:1:6: Do not use lorem'
        ], null, {
            'external': ['test/external']
        });
    });

    describe('Load external rules with require and without `.js` extension', function () {
        assertFile('lorem-invalid.md', [
            'lorem-invalid.md:1:6: Do not use lorem'
        ], null, {
            'external': ['test/external/index']
        });
    });

    describe('Load external rules with require and with `.js` extension', function () {
        assertFile('lorem-invalid.md', [
            'lorem-invalid.md:1:6: Do not use lorem'
        ], null, {
            'external': ['test/external/index.js']
        });
    });

    describe('Load local external rules', function () {
        it('should fail on invalid external rules', function () {
            assert.throws(function () {
                process('lorem-valid.md', {
                    'external': ['remark']
                });
            });
        });
    });

    describe('Load external rules by passing in', function () {
        var external = require('./external');

        assertFile('lorem-invalid.md', [
            'lorem-invalid.md:1:6: Do not use lorem'
        ], null, {
            'external': [external]
        });
    });
});

/*
 * Validate gaps are ignored.
 */

describe('Gaps', function () {
    it('should supports gaps in a document', function (done) {
        var file = toFile('gaps-toc-internal.md');
        var processor = remark().use(toc).use(lint);

        file.quiet = true;

        processor.process(file, function (err) {
            assert(file.messages.length === 0);

            done(err);
        });
    });

    it('should supports gaps at the end of a document', function (done) {
        var file = toFile('gaps-toc-final.md');
        var processor = remark().use(toc).use(lint);

        file.quiet = true;

        processor.process(file, function (err) {
            assert(file.messages.length === 0);

            done(err);
        });
    });
});

/*
 * Validate only “real” links are warned about.
 */

describe('GitHub', function () {
    it('should supports gaps in a document', function (done) {
        var file = toFile('remark-github.md');
        var processor = remark().use(github).use(lint);

        file.quiet = true;

        processor.process(file, function (err) {
            assert(file.messages.length === 0);
            done(err);
        });
    });
});

/*
 * Validate inline en- and disabling.
 */

describe('Comments', function () {
    describe('Disable and re-enable rules based on markers', function () {
        assertFile('comments-disable.md', [
            'comments-disable.md:7:89: Line must be at most 80 characters'
        ], null, {});
    });

    describe('Enable and re-disable rules based on markers', function () {
        assertFile('comments-enable.md', [
            'comments-enable.md:3:89: Line must be at most 80 characters'
        ], null, {
            'reset': true
        });
    });

    describe('Disable multiple rules at once', function () {
        assertFile('comments-disable-multiple.md', [
            'comments-disable-multiple.md:11:1-11:10: Do not use headings with similar content (5:1)'
        ], null, {});
    });

    describe('Inline comments', function () {
        assertFile('comments-inline.md', [
            'comments-inline.md:1:32-1:38: Do not use HTML in markdown',
            'comments-inline.md:1:50-1:57: Do not use HTML in markdown'
        ], null, {
            'reset': true
        });
    });

    describe('Invalid comments', function () {
        assertFile('comments-invalid-keyword.md', [
            'comments-invalid-keyword.md:3:1-3:20: Unknown keyword `foo`: expected `\'enable\'`, `\'disable\'`, or `\'ignore\'`'
        ], null, {
            'reset': true
        });
    });

    describe('Invalid rules', function () {
        assertFile('comments-invalid-rule-id.md', [
            'comments-invalid-rule-id.md:3:1-3:23: Unknown rule: cannot enable `\'bar\'`'
        ], null, {
            'reset': true
        });
    });

    describe('Without comments', function () {
        assertFile('comments-none.md', [], null, {
            'reset': true
        });
    });

    describe('Duplicate enabling of rules', function () {
        assertFile('comments-duplicates.md', [
            'comments-duplicates.md:3:89: Line must be at most 80 characters',
            'comments-duplicates.md:7:89: Line must be at most 80 characters'
        ], null, {});
    });
});

/*
 * Validate rules.
 */

describe('Rules', function () {
    describeRule('file-extension', function () {
        describeSetting('md', function () {
            assertFile('file-extension-markdown.markdown', [
                'file-extension-markdown.markdown:1:1: Invalid extension: use `md`'
            ]);

            assertFile('file-without-extension', []);
            assertFile('file-extension-md.md', []);
        });

        describeSetting('markdown', function () {
            assertFile('file-extension-markdown.markdown', []);
            assertFile('file-without-extension', []);

            assertFile('file-extension-md.md', [
                'file-extension-md.md:1:1: Invalid extension: use `markdown`'
            ]);
        });
    });

    describeRule('no-file-name-articles', function () {
        describeSetting(true, function () {
            assertFile('the-file-name.md', [
                'the-file-name.md:1:1: Do not start file names with `the`'
            ]);
        });
    });

    describeRule('no-file-name-mixed-case', function () {
        describeSetting(true, function () {
            assertFile('file-name-Upper-case.md', [
                'file-name-Upper-case.md:1:1: Do not mix casing in file names'
            ]);
        });
    });

    describeRule('no-file-name-irregular-characters', function () {
        describeSetting(true, function () {
            assertFile('file-name characters.md', [
                'file-name characters.md:1:1: Do not use ` ` in a file name'
            ]);
        });
    });

    describeRule('no-file-name-consecutive-dashes', function () {
        describeSetting(true, function () {
            assertFile('file-name--consecutive-dashes.md', [
                'file-name--consecutive-dashes.md:1:1: Do not use consecutive dashes in a file name'
            ]);
        });
    });

    describeRule('no-file-name-consecutive-dashes', function () {
        describeSetting(true, function () {
            assertFile('file-name--consecutive-dashes.md', [
                'file-name--consecutive-dashes.md:1:1: Do not use consecutive dashes in a file name'
            ]);
        });
    });

    describeRule('no-file-name-outer-dashes', function () {
        describeSetting(true, function () {
            assertFile('-file-name-initial-dash.md', [
                '-file-name-initial-dash.md:1:1: Do not use initial or final dashes in a file name'
            ]);

            assertFile('file-name-final-dash-.md', [
                'file-name-final-dash-.md:1:1: Do not use initial or final dashes in a file name'
            ]);
        });
    });

    describeRule('maximum-heading-length', function () {
        describeSetting(true, function () {
            assertFile('heading-length-too-long.md', [
                'heading-length-too-long.md:1:1-1:65: Use headings shorter than `60`'
            ]);

            assertFile('heading-length-normal.md', []);
            assertFile('heading-length-quite-short.md', []);
        });

        describeSetting(20, function () {
            assertFile('heading-length-too-long.md', [
                'heading-length-too-long.md:1:1-1:65: Use headings shorter than `20`'
            ]);

            assertFile('heading-length-quite-short.md', [
                'heading-length-quite-short.md:1:1-1:29: Use headings shorter than `20`'
            ]);

            assertFile('heading-length-normal.md', []);
        });
    });

    describeRule('first-heading-level', function () {
        describeSetting(true, function () {
            assertFile('first-heading-level-invalid.md', [
                'first-heading-level-invalid.md:1:1-1:11: First heading level should be `1`'
            ]);

            assertFile('first-heading-level-valid.md', []);
        });
    });

    describeRule('heading-increment', function () {
        describeSetting(true, function () {
            assertFile('heading-increment-invalid.md', [
                'heading-increment-invalid.md:3:1-3:8: Heading levels should increment by one level at a time'
            ]);

            assertFile('heading-increment-invalid-blockquote.md', [
                'heading-increment-invalid-blockquote.md:3:3-3:10: Heading levels should increment by one level at a time'
            ]);

            assertFile('heading-increment-invalid-list.md', [
                'heading-increment-invalid-list.md:3:5-3:12: Heading levels should increment by one level at a time'
            ]);

            assertFile('first-heading-level-invalid.md', []);
        });
    });

    describeRule('no-heading-punctuation', function () {
        describeSetting(true, function () {
            assertFile('no-heading-punctuation-period.md', [
                'no-heading-punctuation-period.md:1:1-1:7: Don’t add a trailing `.` to headings'
            ]);

            assertFile('no-heading-punctuation-colon.md', [
                'no-heading-punctuation-colon.md:1:1-1:7: Don’t add a trailing `:` to headings'
            ]);

            assertFile('no-heading-punctuation-question.md', [
                'no-heading-punctuation-question.md:1:1-1:7: Don’t add a trailing `?` to headings'
            ]);

            assertFile('no-heading-punctuation-valid.md', []);
        });

        describeSetting('o', function () {
            assertFile('no-heading-punctuation-period.md', []);
            assertFile('no-heading-punctuation-colon.md', []);
            assertFile('no-heading-punctuation-question.md', []);

            assertFile('no-heading-punctuation-valid.md', [
                'no-heading-punctuation-valid.md:1:1-1:6: Don’t add a trailing `o` to headings'
            ]);
        });
    });

    describeRule('heading-style', function () {
        describeSetting(true, function () {
            assertFile('heading-style-atx.md', []);
            assertFile('heading-style-atx-closed.md', []);
            assertFile('heading-style-setext.md', []);

            assertFile('heading-style-not-consistent.md', [
                'heading-style-not-consistent.md:3:1-4:6: Headings should use atx',
                'heading-style-not-consistent.md:6:1-6:19: Headings should use atx',
                'heading-style-not-consistent.md:10:1-10:24: Headings should use atx'
            ]);

            assertFile('heading-style-empty.md', [
                'heading-style-empty.md:3:1-3:3: Headings should use atx-closed',
                'heading-style-empty.md:7:1-7:5: Headings should use atx-closed',
                'heading-style-empty.md:11:1-11:7: Headings should use atx-closed'
            ]);
        });

        describeSetting('atx', function () {
            assertFile('heading-style-atx.md', []);

            assertFile('heading-style-atx-closed.md', [
                'heading-style-atx-closed.md:1:1-1:15: Headings should use atx',
                'heading-style-atx-closed.md:3:1-3:17: Headings should use atx',
                'heading-style-atx-closed.md:5:1-5:19: Headings should use atx',
                'heading-style-atx-closed.md:7:1-7:21: Headings should use atx',
                'heading-style-atx-closed.md:9:1-9:23: Headings should use atx',
                'heading-style-atx-closed.md:11:1-11:25: Headings should use atx'
            ]);

            assertFile('heading-style-setext.md', [
                'heading-style-setext.md:1:1-2:6: Headings should use atx',
                'heading-style-setext.md:4:1-5:6: Headings should use atx'
            ]);

            assertFile('heading-style-not-consistent.md', [
                'heading-style-not-consistent.md:3:1-4:6: Headings should use atx',
                'heading-style-not-consistent.md:6:1-6:19: Headings should use atx',
                'heading-style-not-consistent.md:10:1-10:24: Headings should use atx'
            ]);

            assertFile('heading-style-empty.md', [
                'heading-style-empty.md:1:1-1:4: Headings should use atx',
                'heading-style-empty.md:5:1-5:8: Headings should use atx',
                'heading-style-empty.md:9:1-9:12: Headings should use atx'
            ]);
        });

        describeSetting('atx-closed', function () {
            assertFile('heading-style-atx.md', [
                'heading-style-atx.md:1:1-1:6: Headings should use atx-closed',
                'heading-style-atx.md:3:1-3:7: Headings should use atx-closed',
                'heading-style-atx.md:5:1-5:17: Headings should use atx-closed',
                'heading-style-atx.md:7:1-7:18: Headings should use atx-closed',
                'heading-style-atx.md:9:1-9:19: Headings should use atx-closed',
                'heading-style-atx.md:11:1-11:20: Headings should use atx-closed'
            ]);

            assertFile('heading-style-atx-closed.md', []);

            assertFile('heading-style-setext.md', [
                'heading-style-setext.md:1:1-2:6: Headings should use atx-closed',
                'heading-style-setext.md:4:1-5:6: Headings should use atx-closed',
                'heading-style-setext.md:7:1-7:17: Headings should use atx-closed',
                'heading-style-setext.md:9:1-9:18: Headings should use atx-closed',
                'heading-style-setext.md:11:1-11:19: Headings should use atx-closed',
                'heading-style-setext.md:13:1-13:20: Headings should use atx-closed'
            ]);

            assertFile('heading-style-not-consistent.md', [
                'heading-style-not-consistent.md:1:1-1:6: Headings should use atx-closed',
                'heading-style-not-consistent.md:3:1-4:6: Headings should use atx-closed',
                'heading-style-not-consistent.md:8:1-8:18: Headings should use atx-closed',
                'heading-style-not-consistent.md:12:1-12:20: Headings should use atx-closed'
            ]);

            assertFile('heading-style-empty.md', [
                'heading-style-empty.md:3:1-3:3: Headings should use atx-closed',
                'heading-style-empty.md:7:1-7:5: Headings should use atx-closed',
                'heading-style-empty.md:11:1-11:7: Headings should use atx-closed'
            ]);
        });

        describeSetting('setext', function () {
            assertFile('heading-style-atx.md', [
                'heading-style-atx.md:1:1-1:6: Headings should use setext',
                'heading-style-atx.md:3:1-3:7: Headings should use setext'
            ]);

            assertFile('heading-style-atx-closed.md', [
                'heading-style-atx-closed.md:1:1-1:15: Headings should use setext',
                'heading-style-atx-closed.md:3:1-3:17: Headings should use setext',
                'heading-style-atx-closed.md:5:1-5:19: Headings should use setext',
                'heading-style-atx-closed.md:7:1-7:21: Headings should use setext',
                'heading-style-atx-closed.md:9:1-9:23: Headings should use setext',
                'heading-style-atx-closed.md:11:1-11:25: Headings should use setext'
            ]);

            assertFile('heading-style-setext.md', []);

            assertFile('heading-style-not-consistent.md', [
                'heading-style-not-consistent.md:1:1-1:6: Headings should use setext',
                'heading-style-not-consistent.md:6:1-6:19: Headings should use setext',
                'heading-style-not-consistent.md:10:1-10:24: Headings should use setext'
            ]);

            assertFile('heading-style-empty.md', [
                'heading-style-empty.md:1:1-1:4: Headings should use setext',
                'heading-style-empty.md:3:1-3:3: Headings should use setext',
                'heading-style-empty.md:5:1-5:8: Headings should use setext',
                'heading-style-empty.md:9:1-9:12: Headings should use setext'
            ]);
        });
    });

    describeRule('no-heading-indent', function () {
        describeSetting(true, function () {
            assertFile('no-heading-indent-invalid.md', [
                'no-heading-indent-invalid.md:1:4: Remove 3 spaces before this heading',
                'no-heading-indent-invalid.md:3:2: Remove 1 space before this heading',
                'no-heading-indent-invalid.md:6:2: Remove 1 space before this heading',
                'no-heading-indent-invalid.md:8:4: Remove 3 spaces before this heading'
            ]);

            assertFile('no-heading-indent-valid.md', []);
        });
    });

    describeRule('no-heading-content-indent', function () {
        describeSetting(true, function () {
            assertFile('no-heading-content-indent-invalid.md', [
                'no-heading-content-indent-invalid.md:1:4: Remove 1 space before this heading’s content',
                'no-heading-content-indent-invalid.md:3:6: Remove 2 spaces before this heading’s content',
                'no-heading-content-indent-invalid.md:5:5: Add 1 space before this heading’s content',
                'no-heading-content-indent-invalid.md:5:41: Remove 1 space after this heading’s content',
                'no-heading-content-indent-invalid.md:7:7: Remove 1 space before this heading’s content',
                'no-heading-content-indent-invalid.md:7:39: Remove 1 space after this heading’s content'
            ], {
                'pedantic': true
            });

            assertFile('no-heading-content-indent-valid.md', [], {
                'pedantic': true
            });
        });
    });

    describeRule('no-duplicate-headings', function () {
        describeSetting(true, function () {
            assertFile('no-duplicate-headings-invalid.md', [
                'no-duplicate-headings-invalid.md:3:1-3:8: Do not use headings with similar content (1:1)',
                'no-duplicate-headings-invalid.md:8:1-8:28: Do not use headings with similar content (5:1)'
            ]);

            assertFile('no-duplicate-headings-valid.md', []);
        });
    });

    describeRule('no-emphasis-as-heading', function () {
        describeSetting(true, function () {
            assertFile('no-emphasis-as-heading-invalid.md', [
                'no-emphasis-as-heading-invalid.md:1:1-1:25: Don’t use emphasis to introduce a section, use a heading',
                'no-emphasis-as-heading-invalid.md:5:1-5:21: Don’t use emphasis to introduce a section, use a heading'
            ]);

            assertFile('no-emphasis-as-heading-valid.md', []);
        });
    });

    describeRule('no-multiple-toplevel-headings', function () {
        describeSetting(true, function () {
            assertFile('no-multiple-toplevel-headings-invalid.md', [
                'no-multiple-toplevel-headings-invalid.md:6:1-7:8: Don’t use multiple top level headings (6:1)'
            ]);

            assertFile('no-multiple-toplevel-headings-valid.md', []);
        });
    });

    describeRule('no-literal-urls', function () {
        describeSetting(true, function () {
            assertFile('no-literal-urls-invalid.md', [
                'no-literal-urls-invalid.md:1:1-1:19: Don’t use literal URLs without angle brackets'
            ]);

            assertFile('no-literal-urls-valid.md', []);
        });
    });

    describeRule('no-auto-link-without-protocol', function () {
        describeSetting(true, function () {
            assertFile('no-auto-link-without-protocol-invalid.md', [
                'no-auto-link-without-protocol-invalid.md:8:1-8:17: All automatic links must start with a protocol'
            ]);

            assertFile('no-auto-link-without-protocol-valid.md', []);
        });
    });

    describeRule('no-consecutive-blank-lines', function () {
        describeSetting(true, function () {
            assertFile('no-consecutive-blank-lines-invalid.md', [
                'no-consecutive-blank-lines-invalid.md:2:1: Remove 1 line before node',
                'no-consecutive-blank-lines-invalid.md:5:1: Remove 1 line before node',
                'no-consecutive-blank-lines-invalid.md:8:1: Remove 1 line before node',
                'no-consecutive-blank-lines-invalid.md:11:3: Remove 1 line before node',
                'no-consecutive-blank-lines-invalid.md:14:1: Remove 1 line before node',
                'no-consecutive-blank-lines-invalid.md:18:1: Remove 1 line before node',
                'no-consecutive-blank-lines-invalid.md:22:1: Remove 1 line before node'
            ]);

            assertFile('no-consecutive-blank-lines-valid.md', []);
        });
    });

    describeRule('no-missing-blank-lines', function () {
        describeSetting(true, function () {
            assertFile('no-missing-blank-lines-invalid.md', [
                'no-missing-blank-lines-invalid.md:4:1-6:31: Missing blank line before block node',
                'no-missing-blank-lines-invalid.md:7:1-7:12: Missing blank line before block node',
                'no-missing-blank-lines-invalid.md:8:1-9:4: Missing blank line before block node',
                'no-missing-blank-lines-invalid.md:10:1-11:39: Missing blank line before block node',
                'no-missing-blank-lines-invalid.md:12:1-12:4: Missing blank line before block node',
                'no-missing-blank-lines-invalid.md:13:1-15:4: Missing blank line before block node',
                'no-missing-blank-lines-invalid.md:16:1-16:18: Missing blank line before block node',
                'no-missing-blank-lines-invalid.md:17:1-17:20: Missing blank line before block node',
                'no-missing-blank-lines-invalid.md:18:1-18:15: Missing blank line before block node',
                'no-missing-blank-lines-invalid.md:21:1-21:13: Missing blank line before block node'
            ]);

            assertFile('no-missing-blank-lines-valid.md', []);
        });
    });

    describeRule('blockquote-indentation', function () {
        describeSetting(true, function () {
            assertFile('blockquote-indentation-2.md', []);
            assertFile('blockquote-indentation-4.md', []);
        });

        describeSetting(2, function () {
            assertFile('blockquote-indentation-2.md', []);

            assertFile('blockquote-indentation-4.md', [
                'blockquote-indentation-4.md:1:3: Remove 2 spaces between blockquote and content',
                'blockquote-indentation-4.md:5:3: Remove 2 spaces between blockquote and content',
                'blockquote-indentation-4.md:9:3: Remove 2 spaces between blockquote and content'
            ]);
        });

        describeSetting(4, function () {
            assertFile('blockquote-indentation-2.md', [
                'blockquote-indentation-2.md:1:3: Add 2 spaces between blockquote and content',
                'blockquote-indentation-2.md:5:3: Add 2 spaces between blockquote and content',
                'blockquote-indentation-2.md:9:3: Add 2 spaces between blockquote and content'
            ]);

            assertFile('blockquote-indentation-4.md', []);
        });
    });

    describeRule('emphasis-marker', function () {
        describeSetting(true, function () {
            assertFile('emphasis-marker-asterisk-underscore.md', [
                'emphasis-marker-asterisk-underscore.md:3:1-3:6: Emphasis should use `*` as a marker'
            ]);

            assertFile('emphasis-marker-underscore-asterisk.md', [
                'emphasis-marker-underscore-asterisk.md:3:1-3:6: Emphasis should use `_` as a marker'
            ]);

            assertFile('emphasis-marker-asterisk.md', []);
            assertFile('emphasis-marker-underscore.md', []);
        });

        describeSetting('~', function () {
            assertFile('empty.md', [
                'empty.md:1:1: Invalid emphasis marker `~`: use either `\'consistent\'`, `\'*\'`, or `\'_\'`'
            ]);
        });

        describeSetting('*', function () {
            assertFile('emphasis-marker-asterisk-underscore.md', [
                'emphasis-marker-asterisk-underscore.md:3:1-3:6: Emphasis should use `*` as a marker'
            ]);

            assertFile('emphasis-marker-underscore-asterisk.md', [
                'emphasis-marker-underscore-asterisk.md:1:1-1:6: Emphasis should use `*` as a marker'
            ]);

            assertFile('emphasis-marker-asterisk.md', []);

            assertFile('emphasis-marker-underscore.md', [
                'emphasis-marker-underscore.md:1:1-1:6: Emphasis should use `*` as a marker',
                'emphasis-marker-underscore.md:3:1-3:6: Emphasis should use `*` as a marker'
            ]);
        });

        describeSetting('_', function () {
            assertFile('emphasis-marker-asterisk-underscore.md', [
                'emphasis-marker-asterisk-underscore.md:1:1-1:6: Emphasis should use `_` as a marker'
            ]);

            assertFile('emphasis-marker-underscore-asterisk.md', [
                'emphasis-marker-underscore-asterisk.md:3:1-3:6: Emphasis should use `_` as a marker'
            ]);

            assertFile('emphasis-marker-asterisk.md', [
                'emphasis-marker-asterisk.md:1:1-1:6: Emphasis should use `_` as a marker',
                'emphasis-marker-asterisk.md:3:1-3:6: Emphasis should use `_` as a marker'
            ]);

            assertFile('emphasis-marker-underscore.md', []);
        });

        describeSetting('~', function () {
            assertFile('empty.md', [
                'empty.md:1:1: Invalid emphasis marker `~`: use either `\'consistent\'`, `\'*\'`, or `\'_\'`'
            ]);
        });
    });

    describeRule('strong-marker', function () {
        describeSetting(true, function () {
            assertFile('strong-marker-asterisk-underscore.md', [
                'strong-marker-asterisk-underscore.md:3:1-3:8: Strong should use `*` as a marker'
            ]);

            assertFile('strong-marker-underscore-asterisk.md', [
                'strong-marker-underscore-asterisk.md:3:1-3:8: Strong should use `_` as a marker'
            ]);

            assertFile('strong-marker-asterisk.md', []);
            assertFile('strong-marker-underscore.md', []);
        });

        describeSetting('*', function () {
            assertFile('strong-marker-asterisk-underscore.md', [
                'strong-marker-asterisk-underscore.md:3:1-3:8: Strong should use `*` as a marker'
            ]);

            assertFile('strong-marker-underscore-asterisk.md', [
                'strong-marker-underscore-asterisk.md:1:1-1:8: Strong should use `*` as a marker'
            ]);

            assertFile('strong-marker-asterisk.md', []);

            assertFile('strong-marker-underscore.md', [
                'strong-marker-underscore.md:1:1-1:8: Strong should use `*` as a marker',
                'strong-marker-underscore.md:3:1-3:8: Strong should use `*` as a marker'
            ]);
        });

        describeSetting('_', function () {
            assertFile('strong-marker-asterisk-underscore.md', [
                'strong-marker-asterisk-underscore.md:1:1-1:8: Strong should use `_` as a marker'
            ]);

            assertFile('strong-marker-underscore-asterisk.md', [
                'strong-marker-underscore-asterisk.md:3:1-3:8: Strong should use `_` as a marker'
            ]);

            assertFile('strong-marker-asterisk.md', [
                'strong-marker-asterisk.md:1:1-1:8: Strong should use `_` as a marker',
                'strong-marker-asterisk.md:3:1-3:8: Strong should use `_` as a marker'
            ]);

            assertFile('strong-marker-underscore.md', []);
        });

        describeSetting('~', function () {
            assertFile('empty.md', [
                'empty.md:1:1: Invalid strong marker `~`: use either `\'consistent\'`, `\'*\'`, or `\'_\'`'
            ]);
        });
    });

    describeRule('no-inline-padding', function () {
        describeSetting(true, function () {
            assertFile('no-inline-padding-invalid.md', [
                'no-inline-padding-invalid.md:1:11-1:17: Don’t pad `emphasis` with inner spaces',
                'no-inline-padding-invalid.md:1:23-1:29: Don’t pad `emphasis` with inner spaces',
                'no-inline-padding-invalid.md:3:9-3:17: Don’t pad `strong` with inner spaces',
                'no-inline-padding-invalid.md:3:22-3:30: Don’t pad `strong` with inner spaces',
                'no-inline-padding-invalid.md:7:11-7:31: Don’t pad `image` with inner spaces',
                'no-inline-padding-invalid.md:9:9-9:32: Don’t pad `link` with inner spaces'
            ]);

            assertFile('no-inline-padding-valid.md', []);
        });
    });

    describeRule('no-table-indentation', function () {
        describeSetting(true, function () {
            assertFile('no-table-indentation-invalid.md', [
                'no-table-indentation-invalid.md:4:1-4:16: Do not indent table rows',
                'no-table-indentation-invalid.md:6:1-6:16: Do not indent table rows'
            ]);

            assertFile('no-table-indentation-valid.md', []);
        });
    });

    describeRule('table-pipes', function () {
        describeSetting(true, function () {
            assertFile('table-pipes-invalid.md', [
                'table-pipes-invalid.md:3:1: Missing initial pipe in table fence',
                'table-pipes-invalid.md:3:10: Missing final pipe in table fence',
                'table-pipes-invalid.md:5:1: Missing initial pipe in table fence',
                'table-pipes-invalid.md:5:10: Missing final pipe in table fence',
                'table-pipes-invalid.md:9:1: Missing initial pipe in table fence',
                'table-pipes-invalid.md:11:1: Missing initial pipe in table fence',
                'table-pipes-invalid.md:15:12: Missing final pipe in table fence',
                'table-pipes-invalid.md:17:12: Missing final pipe in table fence',
                'table-pipes-invalid.md:21:1: Missing initial pipe in table fence',
                'table-pipes-invalid.md:21:18: Missing final pipe in table fence',
                'table-pipes-invalid.md:23:1: Missing initial pipe in table fence',
                'table-pipes-invalid.md:23:16: Missing final pipe in table fence'
            ]);

            assertFile('table-pipes-valid.md', []);
        });
    });

    describeRule('table-pipe-alignment', function () {
        describeSetting(true, function () {
            assertFile('table-pipe-alignment-invalid.md', [
                'table-pipe-alignment-invalid.md:5:6-5:7: Misaligned table fence',
                'table-pipe-alignment-invalid.md:5:22-5:23: Misaligned table fence'
            ]);

            assertFile('table-pipe-alignment-valid.md', []);
        });
    });

    describeRule('table-cell-padding', function () {
        describeSetting('~', function () {
            assertFile('empty.md', [
                'empty.md:1:1: Invalid table-cell-padding style `~`'
            ]);
        });

        describeSetting(true, function () {
            assertFile('table-cell-padding-padded.md', []);
            assertFile('table-cell-padding-compact.md', []);
            assertFile('table-cell-padding-padded-unaligned.md', []);
            assertFile('table-cell-padding-compact-unaligned.md', []);

            assertFile('table-cell-padding-mixed.md', [
                'table-cell-padding-mixed.md:3:7: Cell should be compact, isn’t',
                'table-cell-padding-mixed.md:3:16: Cell should be compact, isn’t',
                'table-cell-padding-mixed.md:3:20: Cell should be compact, isn’t',
                'table-cell-padding-mixed.md:7:7: Cell should be compact, isn’t',
                'table-cell-padding-mixed.md:7:16: Cell should be compact, isn’t',
                'table-cell-padding-mixed.md:7:20: Cell should be compact, isn’t',
                'table-cell-padding-mixed.md:13:10: Cell should be padded, isn’t',
                'table-cell-padding-mixed.md:13:15: Cell should be padded, isn’t',
                'table-cell-padding-mixed.md:13:23: Cell should be padded, isn’t',
                'table-cell-padding-mixed.md:13:28: Cell should be padded, isn’t',
                'table-cell-padding-mixed.md:17:10: Cell should be padded, isn’t',
                'table-cell-padding-mixed.md:17:14: Cell should be padded, isn’t',
                'table-cell-padding-mixed.md:17:25: Cell should be padded, isn’t',
                'table-cell-padding-mixed.md:17:28: Cell should be padded, isn’t'
            ]);
        });

        describeSetting('compact', function () {
            assertFile('table-cell-padding-padded.md', [
                'table-cell-padding-padded.md:3:3: Cell should be compact, isn’t',
                'table-cell-padding-padded.md:3:8: Cell should be compact, isn’t',
                'table-cell-padding-padded.md:3:11: Cell should be compact, isn’t',
                'table-cell-padding-padded.md:3:16: Cell should be compact, isn’t',
                'table-cell-padding-padded.md:3:19: Cell should be compact, isn’t',
                'table-cell-padding-padded.md:3:24: Cell should be compact, isn’t',
                'table-cell-padding-padded.md:3:27: Cell should be compact, isn’t',
                'table-cell-padding-padded.md:3:32: Cell should be compact, isn’t',
                'table-cell-padding-padded.md:9:3: Cell should be compact, isn’t',
                'table-cell-padding-padded.md:9:8: Cell should be compact, isn’t',
                'table-cell-padding-padded.md:9:11: Cell should be compact, isn’t',
                'table-cell-padding-padded.md:9:16: Cell should be compact, isn’t',
                'table-cell-padding-padded.md:9:20: Cell should be compact, isn’t',
                'table-cell-padding-padded.md:9:24: Cell should be compact, isn’t',
                'table-cell-padding-padded.md:9:29: Cell should be compact, isn’t',
                'table-cell-padding-padded.md:9:32: Cell should be compact, isn’t'
            ]);

            assertFile('table-cell-padding-compact.md', []);

            assertFile('table-cell-padding-padded-unaligned.md', [
                'table-cell-padding-padded-unaligned.md:3:3: Cell should be compact, isn’t',
                'table-cell-padding-padded-unaligned.md:3:8: Cell should be compact, isn’t',
                'table-cell-padding-padded-unaligned.md:3:11: Cell should be compact, isn’t',
                'table-cell-padding-padded-unaligned.md:3:13: Cell should be compact, isn’t',
                'table-cell-padding-padded-unaligned.md:3:16: Cell should be compact, isn’t',
                'table-cell-padding-padded-unaligned.md:3:21: Cell should be compact, isn’t',
                'table-cell-padding-padded-unaligned.md:3:24: Cell should be compact, isn’t',
                'table-cell-padding-padded-unaligned.md:3:26: Cell should be compact, isn’t'
            ]);

            assertFile('table-cell-padding-compact-unaligned.md', []);

            assertFile('table-cell-padding-mixed.md', [
                'table-cell-padding-mixed.md:3:7: Cell should be compact, isn’t',
                'table-cell-padding-mixed.md:3:16: Cell should be compact, isn’t',
                'table-cell-padding-mixed.md:3:20: Cell should be compact, isn’t',
                'table-cell-padding-mixed.md:7:7: Cell should be compact, isn’t',
                'table-cell-padding-mixed.md:7:16: Cell should be compact, isn’t',
                'table-cell-padding-mixed.md:7:20: Cell should be compact, isn’t',
                'table-cell-padding-mixed.md:13:3: Cell should be compact, isn’t',
                'table-cell-padding-mixed.md:13:8: Cell should be compact, isn’t',
                'table-cell-padding-mixed.md:13:17: Cell should be compact, isn’t',
                'table-cell-padding-mixed.md:13:21: Cell should be compact, isn’t',
                'table-cell-padding-mixed.md:17:3: Cell should be compact, isn’t',
                'table-cell-padding-mixed.md:17:8: Cell should be compact, isn’t',
                'table-cell-padding-mixed.md:17:17: Cell should be compact, isn’t',
                'table-cell-padding-mixed.md:17:21: Cell should be compact, isn’t'
            ]);
        });

        describeSetting('padded', function () {
            assertFile('table-cell-padding-padded.md', []);

            assertFile('table-cell-padding-compact.md', [
                'table-cell-padding-compact.md:3:2: Cell should be padded, isn’t',
                'table-cell-padding-compact.md:3:7: Cell should be padded, isn’t',
                'table-cell-padding-compact.md:3:8: Cell should be padded, isn’t',
                'table-cell-padding-compact.md:3:13: Cell should be padded, isn’t',
                'table-cell-padding-compact.md:3:14: Cell should be padded, isn’t',
                'table-cell-padding-compact.md:3:19: Cell should be padded, isn’t',
                'table-cell-padding-compact.md:3:20: Cell should be padded, isn’t',
                'table-cell-padding-compact.md:3:25: Cell should be padded, isn’t',
                'table-cell-padding-compact.md:9:2: Cell should be padded, isn’t',
                'table-cell-padding-compact.md:9:6: Cell should be padded, isn’t',
                'table-cell-padding-compact.md:9:8: Cell should be padded, isn’t',
                'table-cell-padding-compact.md:9:12: Cell should be padded, isn’t',
                'table-cell-padding-compact.md:9:15: Cell should be padded, isn’t',
                'table-cell-padding-compact.md:9:18: Cell should be padded, isn’t',
                'table-cell-padding-compact.md:9:22: Cell should be padded, isn’t',
                'table-cell-padding-compact.md:9:25: Cell should be padded, isn’t'
            ]);

            assertFile('table-cell-padding-padded-unaligned.md', []);

            assertFile('table-cell-padding-compact-unaligned.md', [
                'table-cell-padding-compact-unaligned.md:3:2: Cell should be padded, isn’t',
                'table-cell-padding-compact-unaligned.md:3:7: Cell should be padded, isn’t',
                'table-cell-padding-compact-unaligned.md:3:8: Cell should be padded, isn’t',
                'table-cell-padding-compact-unaligned.md:3:10: Cell should be padded, isn’t',
                'table-cell-padding-compact-unaligned.md:3:11: Cell should be padded, isn’t',
                'table-cell-padding-compact-unaligned.md:3:16: Cell should be padded, isn’t',
                'table-cell-padding-compact-unaligned.md:3:17: Cell should be padded, isn’t',
                'table-cell-padding-compact-unaligned.md:3:19: Cell should be padded, isn’t'
            ]);

            assertFile('table-cell-padding-mixed.md', [
                'table-cell-padding-mixed.md:3:2: Cell should be padded, isn’t',
                'table-cell-padding-mixed.md:3:9: Cell should be padded, isn’t',
                'table-cell-padding-mixed.md:3:14: Cell should be padded, isn’t',
                'table-cell-padding-mixed.md:3:22: Cell should be padded, isn’t',
                'table-cell-padding-mixed.md:3:27: Cell should be padded, isn’t',
                'table-cell-padding-mixed.md:7:2: Cell should be padded, isn’t',
                'table-cell-padding-mixed.md:7:9: Cell should be padded, isn’t',
                'table-cell-padding-mixed.md:7:13: Cell should be padded, isn’t',
                'table-cell-padding-mixed.md:7:24: Cell should be padded, isn’t',
                'table-cell-padding-mixed.md:7:27: Cell should be padded, isn’t',
                'table-cell-padding-mixed.md:13:10: Cell should be padded, isn’t',
                'table-cell-padding-mixed.md:13:15: Cell should be padded, isn’t',
                'table-cell-padding-mixed.md:13:23: Cell should be padded, isn’t',
                'table-cell-padding-mixed.md:13:28: Cell should be padded, isn’t',
                'table-cell-padding-mixed.md:17:10: Cell should be padded, isn’t',
                'table-cell-padding-mixed.md:17:14: Cell should be padded, isn’t',
                'table-cell-padding-mixed.md:17:25: Cell should be padded, isn’t',
                'table-cell-padding-mixed.md:17:28: Cell should be padded, isn’t'
            ]);
        });
    });

    describeRule('no-blockquote-without-caret', function () {
        describeSetting(true, function () {
            assertFile('no-blockquote-without-caret-invalid.md', [
                'no-blockquote-without-caret-invalid.md:3:1: Missing caret in blockquote',
                'no-blockquote-without-caret-invalid.md:9:1: Missing caret in blockquote',
                'no-blockquote-without-caret-invalid.md:10:1: Missing caret in blockquote',
                'no-blockquote-without-caret-invalid.md:17:1: Missing caret in blockquote'
            ]);

            assertFile('no-blockquote-without-caret-valid.md', []);
        });
    });

    describeRule('code-block-style', function () {
        describeSetting(true, function () {
            assertFile('code-style-indented.md', []);
            assertFile('code-style-fenced.md', []);
        });

        describeSetting('~', function () {
            assertFile('empty.md', [
                'empty.md:1:1: Invalid code block style `~`: use either `\'consistent\'`, `\'fenced\'`, or `\'indented\'`'
            ]);
        });

        describeSetting('indented', function () {
            assertFile('code-style-indented.md', []);

            assertFile('code-style-fenced.md', [
                'code-style-fenced.md:3:1-5:4: Code blocks should be indented',
                'code-style-fenced.md:9:1-11:4: Code blocks should be indented'
            ]);
        });

        describeSetting('fenced', function () {
            assertFile('code-style-indented.md', [
                'code-style-indented.md:3:1-3:8: Code blocks should be fenced',
                'code-style-indented.md:7:1-7:8: Code blocks should be fenced'
            ]);

            assertFile('code-style-fenced.md', []);
        });
    });

    describeRule('definition-case', function () {
        describeSetting(true, function () {
            assertFile('definition-case-invalid.md', [
                'definition-case-invalid.md:3:1-3:59: Do not use upper-case characters in definition labels'
            ]);

            assertFile('definition-case-valid.md', []);
        });
    });

    describeRule('definition-spacing', function () {
        describeSetting(true, function () {
            assertFile('definition-spacing-invalid.md', [
                'definition-spacing-invalid.md:3:1-3:68: Do not use consecutive white-space in definition labels'
            ]);

            assertFile('definition-spacing-valid.md', []);
        });
    });

    describeRule('fenced-code-flag', function () {
        describeSetting(true, function () {
            assertFile('fenced-code-flag-invalid.md', [
                'fenced-code-flag-invalid.md:3:1-5:4: Missing code-language flag'
            ]);

            assertFile('fenced-code-flag-unknown.md', []);
            assertFile('fenced-code-flag-valid.md', []);
        });

        describeSetting(['foo'], function () {
            assertFile('fenced-code-flag-invalid.md', [
                'fenced-code-flag-invalid.md:3:1-5:4: Missing code-language flag'
            ]);

            assertFile('fenced-code-flag-unknown.md', [
                'fenced-code-flag-unknown.md:3:1-5:4: Invalid code-language flag'
            ]);

            assertFile('fenced-code-flag-valid.md', []);
        });

        describeSetting({
            'allowEmpty': true,
            'flags': ['foo']
        }, function () {
            assertFile('fenced-code-flag-invalid.md', []);

            assertFile('fenced-code-flag-unknown.md', [
                'fenced-code-flag-unknown.md:3:1-5:4: Invalid code-language flag'
            ]);

            assertFile('fenced-code-flag-valid.md', []);
        });
    });

    describeRule('final-definition', function () {
        describeSetting(true, function () {
            assertFile('final-definition-invalid.md', [
                'final-definition-invalid.md:1:1-1:57: Move definitions to the end of the file (after the node at line `7`)',
                'final-definition-invalid.md:5:1-5:59: Move definitions to the end of the file (after the node at line `7`)'
            ]);

            assertFile('final-definition-valid.md', []);
        });
    });

    describeRule('hard-break-spaces', function () {
        describeSetting(true, function () {
            assertFile('hard-break-spaces-invalid.md', [
                'hard-break-spaces-invalid.md:1:25-2:1: Use two spaces for hard line breaks',
                'hard-break-spaces-invalid.md:4:40-5:5: Use two spaces for hard line breaks'
            ]);

            assertFile('hard-break-spaces-valid.md', []);
        });
    });

    describeRule('no-html', function () {
        describeSetting(true, function () {
            assertFile('no-html-invalid.md', [
                'no-html-invalid.md:1:1-1:14: Do not use HTML in markdown',
                'no-html-invalid.md:3:8-3:14: Do not use HTML in markdown',
                'no-html-invalid.md:3:18-3:25: Do not use HTML in markdown'
            ]);

            assertFile('no-html-valid.md', []);
        });
    });

    describeRule('maximum-line-length', function () {
        describeSetting(true, function () {
            assertFile('maximum-line-length-invalid.md', [
                'maximum-line-length-invalid.md:1:82: Line must be at most 80 characters',
                'maximum-line-length-invalid.md:3:86: Line must be at most 80 characters',
                'maximum-line-length-invalid.md:5:99: Line must be at most 80 characters',
                'maximum-line-length-invalid.md:7:97: Line must be at most 80 characters'
            ]);

            assertFile('maximum-line-length-valid.md', []);
        });

        describeSetting(100, function () {
            assertFile('maximum-line-length-invalid.md', []);
            assertFile('maximum-line-length-valid.md', []);
        });
    });

    describeRule('list-item-bullet-indent', function () {
        describeSetting(true, function () {
            assertFile('list-item-bullet-indent-invalid.md', [
                'list-item-bullet-indent-invalid.md:3:3: Incorrect indentation before bullet: remove 2 spaces',
                'list-item-bullet-indent-invalid.md:4:3: Incorrect indentation before bullet: remove 2 spaces'
            ]);

            assertFile('list-item-bullet-indent-valid.md', []);
        });
    });

    describeRule('list-item-content-indent', function () {
        describeSetting(true, function () {
            assertFile('list-item-content-indent-invalid.md', [
                'list-item-content-indent-invalid.md:14:5: Don’t use mixed indentation for children, remove 1 space'
            ]);

            assertFile('list-item-content-indent-valid.md', []);
        });
    });

    describeRule('list-item-indent', function () {
        describeSetting('~', function () {
            assertFile('empty.md', [
                'empty.md:1:1: Invalid list-item indent style `~`: use either `\'tab-size\'`, `\'space\'`, or `\'mixed\'`'
            ]);
        });

        describeSetting('tab-size', function () {
            assertFile('list-item-indent-tab-size.md', []);

            assertFile('list-item-indent-space.md', [
                'list-item-indent-space.md:3:3: Incorrect list-item indent: add 2 spaces',
                'list-item-indent-space.md:4:3: Incorrect list-item indent: add 2 spaces',
                'list-item-indent-space.md:5:3: Incorrect list-item indent: add 2 spaces',
                'list-item-indent-space.md:9:4: Incorrect list-item indent: add 1 space',
                'list-item-indent-space.md:10:4: Incorrect list-item indent: add 1 space',
                'list-item-indent-space.md:11:4: Incorrect list-item indent: add 1 space',
                'list-item-indent-space.md:15:3: Incorrect list-item indent: add 2 spaces',
                'list-item-indent-space.md:18:3: Incorrect list-item indent: add 2 spaces',
                'list-item-indent-space.md:21:3: Incorrect list-item indent: add 2 spaces',
                'list-item-indent-space.md:26:4: Incorrect list-item indent: add 1 space',
                'list-item-indent-space.md:29:4: Incorrect list-item indent: add 1 space',
                'list-item-indent-space.md:32:4: Incorrect list-item indent: add 1 space',
                'list-item-indent-space.md:37:4: Incorrect list-item indent: add 1 space',
                'list-item-indent-space.md:43:4: Incorrect list-item indent: add 1 space',
                'list-item-indent-space.md:54:4: Incorrect list-item indent: add 1 space',
                'list-item-indent-space.md:55:4: Incorrect list-item indent: add 1 space',
                'list-item-indent-space.md:56:4: Incorrect list-item indent: add 1 space',
                'list-item-indent-space.md:57:4: Incorrect list-item indent: add 1 space',
                'list-item-indent-space.md:58:4: Incorrect list-item indent: add 1 space',
                'list-item-indent-space.md:59:4: Incorrect list-item indent: add 1 space',
                'list-item-indent-space.md:60:4: Incorrect list-item indent: add 1 space',
                'list-item-indent-space.md:61:4: Incorrect list-item indent: add 1 space',
                'list-item-indent-space.md:62:4: Incorrect list-item indent: add 1 space',
                'list-item-indent-space.md:63:4: Incorrect list-item indent: add 1 space'
            ]);

            assertFile('list-item-indent-mixed.md', [
                'list-item-indent-mixed.md:3:3: Incorrect list-item indent: add 2 spaces',
                'list-item-indent-mixed.md:4:3: Incorrect list-item indent: add 2 spaces',
                'list-item-indent-mixed.md:5:3: Incorrect list-item indent: add 2 spaces',
                'list-item-indent-mixed.md:9:4: Incorrect list-item indent: add 1 space',
                'list-item-indent-mixed.md:10:4: Incorrect list-item indent: add 1 space',
                'list-item-indent-mixed.md:11:4: Incorrect list-item indent: add 1 space',
                'list-item-indent-mixed.md:37:4: Incorrect list-item indent: add 1 space'
            ]);
        });

        describeSetting('space', function () {
            assertFile('list-item-indent-tab-size.md', [
                'list-item-indent-tab-size.md:3:5: Incorrect list-item indent: remove 2 spaces',
                'list-item-indent-tab-size.md:4:5: Incorrect list-item indent: remove 2 spaces',
                'list-item-indent-tab-size.md:5:5: Incorrect list-item indent: remove 2 spaces',
                'list-item-indent-tab-size.md:9:5: Incorrect list-item indent: remove 1 space',
                'list-item-indent-tab-size.md:10:5: Incorrect list-item indent: remove 1 space',
                'list-item-indent-tab-size.md:11:5: Incorrect list-item indent: remove 1 space',
                'list-item-indent-tab-size.md:15:5: Incorrect list-item indent: remove 2 spaces',
                'list-item-indent-tab-size.md:18:5: Incorrect list-item indent: remove 2 spaces',
                'list-item-indent-tab-size.md:21:5: Incorrect list-item indent: remove 2 spaces',
                'list-item-indent-tab-size.md:26:5: Incorrect list-item indent: remove 1 space',
                'list-item-indent-tab-size.md:29:5: Incorrect list-item indent: remove 1 space',
                'list-item-indent-tab-size.md:32:5: Incorrect list-item indent: remove 1 space',
                'list-item-indent-tab-size.md:37:5: Incorrect list-item indent: remove 1 space',
                'list-item-indent-tab-size.md:43:5: Incorrect list-item indent: remove 1 space'
            ]);

            assertFile('list-item-indent-space.md', []);

            assertFile('list-item-indent-mixed.md', [
                'list-item-indent-mixed.md:15:5: Incorrect list-item indent: remove 2 spaces',
                'list-item-indent-mixed.md:18:5: Incorrect list-item indent: remove 2 spaces',
                'list-item-indent-mixed.md:21:5: Incorrect list-item indent: remove 2 spaces',
                'list-item-indent-mixed.md:26:5: Incorrect list-item indent: remove 1 space',
                'list-item-indent-mixed.md:29:5: Incorrect list-item indent: remove 1 space',
                'list-item-indent-mixed.md:32:5: Incorrect list-item indent: remove 1 space',
                'list-item-indent-mixed.md:43:5: Incorrect list-item indent: remove 1 space'
            ]);
        });

        describeSetting('mixed', function () {
            assertFile('list-item-indent-tab-size.md', [
                'list-item-indent-tab-size.md:3:5: Incorrect list-item indent: remove 2 spaces',
                'list-item-indent-tab-size.md:4:5: Incorrect list-item indent: remove 2 spaces',
                'list-item-indent-tab-size.md:5:5: Incorrect list-item indent: remove 2 spaces',
                'list-item-indent-tab-size.md:9:5: Incorrect list-item indent: remove 1 space',
                'list-item-indent-tab-size.md:10:5: Incorrect list-item indent: remove 1 space',
                'list-item-indent-tab-size.md:11:5: Incorrect list-item indent: remove 1 space',
                'list-item-indent-tab-size.md:37:5: Incorrect list-item indent: remove 1 space'
            ]);

            assertFile('list-item-indent-space.md', [
                'list-item-indent-space.md:15:3: Incorrect list-item indent: add 2 spaces',
                'list-item-indent-space.md:18:3: Incorrect list-item indent: add 2 spaces',
                'list-item-indent-space.md:21:3: Incorrect list-item indent: add 2 spaces',
                'list-item-indent-space.md:26:4: Incorrect list-item indent: add 1 space',
                'list-item-indent-space.md:29:4: Incorrect list-item indent: add 1 space',
                'list-item-indent-space.md:32:4: Incorrect list-item indent: add 1 space',
                'list-item-indent-space.md:43:4: Incorrect list-item indent: add 1 space'
            ]);

            assertFile('list-item-indent-mixed.md', []);
        });
    });

    describeRule('list-item-spacing', function () {
        describeSetting(true, function () {
            assertFile('list-item-spacing-tight-invalid.md', [
                 'list-item-spacing-tight-invalid.md:2:1-3:1: List item should be tight, isn’t',
                 'list-item-spacing-tight-invalid.md:4:1-5:1: List item should be tight, isn’t'
            ]);

            assertFile('list-item-spacing-loose-invalid.md', [
                 'list-item-spacing-loose-invalid.md:2:9-3:1: List item should be loose, isn’t',
                 'list-item-spacing-loose-invalid.md:3:11-4:1: List item should be loose, isn’t'
            ]);

            assertFile('list-item-spacing-tight-valid.md', []);
            assertFile('list-item-spacing-loose-valid.md', []);
        });
    });

    describeRule('ordered-list-marker-value', function () {
        describeSetting('~', function () {
            assertFile('empty.md', [
                'empty.md:1:1: Invalid ordered list-item marker value `~`: use either `\'ordered\'` or `\'one\'`'
            ]);
        });

        describeSetting('ordered', function () {
            assertFile('ordered-list-marker-value-ordered.md', []);

            assertFile('ordered-list-marker-value-one.md', [
                'ordered-list-marker-value-one.md:2:1-2:9: Marker should be `2`, was `1`',
                'ordered-list-marker-value-one.md:3:1-3:11: Marker should be `3`, was `1`',
                'ordered-list-marker-value-one.md:7:1-7:9: Marker should be `2`, was `1`',
                'ordered-list-marker-value-one.md:8:1-8:11: Marker should be `3`, was `1`'
            ]);

            assertFile('ordered-list-marker-value-single.md', [
                'ordered-list-marker-value-single.md:2:1-2:9: Marker should be `2`, was `1`',
                'ordered-list-marker-value-single.md:3:1-3:11: Marker should be `3`, was `1`',
                'ordered-list-marker-value-single.md:7:1-7:9: Marker should be `4`, was `3`',
                'ordered-list-marker-value-single.md:8:1-8:11: Marker should be `5`, was `3`'
            ]);
        });

        describeSetting('one', function () {
            assertFile('ordered-list-marker-value-ordered.md', [
                'ordered-list-marker-value-ordered.md:2:1-2:9: Marker should be `1`, was `2`',
                'ordered-list-marker-value-ordered.md:3:1-3:11: Marker should be `1`, was `3`',
                'ordered-list-marker-value-ordered.md:7:1-7:9: Marker should be `1`, was `4`',
                'ordered-list-marker-value-ordered.md:8:1-8:11: Marker should be `1`, was `5`'
            ]);

            assertFile('ordered-list-marker-value-one.md', []);

            assertFile('ordered-list-marker-value-single.md', [
                'ordered-list-marker-value-single.md:7:1-7:9: Marker should be `1`, was `3`',
                'ordered-list-marker-value-single.md:8:1-8:11: Marker should be `1`, was `3`'
            ]);
        });

        describeSetting('single', function () {
            assertFile('ordered-list-marker-value-ordered.md', [
                'ordered-list-marker-value-ordered.md:2:1-2:9: Marker should be `1`, was `2`',
                'ordered-list-marker-value-ordered.md:3:1-3:11: Marker should be `1`, was `3`',
                'ordered-list-marker-value-ordered.md:7:1-7:9: Marker should be `3`, was `4`',
                'ordered-list-marker-value-ordered.md:8:1-8:11: Marker should be `3`, was `5`'
            ]);

            assertFile('ordered-list-marker-value-one.md', []);

            assertFile('ordered-list-marker-value-single.md', []);
        });
    });

    describeRule('ordered-list-marker-style', function () {
        describeSetting('~', function () {
            assertFile('empty.md', [
                'empty.md:1:1: Invalid ordered list-item marker style `~`: use either `\'.\'` or `\')\'`'
            ]);
        });

        describeSetting(true, function () {
            assertFile('list-item-marker-dot.md', [], {
                'commonmark': true
            });

            assertFile('list-item-marker-paren.md', [], {
                'commonmark': true
            });
        });

        describeSetting('.', function () {
            assertFile('list-item-marker-dot.md', [], {
                'commonmark': true
            });

            assertFile('list-item-marker-paren.md', [
                'list-item-marker-paren.md:1:1-1:10: Marker style should be `.`',
                'list-item-marker-paren.md:2:1-2:11: Marker style should be `.`',
                'list-item-marker-paren.md:4:3-4:14: Marker style should be `.`',
                'list-item-marker-paren.md:5:3-5:15: Marker style should be `.`'
            ], {
                'commonmark': true
            });
        });

        describeSetting(')', function () {
            assertFile('list-item-marker-dot.md', [
                'list-item-marker-dot.md:1:1-1:10: Marker style should be `)`',
                 'list-item-marker-dot.md:2:1-2:11: Marker style should be `)`',
                 'list-item-marker-dot.md:4:3-4:14: Marker style should be `)`',
                 'list-item-marker-dot.md:5:3-5:15: Marker style should be `)`'
            ], {
                'commonmark': true
            });

            assertFile('list-item-marker-paren.md', [], {
                'commonmark': true
            });
        });
    });

    describeRule('unordered-list-marker-style', function () {
        describeSetting('~', function () {
            assertFile('empty.md', [
                'empty.md:1:1: Invalid unordered list-item marker style `~`: use either `\'-\'`, `\'*\'`, or `\'+\'`'
            ]);
        });

        describeSetting(true, function () {
            assertFile('list-item-marker-dash.md', []);
            assertFile('list-item-marker-asterisk.md', []);
            assertFile('list-item-marker-plus.md', []);
        });

        describeSetting('-', function () {
            assertFile('list-item-marker-dash.md', []);

            assertFile('list-item-marker-asterisk.md', [
                'list-item-marker-asterisk.md:1:1-1:9: Marker style should be `-`',
                'list-item-marker-asterisk.md:4:1-4:11: Marker style should be `-`',
                'list-item-marker-asterisk.md:7:3-7:13: Marker style should be `-`',
                'list-item-marker-asterisk.md:10:3-10:15: Marker style should be `-`'
            ]);

            assertFile('list-item-marker-plus.md', [
                'list-item-marker-plus.md:1:1-1:9: Marker style should be `-`',
                'list-item-marker-plus.md:4:1-4:11: Marker style should be `-`',
                'list-item-marker-plus.md:7:3-7:13: Marker style should be `-`',
                'list-item-marker-plus.md:10:3-10:15: Marker style should be `-`'
            ]);
        });

        describeSetting('*', function () {
            assertFile('list-item-marker-dash.md', [
                'list-item-marker-dash.md:1:1-1:9: Marker style should be `*`',
                'list-item-marker-dash.md:2:1-2:11: Marker style should be `*`',
                'list-item-marker-dash.md:4:3-4:13: Marker style should be `*`',
                'list-item-marker-dash.md:5:3-5:15: Marker style should be `*`'
            ]);

            assertFile('list-item-marker-asterisk.md', []);

            assertFile('list-item-marker-plus.md', [
                'list-item-marker-plus.md:1:1-1:9: Marker style should be `*`',
                'list-item-marker-plus.md:4:1-4:11: Marker style should be `*`',
                'list-item-marker-plus.md:7:3-7:13: Marker style should be `*`',
                'list-item-marker-plus.md:10:3-10:15: Marker style should be `*`'
            ]);
        });

        describeSetting('+', function () {
            assertFile('list-item-marker-dash.md', [
                'list-item-marker-dash.md:1:1-1:9: Marker style should be `+`',
                'list-item-marker-dash.md:2:1-2:11: Marker style should be `+`',
                'list-item-marker-dash.md:4:3-4:13: Marker style should be `+`',
                'list-item-marker-dash.md:5:3-5:15: Marker style should be `+`'
            ]);

            assertFile('list-item-marker-asterisk.md', [
                'list-item-marker-asterisk.md:1:1-1:9: Marker style should be `+`',
                'list-item-marker-asterisk.md:4:1-4:11: Marker style should be `+`',
                'list-item-marker-asterisk.md:7:3-7:13: Marker style should be `+`',
                'list-item-marker-asterisk.md:10:3-10:15: Marker style should be `+`'
            ]);

            assertFile('list-item-marker-plus.md', []);
        });
    });

    describeRule('no-tabs', function () {
        describeSetting(true, function () {
            assertFile('no-tabs-invalid.md', [
                'no-tabs-invalid.md:1:1: Use spaces instead of hard-tabs',
                'no-tabs-invalid.md:3:14: Use spaces instead of hard-tabs',
                'no-tabs-invalid.md:3:37: Use spaces instead of hard-tabs',
                'no-tabs-invalid.md:5:23: Use spaces instead of hard-tabs',
                'no-tabs-invalid.md:7:2: Use spaces instead of hard-tabs',
                'no-tabs-invalid.md:9:2: Use spaces instead of hard-tabs',
                'no-tabs-invalid.md:11:1: Use spaces instead of hard-tabs',
                'no-tabs-invalid.md:11:4: Use spaces instead of hard-tabs',
                'no-tabs-invalid.md:13:41: Use spaces instead of hard-tabs'
            ]);

            assertFile('no-tabs-valid.md', []);
        });
    });

    describeRule('no-shell-dollars', function () {
        describeSetting(true, function () {
            assertFile('no-shell-dollars-invalid.md', [
                'no-shell-dollars-invalid.md:15:1-18:4: Do not use dollar signs before shell-commands',
                'no-shell-dollars-invalid.md:20:1-24:4: Do not use dollar signs before shell-commands',
                'no-shell-dollars-invalid.md:26:1-29:4: Do not use dollar signs before shell-commands'
            ]);

            assertFile('no-shell-dollars-valid.md', []);
        });
    });

    describeRule('no-shortcut-reference-link', function () {
        describeSetting(true, function () {
            assertFile('no-shortcut-reference-link-invalid.md', [
                'no-shortcut-reference-link-invalid.md:1:11-1:20: Use the trailing [] on reference links',
                'no-shortcut-reference-link-invalid.md:1:48-1:57: Use the trailing [] on reference links'
            ]);

            assertFile('no-shortcut-reference-link-valid.md', []);
        });
    });

    describeRule('no-shortcut-reference-image', function () {
        describeSetting(true, function () {
            assertFile('no-shortcut-reference-image-invalid.md', [
                'no-shortcut-reference-image-invalid.md:1:11-1:19: Use the trailing [] on reference images',
                'no-shortcut-reference-image-invalid.md:1:48-1:58: Use the trailing [] on reference images'
            ]);

            assertFile('no-shortcut-reference-image-valid.md', []);
        });
    });

    describeRule('no-blockquote-without-caret', function () {
        describeSetting(true, function () {
            assertFile('no-blockquote-without-caret-invalid.md', [
                'no-blockquote-without-caret-invalid.md:3:1: Missing caret in blockquote',
                'no-blockquote-without-caret-invalid.md:9:1: Missing caret in blockquote',
                'no-blockquote-without-caret-invalid.md:10:1: Missing caret in blockquote',
                'no-blockquote-without-caret-invalid.md:17:1: Missing caret in blockquote'
            ]);

            assertFile('no-blockquote-without-caret-valid.md', []);
        });
    });

    describeRule('rule-style', function () {
        describeSetting('~', function () {
            assertFile('empty.md', [
                'empty.md:1:1: Invalid preferred rule-style: provide a valid markdown rule, or `\'consistent\'`'
            ]);
        });

        describeSetting(true, function () {
            assertFile('rule-style-invalid.md', [
                'rule-style-invalid.md:7:1-7:10: Horizontal rules should use `* * * *`',
                'rule-style-invalid.md:11:1-11:6: Horizontal rules should use `* * * *`',
                'rule-style-invalid.md:15:1-15:5: Horizontal rules should use `* * * *`'
            ]);

            assertFile('rule-style-valid.md', []);
        });
    });

    describeRule('final-newline', function () {
        describeSetting(true, function () {
            assertFile('final-newline-invalid.md', [
                'final-newline-invalid.md:1:1: Missing newline character at end of file'
            ]);

            assertFile('final-newline-valid.md', []);
        });
    });

    describeRule('link-title-style', function () {
        var settings = {
            'commonmark': true
        };

        describeSetting('~', function () {
            assertFile('empty.md', [
                'empty.md:1:1: Invalid link title style marker `~`: use either `\'consistent\'`, `\'"\'`, `\'\\\'\'`, or `\'()\'`'
            ]);
        });

        describeSetting(true, function () {
            assertFile('link-title-style-double.md', [], settings);
            assertFile('link-title-style-single.md', [], settings);
            assertFile('link-title-style-parentheses.md', [], settings);
            assertFile('link-title-style-missing.md', [], settings);

            assertFile('link-title-style-trailing-white-space.md', [
                'link-title-style-trailing-white-space.md:3:45: Titles should use `"` as a quote',
                'link-title-style-trailing-white-space.md:5:45: Titles should use `"` as a quote'
            ], settings);
        });

        describeSetting('"', function () {
            assertFile('link-title-style-double.md', [], settings);
            assertFile('link-title-style-missing.md', [], settings);

            assertFile('link-title-style-single.md', [
                'link-title-style-single.md:1:44: Titles should use `"` as a quote',
                'link-title-style-single.md:3:45: Titles should use `"` as a quote',
                'link-title-style-single.md:5:45: Titles should use `"` as a quote'
            ], settings);

            assertFile('link-title-style-parentheses.md', [
                'link-title-style-parentheses.md:1:44: Titles should use `"` as a quote',
                'link-title-style-parentheses.md:3:45: Titles should use `"` as a quote',
                'link-title-style-parentheses.md:5:45: Titles should use `"` as a quote'
            ], settings);
        });

        describeSetting('\'', function () {
            assertFile('link-title-style-single.md', [], settings);
            assertFile('link-title-style-missing.md', [], settings);

            assertFile('link-title-style-double.md', [
                'link-title-style-double.md:1:44: Titles should use `\'` as a quote',
                'link-title-style-double.md:3:45: Titles should use `\'` as a quote',
                'link-title-style-double.md:5:45: Titles should use `\'` as a quote'
            ], settings);

            assertFile('link-title-style-parentheses.md', [
                'link-title-style-parentheses.md:1:44: Titles should use `\'` as a quote',
                'link-title-style-parentheses.md:3:45: Titles should use `\'` as a quote',
                'link-title-style-parentheses.md:5:45: Titles should use `\'` as a quote'
            ], settings);
        });

        describeSetting('()', function () {
            assertFile('link-title-style-parentheses.md', [], settings);
            assertFile('link-title-style-missing.md', [], settings);

            assertFile('link-title-style-double.md', [
                'link-title-style-double.md:1:44: Titles should use `()` as a quote',
                'link-title-style-double.md:3:45: Titles should use `()` as a quote',
                'link-title-style-double.md:5:45: Titles should use `()` as a quote'
            ], settings);

            assertFile('link-title-style-single.md', [
                'link-title-style-single.md:1:44: Titles should use `()` as a quote',
                'link-title-style-single.md:3:45: Titles should use `()` as a quote',
                'link-title-style-single.md:5:45: Titles should use `()` as a quote'
            ], settings);
        });
    });

    describeRule('no-duplicate-definitions', function () {
        describeSetting(true, function () {
            assertFile('no-duplicate-definitions-invalid.md', [
                'no-duplicate-definitions-invalid.md:2:1-2:11: Do not use definitions with the same identifier (1:1)'
            ]);

            assertFile('no-duplicate-definitions-valid.md', []);
        });
    });

    describeRule('no-undefined-references', function () {
        describeSetting(true, function () {
            assertFile('no-undefined-references-invalid.md', [
                'no-undefined-references-invalid.md:1:1-1:8: Found reference to undefined definition'
            ]);

            assertFile('no-undefined-references-valid.md', []);
        });
    });

    describeRule('no-unused-definitions', function () {
        describeSetting(true, function () {
            assertFile('no-unused-definitions-invalid.md', [
                'no-unused-definitions-invalid.md:1:1-1:27: Found unused definition'
            ]);

            assertFile('no-unused-definitions-valid.md', []);
        });
    });

    describeRule('fenced-code-marker', function () {
        describeSetting(true, function () {
            assertFile('fenced-code-marker-tick.md', []);
            assertFile('fenced-code-marker-tilde.md', []);

            assertFile('fenced-code-marker-mismatched.md', [
                'fenced-code-marker-mismatched.md:5:1-7:4: Fenced code should use ` as a marker'
            ]);
        });

        describeSetting('@', function () {
            assertFile('empty.md', [
                'empty.md:1:1: Invalid fenced code marker `@`: use either `\'consistent\'`, `` \'`\' ``, or `\'~\'`'
            ]);
        });

        describeSetting('`', function () {
            assertFile('fenced-code-marker-tick.md', []);

            assertFile('fenced-code-marker-tilde.md', [
                'fenced-code-marker-tilde.md:1:1-3:4: Fenced code should use ` as a marker',
                'fenced-code-marker-tilde.md:5:1-7:4: Fenced code should use ` as a marker'
            ]);

            assertFile('fenced-code-marker-mismatched.md', [
                'fenced-code-marker-mismatched.md:5:1-7:4: Fenced code should use ` as a marker'
            ]);
        });

        describeSetting('~', function () {
            assertFile('fenced-code-marker-tick.md', [
                'fenced-code-marker-tick.md:1:1-3:4: Fenced code should use ~ as a marker',
                'fenced-code-marker-tick.md:5:1-7:4: Fenced code should use ~ as a marker'
            ]);

            assertFile('fenced-code-marker-tilde.md', []);

            assertFile('fenced-code-marker-mismatched.md', [
                'fenced-code-marker-mismatched.md:1:1-3:4: Fenced code should use ~ as a marker'
            ]);
        });
    });

    describeRule('checkbox-character-style', function () {
        describeSetting(true, function () {
            assertFile('checkbox-character-style-lower-x.md', []);
            assertFile('checkbox-character-style-upper-x.md', []);
            assertFile('checkbox-character-style-space.md', []);
            assertFile('checkbox-character-style-tab.md', []);
        });

        describeSetting({
            'checked': '@'
        }, function () {
            assertFile('empty.md', [
                'empty.md:1:1: Invalid checked checkbox marker `@`: use either `\'x\'`, or `\'X\'`'
            ]);
        });

        describeSetting({
            'unchecked': '@'
        }, function () {
            assertFile('empty.md', [
                'empty.md:1:1: Invalid unchecked checkbox marker `@`: use either `\'\\t\'`, or `\' \'`'
            ]);
        });

        describeSetting({
            'checked': 'X'
        }, function () {
            assertFile('checkbox-character-style-lower-x.md', [
                'checkbox-character-style-lower-x.md:1:6-1:7: Checked checkboxes should use `X` as a marker',
                'checkbox-character-style-lower-x.md:3:4-3:5: Checked checkboxes should use `X` as a marker',
                'checkbox-character-style-lower-x.md:5:5-5:6: Checked checkboxes should use `X` as a marker',
                'checkbox-character-style-lower-x.md:7:6-7:7: Checked checkboxes should use `X` as a marker'
            ]);

            assertFile('checkbox-character-style-upper-x.md', []);
        });

        describeSetting({
            'checked': 'x'
        }, function () {
            assertFile('checkbox-character-style-lower-x.md', []);

            assertFile('checkbox-character-style-upper-x.md', [
                'checkbox-character-style-upper-x.md:1:6-1:7: Checked checkboxes should use `x` as a marker',
                'checkbox-character-style-upper-x.md:3:4-3:5: Checked checkboxes should use `x` as a marker',
                'checkbox-character-style-upper-x.md:5:5-5:6: Checked checkboxes should use `x` as a marker',
                'checkbox-character-style-upper-x.md:7:6-7:7: Checked checkboxes should use `x` as a marker'
            ]);
        });

        describeSetting({
            'unchecked': ' '
        }, function () {
            assertFile('checkbox-character-style-space.md', []);

            assertFile('checkbox-character-style-tab.md', [
                'checkbox-character-style-tab.md:1:6-1:7: Unchecked checkboxes should use ` ` as a marker',
                'checkbox-character-style-tab.md:3:4-3:5: Unchecked checkboxes should use ` ` as a marker',
                'checkbox-character-style-tab.md:5:5-5:6: Unchecked checkboxes should use ` ` as a marker',
                'checkbox-character-style-tab.md:7:6-7:7: Unchecked checkboxes should use ` ` as a marker'
            ]);
        });

        describeSetting({
            'unchecked': '\t'
        }, function () {
            assertFile('checkbox-character-style-space.md', [
                'checkbox-character-style-space.md:1:6-1:7: Unchecked checkboxes should use `\t` as a marker',
                'checkbox-character-style-space.md:3:4-3:5: Unchecked checkboxes should use `\t` as a marker',
                'checkbox-character-style-space.md:5:5-5:6: Unchecked checkboxes should use `\t` as a marker',
                'checkbox-character-style-space.md:7:6-7:7: Unchecked checkboxes should use `\t` as a marker'
            ]);

            assertFile('checkbox-character-style-tab.md', []);
        });
    });

    describeRule('checkbox-content-indent', function () {
        describeSetting(true, function () {
            assertFile('checkbox-content-indent-invalid.md', [
                'checkbox-content-indent-invalid.md:1:7-1:8: Checkboxes should be followed by a single character',
                'checkbox-content-indent-invalid.md:3:7-3:9: Checkboxes should be followed by a single character',
                'checkbox-content-indent-invalid.md:5:7-5:8: Checkboxes should be followed by a single character',
                'checkbox-content-indent-invalid.md:7:9-7:11: Checkboxes should be followed by a single character',
                'checkbox-content-indent-invalid.md:9:9-9:11: Checkboxes should be followed by a single character'
            ]);

            assertFile('checkbox-content-indent-valid.md', []);
        });
    });
});

/*
 * Check that no warnings are created for generated
 * nodes: nodes without positional information.
 */

var nonnode = [
    'no-file-name-articles',
    'no-tabs',
    'no-file-name-outer-dashes',
    'maximum-line-length',
    'final-newline',
    'no-file-name-mixed-case',
    'no-file-name-consecutive-dashes',
    'file-extension',
    'no-file-name-irregular-characters'
];

describe('remark-lint with generated nodes', function () {
    fs.readdirSync(join(__dirname, 'fixtures'))
    .filter(function (filePath) {
        return filePath.charAt(0) !== '.';
    })
    .forEach(function (filePath) {
        it(filePath, function () {
            var messages = process(filePath, null, null, true);

            messages = messages.filter(function (message) {
                return !message.ruleId || nonnode.indexOf(message.ruleId) === -1;
            });
        });
    });
});

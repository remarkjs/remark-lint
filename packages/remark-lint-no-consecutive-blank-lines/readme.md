<!--This file is generated-->

# remark-lint-no-consecutive-blank-lines

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

Warn for too many consecutive blank lines.
Knows about the extra line needed between a list and indented code, and two
lists.

## Fix

[`remark-stringify`](https://github.com/remarkjs/remark/tree/master/packages/remark-stringify)
always uses one blank line between blocks if possible, or two lines when
needed.

See [Using remark to fix your Markdown](https://github.com/remarkjs/remark-lint#using-remark-to-fix-your-markdown)
on how to automatically fix warnings for this rule.

## Presets

This rule is included in the following presets:

| Preset | Setting |
| ------ | ------- |
| [`remark-preset-lint-markdown-style-guide`](https://github.com/remarkjs/remark-lint/tree/master/packages/remark-preset-lint-markdown-style-guide) |  |

## Example

##### `valid.md`

###### In

Note: `␊` represents a line feed.

```markdown
Foo...
␊
...Bar.
```

###### Out

No messages.

##### `valid-for-code.md`

###### In

Note: `␊` represents a line feed.

```markdown
Paragraph.

*   List
␊
␊
    bravo();
```

###### Out

No messages.

##### `empty-document.md`

###### Out

No messages.

##### `invalid.md`

###### In

Note: `␊` represents a line feed.

```markdown
Foo...
␊
␊
...Bar
␊
␊
```

###### Out

```text
4:1: Remove 1 line before node
4:7: Remove 2 lines after node
```

## Install

[npm][]:

```sh
npm install remark-lint-no-consecutive-blank-lines
```

## Use

You probably want to use it on the CLI through a config file:

```diff
 ...
 "remarkConfig": {
   "plugins": [
     ...
     "lint",
+    "lint-no-consecutive-blank-lines",
     ...
   ]
 }
 ...
```

Or use it on the CLI directly

```sh
remark -u lint -u lint-no-consecutive-blank-lines readme.md
```

Or use this on the API:

```diff
 var remark = require('remark');
 var report = require('vfile-reporter');

 remark()
   .use(require('remark-lint'))
+  .use(require('remark-lint-no-consecutive-blank-lines'))
   .process('_Emphasis_ and **importance**', function (err, file) {
     console.error(report(err || file));
   });
```

## Contribute

See [`contributing.md`][contributing] in [`remarkjs/.github`][health] for ways
to get started.
See [`support.md`][support] for ways to get help.

This project has a [Code of Conduct][coc].
By interacting with this repository, organisation, or community you agree to
abide by its terms.

## License

[MIT][license] © [Titus Wormer][author]

[build-badge]: https://img.shields.io/travis/remarkjs/remark-lint/master.svg

[build]: https://travis-ci.org/remarkjs/remark-lint

[coverage-badge]: https://img.shields.io/codecov/c/github/remarkjs/remark-lint.svg

[coverage]: https://codecov.io/github/remarkjs/remark-lint

[downloads-badge]: https://img.shields.io/npm/dm/remark-lint-no-consecutive-blank-lines.svg

[downloads]: https://www.npmjs.com/package/remark-lint-no-consecutive-blank-lines

[size-badge]: https://img.shields.io/bundlephobia/minzip/remark-lint-no-consecutive-blank-lines.svg

[size]: https://bundlephobia.com/result?p=remark-lint-no-consecutive-blank-lines

[sponsors-badge]: https://opencollective.com/unified/sponsors/badge.svg

[backers-badge]: https://opencollective.com/unified/backers/badge.svg

[collective]: https://opencollective.com/unified

[chat-badge]: https://img.shields.io/badge/join%20the%20community-on%20spectrum-7b16ff.svg

[chat]: https://spectrum.chat/unified/remark

[npm]: https://docs.npmjs.com/cli/install

[health]: https://github.com/remarkjs/.github

[contributing]: https://github.com/remarkjs/.github/blob/master/contributing.md

[support]: https://github.com/remarkjs/.github/blob/master/support.md

[coc]: https://github.com/remarkjs/.github/blob/master/code-of-conduct.md

[license]: https://github.com/remarkjs/remark-lint/blob/master/license

[author]: https://wooorm.com

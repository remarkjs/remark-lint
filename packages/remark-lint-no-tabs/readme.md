<!--This file is generated-->

# remark-lint-no-tabs

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

Warn when hard tabs (`\t`) are used instead of spaces.

## Fix

[`remark-stringify`](https://github.com/remarkjs/remark/tree/master/packages/remark-stringify)
uses spaces where tabs are used for indentation, but retains tabs used in
content.

See [Using remark to fix your Markdown](https://github.com/remarkjs/remark-lint#using-remark-to-fix-your-markdown)
on how to automatically fix warnings for this rule.

## Presets

This rule is not included in any default preset

## Example

##### `valid.md`

###### In

Note: `·` represents a space.

```markdown
Foo Bar

····Foo
```

###### Out

No messages.

##### `invalid.md`

###### In

Note: `»` represents a tab.

```markdown
»Here's one before a code block.

Here's a tab:», and here is another:».

And this is in `inline»code`.

>»This is in a block quote.

*»And...

»1.»in a list.

And this is a tab as the last character.»
```

###### Out

```text
1:1: Use spaces instead of hard-tabs
3:14: Use spaces instead of hard-tabs
3:37: Use spaces instead of hard-tabs
5:23: Use spaces instead of hard-tabs
7:2: Use spaces instead of hard-tabs
9:2: Use spaces instead of hard-tabs
11:1: Use spaces instead of hard-tabs
11:4: Use spaces instead of hard-tabs
13:41: Use spaces instead of hard-tabs
```

## Install

[npm][]:

```sh
npm install remark-lint-no-tabs
```

## Use

You probably want to use it on the CLI through a config file:

```diff
 ...
 "remarkConfig": {
   "plugins": [
     ...
     "lint",
+    "lint-no-tabs",
     ...
   ]
 }
 ...
```

Or use it on the CLI directly

```sh
remark -u lint -u lint-no-tabs readme.md
```

Or use this on the API:

```diff
 var remark = require('remark');
 var report = require('vfile-reporter');

 remark()
   .use(require('remark-lint'))
+  .use(require('remark-lint-no-tabs'))
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

[downloads-badge]: https://img.shields.io/npm/dm/remark-lint-no-tabs.svg

[downloads]: https://www.npmjs.com/package/remark-lint-no-tabs

[size-badge]: https://img.shields.io/bundlephobia/minzip/remark-lint-no-tabs.svg

[size]: https://bundlephobia.com/result?p=remark-lint-no-tabs

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

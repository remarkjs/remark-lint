<!--This file is generated-->

# remark-lint-rule-style

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

Warn when the thematic breaks (horizontal rules) violate a given or
detected style.

Options: `string`, either a valid thematic breaks, or `'consistent'`,
default: `'consistent'`.

`'consistent'` detects the first used thematic break style and warns when
subsequent rules use different styles.

## Fix

[`remark-stringify`](https://github.com/remarkjs/remark/tree/master/packages/remark-stringify)
has three settings that define how rules are created:

*   [`rule`](https://github.com/remarkjs/remark/tree/master/packages/remark-stringify#optionsrule)
    (default: `*`) — Marker to use
*   [`ruleRepetition`](https://github.com/remarkjs/remark/tree/master/packages/remark-stringify#optionsrulerepetition)
    (default: `3`) — Number of markers to use
*   [`ruleSpaces`](https://github.com/remarkjs/remark/tree/master/packages/remark-stringify#optionsrulespaces)
    (default: `true`) — Whether to pad markers with spaces

See [Using remark to fix your Markdown](https://github.com/remarkjs/remark-lint#using-remark-to-fix-your-markdown)
on how to automatically fix warnings for this rule.

## Presets

This rule is included in the following presets:

| Preset | Setting |
| ------ | ------- |
| [`remark-preset-lint-consistent`](https://github.com/remarkjs/remark-lint/tree/master/packages/remark-preset-lint-consistent) | `'consistent'` |
| [`remark-preset-lint-markdown-style-guide`](https://github.com/remarkjs/remark-lint/tree/master/packages/remark-preset-lint-markdown-style-guide) | `'---'` |

## Example

##### `valid.md`

When configured with `'* * *'`.

###### In

```markdown
* * *

* * *
```

###### Out

No messages.

##### `valid.md`

When configured with `'_______'`.

###### In

```markdown
_______

_______
```

###### Out

No messages.

##### `invalid.md`

###### In

```markdown
***

* * *
```

###### Out

```text
3:1-3:6: Rules should use `***`
```

##### `invalid.md`

When configured with `'!!!'`.

###### Out

```text
1:1: Invalid preferred rule-style: provide a valid markdown rule, or `'consistent'`
```

## Install

[npm][]:

```sh
npm install remark-lint-rule-style
```

## Use

You probably want to use it on the CLI through a config file:

```diff
 ...
 "remarkConfig": {
   "plugins": [
     ...
     "lint",
+    "lint-rule-style",
     ...
   ]
 }
 ...
```

Or use it on the CLI directly

```sh
remark -u lint -u lint-rule-style readme.md
```

Or use this on the API:

```diff
 var remark = require('remark');
 var report = require('vfile-reporter');

 remark()
   .use(require('remark-lint'))
+  .use(require('remark-lint-rule-style'))
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

[downloads-badge]: https://img.shields.io/npm/dm/remark-lint-rule-style.svg

[downloads]: https://www.npmjs.com/package/remark-lint-rule-style

[size-badge]: https://img.shields.io/bundlephobia/minzip/remark-lint-rule-style.svg

[size]: https://bundlephobia.com/result?p=remark-lint-rule-style

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

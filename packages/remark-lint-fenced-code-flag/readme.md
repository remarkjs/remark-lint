<!--This file is generated-->

# remark-lint-fenced-code-flag

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

Check fenced code block flags.

Options: `Array.<string>` or `Object`, optional.

Providing an array is as passing `{flags: Array}`.

The object can have an array of `'flags'` which are deemed valid.
In addition it can have the property `allowEmpty` (`boolean`, default:
`false`) which signifies whether or not to warn for fenced code blocks
without language flags.

## Presets

This rule is included in the following presets:

| Preset | Setting |
| ------ | ------- |
| [`remark-preset-lint-markdown-style-guide`](https://github.com/remarkjs/remark-lint/tree/master/packages/remark-preset-lint-markdown-style-guide) | `{allowEmpty: false}` |

## Example

##### `valid.md`

###### In

````markdown
```alpha
bravo();
```
````

###### Out

No messages.

##### `invalid.md`

###### In

````markdown
```
alpha();
```
````

###### Out

```text
1:1-3:4: Missing code-language flag
```

##### `valid.md`

When configured with `{ allowEmpty: true }`.

###### In

````markdown
```
alpha();
```
````

###### Out

No messages.

##### `invalid.md`

When configured with `{ allowEmpty: false }`.

###### In

````markdown
```
alpha();
```
````

###### Out

```text
1:1-3:4: Missing code-language flag
```

##### `valid.md`

When configured with `[ 'alpha' ]`.

###### In

````markdown
```alpha
bravo();
```
````

###### Out

No messages.

##### `invalid.md`

When configured with `[ 'charlie' ]`.

###### In

````markdown
```alpha
bravo();
```
````

###### Out

```text
1:1-3:4: Invalid code-language flag
```

## Install

[npm][]:

```sh
npm install remark-lint-fenced-code-flag
```

## Use

You probably want to use it on the CLI through a config file:

```diff
 ...
 "remarkConfig": {
   "plugins": [
     ...
     "lint",
+    "lint-fenced-code-flag",
     ...
   ]
 }
 ...
```

Or use it on the CLI directly

```sh
remark -u lint -u lint-fenced-code-flag readme.md
```

Or use this on the API:

```diff
 var remark = require('remark');
 var report = require('vfile-reporter');

 remark()
   .use(require('remark-lint'))
+  .use(require('remark-lint-fenced-code-flag'))
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

[downloads-badge]: https://img.shields.io/npm/dm/remark-lint-fenced-code-flag.svg

[downloads]: https://www.npmjs.com/package/remark-lint-fenced-code-flag

[size-badge]: https://img.shields.io/bundlephobia/minzip/remark-lint-fenced-code-flag.svg

[size]: https://bundlephobia.com/result?p=remark-lint-fenced-code-flag

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

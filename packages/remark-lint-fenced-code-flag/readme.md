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

The object can have an array of `'flags'` which are allowed: other flags
will not be allowed.
An `allowEmpty` field (`boolean`, default: `false`) can be set to allow
code blocks without language flags.

## Presets

This rule is included in the following presets:

| Preset | Setting |
| - | - |
| [`remark-preset-lint-markdown-style-guide`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-preset-lint-markdown-style-guide) | `{allowEmpty: false}` |

## Example

##### `ok.md`

###### In

````markdown
```alpha
bravo();
```
````

###### Out

No messages.

##### `not-ok.md`

###### In

````markdown
```
alpha();
```
````

###### Out

```text
1:1-3:4: Missing code language flag
```

##### `ok.md`

When configured with `{ allowEmpty: true }`.

###### In

````markdown
```
alpha();
```
````

###### Out

No messages.

##### `not-ok.md`

When configured with `{ allowEmpty: false }`.

###### In

````markdown
```
alpha();
```
````

###### Out

```text
1:1-3:4: Missing code language flag
```

##### `ok.md`

When configured with `[ 'alpha' ]`.

###### In

````markdown
```alpha
bravo();
```
````

###### Out

No messages.

##### `not-ok.md`

When configured with `[ 'charlie' ]`.

###### In

````markdown
```alpha
bravo();
```
````

###### Out

```text
1:1-3:4: Incorrect code language flag
```

## Install

[npm][]:

```sh
npm install remark-lint-fenced-code-flag
```

## Use

You probably want to use it on the CLI through a config file:

```diff
 …
 "remarkConfig": {
   "plugins": [
     …
     "lint",
+    "lint-fenced-code-flag",
     …
   ]
 }
 …
```

Or use it on the CLI directly

```sh
remark -u lint -u lint-fenced-code-flag readme.md
```

Or use this on the API:

```diff
 var remark = require('remark')
 var report = require('vfile-reporter')

 remark()
   .use(require('remark-lint'))
+  .use(require('remark-lint-fenced-code-flag'))
   .process('_Emphasis_ and **importance**', function (err, file) {
     console.error(report(err || file))
   })
```

## Contribute

See [`contributing.md`][contributing] in [`remarkjs/.github`][health] for ways
to get started.
See [`support.md`][support] for ways to get help.

This project has a [code of conduct][coc].
By interacting with this repository, organization, or community you agree to
abide by its terms.

## License

[MIT][license] © [Titus Wormer][author]

[build-badge]: https://img.shields.io/travis/remarkjs/remark-lint/main.svg

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

[chat-badge]: https://img.shields.io/badge/chat-spectrum.svg

[chat]: https://spectrum.chat/unified/remark

[npm]: https://docs.npmjs.com/cli/install

[health]: https://github.com/remarkjs/.github

[contributing]: https://github.com/remarkjs/.github/blob/HEAD/contributing.md

[support]: https://github.com/remarkjs/.github/blob/HEAD/support.md

[coc]: https://github.com/remarkjs/.github/blob/HEAD/code-of-conduct.md

[license]: https://github.com/remarkjs/remark-lint/blob/main/license

[author]: https://wooorm.com

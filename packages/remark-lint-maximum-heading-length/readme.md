<!--This file is generated-->

# remark-lint-maximum-heading-length

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

Warn when headings are too long.

Options: `number`, default: `60`.

Ignores Markdown syntax, only checks the plain text content.

## Presets

This rule is included in the following presets:

| Preset | Setting |
| - | - |
| [`remark-preset-lint-markdown-style-guide`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-preset-lint-markdown-style-guide) | |

## Example

##### `not-ok.md`

When configured with `40`.

###### In

```markdown
# Alpha bravo charlie delta echo foxtrot golf hotel
```

###### Out

```text
1:1-1:52: Use headings shorter than `40`
```

##### `ok.md`

###### In

```markdown
# Alpha bravo charlie delta echo foxtrot golf hotel

# ![Alpha bravo charlie delta echo foxtrot golf hotel](http://example.com/nato.png)
```

###### Out

No messages.

## Install

[npm][]:

```sh
npm install remark-lint-maximum-heading-length
```

## Use

You probably want to use it on the CLI through a config file:

```diff
 …
 "remarkConfig": {
   "plugins": [
     …
     "lint",
+    "lint-maximum-heading-length",
     …
   ]
 }
 …
```

Or use it on the CLI directly

```sh
remark -u lint -u lint-maximum-heading-length readme.md
```

Or use this on the API:

```diff
 var remark = require('remark')
 var report = require('vfile-reporter')

 remark()
   .use(require('remark-lint'))
+  .use(require('remark-lint-maximum-heading-length'))
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

[downloads-badge]: https://img.shields.io/npm/dm/remark-lint-maximum-heading-length.svg

[downloads]: https://www.npmjs.com/package/remark-lint-maximum-heading-length

[size-badge]: https://img.shields.io/bundlephobia/minzip/remark-lint-maximum-heading-length.svg

[size]: https://bundlephobia.com/result?p=remark-lint-maximum-heading-length

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

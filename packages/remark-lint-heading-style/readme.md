<!--This file is generated-->

# remark-lint-heading-style

[![Build][badge-build-image]][badge-build-url]
[![Coverage][badge-coverage-image]][badge-coverage-url]
[![Downloads][badge-downloads-image]][badge-downloads-url]
[![Size][badge-size-image]][badge-size-url]
[![Sponsors][badge-funding-sponsors-image]][badge-funding-url]
[![Backers][badge-funding-backers-image]][badge-funding-url]
[![Chat][badge-chat-image]][badge-chat-url]

[`remark-lint`][github-remark-lint] rule to warn when headings violate a given style.

## Contents

* [What is this?](#what-is-this)
* [When should I use this?](#when-should-i-use-this)
* [Presets](#presets)
* [Install](#install)
* [Use](#use)
* [API](#api)
  * [`unified().use(remarkLintHeadingStyle[, options])`](#unifieduseremarklintheadingstyle-options)
  * [`Options`](#options)
  * [`Style`](#style)
* [Recommendation](#recommendation)
* [Fix](#fix)
* [Examples](#examples)
* [Compatibility](#compatibility)
* [Contribute](#contribute)
* [License](#license)

## What is this?

This package checks the style of headings.

## When should I use this?

You can use this package to check that the style of headings is consistent.

## Presets

This plugin is included in the following presets:

| Preset | Options |
| - | - |
| [`remark-preset-lint-consistent`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-preset-lint-consistent) | `'consistent'` |
| [`remark-preset-lint-markdown-style-guide`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-preset-lint-markdown-style-guide) | `'atx'` |

## Install

This package is [ESM only][github-gist-esm].
In Node.js (version 16+),
install with [npm][npm-install]:

```sh
npm install remark-lint-heading-style
```

In Deno with [`esm.sh`][esm-sh]:

```js
import remarkLintHeadingStyle from 'https://esm.sh/remark-lint-heading-style@4'
```

In browsers with [`esm.sh`][esm-sh]:

```html
<script type="module">
  import remarkLintHeadingStyle from 'https://esm.sh/remark-lint-heading-style@4?bundle'
</script>
```

## Use

On the API:

```js
import remarkLint from 'remark-lint'
import remarkLintHeadingStyle from 'remark-lint-heading-style'
import remarkParse from 'remark-parse'
import remarkStringify from 'remark-stringify'
import {read} from 'to-vfile'
import {unified} from 'unified'
import {reporter} from 'vfile-reporter'

const file = await read('example.md')

await unified()
  .use(remarkParse)
  .use(remarkLint)
  .use(remarkLintHeadingStyle)
  .use(remarkStringify)
  .process(file)

console.error(reporter(file))
```

On the CLI:

```sh
remark --frail --use remark-lint --use remark-lint-heading-style .
```

On the CLI in a config file (here a `package.json`):

```diff
 …
 "remarkConfig": {
   "plugins": [
     …
     "remark-lint",
+    "remark-lint-heading-style",
     …
   ]
 }
 …
```

## API

This package exports no identifiers.
It exports the [TypeScript][typescript] types
[`Options`][api-options] and
[`Style`][api-style].
The default export is
[`remarkLintHeadingStyle`][api-remark-lint-heading-style].

### `unified().use(remarkLintHeadingStyle[, options])`

Warn when headings violate a given style.

###### Parameters

* `options` ([`Options`][api-options], default: `'consistent'`)
  — preferred style or whether to detect the first style and warn for
  further differences

###### Returns

Transform ([`Transformer` from `unified`][github-unified-transformer]).

### `Options`

Configuration (TypeScript type).

###### Type

```ts
type Options = Style | 'consistent'
```

### `Style`

Style (TypeScript type).

###### Type

```ts
type Style = 'atx' | 'atx-closed' | 'setext'
```

## Recommendation

Setext headings are limited in that they can only construct headings with a
rank of one and two.
They do allow multiple lines of content where ATX only allows one line.
The number of used markers in their underline does not matter,
leading to either:

* 1 marker (`Hello\n-`),
  which is the bare minimum,
  and for rank 2 headings looks suspiciously like an empty list item
* using as many markers as the content (`Hello\n-----`),
  which is hard to maintain and diff
* an arbitrary number (`Hello\n---`), which for rank 2 headings looks
  suspiciously like a thematic break

Setext headings are also uncommon.
Using a sequence of hashes at the end of ATX headings is even more uncommon.
Due to this,
it’s recommended to use ATX headings, without closing hashes.

## Fix

[`remark-stringify`][github-remark-stringify] formats headings as ATX by default.
The other styles can be configured with `setext: true` or `closeAtx: true`.

## Examples

##### `ok.md`

When configured with `'atx'`.

###### In

```markdown
# Mercury

## Venus

### Earth
```

###### Out

No messages.

##### `ok.md`

When configured with `'atx-closed'`.

###### In

```markdown
# Mercury ##

## Venus ##

### Earth ###
```

###### Out

No messages.

##### `ok.md`

When configured with `'setext'`.

###### In

```markdown
Mercury
=======

Venus
-----

### Earth
```

###### Out

No messages.

##### `not-ok.md`

###### In

```markdown
Mercury
=======

## Venus

### Earth ###
```

###### Out

```text
4:1-4:9: Unexpected ATX heading, expected setext
6:1-6:14: Unexpected ATX (closed) heading, expected setext
```

##### `not-ok.md`

When configured with `'🌍'`.

###### Out

```text
1:1: Unexpected value `🌍` for `options`, expected `'atx'`, `'atx-closed'`, `'setext'`, or `'consistent'`
```

## Compatibility

Projects maintained by the unified collective are compatible with maintained
versions of Node.js.

When we cut a new major release, we drop support for unmaintained versions of
Node.
This means we try to keep the current release line,
`remark-lint-heading-style@4`,
compatible with Node.js 16.

## Contribute

See [`contributing.md`][github-dotfiles-contributing] in [`remarkjs/.github`][github-dotfiles-health] for ways
to get started.
See [`support.md`][github-dotfiles-support] for ways to get help.

This project has a [code of conduct][github-dotfiles-coc].
By interacting with this repository, organization, or community you agree to
abide by its terms.

## License

[MIT][file-license] © [Titus Wormer][author]

[api-options]: #options

[api-remark-lint-heading-style]: #unifieduseremarklintheadingstyle-options

[api-style]: #style

[author]: https://wooorm.com

[badge-build-image]: https://github.com/remarkjs/remark-lint/workflows/main/badge.svg

[badge-build-url]: https://github.com/remarkjs/remark-lint/actions

[badge-chat-image]: https://img.shields.io/badge/chat-discussions-success.svg

[badge-chat-url]: https://github.com/remarkjs/remark/discussions

[badge-coverage-image]: https://img.shields.io/codecov/c/github/remarkjs/remark-lint.svg

[badge-coverage-url]: https://codecov.io/github/remarkjs/remark-lint

[badge-downloads-image]: https://img.shields.io/npm/dm/remark-lint-heading-style.svg

[badge-downloads-url]: https://www.npmjs.com/package/remark-lint-heading-style

[badge-funding-backers-image]: https://opencollective.com/unified/backers/badge.svg

[badge-funding-sponsors-image]: https://opencollective.com/unified/sponsors/badge.svg

[badge-funding-url]: https://opencollective.com/unified

[badge-size-image]: https://img.shields.io/bundlejs/size/remark-lint-heading-style

[badge-size-url]: https://bundlejs.com/?q=remark-lint-heading-style

[esm-sh]: https://esm.sh

[file-license]: https://github.com/remarkjs/remark-lint/blob/main/license

[github-dotfiles-coc]: https://github.com/remarkjs/.github/blob/main/code-of-conduct.md

[github-dotfiles-contributing]: https://github.com/remarkjs/.github/blob/main/contributing.md

[github-dotfiles-health]: https://github.com/remarkjs/.github

[github-dotfiles-support]: https://github.com/remarkjs/.github/blob/main/support.md

[github-gist-esm]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c

[github-remark-lint]: https://github.com/remarkjs/remark-lint

[github-remark-stringify]: https://github.com/remarkjs/remark/tree/main/packages/remark-stringify

[github-unified-transformer]: https://github.com/unifiedjs/unified#transformer

[npm-install]: https://docs.npmjs.com/cli/install

[typescript]: https://www.typescriptlang.org

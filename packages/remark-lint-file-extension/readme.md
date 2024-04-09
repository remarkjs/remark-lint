<!--This file is generated-->

# remark-lint-file-extension

[![Build][badge-build-image]][badge-build-url]
[![Coverage][badge-coverage-image]][badge-coverage-url]
[![Downloads][badge-downloads-image]][badge-downloads-url]
[![Size][badge-size-image]][badge-size-url]
[![Sponsors][badge-funding-sponsors-image]][badge-funding-url]
[![Backers][badge-funding-backers-image]][badge-funding-url]
[![Chat][badge-chat-image]][badge-chat-url]

[`remark-lint`][github-remark-lint] rule to warn for unexpected file extensions.

## Contents

* [What is this?](#what-is-this)
* [When should I use this?](#when-should-i-use-this)
* [Presets](#presets)
* [Install](#install)
* [Use](#use)
* [API](#api)
  * [`unified().use(remarkLintFileExtension[, options])`](#unifieduseremarklintfileextension-options)
  * [`Extensions`](#extensions)
  * [`Options`](#options)
* [Recommendation](#recommendation)
* [Examples](#examples)
* [Compatibility](#compatibility)
* [Contribute](#contribute)
* [License](#license)

## What is this?

This package checks the file extension.

## When should I use this?

You can use this package to check that file extensions are consistent.

## Presets

This plugin is included in the following presets:

| Preset | Options |
| - | - |
| [`remark-preset-lint-markdown-style-guide`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-preset-lint-markdown-style-guide) | `'md'` |

## Install

This package is [ESM only][github-gist-esm].
In Node.js (version 16+),
install with [npm][npm-install]:

```sh
npm install remark-lint-file-extension
```

In Deno with [`esm.sh`][esm-sh]:

```js
import remarkLintFileExtension from 'https://esm.sh/remark-lint-file-extension@2'
```

In browsers with [`esm.sh`][esm-sh]:

```html
<script type="module">
  import remarkLintFileExtension from 'https://esm.sh/remark-lint-file-extension@2?bundle'
</script>
```

## Use

On the API:

```js
import remarkLint from 'remark-lint'
import remarkLintFileExtension from 'remark-lint-file-extension'
import remarkParse from 'remark-parse'
import remarkStringify from 'remark-stringify'
import {read} from 'to-vfile'
import {unified} from 'unified'
import {reporter} from 'vfile-reporter'

const file = await read('example.md')

await unified()
  .use(remarkParse)
  .use(remarkLint)
  .use(remarkLintFileExtension)
  .use(remarkStringify)
  .process(file)

console.error(reporter(file))
```

On the CLI:

```sh
remark --frail --use remark-lint --use remark-lint-file-extension .
```

On the CLI in a config file (here a `package.json`):

```diff
 …
 "remarkConfig": {
   "plugins": [
     …
     "remark-lint",
+    "remark-lint-file-extension",
     …
   ]
 }
 …
```

## API

This package exports no identifiers.
It exports the [TypeScript][typescript] types
[`Extensions`][api-extensions] and
[`Options`][api-options].
The default export is
[`remarkLintFileExtension`][api-remark-lint-file-extension].

### `unified().use(remarkLintFileExtension[, options])`

Warn for unexpected extensions.

###### Parameters

* `options` ([`Extensions`][api-extensions] or [`Options`][api-options],
  optional)
  — configuration

###### Returns

Transform ([`Transformer` from `unified`][github-unified-transformer]).

### `Extensions`

File extension(s) (TypeScript type).

###### Type

```ts
type Extensions = Array<string> | string
```

### `Options`

Configuration (TypeScript type).

###### Fields

* `allowExtensionless` (`boolean`, default: `true`)
  — allow no file extension such as `AUTHORS` or `LICENSE`
* `extensions` ([`Extensions`][api-extensions], default: `['mdx', 'md']`)
  — allowed file extension(s)

## Recommendation

Use `md` as it’s the most common.
Also use `md` when your markdown contains common syntax extensions (such as
GFM, frontmatter, or math).
Do not use `md` for MDX: use `mdx` instead.

## Examples

##### `readme.md`

###### Out

No messages.

##### `readme.mdx`

###### Out

No messages.

##### `readme`

###### Out

No messages.

##### `readme`

When configured with `{ allowExtensionless: false }`.

###### Out

```text
1:1: Unexpected missing file extension, expected `mdx` or `md`
```

##### `readme.mkd`

###### Out

```text
1:1: Unexpected file extension `mkd`, expected `mdx` or `md`
```

##### `readme.mkd`

When configured with `'mkd'`.

###### Out

No messages.

##### `readme.css`

When configured with `[
  'markdown', 'md',
  'mdown',    'mdwn',
  'mdx',      'mkd',
  'mkdn',     'mkdown',
  'ron'
]`.

###### Out

```text
1:1: Unexpected file extension `css`, expected `markdown`, `md`, `mdown`, …
```

## Compatibility

Projects maintained by the unified collective are compatible with maintained
versions of Node.js.

When we cut a new major release, we drop support for unmaintained versions of
Node.
This means we try to keep the current release line,
`remark-lint-file-extension@2`,
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

[api-extensions]: #extensions

[api-options]: #options

[api-remark-lint-file-extension]: #unifieduseremarklintfileextension-options

[author]: https://wooorm.com

[badge-build-image]: https://github.com/remarkjs/remark-lint/workflows/main/badge.svg

[badge-build-url]: https://github.com/remarkjs/remark-lint/actions

[badge-chat-image]: https://img.shields.io/badge/chat-discussions-success.svg

[badge-chat-url]: https://github.com/remarkjs/remark/discussions

[badge-coverage-image]: https://img.shields.io/codecov/c/github/remarkjs/remark-lint.svg

[badge-coverage-url]: https://codecov.io/github/remarkjs/remark-lint

[badge-downloads-image]: https://img.shields.io/npm/dm/remark-lint-file-extension.svg

[badge-downloads-url]: https://www.npmjs.com/package/remark-lint-file-extension

[badge-funding-backers-image]: https://opencollective.com/unified/backers/badge.svg

[badge-funding-sponsors-image]: https://opencollective.com/unified/sponsors/badge.svg

[badge-funding-url]: https://opencollective.com/unified

[badge-size-image]: https://img.shields.io/bundlejs/size/remark-lint-file-extension

[badge-size-url]: https://bundlejs.com/?q=remark-lint-file-extension

[esm-sh]: https://esm.sh

[file-license]: https://github.com/remarkjs/remark-lint/blob/main/license

[github-dotfiles-coc]: https://github.com/remarkjs/.github/blob/main/code-of-conduct.md

[github-dotfiles-contributing]: https://github.com/remarkjs/.github/blob/main/contributing.md

[github-dotfiles-health]: https://github.com/remarkjs/.github

[github-dotfiles-support]: https://github.com/remarkjs/.github/blob/main/support.md

[github-gist-esm]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c

[github-remark-lint]: https://github.com/remarkjs/remark-lint

[github-unified-transformer]: https://github.com/unifiedjs/unified#transformer

[npm-install]: https://docs.npmjs.com/cli/install

[typescript]: https://www.typescriptlang.org

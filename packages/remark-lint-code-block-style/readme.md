<!--This file is generated-->

# remark-lint-code-block-style

[![Build][badge-build-image]][badge-build-url]
[![Coverage][badge-coverage-image]][badge-coverage-url]
[![Downloads][badge-downloads-image]][badge-downloads-url]
[![Size][badge-size-image]][badge-size-url]
[![Sponsors][badge-funding-sponsors-image]][badge-funding-url]
[![Backers][badge-funding-backers-image]][badge-funding-url]
[![Chat][badge-chat-image]][badge-chat-url]

[`remark-lint`][github-remark-lint] rule to warn when code blocks violate a given style.

## Contents

* [What is this?](#what-is-this)
* [When should I use this?](#when-should-i-use-this)
* [Presets](#presets)
* [Install](#install)
* [Use](#use)
* [API](#api)
  * [`unified().use(remarkLintCodeBlockStyle[, options])`](#unifieduseremarklintcodeblockstyle-options)
  * [`Options`](#options)
  * [`Style`](#style)
* [Recommendation](#recommendation)
* [Fix](#fix)
* [Examples](#examples)
* [Compatibility](#compatibility)
* [Contribute](#contribute)
* [License](#license)

## What is this?

This package checks the style of code blocks.

## When should I use this?

You can use this package to check that the style of code blocks is
consistent.

## Presets

This plugin is included in the following presets:

| Preset | Options |
| - | - |
| [`remark-preset-lint-consistent`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-preset-lint-consistent) | `'consistent'` |
| [`remark-preset-lint-markdown-style-guide`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-preset-lint-markdown-style-guide) | `'fenced'` |

## Install

This package is [ESM only][github-gist-esm].
In Node.js (version 16+),
install with [npm][npm-install]:

```sh
npm install remark-lint-code-block-style
```

In Deno with [`esm.sh`][esm-sh]:

```js
import remarkLintCodeBlockStyle from 'https://esm.sh/remark-lint-code-block-style@4'
```

In browsers with [`esm.sh`][esm-sh]:

```html
<script type="module">
  import remarkLintCodeBlockStyle from 'https://esm.sh/remark-lint-code-block-style@4?bundle'
</script>
```

## Use

On the API:

```js
import remarkLint from 'remark-lint'
import remarkLintCodeBlockStyle from 'remark-lint-code-block-style'
import remarkParse from 'remark-parse'
import remarkStringify from 'remark-stringify'
import {read} from 'to-vfile'
import {unified} from 'unified'
import {reporter} from 'vfile-reporter'

const file = await read('example.md')

await unified()
  .use(remarkParse)
  .use(remarkLint)
  .use(remarkLintCodeBlockStyle)
  .use(remarkStringify)
  .process(file)

console.error(reporter(file))
```

On the CLI:

```sh
remark --frail --use remark-lint --use remark-lint-code-block-style .
```

On the CLI in a config file (here a `package.json`):

```diff
 …
 "remarkConfig": {
   "plugins": [
     …
     "remark-lint",
+    "remark-lint-code-block-style",
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
[`remarkLintCodeBlockStyle`][api-remark-lint-code-block-style].

### `unified().use(remarkLintCodeBlockStyle[, options])`

Warn when code blocks violate a given style.

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
type Style = 'indented' | 'fenced'
```

## Recommendation

Indentation in markdown is complex as lists and indented code interfere in
unexpected ways.
Fenced code has more features than indented code: it can specify a
programming language.
Since CommonMark took the idea of fenced code from GFM,
fenced code became widely supported.
Due to this, it’s recommended to configure this rule with `'fenced'`.

## Fix

[`remark-stringify`][github-remark-stringify] always formats code blocks as
fenced.
Pass `fences: false` to only use fenced code blocks when they have a
language and as indented code otherwise.

## Examples

##### `ok-indented.md`

When configured with `'indented'`.

###### In

```markdown
    venus()

Mercury.

    earth()
```

###### Out

No messages.

##### `ok-fenced.md`

When configured with `'fenced'`.

###### In

````markdown
```
venus()
```

Mercury.

```
earth()
```
````

###### Out

No messages.

##### `not-ok-consistent.md`

###### In

````markdown
    venus()

Mercury.

```
earth()
```
````

###### Out

```text
5:1-7:4: Unexpected fenced code block, expected indented code blocks
```

##### `not-ok-indented.md`

When configured with `'indented'`.

###### In

````markdown
```
venus()
```

Mercury.

```
earth()
```
````

###### Out

```text
1:1-3:4: Unexpected fenced code block, expected indented code blocks
7:1-9:4: Unexpected fenced code block, expected indented code blocks
```

##### `not-ok-fenced.md`

When configured with `'fenced'`.

###### In

```markdown
    venus()

Mercury.

    earth()
```

###### Out

```text
1:1-1:12: Unexpected indented code block, expected fenced code blocks
5:1-5:12: Unexpected indented code block, expected fenced code blocks
```

##### `not-ok-options.md`

When configured with `'🌍'`.

###### Out

```text
1:1: Unexpected value `🌍` for `options`, expected `'fenced'`, `'indented'`, or `'consistent'`
```

## Compatibility

Projects maintained by the unified collective are compatible with maintained
versions of Node.js.

When we cut a new major release, we drop support for unmaintained versions of
Node.
This means we try to keep the current release line,
`remark-lint-code-block-style@4`,
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

[api-remark-lint-code-block-style]: #unifieduseremarklintcodeblockstyle-options

[api-style]: #style

[author]: https://wooorm.com

[badge-build-image]: https://github.com/remarkjs/remark-lint/workflows/main/badge.svg

[badge-build-url]: https://github.com/remarkjs/remark-lint/actions

[badge-chat-image]: https://img.shields.io/badge/chat-discussions-success.svg

[badge-chat-url]: https://github.com/remarkjs/remark/discussions

[badge-coverage-image]: https://img.shields.io/codecov/c/github/remarkjs/remark-lint.svg

[badge-coverage-url]: https://codecov.io/github/remarkjs/remark-lint

[badge-downloads-image]: https://img.shields.io/npm/dm/remark-lint-code-block-style.svg

[badge-downloads-url]: https://www.npmjs.com/package/remark-lint-code-block-style

[badge-funding-backers-image]: https://opencollective.com/unified/backers/badge.svg

[badge-funding-sponsors-image]: https://opencollective.com/unified/sponsors/badge.svg

[badge-funding-url]: https://opencollective.com/unified

[badge-size-image]: https://img.shields.io/bundlejs/size/remark-lint-code-block-style

[badge-size-url]: https://bundlejs.com/?q=remark-lint-code-block-style

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

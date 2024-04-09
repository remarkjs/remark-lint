<!--This file is generated-->

# remark-lint-blockquote-indentation

[![Build][badge-build-image]][badge-build-url]
[![Coverage][badge-coverage-image]][badge-coverage-url]
[![Downloads][badge-downloads-image]][badge-downloads-url]
[![Size][badge-size-image]][badge-size-url]
[![Sponsors][badge-funding-sponsors-image]][badge-funding-url]
[![Backers][badge-funding-backers-image]][badge-funding-url]
[![Chat][badge-chat-image]][badge-chat-url]

[`remark-lint`][github-remark-lint] rule to warn when block quotes are indented too much or
too little.

## Contents

* [What is this?](#what-is-this)
* [When should I use this?](#when-should-i-use-this)
* [Presets](#presets)
* [Install](#install)
* [Use](#use)
* [API](#api)
  * [`unified().use(remarkLintBlockquoteIndentation[, options])`](#unifieduseremarklintblockquoteindentation-options)
  * [`Options`](#options)
* [Recommendation](#recommendation)
* [Examples](#examples)
* [Compatibility](#compatibility)
* [Contribute](#contribute)
* [License](#license)

## What is this?

This package checks the “indent” of block quotes: the `>` (greater than)
marker *and* the spaces before content.

## When should I use this?

You can use this rule to check markdown code style.

## Presets

This plugin is included in the following presets:

| Preset | Options |
| - | - |
| [`remark-preset-lint-consistent`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-preset-lint-consistent) | `'consistent'` |
| [`remark-preset-lint-markdown-style-guide`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-preset-lint-markdown-style-guide) | `2` |

## Install

This package is [ESM only][github-gist-esm].
In Node.js (version 16+),
install with [npm][npm-install]:

```sh
npm install remark-lint-blockquote-indentation
```

In Deno with [`esm.sh`][esm-sh]:

```js
import remarkLintBlockquoteIndentation from 'https://esm.sh/remark-lint-blockquote-indentation@4'
```

In browsers with [`esm.sh`][esm-sh]:

```html
<script type="module">
  import remarkLintBlockquoteIndentation from 'https://esm.sh/remark-lint-blockquote-indentation@4?bundle'
</script>
```

## Use

On the API:

```js
import remarkLint from 'remark-lint'
import remarkLintBlockquoteIndentation from 'remark-lint-blockquote-indentation'
import remarkParse from 'remark-parse'
import remarkStringify from 'remark-stringify'
import {read} from 'to-vfile'
import {unified} from 'unified'
import {reporter} from 'vfile-reporter'

const file = await read('example.md')

await unified()
  .use(remarkParse)
  .use(remarkLint)
  .use(remarkLintBlockquoteIndentation)
  .use(remarkStringify)
  .process(file)

console.error(reporter(file))
```

On the CLI:

```sh
remark --frail --use remark-lint --use remark-lint-blockquote-indentation .
```

On the CLI in a config file (here a `package.json`):

```diff
 …
 "remarkConfig": {
   "plugins": [
     …
     "remark-lint",
+    "remark-lint-blockquote-indentation",
     …
   ]
 }
 …
```

## API

This package exports no identifiers.
It exports the [TypeScript][typescript] type
[`Options`][api-options].
The default export is
[`remarkLintBlockquoteIndentation`][api-remark-lint-blockquote-indentation].

### `unified().use(remarkLintBlockquoteIndentation[, options])`

Warn when block quotes are indented too much or too little.

###### Parameters

* `options` ([`Options`][api-options], default: `'consistent'`)
  — either a preferred indent or whether to detect the first style
  and warn for further differences

###### Returns

Transform ([`Transformer` from `unified`][github-unified-transformer]).

### `Options`

Configuration (TypeScript type).

###### Type

```ts
type Options = number | 'consistent'
```

## Recommendation

CommonMark specifies that when block quotes are used the `>` markers can be
followed by an optional space.
No space at all arguably looks rather ugly:

```markdown
>Mars and
>Venus.
```

There is no specific handling of more that one space, so if 5 spaces were
used after `>`, then indented code kicks in:

```markdown
>     neptune()
```

Due to this, it’s recommended to configure this rule with `2`.

## Examples

##### `ok-2.md`

When configured with `2`.

###### In

```markdown
> Mercury.

Venus.

> Earth.
```

###### Out

No messages.

##### `ok-4.md`

When configured with `4`.

###### In

```markdown
>   Mercury.

Venus.

>   Earth.
```

###### Out

No messages.

##### `ok-tab.md`

###### In

```markdown
>␉Mercury.
```

###### Out

No messages.

##### `not-ok.md`

###### In

```markdown
>  Mercury.

Venus.

>   Earth.

Mars.

> Jupiter
```

###### Out

```text
5:5: Unexpected `4` spaces between block quote marker and content, expected `3` spaces, remove `1` space
9:3: Unexpected `2` spaces between block quote marker and content, expected `3` spaces, add `1` space
```

##### `not-ok-options.md`

When configured with `'🌍'`.

###### Out

```text
1:1: Unexpected value `🌍` for `options`, expected `number` or `'consistent'`
```

## Compatibility

Projects maintained by the unified collective are compatible with maintained
versions of Node.js.

When we cut a new major release, we drop support for unmaintained versions of
Node.
This means we try to keep the current release line,
`remark-lint-blockquote-indentation@4`,
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

[api-remark-lint-blockquote-indentation]: #unifieduseremarklintblockquoteindentation-options

[author]: https://wooorm.com

[badge-build-image]: https://github.com/remarkjs/remark-lint/workflows/main/badge.svg

[badge-build-url]: https://github.com/remarkjs/remark-lint/actions

[badge-chat-image]: https://img.shields.io/badge/chat-discussions-success.svg

[badge-chat-url]: https://github.com/remarkjs/remark/discussions

[badge-coverage-image]: https://img.shields.io/codecov/c/github/remarkjs/remark-lint.svg

[badge-coverage-url]: https://codecov.io/github/remarkjs/remark-lint

[badge-downloads-image]: https://img.shields.io/npm/dm/remark-lint-blockquote-indentation.svg

[badge-downloads-url]: https://www.npmjs.com/package/remark-lint-blockquote-indentation

[badge-funding-backers-image]: https://opencollective.com/unified/backers/badge.svg

[badge-funding-sponsors-image]: https://opencollective.com/unified/sponsors/badge.svg

[badge-funding-url]: https://opencollective.com/unified

[badge-size-image]: https://img.shields.io/bundlejs/size/remark-lint-blockquote-indentation

[badge-size-url]: https://bundlejs.com/?q=remark-lint-blockquote-indentation

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

<!--This file is generated-->

# remark-lint-no-blockquote-without-marker

[![Build][badge-build-image]][badge-build-url]
[![Coverage][badge-coverage-image]][badge-coverage-url]
[![Downloads][badge-downloads-image]][badge-downloads-url]
[![Size][badge-size-image]][badge-size-url]
[![Sponsors][badge-funding-sponsors-image]][badge-funding-url]
[![Backers][badge-funding-backers-image]][badge-funding-url]
[![Chat][badge-chat-image]][badge-chat-url]

[`remark-lint`][github-remark-lint] rule to warn for lazy lines in block quotes.

## Contents

* [What is this?](#what-is-this)
* [When should I use this?](#when-should-i-use-this)
* [Presets](#presets)
* [Install](#install)
* [Use](#use)
* [API](#api)
  * [`unified().use(remarkLintNoBlockquoteWithoutMarker)`](#unifieduseremarklintnoblockquotewithoutmarker)
* [Recommendation](#recommendation)
* [Fix](#fix)
* [Examples](#examples)
* [Compatibility](#compatibility)
* [Contribute](#contribute)
* [License](#license)

## What is this?

This package checks the style of block quotes.

## When should I use this?

You can use this package to check that the style of block quotes is
consistent.

## Presets

This plugin is included in the following presets:

| Preset | Options |
| - | - |
| [`remark-preset-lint-markdown-style-guide`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-preset-lint-markdown-style-guide) | |
| [`remark-preset-lint-recommended`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-preset-lint-recommended) | |

## Install

This package is [ESM only][github-gist-esm].
In Node.js (version 16+),
install with [npm][npm-install]:

```sh
npm install remark-lint-no-blockquote-without-marker
```

In Deno with [`esm.sh`][esm-sh]:

```js
import remarkLintNoBlockquoteWithoutMarker from 'https://esm.sh/remark-lint-no-blockquote-without-marker@6'
```

In browsers with [`esm.sh`][esm-sh]:

```html
<script type="module">
  import remarkLintNoBlockquoteWithoutMarker from 'https://esm.sh/remark-lint-no-blockquote-without-marker@6?bundle'
</script>
```

## Use

On the API:

```js
import remarkLint from 'remark-lint'
import remarkLintNoBlockquoteWithoutMarker from 'remark-lint-no-blockquote-without-marker'
import remarkParse from 'remark-parse'
import remarkStringify from 'remark-stringify'
import {read} from 'to-vfile'
import {unified} from 'unified'
import {reporter} from 'vfile-reporter'

const file = await read('example.md')

await unified()
  .use(remarkParse)
  .use(remarkLint)
  .use(remarkLintNoBlockquoteWithoutMarker)
  .use(remarkStringify)
  .process(file)

console.error(reporter(file))
```

On the CLI:

```sh
remark --frail --use remark-lint --use remark-lint-no-blockquote-without-marker .
```

On the CLI in a config file (here a `package.json`):

```diff
 …
 "remarkConfig": {
   "plugins": [
     …
     "remark-lint",
+    "remark-lint-no-blockquote-without-marker",
     …
   ]
 }
 …
```

## API

This package exports no identifiers.
It exports no additional [TypeScript][typescript] types.
The default export is
[`remarkLintNoBlockquoteWithoutMarker`][api-remark-lint-no-blockquote-without-marker].

### `unified().use(remarkLintNoBlockquoteWithoutMarker)`

Warn for lazy lines in block quotes.

###### Parameters

There are no options.

###### Returns

Transform ([`Transformer` from `unified`][github-unified-transformer]).

## Recommendation

Rules around lazy lines are not straightforward and visually confusing,
so it’s recommended to start each line with a `>`.

## Fix

[`remark-stringify`][github-remark-stringify] adds `>` markers to every line
in a block quote.

## Examples

##### `ok.md`

###### In

```markdown
> Mercury,
> Venus,
> and Earth.

Mars.
```

###### Out

No messages.

##### `ok-tabs.md`

###### In

```markdown
>␉Mercury,
>␉Venus,
>␉and Earth.
```

###### Out

No messages.

##### `not-ok.md`

###### In

```markdown
> Mercury,
Venus,
> and Earth.
```

###### Out

```text
2:1: Unexpected `0` block quote markers before paragraph line, expected `1` marker, add `1` marker
```

##### `not-ok-tabs.md`

###### In

```markdown
>␉Mercury,
␉Venus,
and Earth.
```

###### Out

```text
2:2: Unexpected `0` block quote markers before paragraph line, expected `1` marker, add `1` marker
3:1: Unexpected `0` block quote markers before paragraph line, expected `1` marker, add `1` marker
```

##### `containers.md`

###### In

```markdown
* > Mercury and
Venus.

> * Mercury and
  Venus.

* > * Mercury and
    Venus.

> * > Mercury and
      Venus.

***

> * > Mercury and
>     Venus.
```

###### Out

```text
2:1: Unexpected `0` block quote markers before paragraph line, expected `1` marker, add `1` marker
5:3: Unexpected `0` block quote markers before paragraph line, expected `1` marker, add `1` marker
8:5: Unexpected `0` block quote markers before paragraph line, expected `1` marker, add `1` marker
11:7: Unexpected `0` block quote markers before paragraph line, expected `2` markers, add `2` markers
16:7: Unexpected `1` block quote marker before paragraph line, expected `2` markers, add `1` marker
```

## Compatibility

Projects maintained by the unified collective are compatible with maintained
versions of Node.js.

When we cut a new major release, we drop support for unmaintained versions of
Node.
This means we try to keep the current release line,
`remark-lint-no-blockquote-without-marker@6`,
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

[api-remark-lint-no-blockquote-without-marker]: #unifieduseremarklintnoblockquotewithoutmarker

[author]: https://wooorm.com

[badge-build-image]: https://github.com/remarkjs/remark-lint/workflows/main/badge.svg

[badge-build-url]: https://github.com/remarkjs/remark-lint/actions

[badge-chat-image]: https://img.shields.io/badge/chat-discussions-success.svg

[badge-chat-url]: https://github.com/remarkjs/remark/discussions

[badge-coverage-image]: https://img.shields.io/codecov/c/github/remarkjs/remark-lint.svg

[badge-coverage-url]: https://codecov.io/github/remarkjs/remark-lint

[badge-downloads-image]: https://img.shields.io/npm/dm/remark-lint-no-blockquote-without-marker.svg

[badge-downloads-url]: https://www.npmjs.com/package/remark-lint-no-blockquote-without-marker

[badge-funding-backers-image]: https://opencollective.com/unified/backers/badge.svg

[badge-funding-sponsors-image]: https://opencollective.com/unified/sponsors/badge.svg

[badge-funding-url]: https://opencollective.com/unified

[badge-size-image]: https://img.shields.io/bundlejs/size/remark-lint-no-blockquote-without-marker

[badge-size-url]: https://bundlejs.com/?q=remark-lint-no-blockquote-without-marker

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

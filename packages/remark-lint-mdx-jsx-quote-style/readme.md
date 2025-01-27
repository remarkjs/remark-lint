<!--This file is generated-->

# remark-lint-mdx-jsx-quote-style

[![Build][badge-build-image]][badge-build-url]
[![Coverage][badge-coverage-image]][badge-coverage-url]
[![Downloads][badge-downloads-image]][badge-downloads-url]
[![Size][badge-size-image]][badge-size-url]
[![Sponsors][badge-funding-sponsors-image]][badge-funding-url]
[![Backers][badge-funding-backers-image]][badge-funding-url]
[![Chat][badge-chat-image]][badge-chat-url]

[`remark-lint`][github-remark-lint] rule to warn when MDX JSX attribute value
markers violate a given style.

## Contents

* [What is this?](#what-is-this)
* [When should I use this?](#when-should-i-use-this)
* [Presets](#presets)
* [Install](#install)
* [Use](#use)
* [API](#api)
  * [`unified().use(remarkLintMdxJsxQuoteStyle[, options])`](#unifieduseremarklintmdxjsxquotestyle-options)
  * [`Options`](#options)
  * [`Style`](#style)
* [Recommendation](#recommendation)
* [Fix](#fix)
* [Examples](#examples)
* [Compatibility](#compatibility)
* [Contribute](#contribute)
* [License](#license)

## What is this?

This package checks the style of MDX JSX attribute value markers.

## When should I use this?

You can use this package to check that the style of MDX JSX attribute value
markers is consistent.

## Presets

This plugin is not included in presets maintained here.

## Install

This package is [ESM only][github-gist-esm].
In Node.js (version 16+),
install with [npm][npm-install]:

```sh
npm install remark-lint-mdx-jsx-quote-style
```

In Deno with [`esm.sh`][esm-sh]:

```js
import remarkLintMdxJsxQuoteStyle from 'https://esm.sh/remark-lint-mdx-jsx-quote-style@1'
```

In browsers with [`esm.sh`][esm-sh]:

```html
<script type="module">
  import remarkLintMdxJsxQuoteStyle from 'https://esm.sh/remark-lint-mdx-jsx-quote-style@1?bundle'
</script>
```

## Use

On the API:

```js
import remarkLint from 'remark-lint'
import remarkLintMdxJsxQuoteStyle from 'remark-lint-mdx-jsx-quote-style'
import remarkParse from 'remark-parse'
import remarkStringify from 'remark-stringify'
import {read} from 'to-vfile'
import {unified} from 'unified'
import {reporter} from 'vfile-reporter'

const file = await read('example.md')

await unified()
  .use(remarkParse)
  .use(remarkLint)
  .use(remarkLintMdxJsxQuoteStyle)
  .use(remarkStringify)
  .process(file)

console.error(reporter(file))
```

On the CLI:

```sh
remark --frail --use remark-lint --use remark-lint-mdx-jsx-quote-style .
```

On the CLI in a config file (here a `package.json`):

```diff
 …
 "remarkConfig": {
   "plugins": [
     …
     "remark-lint",
+    "remark-lint-mdx-jsx-quote-style",
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
[`remarkLintMdxJsxQuoteStyle`][api-remark-lint-mdx-jsx-quote-style].

### `unified().use(remarkLintMdxJsxQuoteStyle[, options])`

Warn when MDX JSX attribute value markers violate a given style.

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
type Style = '"' | '\''
```

## Recommendation

In HTML,
attributes are commonly written with double quotes.
It’s recommended to go with that.
To configure this rule with `'"'`.

## Fix

[`remark-mdx`][github-remark-mdx] formats titles with double
quotes by default.
Pass `quote: "'"` to use single quotes.

## Examples

##### `ok-consistent.mdx`

###### In

> 👉 **Note**: this example uses
> MDX ([`remark-mdx`][github-remark-mdx]).

```mdx
<a href="https://example.com/venus/">Venus</a> and
<a href="https://example.com/earth/">Earth</a>.
```

###### Out

No messages.

##### `not-ok-consistent.mdx`

###### In

> 👉 **Note**: this example uses
> MDX ([`remark-mdx`][github-remark-mdx]).

```mdx
<a href="https://example.com/venus/">Venus</a> and
<a href='https://example.com/earth/'>Earth</a>.
```

###### Out

```text
2:4-2:37: Unexpected JSX quote markers `'`, expected `"`
```

##### `double-quote.mdx`

When configured with `'"'`.

###### In

> 👉 **Note**: this example uses
> MDX ([`remark-mdx`][github-remark-mdx]).

```mdx
<a href="https://example.com/venus/">Venus</a> and
<a href='https://example.com/earth/'>Earth</a>.
```

###### Out

```text
2:4-2:37: Unexpected JSX quote markers `'`, expected `"`
```

##### `single-quote.mdx`

When configured with `"'"`.

###### In

> 👉 **Note**: this example uses
> MDX ([`remark-mdx`][github-remark-mdx]).

```mdx
<a href="https://example.com/venus/">Venus</a> and
<a href='https://example.com/earth/'>Earth</a>.
```

###### Out

```text
1:4-1:37: Unexpected JSX quote markers `"`, expected `'`
```

##### `other-attributes.mdx`

###### In

> 👉 **Note**: this example uses
> MDX ([`remark-mdx`][github-remark-mdx]).

```mdx
<Mercury closest />,
<Venus aphelion={0.728213} />, and
<Earth {...people} />.
```

###### Out

No messages.

##### `whitespace.mdx`

When configured with `'"'`.

###### In

> 👉 **Note**: this example uses
> MDX ([`remark-mdx`][github-remark-mdx]).

```mdx
<Mars symbol = "♂" />.
```

###### Out

No messages.

##### `not-ok.mdx`

When configured with `'🌍'`.

###### Out

```text
1:1: Unexpected value `🌍` for `options`, expected `'"'`, `"'"`, or `'consistent'`
```

## Compatibility

Projects maintained by the unified collective are compatible with maintained
versions of Node.js.

When we cut a new major release, we drop support for unmaintained versions of
Node.
This means we try to keep the current release line,
`remark-lint-mdx-jsx-quote-style@1`,
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

[api-remark-lint-mdx-jsx-quote-style]: #unifieduseremarklintmdxjsxquotestyle-options

[api-style]: #style

[author]: https://wooorm.com

[badge-build-image]: https://github.com/remarkjs/remark-lint/workflows/main/badge.svg

[badge-build-url]: https://github.com/remarkjs/remark-lint/actions

[badge-chat-image]: https://img.shields.io/badge/chat-discussions-success.svg

[badge-chat-url]: https://github.com/remarkjs/remark/discussions

[badge-coverage-image]: https://img.shields.io/codecov/c/github/remarkjs/remark-lint.svg

[badge-coverage-url]: https://codecov.io/github/remarkjs/remark-lint

[badge-downloads-image]: https://img.shields.io/npm/dm/remark-lint-mdx-jsx-quote-style.svg

[badge-downloads-url]: https://www.npmjs.com/package/remark-lint-mdx-jsx-quote-style

[badge-funding-backers-image]: https://opencollective.com/unified/backers/badge.svg

[badge-funding-sponsors-image]: https://opencollective.com/unified/sponsors/badge.svg

[badge-funding-url]: https://opencollective.com/unified

[badge-size-image]: https://img.shields.io/bundlejs/size/remark-lint-mdx-jsx-quote-style

[badge-size-url]: https://bundlejs.com/?q=remark-lint-mdx-jsx-quote-style

[esm-sh]: https://esm.sh

[file-license]: https://github.com/remarkjs/remark-lint/blob/main/license

[github-dotfiles-coc]: https://github.com/remarkjs/.github/blob/main/code-of-conduct.md

[github-dotfiles-contributing]: https://github.com/remarkjs/.github/blob/main/contributing.md

[github-dotfiles-health]: https://github.com/remarkjs/.github

[github-dotfiles-support]: https://github.com/remarkjs/.github/blob/main/support.md

[github-gist-esm]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c

[github-remark-lint]: https://github.com/remarkjs/remark-lint

[github-remark-mdx]: https://mdxjs.com/packages/remark-mdx/

[github-unified-transformer]: https://github.com/unifiedjs/unified#transformer

[npm-install]: https://docs.npmjs.com/cli/install

[typescript]: https://www.typescriptlang.org

<!--This file is generated-->

# remark-lint-directive-quote-style

[![Build][badge-build-image]][badge-build-url]
[![Coverage][badge-coverage-image]][badge-coverage-url]
[![Downloads][badge-downloads-image]][badge-downloads-url]
[![Size][badge-size-image]][badge-size-url]
[![Sponsors][badge-funding-sponsors-image]][badge-funding-url]
[![Backers][badge-funding-backers-image]][badge-funding-url]
[![Chat][badge-chat-image]][badge-chat-url]

[`remark-lint`][github-remark-lint] rule to warn when directive attribute value
markers violate a given style.

## Contents

* [What is this?](#what-is-this)
* [When should I use this?](#when-should-i-use-this)
* [Presets](#presets)
* [Install](#install)
* [Use](#use)
* [API](#api)
  * [`inferAttributes(node, document)`](#inferattributesnode-document)
  * [`unified().use(remarkLintDirectiveQuoteStyle[, options])`](#unifieduseremarklintdirectivequotestyle-options)
  * [`Attribute`](#attribute)
  * [`Options`](#options)
  * [`Style`](#style)
  * [`Token`](#token)
* [Recommendation](#recommendation)
* [Fix](#fix)
* [Examples](#examples)
* [Compatibility](#compatibility)
* [Contribute](#contribute)
* [License](#license)

## What is this?

This package checks the style of directive attribute value markers.

## When should I use this?

You can use this package to check that the style of directive
attribute value markers is consistent.

## Presets

This plugin is not included in presets maintained here.

## Install

This package is [ESM only][github-gist-esm].
In Node.js (version 16+),
install with [npm][npm-install]:

```sh
npm install remark-lint-directive-quote-style
```

In Deno with [`esm.sh`][esm-sh]:

```js
import remarkLintDirectiveQuoteStyle, {inferAttributes} from 'https://esm.sh/remark-lint-directive-quote-style@0'
```

In browsers with [`esm.sh`][esm-sh]:

```html
<script type="module">
  import remarkLintDirectiveQuoteStyle, {inferAttributes} from 'https://esm.sh/remark-lint-directive-quote-style@0?bundle'
</script>
```

## Use

On the API:

```js
import remarkLint from 'remark-lint'
import remarkLintDirectiveQuoteStyle from 'remark-lint-directive-quote-style'
import remarkParse from 'remark-parse'
import remarkStringify from 'remark-stringify'
import {read} from 'to-vfile'
import {unified} from 'unified'
import {reporter} from 'vfile-reporter'

const file = await read('example.md')

await unified()
  .use(remarkParse)
  .use(remarkLint)
  .use(remarkLintDirectiveQuoteStyle)
  .use(remarkStringify)
  .process(file)

console.error(reporter(file))
```

On the CLI:

```sh
remark --frail --use remark-lint --use remark-lint-directive-quote-style .
```

On the CLI in a config file (here a `package.json`):

```diff
 …
 "remarkConfig": {
   "plugins": [
     …
     "remark-lint",
+    "remark-lint-directive-quote-style",
     …
   ]
 }
 …
```

## API

This package exports the identifier
[`inferAttributes`][api-infer-attributes].
It exports the [TypeScript][typescript] types
[`Attribute`][api-attribute],
[`Options`][api-options],
[`Style`][api-style], and
[`Token`][api-token].
The default export is
[`remarkLintDirectiveQuoteStyle`][api-remark-lint-directive-quote-style].

### `inferAttributes(node, document)`

Internal API to get offsets of where attributes occur.
Shared with other lint rules to work with attributes.

###### Parameters

* `node`
  ([`Directive`][github-mdast-util-directive-nodes])
* `document`
  (`string`)

###### Returns

[`Array<Attribute>`][api-attribute].

### `unified().use(remarkLintDirectiveQuoteStyle[, options])`

Warn when directive attribute value markers violate a given style.

###### Parameters

* `options`
  ([`Options`][api-options], default: `'consistent'`)
  — configuration

###### Returns

Transform ([`Transformer` from `unified`][github-unified-transformer]).

### `Attribute`

Internal attribute tokens (TypeScript type).

###### Type

```ts
export interface Attribute {
  key: Token
  value: Token | undefined
}
```

### `Options`

Configuration (TypeScript type).

###### Properties

* `allowUnquoted`
  (`boolean`, default: `true`)
  — whether to allow unquoted attributes;
  otherwise attribute values must be quoted
* `quote`
  ([`Style`][api-style] or `'consistent'`, default: `'consistent'`)
  — quote

### `Style`

Style (TypeScript type).

###### Type

```ts
type Style = '"' | '\''
```

### `Token`

Info on an internal token (TypeScript type).

###### Type

```ts
type Token = [value: string, start: number, end: number]
```

## Recommendation

In HTML,
attributes are commonly written with double quotes.
It’s recommended to go with that.
To configure this rule with `'"'`.

## Fix

[`remark-directive`][github-remark-directive] typically formats
attributes with double quotes.
It can be passed several options to influence which quote it uses.
The options `quote` and `quoteSmart` can be used together with this
lint rule.

## Examples

##### `ok-consistent.md`

###### In

> 👉 **Note**: this example uses
> directives ([`remark-directive`][github-remark-directive]).

```markdown
:planet[Venus]{aphelion="0.728213" perihelion="0.718440" symbol=♀︎}
```

###### Out

No messages.

##### `not-ok-consistent.md`

###### In

> 👉 **Note**: this example uses
> directives ([`remark-directive`][github-remark-directive]).

```markdown
:planet[Venus]{aphelion="0.728213" perihelion='0.718440' symbol=♀︎}
```

###### Out

```text
1:47-1:57: Unexpected directive attribute quote markers `'`, expected `"`
```

##### `double-quote.md`

When configured with `'"'`.

###### In

> 👉 **Note**: this example uses
> directives ([`remark-directive`][github-remark-directive]).

```markdown
:planet[Venus]{aphelion="0.728213" perihelion='0.718440' symbol=♀︎}
```

###### Out

```text
1:47-1:57: Unexpected directive attribute quote markers `'`, expected `"`
```

##### `single-quote.md`

When configured with `"'"`.

###### In

> 👉 **Note**: this example uses
> directives ([`remark-directive`][github-remark-directive]).

```markdown
:planet[Venus]{aphelion="0.728213" perihelion='0.718440' symbol=♀︎}
```

###### Out

```text
1:25-1:35: Unexpected directive attribute quote markers `"`, expected `'`
```

##### `other-attributes.md`

When configured with `'"'`.

###### In

> 👉 **Note**: this example uses
> directives ([`remark-directive`][github-remark-directive]).

```markdown
:planet[Jupiter]{#jupiter.fifth.gas-giant symbol=♃ .zeus}
```

###### Out

No messages.

##### `whitespace.md`

When configured with `'"'`.

###### In

> 👉 **Note**: this example uses
> directives ([`remark-directive`][github-remark-directive]).

```markdown
:planet[Mars]{ aphelion = "249261000" perihelion = '206650000' symbol = ♂ }.
```

###### Out

```text
1:52-1:63: Unexpected directive attribute quote markers `'`, expected `"`
```

##### `text-directive.md`

When configured with `'"'`.

###### In

> 👉 **Note**: this example uses
> directives ([`remark-directive`][github-remark-directive]).

```markdown
:planet{}

:planet[Venus]{aphelion="0.728213" perihelion='0.718440'}

:planet{symbol='♂'}

:planet[]
```

###### Out

```text
3:47-3:57: Unexpected directive attribute quote markers `'`, expected `"`
5:16-5:19: Unexpected directive attribute quote markers `'`, expected `"`
```

##### `leaf-directive.md`

When configured with `'"'`.

###### In

> 👉 **Note**: this example uses
> directives ([`remark-directive`][github-remark-directive]).

```markdown
::planet{}

::planet[Venus]{aphelion="0.728213" perihelion='0.718440'}

::planet{symbol='♂'}

::planet[]
```

###### Out

```text
3:48-3:58: Unexpected directive attribute quote markers `'`, expected `"`
5:17-5:20: Unexpected directive attribute quote markers `'`, expected `"`
```

##### `container-directive.md`

When configured with `'"'`.

###### In

> 👉 **Note**: this example uses
> directives ([`remark-directive`][github-remark-directive]).

```markdown
:::planet{}
:::

:::planet[Venus]{aphelion="0.728213" perihelion='0.718440'}
:::

:::planet{symbol='♃'}
Jupiter
:::

:::planet{symbol='🜨'}
:::

:::planet[]
:::
```

###### Out

```text
4:49-4:59: Unexpected directive attribute quote markers `'`, expected `"`
7:18-7:21: Unexpected directive attribute quote markers `'`, expected `"`
11:18-11:22: Unexpected directive attribute quote markers `'`, expected `"`
```

##### `allow-unquoted.md`

When configured with `{ allowUnquoted: false }`.

###### In

> 👉 **Note**: this example uses
> directives ([`remark-directive`][github-remark-directive]).

```markdown
:planet[Venus]{aphelion=0.728213}

:planet[Mars]{aphelion="249261000" symbol=♂}.
```

###### Out

```text
1:25-1:33: Unexpected unquoted directive attribute, expected quote around value
3:43-3:44: Unexpected unquoted directive attribute, expected `"` around value
```

##### `not-ok.md`

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
`remark-lint-directive-quote-style@0`,
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

[api-attribute]: #attribute

[api-infer-attributes]: #inferattributesnode-document

[api-options]: #options

[api-remark-lint-directive-quote-style]: #unifieduseremarklintdirectivequotestyle-options

[api-style]: #style

[api-token]: #token

[author]: https://wooorm.com

[badge-build-image]: https://github.com/remarkjs/remark-lint/workflows/main/badge.svg

[badge-build-url]: https://github.com/remarkjs/remark-lint/actions

[badge-chat-image]: https://img.shields.io/badge/chat-discussions-success.svg

[badge-chat-url]: https://github.com/remarkjs/remark/discussions

[badge-coverage-image]: https://img.shields.io/codecov/c/github/remarkjs/remark-lint.svg

[badge-coverage-url]: https://codecov.io/github/remarkjs/remark-lint

[badge-downloads-image]: https://img.shields.io/npm/dm/remark-lint-directive-quote-style.svg

[badge-downloads-url]: https://www.npmjs.com/package/remark-lint-directive-quote-style

[badge-funding-backers-image]: https://opencollective.com/unified/backers/badge.svg

[badge-funding-sponsors-image]: https://opencollective.com/unified/sponsors/badge.svg

[badge-funding-url]: https://opencollective.com/unified

[badge-size-image]: https://img.shields.io/bundlejs/size/remark-lint-directive-quote-style

[badge-size-url]: https://bundlejs.com/?q=remark-lint-directive-quote-style

[esm-sh]: https://esm.sh

[file-license]: https://github.com/remarkjs/remark-lint/blob/main/license

[github-dotfiles-coc]: https://github.com/remarkjs/.github/blob/main/code-of-conduct.md

[github-dotfiles-contributing]: https://github.com/remarkjs/.github/blob/main/contributing.md

[github-dotfiles-health]: https://github.com/remarkjs/.github

[github-dotfiles-support]: https://github.com/remarkjs/.github/blob/main/support.md

[github-gist-esm]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c

[github-mdast-util-directive-nodes]: https://github.com/syntax-tree/mdast-util-directive#nodes

[github-remark-directive]: https://github.com/remarkjs/remark-directive

[github-remark-lint]: https://github.com/remarkjs/remark-lint

[github-unified-transformer]: https://github.com/unifiedjs/unified#transformer

[npm-install]: https://docs.npmjs.com/cli/install

[typescript]: https://www.typescriptlang.org

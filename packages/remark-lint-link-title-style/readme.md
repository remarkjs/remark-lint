<!--This file is generated-->

# remark-lint-link-title-style

[![Build][badge-build-image]][badge-build-url]
[![Coverage][badge-coverage-image]][badge-coverage-url]
[![Downloads][badge-downloads-image]][badge-downloads-url]
[![Size][badge-size-image]][badge-size-url]
[![Sponsors][badge-funding-sponsors-image]][badge-funding-url]
[![Backers][badge-funding-backers-image]][badge-funding-url]
[![Chat][badge-chat-image]][badge-chat-url]

[`remark-lint`][github-remark-lint] rule to warn when link title markers violate a given style.

## Contents

* [What is this?](#what-is-this)
* [When should I use this?](#when-should-i-use-this)
* [Presets](#presets)
* [Install](#install)
* [Use](#use)
* [API](#api)
  * [`unified().use(remarkLintLinkTitleStyle[, options])`](#unifieduseremarklintlinktitlestyle-options)
  * [`Options`](#options)
  * [`Style`](#style)
* [Recommendation](#recommendation)
* [Fix](#fix)
* [Examples](#examples)
* [Compatibility](#compatibility)
* [Contribute](#contribute)
* [License](#license)

## What is this?

This package checks the style of link (*and* image and definition) title
markers.

## When should I use this?

You can use this package to check that the style of link title markers is
consistent.

## Presets

This plugin is included in the following presets:

| Preset | Options |
| - | - |
| [`remark-preset-lint-consistent`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-preset-lint-consistent) | `'consistent'` |
| [`remark-preset-lint-markdown-style-guide`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-preset-lint-markdown-style-guide) | `'"'` |

## Install

This package is [ESM only][github-gist-esm].
In Node.js (version 16+),
install with [npm][npm-install]:

```sh
npm install remark-lint-link-title-style
```

In Deno with [`esm.sh`][esm-sh]:

```js
import remarkLintLinkTitleStyle from 'https://esm.sh/remark-lint-link-title-style@4'
```

In browsers with [`esm.sh`][esm-sh]:

```html
<script type="module">
  import remarkLintLinkTitleStyle from 'https://esm.sh/remark-lint-link-title-style@4?bundle'
</script>
```

## Use

On the API:

```js
import remarkLint from 'remark-lint'
import remarkLintLinkTitleStyle from 'remark-lint-link-title-style'
import remarkParse from 'remark-parse'
import remarkStringify from 'remark-stringify'
import {read} from 'to-vfile'
import {unified} from 'unified'
import {reporter} from 'vfile-reporter'

const file = await read('example.md')

await unified()
  .use(remarkParse)
  .use(remarkLint)
  .use(remarkLintLinkTitleStyle)
  .use(remarkStringify)
  .process(file)

console.error(reporter(file))
```

On the CLI:

```sh
remark --frail --use remark-lint --use remark-lint-link-title-style .
```

On the CLI in a config file (here a `package.json`):

```diff
 …
 "remarkConfig": {
   "plugins": [
     …
     "remark-lint",
+    "remark-lint-link-title-style",
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
[`remarkLintLinkTitleStyle`][api-remark-lint-link-title-style].

### `unified().use(remarkLintLinkTitleStyle[, options])`

Warn when link title markers violate a given style.

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
type Style = '"' | '\'' | '()'
```

## Recommendation

Before CommonMark, parens for titles were not supported in markdown.
They should now work in most places.
Parens do look a bit weird as they’re inside more parens:
`[text](url (title))`.

In HTML, attributes are commonly written with double quotes.
Due to this, titles are almost exclusively wrapped in double quotes in
markdown, so it’s recommended to configure this rule with `'"'`.

## Fix

[`remark-stringify`][github-remark-stringify] formats titles with double
quotes by default.
Pass `quote: "'"` to use single quotes.
There is no option to use parens.

## Examples

##### `ok-consistent.md`

###### In

```markdown
[Mercury](http://example.com/mercury/),
[Venus](http://example.com/venus/ "Go to Venus"), and
![Earth](http://example.com/earth/ "Go to Earth").

[Mars]: http://example.com/mars/ "Go to Mars"
```

###### Out

No messages.

##### `not-ok-consistent.md`

###### In

```markdown
[Mercury](http://example.com/mercury/ "Go to Mercury") and
![Venus](http://example.com/venus/ 'Go to Venus').

[Earth]: http://example.com/earth/ (Go to Earth)
```

###### Out

```text
2:1-2:50: Unexpected title markers `'`, expected `"`
4:1-4:49: Unexpected title markers `'('` and `')'`, expected `"`
```

##### `ok-double.md`

When configured with `'"'`.

###### In

```markdown
[Mercury](http://example.com/mercury/ "Go to Mercury").
```

###### Out

No messages.

##### `not-ok-double.md`

When configured with `'"'`.

###### In

```markdown
[Mercury](http://example.com/mercury/ 'Go to Mercury').
```

###### Out

```text
1:1-1:55: Unexpected title markers `'`, expected `"`
```

##### `ok-single.md`

When configured with `"'"`.

###### In

```markdown
[Mercury](http://example.com/mercury/ 'Go to Mercury').
```

###### Out

No messages.

##### `not-ok-single.md`

When configured with `"'"`.

###### In

```markdown
[Mercury](http://example.com/mercury/ "Go to Mercury").
```

###### Out

```text
1:1-1:55: Unexpected title markers `"`, expected `'`
```

##### `ok-paren.md`

When configured with `'()'`.

###### In

```markdown
[Mercury](http://example.com/mercury/ (Go to Mercury)).
```

###### Out

No messages.

##### `not-ok-paren.md`

When configured with `'()'`.

###### In

```markdown
[Mercury](http://example.com/mercury/ "Go to Mercury").
```

###### Out

```text
1:1-1:55: Unexpected title markers `"`, expected `'('` and `')'`
```

##### `not-ok.md`

When configured with `'🌍'`.

###### Out

```text
1:1: Unexpected value `🌍` for `options`, expected `'"'`, `"'"`, `'()'`, or `'consistent'`
```

##### `ok-parens-in-url.md`

When configured with `'"'`.

###### In

```markdown
Parens in URLs work correctly:

[Mercury](http://example.com/(mercury) "Go to Mercury") and
[Venus](http://example.com/(venus)).
```

###### Out

No messages.

##### `ok-whitespace.md`

When configured with `'"'`.

###### In

```markdown
Trailing whitespace works correctly:

[Mercury](http://example.com/mercury/␠"Go to Mercury"␠).
```

###### Out

No messages.

## Compatibility

Projects maintained by the unified collective are compatible with maintained
versions of Node.js.

When we cut a new major release, we drop support for unmaintained versions of
Node.
This means we try to keep the current release line,
`remark-lint-link-title-style@4`,
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

[api-remark-lint-link-title-style]: #unifieduseremarklintlinktitlestyle-options

[api-style]: #style

[author]: https://wooorm.com

[badge-build-image]: https://github.com/remarkjs/remark-lint/workflows/main/badge.svg

[badge-build-url]: https://github.com/remarkjs/remark-lint/actions

[badge-chat-image]: https://img.shields.io/badge/chat-discussions-success.svg

[badge-chat-url]: https://github.com/remarkjs/remark/discussions

[badge-coverage-image]: https://img.shields.io/codecov/c/github/remarkjs/remark-lint.svg

[badge-coverage-url]: https://codecov.io/github/remarkjs/remark-lint

[badge-downloads-image]: https://img.shields.io/npm/dm/remark-lint-link-title-style.svg

[badge-downloads-url]: https://www.npmjs.com/package/remark-lint-link-title-style

[badge-funding-backers-image]: https://opencollective.com/unified/backers/badge.svg

[badge-funding-sponsors-image]: https://opencollective.com/unified/sponsors/badge.svg

[badge-funding-url]: https://opencollective.com/unified

[badge-size-image]: https://img.shields.io/bundlejs/size/remark-lint-link-title-style

[badge-size-url]: https://bundlejs.com/?q=remark-lint-link-title-style

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

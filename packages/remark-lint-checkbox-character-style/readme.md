<!--This file is generated-->

# remark-lint-checkbox-character-style

[![Build][badge-build-image]][badge-build-url]
[![Coverage][badge-coverage-image]][badge-coverage-url]
[![Downloads][badge-downloads-image]][badge-downloads-url]
[![Size][badge-size-image]][badge-size-url]
[![Sponsors][badge-funding-sponsors-image]][badge-funding-url]
[![Backers][badge-funding-backers-image]][badge-funding-url]
[![Chat][badge-chat-image]][badge-chat-url]

[`remark-lint`][github-remark-lint] rule to warn when list item checkboxes violate a given
style.

## Contents

* [What is this?](#what-is-this)
* [When should I use this?](#when-should-i-use-this)
* [Presets](#presets)
* [Install](#install)
* [Use](#use)
* [API](#api)
  * [`unified().use(remarkLintCheckboxCharacterStyle[, options])`](#unifieduseremarklintcheckboxcharacterstyle-options)
  * [`Options`](#options)
  * [`Styles`](#styles)
* [Recommendation](#recommendation)
* [Fix](#fix)
* [Examples](#examples)
* [Compatibility](#compatibility)
* [Contribute](#contribute)
* [License](#license)

## What is this?

This package checks the character used in checkboxes.

## When should I use this?

You can use this package to check that the style of GFM tasklists is
consistent.
Task lists are a GFM feature enabled with
[`remark-gfm`][github-remark-gfm].

## Presets

This plugin is included in the following presets:

| Preset | Options |
| - | - |
| [`remark-preset-lint-consistent`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-preset-lint-consistent) | `'consistent'` |

## Install

This package is [ESM only][github-gist-esm].
In Node.js (version 16+),
install with [npm][npm-install]:

```sh
npm install remark-lint-checkbox-character-style
```

In Deno with [`esm.sh`][esm-sh]:

```js
import remarkLintCheckboxCharacterStyle from 'https://esm.sh/remark-lint-checkbox-character-style@5'
```

In browsers with [`esm.sh`][esm-sh]:

```html
<script type="module">
  import remarkLintCheckboxCharacterStyle from 'https://esm.sh/remark-lint-checkbox-character-style@5?bundle'
</script>
```

## Use

On the API:

```js
import remarkLint from 'remark-lint'
import remarkLintCheckboxCharacterStyle from 'remark-lint-checkbox-character-style'
import remarkParse from 'remark-parse'
import remarkStringify from 'remark-stringify'
import {read} from 'to-vfile'
import {unified} from 'unified'
import {reporter} from 'vfile-reporter'

const file = await read('example.md')

await unified()
  .use(remarkParse)
  .use(remarkLint)
  .use(remarkLintCheckboxCharacterStyle)
  .use(remarkStringify)
  .process(file)

console.error(reporter(file))
```

On the CLI:

```sh
remark --frail --use remark-lint --use remark-lint-checkbox-character-style .
```

On the CLI in a config file (here a `package.json`):

```diff
 …
 "remarkConfig": {
   "plugins": [
     …
     "remark-lint",
+    "remark-lint-checkbox-character-style",
     …
   ]
 }
 …
```

## API

This package exports no identifiers.
It exports the [TypeScript][typescript] types
[`Options`][api-options] and
[`Styles`][api-styles].
The default export is
[`remarkLintCheckboxCharacterStyle`][api-remark-lint-checkbox-character-style].

### `unified().use(remarkLintCheckboxCharacterStyle[, options])`

Warn when list item checkboxes violate a given style.

###### Parameters

* `options` ([`Options`][api-options], default: `'consistent'`)
  — either preferred values or whether to detect the first styles
  and warn for further differences

###### Returns

Transform ([`Transformer` from `unified`][github-unified-transformer]).

### `Options`

Configuration (TypeScript type).

###### Type

```ts
type Options = Styles | 'consistent'
```

### `Styles`

Styles (TypeScript type).

###### Fields

* `checked` (`'X'`, `'x'`, or `'consistent'`, default: `'consistent'`)
  — preferred style to use for checked checkboxes
* `unchecked` (`'␉'` (a tab), `'␠'` (a space), or `'consistent'`, default:
  `'consistent'`)
  — preferred style to use for unchecked checkboxes

## Recommendation

It’s recommended to set `options.checked` to `'x'` (a lowercase X) as it
prevents an extra keyboard press and `options.unchecked` to `'␠'` (a space)
to make all checkboxes align.

## Fix

[`remark-stringify`][github-remark-stringify] formats checked checkboxes
using `'x'` (lowercase X) and unchecked checkboxes using `'␠'` (a space).

## Examples

##### `ok-x.md`

When configured with `{ checked: 'x' }`.

###### In

> 👉 **Note**: this example uses
> GFM ([`remark-gfm`][github-remark-gfm]).

```markdown
- [x] Mercury.
- [x] Venus.
```

###### Out

No messages.

##### `ok-x-upper.md`

When configured with `{ checked: 'X' }`.

###### In

> 👉 **Note**: this example uses
> GFM ([`remark-gfm`][github-remark-gfm]).

```markdown
- [X] Mercury.
- [X] Venus.
```

###### Out

No messages.

##### `ok-space.md`

When configured with `{ unchecked: ' ' }`.

###### In

> 👉 **Note**: this example uses
> GFM ([`remark-gfm`][github-remark-gfm]).

```markdown
- [ ] Mercury.
- [ ] Venus.
- [ ]␠␠
- [ ]
```

###### Out

No messages.

##### `ok-tab.md`

When configured with `{ unchecked: '\t' }`.

###### In

> 👉 **Note**: this example uses
> GFM ([`remark-gfm`][github-remark-gfm]).

```markdown
- [␉] Mercury.
- [␉] Venus.
```

###### Out

No messages.

##### `not-ok-default.md`

###### In

> 👉 **Note**: this example uses
> GFM ([`remark-gfm`][github-remark-gfm]).

```markdown
- [x] Mercury.
- [X] Venus.
- [ ] Earth.
- [␉] Mars.
```

###### Out

```text
2:5: Unexpected checked checkbox value `X`, expected `x`
4:5: Unexpected unchecked checkbox value `\t`, expected ` `
```

##### `not-ok-option.md`

When configured with `'🌍'`.

###### Out

```text
1:1: Unexpected value `🌍` for `options`, expected an object or `'consistent'`
```

##### `not-ok-option-unchecked.md`

When configured with `{ unchecked: '🌍' }`.

###### Out

```text
1:1: Unexpected value `🌍` for `options.unchecked`, expected `'\t'`, `' '`, or `'consistent'`
```

##### `not-ok-option-checked.md`

When configured with `{ checked: '🌍' }`.

###### Out

```text
1:1: Unexpected value `🌍` for `options.checked`, expected `'X'`, `'x'`, or `'consistent'`
```

## Compatibility

Projects maintained by the unified collective are compatible with maintained
versions of Node.js.

When we cut a new major release, we drop support for unmaintained versions of
Node.
This means we try to keep the current release line,
`remark-lint-checkbox-character-style@5`,
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

[api-remark-lint-checkbox-character-style]: #unifieduseremarklintcheckboxcharacterstyle-options

[api-styles]: #styles

[author]: https://wooorm.com

[badge-build-image]: https://github.com/remarkjs/remark-lint/workflows/main/badge.svg

[badge-build-url]: https://github.com/remarkjs/remark-lint/actions

[badge-chat-image]: https://img.shields.io/badge/chat-discussions-success.svg

[badge-chat-url]: https://github.com/remarkjs/remark/discussions

[badge-coverage-image]: https://img.shields.io/codecov/c/github/remarkjs/remark-lint.svg

[badge-coverage-url]: https://codecov.io/github/remarkjs/remark-lint

[badge-downloads-image]: https://img.shields.io/npm/dm/remark-lint-checkbox-character-style.svg

[badge-downloads-url]: https://www.npmjs.com/package/remark-lint-checkbox-character-style

[badge-funding-backers-image]: https://opencollective.com/unified/backers/badge.svg

[badge-funding-sponsors-image]: https://opencollective.com/unified/sponsors/badge.svg

[badge-funding-url]: https://opencollective.com/unified

[badge-size-image]: https://img.shields.io/bundlejs/size/remark-lint-checkbox-character-style

[badge-size-url]: https://bundlejs.com/?q=remark-lint-checkbox-character-style

[esm-sh]: https://esm.sh

[file-license]: https://github.com/remarkjs/remark-lint/blob/main/license

[github-dotfiles-coc]: https://github.com/remarkjs/.github/blob/main/code-of-conduct.md

[github-dotfiles-contributing]: https://github.com/remarkjs/.github/blob/main/contributing.md

[github-dotfiles-health]: https://github.com/remarkjs/.github

[github-dotfiles-support]: https://github.com/remarkjs/.github/blob/main/support.md

[github-gist-esm]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c

[github-remark-gfm]: https://github.com/remarkjs/remark-gfm

[github-remark-lint]: https://github.com/remarkjs/remark-lint

[github-remark-stringify]: https://github.com/remarkjs/remark/tree/main/packages/remark-stringify

[github-unified-transformer]: https://github.com/unifiedjs/unified#transformer

[npm-install]: https://docs.npmjs.com/cli/install

[typescript]: https://www.typescriptlang.org

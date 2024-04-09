<!--This file is generated-->

# remark-lint-linebreak-style

[![Build][badge-build-image]][badge-build-url]
[![Coverage][badge-coverage-image]][badge-coverage-url]
[![Downloads][badge-downloads-image]][badge-downloads-url]
[![Size][badge-size-image]][badge-size-url]
[![Sponsors][badge-funding-sponsors-image]][badge-funding-url]
[![Backers][badge-funding-backers-image]][badge-funding-url]
[![Chat][badge-chat-image]][badge-chat-url]

[`remark-lint`][github-remark-lint] rule to warn when line endings violate a given style.

## Contents

* [When should I use this?](#when-should-i-use-this)
* [When should I use this?](#when-should-i-use-this-1)
* [Presets](#presets)
* [Install](#install)
* [Use](#use)
* [API](#api)
  * [`unified().use(remarkLintLinebreakStyle[, options])`](#unifieduseremarklintlinebreakstyle-options)
  * [`Options`](#options)
  * [`Style`](#style)
* [Recommendation](#recommendation)
* [Fix](#fix)
* [Examples](#examples)
* [Compatibility](#compatibility)
* [Contribute](#contribute)
* [License](#license)

## When should I use this?

This package checks the style of line endings.

## When should I use this?

You can use this package to check that the style of line endings is
consistent.

## Presets

This plugin is not included in presets maintained here.

## Install

This package is [ESM only][github-gist-esm].
In Node.js (version 16+),
install with [npm][npm-install]:

```sh
npm install remark-lint-linebreak-style
```

In Deno with [`esm.sh`][esm-sh]:

```js
import remarkLintLinebreakStyle from 'https://esm.sh/remark-lint-linebreak-style@3'
```

In browsers with [`esm.sh`][esm-sh]:

```html
<script type="module">
  import remarkLintLinebreakStyle from 'https://esm.sh/remark-lint-linebreak-style@3?bundle'
</script>
```

## Use

On the API:

```js
import remarkLint from 'remark-lint'
import remarkLintLinebreakStyle from 'remark-lint-linebreak-style'
import remarkParse from 'remark-parse'
import remarkStringify from 'remark-stringify'
import {read} from 'to-vfile'
import {unified} from 'unified'
import {reporter} from 'vfile-reporter'

const file = await read('example.md')

await unified()
  .use(remarkParse)
  .use(remarkLint)
  .use(remarkLintLinebreakStyle)
  .use(remarkStringify)
  .process(file)

console.error(reporter(file))
```

On the CLI:

```sh
remark --frail --use remark-lint --use remark-lint-linebreak-style .
```

On the CLI in a config file (here a `package.json`):

```diff
 …
 "remarkConfig": {
   "plugins": [
     …
     "remark-lint",
+    "remark-lint-linebreak-style",
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
[`remarkLintLinebreakStyle`][api-remark-lint-linebreak-style].

### `unified().use(remarkLintLinebreakStyle[, options])`

Warn when line endings violate a given style.

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
type Style = 'unix' | 'windows'
```

## Recommendation

In Git projects, you can configure to automatically switch between line
endings based on who checks the repo out.
In other places, you may want to manually force that one or the other is
used.

## Fix

[`remark-stringify`][github-remark-stringify] always uses Unix line endings.

## Examples

##### `ok-consistent-as-windows.md`

###### In

```markdown
Mercury␍␊and␍␊Venus.
```

###### Out

No messages.

##### `ok-consistent-as-unix.md`

###### In

```markdown
Mercury␊and␊Venus.
```

###### Out

No messages.

##### `not-ok-unix.md`

When configured with `'unix'`.

###### In

```markdown
Mercury.␍␊
```

###### Out

```text
1:10: Unexpected windows (`\r\n`) line ending, expected unix (`\n`) line endings
```

##### `not-ok-windows.md`

When configured with `'windows'`.

###### In

```markdown
Mercury.␊
```

###### Out

```text
1:9: Unexpected unix (`\n`) line ending, expected windows (`\r\n`) line endings
```

##### `not-ok-options.md`

When configured with `'🌍'`.

###### Out

```text
1:1: Unexpected value `🌍` for `options`, expected `'unix'`, `'windows'`, or `'consistent'`
```

##### `many.md`

When configured with `'windows'`.

###### In

```markdown
Mercury.␊Venus.␊Earth.␊Mars.␊Jupiter.␊Saturn.␊Uranus.␊Neptune.␊
```

###### Out

```text
1:9: Unexpected unix (`\n`) line ending, expected windows (`\r\n`) line endings
2:7: Unexpected unix (`\n`) line ending, expected windows (`\r\n`) line endings
3:7: Unexpected unix (`\n`) line ending, expected windows (`\r\n`) line endings
4:6: Unexpected unix (`\n`) line ending, expected windows (`\r\n`) line endings
5:9: Unexpected unix (`\n`) line ending, expected windows (`\r\n`) line endings
6:8: Unexpected large number of incorrect line endings, stopping
```

## Compatibility

Projects maintained by the unified collective are compatible with maintained
versions of Node.js.

When we cut a new major release, we drop support for unmaintained versions of
Node.
This means we try to keep the current release line,
`remark-lint-linebreak-style@3`,
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

[api-remark-lint-linebreak-style]: #unifieduseremarklintlinebreakstyle-options

[api-style]: #style

[author]: https://wooorm.com

[badge-build-image]: https://github.com/remarkjs/remark-lint/workflows/main/badge.svg

[badge-build-url]: https://github.com/remarkjs/remark-lint/actions

[badge-chat-image]: https://img.shields.io/badge/chat-discussions-success.svg

[badge-chat-url]: https://github.com/remarkjs/remark/discussions

[badge-coverage-image]: https://img.shields.io/codecov/c/github/remarkjs/remark-lint.svg

[badge-coverage-url]: https://codecov.io/github/remarkjs/remark-lint

[badge-downloads-image]: https://img.shields.io/npm/dm/remark-lint-linebreak-style.svg

[badge-downloads-url]: https://www.npmjs.com/package/remark-lint-linebreak-style

[badge-funding-backers-image]: https://opencollective.com/unified/backers/badge.svg

[badge-funding-sponsors-image]: https://opencollective.com/unified/sponsors/badge.svg

[badge-funding-url]: https://opencollective.com/unified

[badge-size-image]: https://img.shields.io/bundlejs/size/remark-lint-linebreak-style

[badge-size-url]: https://bundlejs.com/?q=remark-lint-linebreak-style

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

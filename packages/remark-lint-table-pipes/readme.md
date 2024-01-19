<!--This file is generated-->

# remark-lint-table-pipes

[![Build][badge-build-image]][badge-build-url]
[![Coverage][badge-coverage-image]][badge-coverage-url]
[![Downloads][badge-downloads-image]][badge-downloads-url]
[![Size][badge-size-image]][badge-size-url]
[![Sponsors][badge-funding-sponsors-image]][badge-funding-url]
[![Backers][badge-funding-backers-image]][badge-funding-url]
[![Chat][badge-chat-image]][badge-chat-url]

[`remark-lint`][github-remark-lint] rule to warn when GFM table rows have no initial or
final cell delimiter.

## Contents

* [What is this?](#what-is-this)
* [When should I use this?](#when-should-i-use-this)
* [Presets](#presets)
* [Install](#install)
* [Use](#use)
* [API](#api)
  * [`unified().use(remarkLintTablePipes)`](#unifieduseremarklinttablepipes)
* [Recommendation](#recommendation)
* [Fix](#fix)
* [Examples](#examples)
* [Compatibility](#compatibility)
* [Contribute](#contribute)
* [License](#license)

## What is this?

This package checks that table rows have initial and final delimiters.
Tables are a GFM feature enabled with [`remark-gfm`][github-remark-gfm].

## When should I use this?

You can use this package to check that tables are consistent.

## Presets

This plugin is included in the following presets:

| Preset | Options |
| - | - |
| [`remark-preset-lint-markdown-style-guide`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-preset-lint-markdown-style-guide) | |

## Install

This package is [ESM only][github-gist-esm].
In Node.js (version 16+),
install with [npm][npm-install]:

```sh
npm install remark-lint-table-pipes
```

In Deno with [`esm.sh`][esm-sh]:

```js
import remarkLintTablePipes from 'https://esm.sh/remark-lint-table-pipes@4'
```

In browsers with [`esm.sh`][esm-sh]:

```html
<script type="module">
  import remarkLintTablePipes from 'https://esm.sh/remark-lint-table-pipes@4?bundle'
</script>
```

## Use

On the API:

```js
import remarkLint from 'remark-lint'
import remarkLintTablePipes from 'remark-lint-table-pipes'
import remarkParse from 'remark-parse'
import remarkStringify from 'remark-stringify'
import {read} from 'to-vfile'
import {unified} from 'unified'
import {reporter} from 'vfile-reporter'

const file = await read('example.md')

await unified()
  .use(remarkParse)
  .use(remarkLint)
  .use(remarkLintTablePipes)
  .use(remarkStringify)
  .process(file)

console.error(reporter(file))
```

On the CLI:

```sh
remark --frail --use remark-lint --use remark-lint-table-pipes .
```

On the CLI in a config file (here a `package.json`):

```diff
 …
 "remarkConfig": {
   "plugins": [
     …
     "remark-lint",
+    "remark-lint-table-pipes",
     …
   ]
 }
 …
```

## API

This package exports no identifiers.
It exports no additional [TypeScript][typescript] types.
The default export is
[`remarkLintTablePipes`][api-remark-lint-table-pipes].

### `unified().use(remarkLintTablePipes)`

Warn when GFM table rows have no initial or final cell delimiter.

###### Parameters

There are no options.

###### Returns

Transform ([`Transformer` from `unified`][github-unified-transformer]).

## Recommendation

While tables don’t require initial or final delimiters (the pipes before the
first and after the last cells in a row),
it arguably does look weird without.

## Fix

[`remark-stringify`][github-remark-stringify] with
[`remark-gfm`][github-remark-gfm] formats all tables with initial and final
delimiters.

## Examples

##### `ok.md`

###### In

> 👉 **Note**: this example uses
> GFM ([`remark-gfm`][github-remark-gfm]).

```markdown
| Planet | Mean anomaly (°) |
| :- | -: |
| Mercury | 174 796 |
```

###### Out

No messages.

##### `not-ok.md`

###### In

> 👉 **Note**: this example uses
> GFM ([`remark-gfm`][github-remark-gfm]).

```markdown
Planet | Mean anomaly (°)
:- | -:
Mercury | 174 796
```

###### Out

```text
1:1: Unexpected missing closing pipe in row, expected `|`
1:26: Unexpected missing opening pipe in row, expected `|`
2:1: Unexpected missing closing pipe in row, expected `|`
2:8: Unexpected missing opening pipe in row, expected `|`
3:1: Unexpected missing closing pipe in row, expected `|`
3:18: Unexpected missing opening pipe in row, expected `|`
```

##### `missing-cells.md`

###### In

> 👉 **Note**: this example uses
> GFM ([`remark-gfm`][github-remark-gfm]).

```markdown
Planet | Symbol | Satellites
:- | - | -
Mercury
Venus | ♀
Earth | ♁ | 1
Mars | ♂ | 2 | 19 412
```

###### Out

```text
1:1: Unexpected missing closing pipe in row, expected `|`
1:29: Unexpected missing opening pipe in row, expected `|`
2:1: Unexpected missing closing pipe in row, expected `|`
2:11: Unexpected missing opening pipe in row, expected `|`
3:1: Unexpected missing closing pipe in row, expected `|`
3:8: Unexpected missing opening pipe in row, expected `|`
4:1: Unexpected missing closing pipe in row, expected `|`
4:10: Unexpected missing opening pipe in row, expected `|`
5:1: Unexpected missing closing pipe in row, expected `|`
5:14: Unexpected missing opening pipe in row, expected `|`
6:1: Unexpected missing closing pipe in row, expected `|`
6:22: Unexpected missing opening pipe in row, expected `|`
```

##### `trailing-spaces.md`

###### In

> 👉 **Note**: this example uses
> GFM ([`remark-gfm`][github-remark-gfm]).

```markdown
␠␠Planet␠␠
␠-:␠

␠␠| Planet |␠␠
␠| -: |␠
```

###### Out

```text
1:3: Unexpected missing closing pipe in row, expected `|`
1:11: Unexpected missing opening pipe in row, expected `|`
2:2: Unexpected missing closing pipe in row, expected `|`
2:5: Unexpected missing opening pipe in row, expected `|`
```

##### `windows.md`

###### In

> 👉 **Note**: this example uses
> GFM ([`remark-gfm`][github-remark-gfm]).

```markdown
Mercury␍␊:-␍␊None
```

###### Out

```text
1:1: Unexpected missing closing pipe in row, expected `|`
1:8: Unexpected missing opening pipe in row, expected `|`
2:1: Unexpected missing closing pipe in row, expected `|`
2:3: Unexpected missing opening pipe in row, expected `|`
3:1: Unexpected missing closing pipe in row, expected `|`
3:5: Unexpected missing opening pipe in row, expected `|`
```

## Compatibility

Projects maintained by the unified collective are compatible with maintained
versions of Node.js.

When we cut a new major release, we drop support for unmaintained versions of
Node.
This means we try to keep the current release line,
`remark-lint-table-pipes@4`,
compatible with Node.js 12.

## Contribute

See [`contributing.md`][github-dotfiles-contributing] in [`remarkjs/.github`][github-dotfiles-health] for ways
to get started.
See [`support.md`][github-dotfiles-support] for ways to get help.

This project has a [code of conduct][github-dotfiles-coc].
By interacting with this repository, organization, or community you agree to
abide by its terms.

## License

[MIT][file-license] © [Titus Wormer][author]

[api-remark-lint-table-pipes]: #unifieduseremarklinttablepipes

[author]: https://wooorm.com

[badge-build-image]: https://github.com/remarkjs/remark-lint/workflows/main/badge.svg

[badge-build-url]: https://github.com/remarkjs/remark-lint/actions

[badge-chat-image]: https://img.shields.io/badge/chat-discussions-success.svg

[badge-chat-url]: https://github.com/remarkjs/remark/discussions

[badge-coverage-image]: https://img.shields.io/codecov/c/github/remarkjs/remark-lint.svg

[badge-coverage-url]: https://codecov.io/github/remarkjs/remark-lint

[badge-downloads-image]: https://img.shields.io/npm/dm/remark-lint-table-pipes.svg

[badge-downloads-url]: https://www.npmjs.com/package/remark-lint-table-pipes

[badge-funding-backers-image]: https://opencollective.com/unified/backers/badge.svg

[badge-funding-sponsors-image]: https://opencollective.com/unified/sponsors/badge.svg

[badge-funding-url]: https://opencollective.com/unified

[badge-size-image]: https://img.shields.io/bundlejs/size/remark-lint-table-pipes

[badge-size-url]: https://bundlejs.com/?q=remark-lint-table-pipes

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

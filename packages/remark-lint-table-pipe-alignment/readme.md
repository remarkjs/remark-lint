<!--This file is generated-->

# remark-lint-table-pipe-alignment

[![Build][badge-build-image]][badge-build-url]
[![Coverage][badge-coverage-image]][badge-coverage-url]
[![Downloads][badge-downloads-image]][badge-downloads-url]
[![Size][badge-size-image]][badge-size-url]
[![Sponsors][badge-funding-sponsors-image]][badge-funding-url]
[![Backers][badge-funding-backers-image]][badge-funding-url]
[![Chat][badge-chat-image]][badge-chat-url]

[`remark-lint`][github-remark-lint] rule to warn when GFM table cells are aligned inconsistently.

## Contents

* [What is this?](#what-is-this)
* [When should I use this?](#when-should-i-use-this)
* [Presets](#presets)
* [Install](#install)
* [Use](#use)
* [API](#api)
  * [`unified().use(remarkLintTablePipeAlignment)`](#unifieduseremarklinttablepipealignment)
* [Recommendation](#recommendation)
* [Fix](#fix)
* [Examples](#examples)
* [Compatibility](#compatibility)
* [Contribute](#contribute)
* [License](#license)

## What is this?

This package checks table cell dividers are aligned.
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
npm install remark-lint-table-pipe-alignment
```

In Deno with [`esm.sh`][esm-sh]:

```js
import remarkLintTablePipeAlignment from 'https://esm.sh/remark-lint-table-pipe-alignment@3'
```

In browsers with [`esm.sh`][esm-sh]:

```html
<script type="module">
  import remarkLintTablePipeAlignment from 'https://esm.sh/remark-lint-table-pipe-alignment@3?bundle'
</script>
```

## Use

On the API:

```js
import remarkLint from 'remark-lint'
import remarkLintTablePipeAlignment from 'remark-lint-table-pipe-alignment'
import remarkParse from 'remark-parse'
import remarkStringify from 'remark-stringify'
import {read} from 'to-vfile'
import {unified} from 'unified'
import {reporter} from 'vfile-reporter'

const file = await read('example.md')

await unified()
  .use(remarkParse)
  .use(remarkLint)
  .use(remarkLintTablePipeAlignment)
  .use(remarkStringify)
  .process(file)

console.error(reporter(file))
```

On the CLI:

```sh
remark --frail --use remark-lint --use remark-lint-table-pipe-alignment .
```

On the CLI in a config file (here a `package.json`):

```diff
 …
 "remarkConfig": {
   "plugins": [
     …
     "remark-lint",
+    "remark-lint-table-pipe-alignment",
     …
   ]
 }
 …
```

## API

This package exports no identifiers.
It exports no additional [TypeScript][typescript] types.
The default export is
[`remarkLintTablePipeAlignment`][api-remark-lint-table-pipe-alignment].

### `unified().use(remarkLintTablePipeAlignment)`

Warn when GFM table cells are aligned inconsistently.

###### Parameters

There are no options.

###### Returns

Transform ([`Transformer` from `unified`][github-unified-transformer]).

## Recommendation

While aligning table dividers improves their legibility,
it is somewhat hard to maintain manually,
especially for tables with many rows.

## Fix

[`remark-stringify`][github-remark-stringify] with
[`remark-gfm`][github-remark-gfm] aligns table cell dividers by default.
Pass `tablePipeAlign: false` to use a more compact style.

Aligning perfectly in all cases is not possible because whether characters
look aligned or not depends on where the markup is shown.
Some characters (such as emoji or Chinese characters) show smaller or bigger
in different places.
You can pass a `stringLength` function to `remark-gfm`,
to align better for your use case,
in which case this rule must be turned off.

## Examples

##### `ok.md`

###### In

> 👉 **Note**: this example uses
> GFM ([`remark-gfm`][github-remark-gfm]).

```markdown
| A     | B     |
| ----- | ----- |
| Alpha | Bravo |
```

###### Out

No messages.

##### `not-ok.md`

###### In

> 👉 **Note**: this example uses
> GFM ([`remark-gfm`][github-remark-gfm]).

```markdown
| A | B |
| -- | -- |
| Alpha | Bravo |
```

###### Out

```text
3:9-3:10: Misaligned table fence
3:17-3:18: Misaligned table fence
```

##### `ok-empty-columns.md`

###### In

> 👉 **Note**: this example uses
> GFM ([`remark-gfm`][github-remark-gfm]).

```markdown
| | B     |   |
|-| ----- | - |
| | Bravo |   |
```

###### Out

No messages.

##### `ok-empty-cells.md`

###### In

> 👉 **Note**: this example uses
> GFM ([`remark-gfm`][github-remark-gfm]).

```markdown
|   |     |         |
| - | --- | ------- |
| A | Bra | Charlie |
```

###### Out

No messages.

## Compatibility

Projects maintained by the unified collective are compatible with maintained
versions of Node.js.

When we cut a new major release, we drop support for unmaintained versions of
Node.
This means we try to keep the current release line,
`remark-lint-table-pipe-alignment@3`,
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

[api-remark-lint-table-pipe-alignment]: #unifieduseremarklinttablepipealignment

[author]: https://wooorm.com

[badge-build-image]: https://github.com/remarkjs/remark-lint/workflows/main/badge.svg

[badge-build-url]: https://github.com/remarkjs/remark-lint/actions

[badge-chat-image]: https://img.shields.io/badge/chat-discussions-success.svg

[badge-chat-url]: https://github.com/remarkjs/remark/discussions

[badge-coverage-image]: https://img.shields.io/codecov/c/github/remarkjs/remark-lint.svg

[badge-coverage-url]: https://codecov.io/github/remarkjs/remark-lint

[badge-downloads-image]: https://img.shields.io/npm/dm/remark-lint-table-pipe-alignment.svg

[badge-downloads-url]: https://www.npmjs.com/package/remark-lint-table-pipe-alignment

[badge-funding-backers-image]: https://opencollective.com/unified/backers/badge.svg

[badge-funding-sponsors-image]: https://opencollective.com/unified/sponsors/badge.svg

[badge-funding-url]: https://opencollective.com/unified

[badge-size-image]: https://img.shields.io/bundlejs/size/remark-lint-table-pipe-alignment

[badge-size-url]: https://bundlejs.com/?q=remark-lint-table-pipe-alignment

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

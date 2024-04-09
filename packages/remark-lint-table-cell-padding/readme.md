<!--This file is generated-->

# remark-lint-table-cell-padding

[![Build][badge-build-image]][badge-build-url]
[![Coverage][badge-coverage-image]][badge-coverage-url]
[![Downloads][badge-downloads-image]][badge-downloads-url]
[![Size][badge-size-image]][badge-size-url]
[![Sponsors][badge-funding-sponsors-image]][badge-funding-url]
[![Backers][badge-funding-backers-image]][badge-funding-url]
[![Chat][badge-chat-image]][badge-chat-url]

[`remark-lint`][github-remark-lint] rule to warn when GFM table cells are padded inconsistently.

## Contents

* [What is this?](#what-is-this)
* [When should I use this?](#when-should-i-use-this)
* [Presets](#presets)
* [Install](#install)
* [Use](#use)
* [API](#api)
  * [`unified().use(remarkLintTableCellPadding[, options])`](#unifieduseremarklinttablecellpadding-options)
  * [`Style`](#style)
  * [`Options`](#options)
* [Recommendation](#recommendation)
* [Fix](#fix)
* [Examples](#examples)
* [Compatibility](#compatibility)
* [Contribute](#contribute)
* [License](#license)

## What is this?

This package checks table cell padding.
Tables are a GFM feature enabled with [`remark-gfm`][github-remark-gfm].

## When should I use this?

You can use this package to check that tables are consistent.

## Presets

This plugin is included in the following presets:

| Preset | Options |
| - | - |
| [`remark-preset-lint-consistent`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-preset-lint-consistent) | `'consistent'` |
| [`remark-preset-lint-markdown-style-guide`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-preset-lint-markdown-style-guide) | `'padded'` |

## Install

This package is [ESM only][github-gist-esm].
In Node.js (version 16+),
install with [npm][npm-install]:

```sh
npm install remark-lint-table-cell-padding
```

In Deno with [`esm.sh`][esm-sh]:

```js
import remarkLintTableCellPadding from 'https://esm.sh/remark-lint-table-cell-padding@5'
```

In browsers with [`esm.sh`][esm-sh]:

```html
<script type="module">
  import remarkLintTableCellPadding from 'https://esm.sh/remark-lint-table-cell-padding@5?bundle'
</script>
```

## Use

On the API:

```js
import remarkLint from 'remark-lint'
import remarkLintTableCellPadding from 'remark-lint-table-cell-padding'
import remarkParse from 'remark-parse'
import remarkStringify from 'remark-stringify'
import {read} from 'to-vfile'
import {unified} from 'unified'
import {reporter} from 'vfile-reporter'

const file = await read('example.md')

await unified()
  .use(remarkParse)
  .use(remarkLint)
  .use(remarkLintTableCellPadding)
  .use(remarkStringify)
  .process(file)

console.error(reporter(file))
```

On the CLI:

```sh
remark --frail --use remark-lint --use remark-lint-table-cell-padding .
```

On the CLI in a config file (here a `package.json`):

```diff
 …
 "remarkConfig": {
   "plugins": [
     …
     "remark-lint",
+    "remark-lint-table-cell-padding",
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
[`remarkLintTableCellPadding`][api-remark-lint-table-cell-padding].

### `unified().use(remarkLintTableCellPadding[, options])`

Warn when GFM table cells are padded inconsistently.

###### Parameters

* `options` ([`Options`][api-options], optional)
  — preferred style or whether to detect the first style and warn for
  further differences

###### Returns

Transform ([`Transformer` from `unified`][github-unified-transformer]).

### `Style`

Style (TypeScript type).

* `'compact'`
  — prefer zero spaces between pipes and content
* `'padded'`
  — prefer at least one space between pipes and content

###### Type

```ts
type Style = 'compact' | 'padded'
```

### `Options`

Configuration (TypeScript type).

###### Type

```ts
type Options = Style | 'consistent'
```

## Recommendation

It’s recommended to use at least one space between pipes and content for
legibility of the markup (`'padded'`).

## Fix

[`remark-stringify`][github-remark-stringify] with
[`remark-gfm`][github-remark-gfm] formats all table cells as padded by
default.
Pass `tableCellPadding: false` to use a more compact style.

## Examples

##### `ok.md`

When configured with `'padded'`.

###### In

> 👉 **Note**: this example uses
> GFM ([`remark-gfm`][github-remark-gfm]).

```markdown
| Planet  | Symbol | Satellites | Mean anomaly (°) |
| ------- | :----- | :--------: | ---------------: |
| Mercury | ☿      |    None    |          174 796 |

| Planet | Symbol | Satellites | Mean anomaly (°) |
| - | :- | :-: | -: |
| Venus | ♀ | None | 50 115 |
```

###### Out

No messages.

##### `not-ok.md`

When configured with `'padded'`.

###### In

> 👉 **Note**: this example uses
> GFM ([`remark-gfm`][github-remark-gfm]).

```markdown
| Planet |
| -------|
| Mercury|

|Planet |
|------ |
|Venus  |

|  Planet  |
|  ------  |
|  Venus   |
```

###### Out

```text
2:10: Unexpected `0` spaces between cell content and edge, expected `1` space, add `1` space
3:10: Unexpected `0` spaces between cell content and edge, expected `1` space, add `1` space
5:2: Unexpected `0` spaces between cell edge and content, expected `1` space, add `1` space
6:2: Unexpected `0` spaces between cell edge and content, expected `1` space, add `1` space
7:2: Unexpected `0` spaces between cell edge and content, expected `1` space, add `1` space
9:4: Unexpected `2` spaces between cell edge and content, expected `1` space, remove `1` space
9:12: Unexpected `2` spaces between cell content and edge, expected `1` space, remove `1` space
10:4: Unexpected `2` spaces between cell edge and content, expected `1` space, remove `1` space
10:12: Unexpected `2` spaces between cell content and edge, expected `1` space, remove `1` space
11:4: Unexpected `2` spaces between cell edge and content, expected `1` space, remove `1` space
11:12: Unexpected `3` spaces between cell content and edge, expected between `1` (unaligned) and `2` (aligned) spaces, remove between `1` and `2` spaces
```

##### `ok.md`

When configured with `'compact'`.

###### In

> 👉 **Note**: this example uses
> GFM ([`remark-gfm`][github-remark-gfm]).

```markdown
|Planet |Symbol|Satellites|Mean anomaly (°)|
|-------|:-----|:--------:|---------------:|
|Mercury|☿     |   None   |         174 796|

|Planet|Symbol|Satellites|Mean anomaly (°)|
|-|:-|:-:|-:|
|Venus|♀|None|50 115|
```

###### Out

No messages.

##### `not-ok.md`

When configured with `'compact'`.

###### In

> 👉 **Note**: this example uses
> GFM ([`remark-gfm`][github-remark-gfm]).

```markdown
| Planet |
| -------|
| Mercury|

|Planet |
|------ |
|Venus  |

|  Planet  |
|  ------  |
|  Venus   |
```

###### Out

```text
1:3: Unexpected `1` space between cell edge and content, expected `0` spaces, remove `1` space
2:3: Unexpected `1` space between cell edge and content, expected `0` spaces, remove `1` space
3:3: Unexpected `1` space between cell edge and content, expected `0` spaces, remove `1` space
5:9: Unexpected `1` space between cell content and edge, expected `0` spaces, remove `1` space
6:9: Unexpected `1` space between cell content and edge, expected `0` spaces, remove `1` space
7:9: Unexpected `2` spaces between cell content and edge, expected between `0` (unaligned) and `1` (aligned) space, remove between `1` and `2` spaces
9:4: Unexpected `2` spaces between cell edge and content, expected `0` spaces, remove `2` spaces
9:12: Unexpected `2` spaces between cell content and edge, expected `0` spaces, remove `2` spaces
10:4: Unexpected `2` spaces between cell edge and content, expected `0` spaces, remove `2` spaces
10:12: Unexpected `2` spaces between cell content and edge, expected `0` spaces, remove `2` spaces
11:4: Unexpected `2` spaces between cell edge and content, expected `0` spaces, remove `2` spaces
11:12: Unexpected `3` spaces between cell content and edge, expected between `0` (unaligned) and `1` (aligned) space, remove between `2` and `3` spaces
```

##### `consistent-padded-ok.md`

###### In

> 👉 **Note**: this example uses
> GFM ([`remark-gfm`][github-remark-gfm]).

```markdown
| Planet |
| - |
```

###### Out

No messages.

##### `consistent-padded-nok.md`

###### In

> 👉 **Note**: this example uses
> GFM ([`remark-gfm`][github-remark-gfm]).

```markdown
| Planet|
| - |
```

###### Out

```text
1:9: Unexpected `0` spaces between cell content and edge, expected `1` space, add `1` space
```

##### `consistent-compact-ok.md`

###### In

> 👉 **Note**: this example uses
> GFM ([`remark-gfm`][github-remark-gfm]).

```markdown
|Planet|
|-|
```

###### Out

No messages.

##### `consistent-compact-nok.md`

###### In

> 👉 **Note**: this example uses
> GFM ([`remark-gfm`][github-remark-gfm]).

```markdown
|Planet |
|-|
```

###### Out

```text
1:9: Unexpected `1` space between cell content and edge, expected `0` spaces, remove `1` space
```

##### `empty.md`

###### In

> 👉 **Note**: this example uses
> GFM ([`remark-gfm`][github-remark-gfm]).

```markdown
| | Satellites |
| - | - |
| Mercury | |
```

###### Out

No messages.

##### `missing-cells.md`

###### In

> 👉 **Note**: this example uses
> GFM ([`remark-gfm`][github-remark-gfm]).

```markdown
| Planet | Symbol | Satellites |
| - | - | - |
| Mercury |
| Venus | ♀ |
| Earth | 🜨 and ♁ | 1 |
| Mars | ♂ | 2 | 19 412 |
```

###### Out

No messages.

##### `missing-fences.md`

When configured with `'padded'`.

###### In

> 👉 **Note**: this example uses
> GFM ([`remark-gfm`][github-remark-gfm]).

```markdown
␠Planet|Symbol|Satellites
------:|:-----|----------
Mercury|☿     |0

Planet|Symbol
-----:|------
␠Venus|♀
```

###### Out

```text
1:8: Unexpected `0` spaces between cell content and edge, expected `1` space, add `1` space
1:9: Unexpected `0` spaces between cell edge and content, expected `1` space, add `1` space
1:15: Unexpected `0` spaces between cell content and edge, expected `1` space, add `1` space
1:16: Unexpected `0` spaces between cell edge and content, expected `1` space, add `1` space
2:8: Unexpected `0` spaces between cell content and edge, expected `1` space, add `1` space
2:9: Unexpected `0` spaces between cell edge and content, expected `1` space, add `1` space
2:15: Unexpected `0` spaces between cell content and edge, expected `1` space, add `1` space
2:16: Unexpected `0` spaces between cell edge and content, expected `1` space, add `1` space
3:8: Unexpected `0` spaces between cell content and edge, expected `1` space, add `1` space
3:9: Unexpected `0` spaces between cell edge and content, expected `1` space, add `1` space
3:16: Unexpected `0` spaces between cell edge and content, expected `1` space, add `1` space
5:7: Unexpected `0` spaces between cell content and edge, expected `1` space, add `1` space
5:8: Unexpected `0` spaces between cell edge and content, expected `1` space, add `1` space
6:7: Unexpected `0` spaces between cell content and edge, expected `1` space, add `1` space
6:8: Unexpected `0` spaces between cell edge and content, expected `1` space, add `1` space
7:7: Unexpected `0` spaces between cell content and edge, expected `1` space, add `1` space
7:8: Unexpected `0` spaces between cell edge and content, expected `1` space, add `1` space
```

##### `missing-fences.md`

When configured with `'compact'`.

###### In

> 👉 **Note**: this example uses
> GFM ([`remark-gfm`][github-remark-gfm]).

```markdown
Planet | Symbol | Satellites
-: | - | -
Mercury | ☿ | 0

Planet | Symbol
-----: | ------
␠Venus | ♀
```

###### Out

```text
1:8: Unexpected `1` space between cell content and edge, expected `0` spaces, remove `1` space
1:10: Unexpected `1` space between cell edge and content, expected `0` spaces, remove `1` space
1:17: Unexpected `1` space between cell content and edge, expected `0` spaces, remove `1` space
1:19: Unexpected `1` space between cell edge and content, expected `0` spaces, remove `1` space
2:4: Unexpected `1` space between cell content and edge, expected `0` spaces, remove `1` space
2:6: Unexpected `1` space between cell edge and content, expected `0` spaces, remove `1` space
2:10: Unexpected `1` space between cell edge and content, expected `0` spaces, remove `1` space
3:9: Unexpected `1` space between cell content and edge, expected `0` spaces, remove `1` space
3:11: Unexpected `1` space between cell edge and content, expected `0` spaces, remove `1` space
3:15: Unexpected `1` space between cell edge and content, expected `0` spaces, remove `1` space
5:8: Unexpected `1` space between cell content and edge, expected `0` spaces, remove `1` space
5:10: Unexpected `1` space between cell edge and content, expected `0` spaces, remove `1` space
6:8: Unexpected `1` space between cell content and edge, expected `0` spaces, remove `1` space
6:10: Unexpected `1` space between cell edge and content, expected `0` spaces, remove `1` space
7:8: Unexpected `1` space between cell content and edge, expected `0` spaces, remove `1` space
7:10: Unexpected `1` space between cell edge and content, expected `0` spaces, remove `1` space
```

##### `trailing-spaces.md`

When configured with `'compact'`.

###### In

> 👉 **Note**: this example uses
> GFM ([`remark-gfm`][github-remark-gfm]).

```markdown
Planet | Symbol␠
-: | -␠
Mercury | ☿␠␠

| Planet | Symbol |␠
| ------ | ------ |␠
| Venus  | ♀      |␠␠
```

###### Out

```text
1:8: Unexpected `1` space between cell content and edge, expected `0` spaces, remove `1` space
1:10: Unexpected `1` space between cell edge and content, expected `0` spaces, remove `1` space
2:4: Unexpected `1` space between cell content and edge, expected `0` spaces, remove `1` space
2:6: Unexpected `1` space between cell edge and content, expected `0` spaces, remove `1` space
3:9: Unexpected `1` space between cell content and edge, expected `0` spaces, remove `1` space
3:11: Unexpected `1` space between cell edge and content, expected `0` spaces, remove `1` space
5:3: Unexpected `1` space between cell edge and content, expected `0` spaces, remove `1` space
5:10: Unexpected `1` space between cell content and edge, expected `0` spaces, remove `1` space
5:12: Unexpected `1` space between cell edge and content, expected `0` spaces, remove `1` space
5:19: Unexpected `1` space between cell content and edge, expected `0` spaces, remove `1` space
6:3: Unexpected `1` space between cell edge and content, expected `0` spaces, remove `1` space
6:10: Unexpected `1` space between cell content and edge, expected `0` spaces, remove `1` space
6:12: Unexpected `1` space between cell edge and content, expected `0` spaces, remove `1` space
6:19: Unexpected `1` space between cell content and edge, expected `0` spaces, remove `1` space
7:3: Unexpected `1` space between cell edge and content, expected `0` spaces, remove `1` space
7:10: Unexpected `2` spaces between cell content and edge, expected between `0` (unaligned) and `1` (aligned) space, remove between `1` and `2` spaces
7:12: Unexpected `1` space between cell edge and content, expected `0` spaces, remove `1` space
7:19: Unexpected `6` spaces between cell content and edge, expected between `0` (unaligned) and `5` (aligned) spaces, remove between `1` and `6` spaces
```

##### `nothing.md`

When configured with `'compact'`.

###### In

> 👉 **Note**: this example uses
> GFM ([`remark-gfm`][github-remark-gfm]).

```markdown
|   |   |   |
| - | - | - |
|   |   |   |
```

###### Out

```text
1:5: Unexpected `3` spaces between cell edge and content, expected between `0` (unaligned) and `1` (aligned) space, remove between `2` and `3` spaces
1:9: Unexpected `3` spaces between cell edge and content, expected between `0` (unaligned) and `1` (aligned) space, remove between `2` and `3` spaces
1:13: Unexpected `3` spaces between cell edge and content, expected between `0` (unaligned) and `1` (aligned) space, remove between `2` and `3` spaces
2:3: Unexpected `1` space between cell edge and content, expected `0` spaces, remove `1` space
2:5: Unexpected `1` space between cell content and edge, expected `0` spaces, remove `1` space
2:7: Unexpected `1` space between cell edge and content, expected `0` spaces, remove `1` space
2:9: Unexpected `1` space between cell content and edge, expected `0` spaces, remove `1` space
2:11: Unexpected `1` space between cell edge and content, expected `0` spaces, remove `1` space
2:13: Unexpected `1` space between cell content and edge, expected `0` spaces, remove `1` space
3:5: Unexpected `3` spaces between cell edge and content, expected between `0` (unaligned) and `1` (aligned) space, remove between `2` and `3` spaces
3:9: Unexpected `3` spaces between cell edge and content, expected between `0` (unaligned) and `1` (aligned) space, remove between `2` and `3` spaces
3:13: Unexpected `3` spaces between cell edge and content, expected between `0` (unaligned) and `1` (aligned) space, remove between `2` and `3` spaces
```

##### `nothing.md`

When configured with `'padded'`.

###### In

> 👉 **Note**: this example uses
> GFM ([`remark-gfm`][github-remark-gfm]).

```markdown
||||
|-|-|-|
||||
```

###### Out

```text
1:2: Unexpected `0` spaces between cell edge and content, expected between `1` (unaligned) and `3` (aligned) spaces, add between `3` and `1` space
1:3: Unexpected `0` spaces between cell edge and content, expected between `1` (unaligned) and `3` (aligned) spaces, add between `3` and `1` space
1:4: Unexpected `0` spaces between cell edge and content, expected between `1` (unaligned) and `3` (aligned) spaces, add between `3` and `1` space
2:2: Unexpected `0` spaces between cell edge and content, expected `1` space, add `1` space
2:3: Unexpected `0` spaces between cell content and edge, expected `1` space, add `1` space
2:4: Unexpected `0` spaces between cell edge and content, expected `1` space, add `1` space
2:5: Unexpected `0` spaces between cell content and edge, expected `1` space, add `1` space
2:6: Unexpected `0` spaces between cell edge and content, expected `1` space, add `1` space
2:7: Unexpected `0` spaces between cell content and edge, expected `1` space, add `1` space
3:2: Unexpected `0` spaces between cell edge and content, expected between `1` (unaligned) and `3` (aligned) spaces, add between `3` and `1` space
3:3: Unexpected `0` spaces between cell edge and content, expected between `1` (unaligned) and `3` (aligned) spaces, add between `3` and `1` space
3:4: Unexpected `0` spaces between cell edge and content, expected between `1` (unaligned) and `3` (aligned) spaces, add between `3` and `1` space
```

##### `more-weirdness.md`

When configured with `'padded'`.

###### In

> 👉 **Note**: this example uses
> GFM ([`remark-gfm`][github-remark-gfm]).

```markdown
Mercury
|-

Venus
-|
```

###### Out

```text
2:2: Unexpected `0` spaces between cell edge and content, expected `1` space, add `1` space
5:2: Unexpected `0` spaces between cell content and edge, expected between `1` (unaligned) and `5` (aligned) spaces, add between `5` and `1` space
```

##### `containers.md`

When configured with `'padded'`.

###### In

> 👉 **Note**: this example uses
> GFM ([`remark-gfm`][github-remark-gfm]).

```markdown
> | Mercury|
> | - |

* | Venus|
  | - |

> * > | Earth|
>   > | - |
```

###### Out

```text
1:12: Unexpected `0` spaces between cell content and edge, expected `1` space, add `1` space
4:10: Unexpected `0` spaces between cell content and edge, expected `1` space, add `1` space
7:14: Unexpected `0` spaces between cell content and edge, expected `1` space, add `1` space
```

##### `windows.md`

When configured with `'padded'`.

###### In

> 👉 **Note**: this example uses
> GFM ([`remark-gfm`][github-remark-gfm]).

```markdown
| Mercury|␍␊| --- |␍␊| None |
```

###### Out

```text
1:10: Unexpected `0` spaces between cell content and edge, expected `1` space, add `1` space
```

##### `not-ok.md`

When configured with `'🌍'`.

###### Out

```text
1:1: Unexpected value `🌍` for `options`, expected `'compact'`, `'padded'`, or `'consistent'`
```

## Compatibility

Projects maintained by the unified collective are compatible with maintained
versions of Node.js.

When we cut a new major release, we drop support for unmaintained versions of
Node.
This means we try to keep the current release line,
`remark-lint-table-cell-padding@5`,
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

[api-remark-lint-table-cell-padding]: #unifieduseremarklinttablecellpadding-options

[api-style]: #style

[author]: https://wooorm.com

[badge-build-image]: https://github.com/remarkjs/remark-lint/workflows/main/badge.svg

[badge-build-url]: https://github.com/remarkjs/remark-lint/actions

[badge-chat-image]: https://img.shields.io/badge/chat-discussions-success.svg

[badge-chat-url]: https://github.com/remarkjs/remark/discussions

[badge-coverage-image]: https://img.shields.io/codecov/c/github/remarkjs/remark-lint.svg

[badge-coverage-url]: https://codecov.io/github/remarkjs/remark-lint

[badge-downloads-image]: https://img.shields.io/npm/dm/remark-lint-table-cell-padding.svg

[badge-downloads-url]: https://www.npmjs.com/package/remark-lint-table-cell-padding

[badge-funding-backers-image]: https://opencollective.com/unified/backers/badge.svg

[badge-funding-sponsors-image]: https://opencollective.com/unified/sponsors/badge.svg

[badge-funding-url]: https://opencollective.com/unified

[badge-size-image]: https://img.shields.io/bundlejs/size/remark-lint-table-cell-padding

[badge-size-url]: https://bundlejs.com/?q=remark-lint-table-cell-padding

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

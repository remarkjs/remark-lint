<!--This file is generated-->

# remark-lint-table-cell-padding

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

[`remark-lint`][mono] rule to warn when table cells are inconsistently padded.

## Contents

*   [What is this?](#what-is-this)
*   [When should I use this?](#when-should-i-use-this)
*   [Presets](#presets)
*   [Install](#install)
*   [Use](#use)
*   [API](#api)
    *   [`unified().use(remarkLintTableCellPadding[, config])`](#unifieduseremarklinttablecellpadding-config)
*   [Recommendation](#recommendation)
*   [Fix](#fix)
*   [Examples](#examples)
*   [Compatibility](#compatibility)
*   [Contribute](#contribute)
*   [License](#license)

## What is this?

This package is a [unified][] ([remark][]) plugin, specifically a `remark-lint`
rule.
Lint rules check markdown code style.

## When should I use this?

You can use this package to check that table cells are padded consistently.
Tables are a GFM feature enabled with
[`remark-gfm`](https://github.com/remarkjs/remark-gfm).

## Presets

This rule is included in the following presets:

| Preset | Setting |
| - | - |
| [`remark-preset-lint-consistent`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-preset-lint-consistent) | `'consistent'` |
| [`remark-preset-lint-markdown-style-guide`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-preset-lint-markdown-style-guide) | `'padded'` |

## Install

This package is [ESM only][esm].
In Node.js (version 12.20+, 14.14+, or 16.0+), install with [npm][]:

```sh
npm install remark-lint-table-cell-padding
```

In Deno with [Skypack][]:

```js
import remarkLintTableCellPadding from 'https://cdn.skypack.dev/remark-lint-table-cell-padding@4?dts'
```

In browsers with [Skypack][]:

```html
<script type="module">
  import remarkLintTableCellPadding from 'https://cdn.skypack.dev/remark-lint-table-cell-padding@4?min'
</script>
```

## Use

On the API:

```js
import {read} from 'to-vfile'
import {reporter} from 'vfile-reporter'
import {remark} from 'remark'
import remarkLint from 'remark-lint'
import remarkLintTableCellPadding from 'remark-lint-table-cell-padding'

main()

async function main() {
  const file = await remark()
    .use(remarkLint)
    .use(remarkLintTableCellPadding)
    .process(await read('example.md'))

  console.error(reporter(file))
}
```

On the CLI:

```sh
remark --use remark-lint --use remark-lint-table-cell-padding example.md
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
The default export is `remarkLintTableCellPadding`.

### `unified().use(remarkLintTableCellPadding[, config])`

This rule supports standard configuration that all remark lint rules accept
(such as `false` to turn it off or `[1, options]` to configure it).

The following options (default: `'consistent'`) are accepted:

*   `'padded'`
    — prefer at least one space between pipes and content
*   `'compact'`
    — prefer zero spaces between pipes and content
*   `'consistent'`
    — detect the first used style and warn when further tables differ

## Recommendation

It’s recommended to use at least one space between pipes and content for
legibility of the markup (`'padded'`).

## Fix

[`remark-gfm`](https://github.com/remarkjs/remark-gfm)
formats all table cells as padded by default.
Pass
[`tableCellPadding: false`](https://github.com/remarkjs/remark-gfm#optionstablecellpadding)
to use a more compact style.

## Examples

##### `ok.md`

When configured with `'padded'`.

###### In

> 👉 **Note**: this example uses GFM ([`remark-gfm`][gfm]).

```markdown
| A     | B     |
| ----- | ----- |
| Alpha | Bravo |
```

###### Out

No messages.

##### `not-ok.md`

When configured with `'padded'`.

###### In

> 👉 **Note**: this example uses GFM ([`remark-gfm`][gfm]).

```markdown
| A    |    B |
| :----|----: |
| Alpha|Bravo |

| C      |    D |
| :----- | ---: |
|Charlie | Delta|

Too much padding isn’t good either:

| E     | F        |   G    |      H |
| :---- | -------- | :----: | -----: |
| Echo  | Foxtrot  |  Golf  |  Hotel |
```

###### Out

```text
3:8: Cell should be padded
3:9: Cell should be padded
7:2: Cell should be padded
7:17: Cell should be padded
13:9: Cell should be padded with 1 space, not 2
13:20: Cell should be padded with 1 space, not 2
13:21: Cell should be padded with 1 space, not 2
13:29: Cell should be padded with 1 space, not 2
13:30: Cell should be padded with 1 space, not 2
```

##### `empty.md`

When configured with `'padded'`.

###### In

> 👉 **Note**: this example uses GFM ([`remark-gfm`][gfm]).

```markdown
<!-- Empty cells are OK, but those surrounding them may not be. -->

|        | Alpha | Bravo|
| ------ | ----- | ---: |
| Charlie|       |  Echo|
```

###### Out

```text
3:25: Cell should be padded
5:10: Cell should be padded
5:25: Cell should be padded
```

##### `missing-body.md`

When configured with `'padded'`.

###### In

> 👉 **Note**: this example uses GFM ([`remark-gfm`][gfm]).

```markdown
<!-- Missing cells are fine as well. -->

| Alpha | Bravo   | Charlie |
| ----- | ------- | ------- |
| Delta |
| Echo  | Foxtrot |
```

###### Out

No messages.

##### `ok.md`

When configured with `'compact'`.

###### In

> 👉 **Note**: this example uses GFM ([`remark-gfm`][gfm]).

```markdown
|A    |B    |
|-----|-----|
|Alpha|Bravo|
```

###### Out

No messages.

##### `not-ok.md`

When configured with `'compact'`.

###### In

> 👉 **Note**: this example uses GFM ([`remark-gfm`][gfm]).

```markdown
|   A    | B    |
|   -----| -----|
|   Alpha| Bravo|

|C      |     D|
|:------|-----:|
|Charlie|Delta |
```

###### Out

```text
3:2: Cell should be compact
3:11: Cell should be compact
7:16: Cell should be compact
```

##### `ok-padded.md`

When configured with `'consistent'`.

###### In

> 👉 **Note**: this example uses GFM ([`remark-gfm`][gfm]).

```markdown
| A     | B     |
| ----- | ----- |
| Alpha | Bravo |

| C       | D     |
| ------- | ----- |
| Charlie | Delta |
```

###### Out

No messages.

##### `not-ok-padded.md`

When configured with `'consistent'`.

###### In

> 👉 **Note**: this example uses GFM ([`remark-gfm`][gfm]).

```markdown
| A     | B     |
| ----- | ----- |
| Alpha | Bravo |

| C      |     D |
| :----- | ----: |
|Charlie | Delta |
```

###### Out

```text
7:2: Cell should be padded
```

##### `ok-compact.md`

When configured with `'consistent'`.

###### In

> 👉 **Note**: this example uses GFM ([`remark-gfm`][gfm]).

```markdown
|A    |B    |
|-----|-----|
|Alpha|Bravo|

|C      |D    |
|-------|-----|
|Charlie|Delta|
```

###### Out

No messages.

##### `not-ok-compact.md`

When configured with `'consistent'`.

###### In

> 👉 **Note**: this example uses GFM ([`remark-gfm`][gfm]).

```markdown
|A    |B    |
|-----|-----|
|Alpha|Bravo|

|C      |     D|
|:------|-----:|
|Charlie|Delta |
```

###### Out

```text
7:16: Cell should be compact
```

##### `not-ok.md`

When configured with `'💩'`.

###### Out

```text
1:1: Incorrect table cell padding style `💩`, expected `'padded'`, `'compact'`, or `'consistent'`
```

## Compatibility

Projects maintained by the unified collective are compatible with all maintained
versions of Node.js.
As of now, that is Node.js 12.20+, 14.14+, and 16.0+.
Our projects sometimes work with older versions, but this is not guaranteed.

## Contribute

See [`contributing.md`][contributing] in [`remarkjs/.github`][health] for ways
to get started.
See [`support.md`][support] for ways to get help.

This project has a [code of conduct][coc].
By interacting with this repository, organization, or community you agree to
abide by its terms.

## License

[MIT][license] © [Titus Wormer][author]

[build-badge]: https://github.com/remarkjs/remark-lint/workflows/main/badge.svg

[build]: https://github.com/remarkjs/remark-lint/actions

[coverage-badge]: https://img.shields.io/codecov/c/github/remarkjs/remark-lint.svg

[coverage]: https://codecov.io/github/remarkjs/remark-lint

[downloads-badge]: https://img.shields.io/npm/dm/remark-lint-table-cell-padding.svg

[downloads]: https://www.npmjs.com/package/remark-lint-table-cell-padding

[size-badge]: https://img.shields.io/bundlephobia/minzip/remark-lint-table-cell-padding.svg

[size]: https://bundlephobia.com/result?p=remark-lint-table-cell-padding

[sponsors-badge]: https://opencollective.com/unified/sponsors/badge.svg

[backers-badge]: https://opencollective.com/unified/backers/badge.svg

[collective]: https://opencollective.com/unified

[chat-badge]: https://img.shields.io/badge/chat-discussions-success.svg

[chat]: https://github.com/remarkjs/remark/discussions

[unified]: https://github.com/unifiedjs/unified

[remark]: https://github.com/remarkjs/remark

[mono]: https://github.com/remarkjs/remark-lint

[esm]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c

[skypack]: https://www.skypack.dev

[npm]: https://docs.npmjs.com/cli/install

[health]: https://github.com/remarkjs/.github

[contributing]: https://github.com/remarkjs/.github/blob/main/contributing.md

[support]: https://github.com/remarkjs/.github/blob/main/support.md

[coc]: https://github.com/remarkjs/.github/blob/main/code-of-conduct.md

[license]: https://github.com/remarkjs/remark-lint/blob/main/license

[author]: https://wooorm.com

[gfm]: https://github.com/remarkjs/remark-gfm

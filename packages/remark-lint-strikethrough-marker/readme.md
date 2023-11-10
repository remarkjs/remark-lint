<!--This file is generated-->

# remark-lint-strikethrough-marker

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

[`remark-lint`][mono] rule to warn when the number of strikethrough markers
is inconsistent.

## Contents

* [What is this?](#what-is-this)
* [When should I use this?](#when-should-i-use-this)
* [Presets](#presets)
* [Install](#install)
* [Use](#use)
* [API](#api)
  * [`unified().use(remarkLintStrikethroughMarker[, config])`](#unifieduseremarklintstrikethroughmarker-config)
* [Recommendation](#recommendation)
* [Fix](#fix)
* [Examples](#examples)
* [Compatibility](#compatibility)
* [Contribute](#contribute)
* [License](#license)

## What is this?

This package is a [unified][] ([remark][]) plugin, specifically a `remark-lint`
rule.
Lint rules check markdown code style.

## When should I use this?

You can use this package to check that the number of strikethrough
markers is consistent.
Strikethrough is a GFM feature enabled with
[`remark-gfm`](https://github.com/remarkjs/remark-gfm).

## Presets

This rule is not included in a preset maintained here.

## Install

This package is [ESM only][esm].
In Node.js (version 12.20+, 14.14+, or 16.0+), install with [npm][]:

```sh
npm install remark-lint-strikethrough-marker
```

In Deno with [`esm.sh`][esmsh]:

```js
import remarkLintStrikethroughMarker from 'https://esm.sh/remark-lint-strikethrough-marker@2'
```

In browsers with [`esm.sh`][esmsh]:

```html
<script type="module">
  import remarkLintStrikethroughMarker from 'https://esm.sh/remark-lint-strikethrough-marker@2?bundle'
</script>
```

## Use

On the API:

```js
import {read} from 'to-vfile'
import {reporter} from 'vfile-reporter'
import {remark} from 'remark'
import remarkLint from 'remark-lint'
import remarkLintStrikethroughMarker from 'remark-lint-strikethrough-marker'

main()

async function main() {
  const file = await remark()
    .use(remarkLint)
    .use(remarkLintStrikethroughMarker)
    .process(await read('example.md'))

  console.error(reporter(file))
}
```

On the CLI:

```sh
remark --use remark-lint --use remark-lint-strikethrough-marker example.md
```

On the CLI in a config file (here a `package.json`):

```diff
 …
 "remarkConfig": {
   "plugins": [
     …
     "remark-lint",
+    "remark-lint-strikethrough-marker",
     …
   ]
 }
 …
```

## API

This package exports no identifiers.
The default export is `remarkLintStrikethroughMarker`.

### `unified().use(remarkLintStrikethroughMarker[, config])`

This rule supports standard configuration that all remark lint rules accept
(such as `false` to turn it off or `[1, options]` to configure it).

The following options (default: `'consistent'`) are accepted:

* `'~'`
  — prefer one strikethrough marker
* `'~~'`
  — prefer two strikethrough markers
* `'consistent'`
  — detect the first used style and warn when further strikethrough differs

## Recommendation

GitHub flavored markdown (GFM) specifies that two tildes should be used,
but `github.com` allows one tilde everywhere.
It’s recommended to use two tildes.

## Fix

[`remark-gfm`](https://github.com/remarkjs/remark-gfm)
formats all strikethrough with two tildes.

## Examples

##### `ok.md`

When configured with `'~'`.

###### In

> 👉 **Note**: this example uses GFM ([`remark-gfm`][gfm]).

```markdown
~foo~
```

###### Out

No messages.

##### `not-ok.md`

When configured with `'~'`.

###### In

> 👉 **Note**: this example uses GFM ([`remark-gfm`][gfm]).

```markdown
~~foo~~
```

###### Out

```text
1:1-1:8: Strikethrough should use `~` as a marker
```

##### `ok.md`

When configured with `'~~'`.

###### In

> 👉 **Note**: this example uses GFM ([`remark-gfm`][gfm]).

```markdown
~~foo~~
```

###### Out

No messages.

##### `not-ok.md`

When configured with `'~~'`.

###### In

> 👉 **Note**: this example uses GFM ([`remark-gfm`][gfm]).

```markdown
~foo~
```

###### Out

```text
1:1-1:6: Strikethrough should use `~~` as a marker
```

##### `not-ok.md`

###### In

> 👉 **Note**: this example uses GFM ([`remark-gfm`][gfm]).

```markdown
~~foo~~
~bar~
```

###### Out

```text
2:1-2:6: Strikethrough should use `~~` as a marker
```

##### `not-ok.md`

When configured with `'💩'`.

###### Out

```text
1:1: Incorrect strikethrough marker `💩`: use either `'consistent'`, `'~'`, or `'~~'`
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

[downloads-badge]: https://img.shields.io/npm/dm/remark-lint-strikethrough-marker.svg

[downloads]: https://www.npmjs.com/package/remark-lint-strikethrough-marker

[size-badge]: https://img.shields.io/bundlephobia/minzip/remark-lint-strikethrough-marker.svg

[size]: https://bundlephobia.com/result?p=remark-lint-strikethrough-marker

[sponsors-badge]: https://opencollective.com/unified/sponsors/badge.svg

[backers-badge]: https://opencollective.com/unified/backers/badge.svg

[collective]: https://opencollective.com/unified

[chat-badge]: https://img.shields.io/badge/chat-discussions-success.svg

[chat]: https://github.com/remarkjs/remark/discussions

[unified]: https://github.com/unifiedjs/unified

[remark]: https://github.com/remarkjs/remark

[mono]: https://github.com/remarkjs/remark-lint

[esm]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c

[esmsh]: https://esm.sh

[npm]: https://docs.npmjs.com/cli/install

[health]: https://github.com/remarkjs/.github

[contributing]: https://github.com/remarkjs/.github/blob/main/contributing.md

[support]: https://github.com/remarkjs/.github/blob/main/support.md

[coc]: https://github.com/remarkjs/.github/blob/main/code-of-conduct.md

[license]: https://github.com/remarkjs/remark-lint/blob/main/license

[author]: https://wooorm.com

[gfm]: https://github.com/remarkjs/remark-gfm

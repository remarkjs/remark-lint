<!--This file is generated-->

# remark-lint-checkbox-character-style

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

[`remark-lint`][mono] rule to warn when list item checkboxes violate a given
style.

## Contents

*   [What is this?](#what-is-this)
*   [When should I use this?](#when-should-i-use-this)
*   [Presets](#presets)
*   [Install](#install)
*   [Use](#use)
*   [API](#api)
    *   [`unified().use(remarkLintCheckboxCharacterStyle[, config])`](#unifieduseremarklintcheckboxcharacterstyle-config)
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

You can use this package to check that the style of GFM tasklists is
consistent.

## Presets

This rule is included in the following presets:

| Preset | Setting |
| - | - |
| [`remark-preset-lint-consistent`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-preset-lint-consistent) | `'consistent'` |

## Install

This package is [ESM only][esm].
In Node.js (version 12.20+, 14.14+, or 16.0+), install with [npm][]:

```sh
npm install remark-lint-checkbox-character-style
```

In Deno with [Skypack][]:

```js
import remarkLintCheckboxCharacterStyle from 'https://cdn.skypack.dev/remark-lint-checkbox-character-style@4?dts'
```

In browsers with [Skypack][]:

```html
<script type="module">
  import remarkLintCheckboxCharacterStyle from 'https://cdn.skypack.dev/remark-lint-checkbox-character-style@4?min'
</script>
```

## Use

On the API:

```js
import {read} from 'to-vfile'
import {reporter} from 'vfile-reporter'
import {remark} from 'remark'
import remarkLint from 'remark-lint'
import remarkLintCheckboxCharacterStyle from 'remark-lint-checkbox-character-style'

main()

async function main() {
  const file = await remark()
    .use(remarkLint)
    .use(remarkLintCheckboxCharacterStyle)
    .process(await read('example.md'))

  console.error(reporter(file))
}
```

On the CLI:

```sh
remark --use remark-lint --use remark-lint-checkbox-character-style example.md
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
The default export is `remarkLintCheckboxCharacterStyle`.

### `unified().use(remarkLintCheckboxCharacterStyle[, config])`

This rule supports standard configuration that all remark lint rules accept
(such as `false` to turn it off or `[1, options]` to configure it).

The following options (default: `'consistent'`) are accepted:

*   `Object` with the following fields:
    *   `checked` (`'x'`, `'X'`, or `'consistent'`, default: `'consistent'`)
        — preferred character to use for checked checkboxes
    *   `unchecked` (`'·'` (a space), `'»'` (a tab), or `'consistent'`,
        default: `'consistent'`)
        — preferred character to use for unchecked checkboxes
*   `'consistent'`
    — detect the first used styles and warn when further checkboxes differ

## Recommendation

It’s recommended to set `options.checked` to `'x'` (a lowercase X) as it
prevents an extra keyboard press and `options.unchecked` to `'·'` (a space)
to make all checkboxes align.

## Fix

[`remark-stringify`](https://github.com/remarkjs/remark/tree/main/packages/remark-stringify)
formats checked checkboxes using `'x'` (lowercase X) and unchecked checkboxes
using `'·'` (a space).

## Examples

##### `ok.md`

When configured with `{ checked: 'x' }`.

###### In

> 👉 **Note**: this example uses GFM ([`remark-gfm`][gfm]).

```markdown
- [x] List item
- [x] List item
```

###### Out

No messages.

##### `ok.md`

When configured with `{ checked: 'X' }`.

###### In

> 👉 **Note**: this example uses GFM ([`remark-gfm`][gfm]).

```markdown
- [X] List item
- [X] List item
```

###### Out

No messages.

##### `ok.md`

When configured with `{ unchecked: ' ' }`.

###### In

> 👉 **Note**: this example uses GFM ([`remark-gfm`][gfm]).

> 👉 **Note**: `·` represents a space.

```markdown
- [ ] List item
- [ ] List item
- [ ]··
- [ ]
```

###### Out

No messages.

##### `ok.md`

When configured with `{ unchecked: '\t' }`.

###### In

> 👉 **Note**: this example uses GFM ([`remark-gfm`][gfm]).

> 👉 **Note**: `»` represents a tab.

```markdown
- [»] List item
- [»] List item
```

###### Out

No messages.

##### `not-ok.md`

###### In

> 👉 **Note**: this example uses GFM ([`remark-gfm`][gfm]).

> 👉 **Note**: `»` represents a tab.

```markdown
- [x] List item
- [X] List item
- [ ] List item
- [»] List item
```

###### Out

```text
2:5: Checked checkboxes should use `x` as a marker
4:5: Unchecked checkboxes should use ` ` as a marker
```

##### `not-ok.md`

When configured with `{ unchecked: '💩' }`.

###### Out

```text
1:1: Incorrect unchecked checkbox marker `💩`: use either `'\t'`, or `' '`
```

##### `not-ok.md`

When configured with `{ checked: '💩' }`.

###### Out

```text
1:1: Incorrect checked checkbox marker `💩`: use either `'x'`, or `'X'`
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

[downloads-badge]: https://img.shields.io/npm/dm/remark-lint-checkbox-character-style.svg

[downloads]: https://www.npmjs.com/package/remark-lint-checkbox-character-style

[size-badge]: https://img.shields.io/bundlephobia/minzip/remark-lint-checkbox-character-style.svg

[size]: https://bundlephobia.com/result?p=remark-lint-checkbox-character-style

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

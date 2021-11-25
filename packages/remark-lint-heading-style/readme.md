<!--This file is generated-->

# remark-lint-heading-style

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

[`remark-lint`][mono] rule to warn when headings violate a given style.

## Contents

*   [What is this?](#what-is-this)
*   [When should I use this?](#when-should-i-use-this)
*   [Presets](#presets)
*   [Install](#install)
*   [Use](#use)
*   [API](#api)
    *   [`unified().use(remarkLintHeadingStyle[, config])`](#unifieduseremarklintheadingstyle-config)
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

You can use this package to check that headings are consistent.

## Presets

This rule is included in the following presets:

| Preset | Setting |
| - | - |
| [`remark-preset-lint-consistent`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-preset-lint-consistent) | `'consistent'` |
| [`remark-preset-lint-markdown-style-guide`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-preset-lint-markdown-style-guide) | `'atx'` |

## Install

This package is [ESM only][esm].
In Node.js (version 12.20+, 14.14+, or 16.0+), install with [npm][]:

```sh
npm install remark-lint-heading-style
```

In Deno with [Skypack][]:

```js
import remarkLintHeadingStyle from 'https://cdn.skypack.dev/remark-lint-heading-style@3?dts'
```

In browsers with [Skypack][]:

```html
<script type="module">
  import remarkLintHeadingStyle from 'https://cdn.skypack.dev/remark-lint-heading-style@3?min'
</script>
```

## Use

On the API:

```js
import {read} from 'to-vfile'
import {reporter} from 'vfile-reporter'
import {remark} from 'remark'
import remarkLint from 'remark-lint'
import remarkLintHeadingStyle from 'remark-lint-heading-style'

main()

async function main() {
  const file = await remark()
    .use(remarkLint)
    .use(remarkLintHeadingStyle)
    .process(await read('example.md'))

  console.error(reporter(file))
}
```

On the CLI:

```sh
remark --use remark-lint --use remark-lint-heading-style example.md
```

On the CLI in a config file (here a `package.json`):

```diff
 …
 "remarkConfig": {
   "plugins": [
     …
     "remark-lint",
+    "remark-lint-heading-style",
     …
   ]
 }
 …
```

## API

This package exports no identifiers.
The default export is `remarkLintHeadingStyle`.

### `unified().use(remarkLintHeadingStyle[, config])`

This rule supports standard configuration that all remark lint rules accept
(such as `false` to turn it off or `[1, options]` to configure it).

The following options (default: `'consistent'`) are accepted:

*   `'atx'`
    — prefer ATX headings:
    ```markdown
    ## Hello
    ```
*   `'atx-closed'`
    — prefer ATX headings with a closing sequence:
    ```markdown
    ## Hello ##
    ```
*   `'setext'`
    — prefer setext headings:
    ```markdown
    Hello
    -----
    ```
*   `'consistent'`
    — detect the first used style and warn when further headings differ

## Recommendation

Setext headings are limited in that they can only construct headings with a
rank of one and two.
On the other hand, they do allow multiple lines of content whereas ATX only
allows one line.
The number of used markers in their underline does not matter, leading to
either:

*   1 marker (`Hello\n-`), which is the bare minimum, and for rank 2 headings
    looks suspiciously like an empty list item
*   using as many markers as the content (`Hello\n-----`), which is hard to
    maintain
*   an arbitrary number (`Hello\n---`), which for rank 2 headings looks
    suspiciously like a thematic break

Setext headings are also rather uncommon.
Using a sequence of hashes at the end of ATX headings is even more uncommon.
Due to this, it’s recommended to prefer ATX headings.

## Fix

[`remark-stringify`](https://github.com/remarkjs/remark/tree/main/packages/remark-stringify)
formats headings as ATX by default.
The other styles can be configured with
[`setext: true`](https://github.com/remarkjs/remark/tree/main/packages/remark-stringify#optionssetext)
or
[`closeAtx: true`](https://github.com/remarkjs/remark/tree/main/packages/remark-stringify#optionscloseatx).

## Examples

##### `ok.md`

When configured with `'atx'`.

###### In

```markdown
# Alpha

## Bravo

### Charlie
```

###### Out

No messages.

##### `ok.md`

When configured with `'atx-closed'`.

###### In

```markdown
# Delta ##

## Echo ##

### Foxtrot ###
```

###### Out

No messages.

##### `ok.md`

When configured with `'setext'`.

###### In

```markdown
Golf
====

Hotel
-----

### India
```

###### Out

No messages.

##### `not-ok.md`

###### In

```markdown
Juliett
=======

## Kilo

### Lima ###
```

###### Out

```text
4:1-4:8: Headings should use setext
6:1-6:13: Headings should use setext
```

##### `not-ok.md`

When configured with `'💩'`.

###### Out

```text
1:1: Incorrect heading style type `💩`: use either `'consistent'`, `'atx'`, `'atx-closed'`, or `'setext'`
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

[downloads-badge]: https://img.shields.io/npm/dm/remark-lint-heading-style.svg

[downloads]: https://www.npmjs.com/package/remark-lint-heading-style

[size-badge]: https://img.shields.io/bundlephobia/minzip/remark-lint-heading-style.svg

[size]: https://bundlephobia.com/result?p=remark-lint-heading-style

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

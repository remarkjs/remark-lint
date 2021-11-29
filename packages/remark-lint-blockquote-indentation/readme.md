<!--This file is generated-->

# remark-lint-blockquote-indentation

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

[`remark-lint`][mono] rule to warn when block quotes are indented too much or
too little.

## Contents

*   [What is this?](#what-is-this)
*   [When should I use this?](#when-should-i-use-this)
*   [Presets](#presets)
*   [Install](#install)
*   [Use](#use)
*   [API](#api)
    *   [`unified().use(remarkLintBlockquoteIndentation[, config])`](#unifieduseremarklintblockquoteindentation-config)
*   [Recommendation](#recommendation)
*   [Examples](#examples)
*   [Compatibility](#compatibility)
*   [Contribute](#contribute)
*   [License](#license)

## What is this?

This package is a [unified][] ([remark][]) plugin, specifically a `remark-lint`
rule.
Lint rules check markdown code style.

## When should I use this?

You can use this package to check that the “indent” of block quotes is
consistent.
Indent here is the `>` (greater than) marker and the spaces before content.

## Presets

This rule is included in the following presets:

| Preset | Setting |
| - | - |
| [`remark-preset-lint-consistent`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-preset-lint-consistent) | `'consistent'` |
| [`remark-preset-lint-markdown-style-guide`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-preset-lint-markdown-style-guide) | `2` |

## Install

This package is [ESM only][esm].
In Node.js (version 12.20+, 14.14+, or 16.0+), install with [npm][]:

```sh
npm install remark-lint-blockquote-indentation
```

In Deno with [Skypack][]:

```js
import remarkLintBlockquoteIndentation from 'https://cdn.skypack.dev/remark-lint-blockquote-indentation@3?dts'
```

In browsers with [Skypack][]:

```html
<script type="module">
  import remarkLintBlockquoteIndentation from 'https://cdn.skypack.dev/remark-lint-blockquote-indentation@3?min'
</script>
```

## Use

On the API:

```js
import {read} from 'to-vfile'
import {reporter} from 'vfile-reporter'
import {remark} from 'remark'
import remarkLint from 'remark-lint'
import remarkLintBlockquoteIndentation from 'remark-lint-blockquote-indentation'

main()

async function main() {
  const file = await remark()
    .use(remarkLint)
    .use(remarkLintBlockquoteIndentation)
    .process(await read('example.md'))

  console.error(reporter(file))
}
```

On the CLI:

```sh
remark --use remark-lint --use remark-lint-blockquote-indentation example.md
```

On the CLI in a config file (here a `package.json`):

```diff
 …
 "remarkConfig": {
   "plugins": [
     …
     "remark-lint",
+    "remark-lint-blockquote-indentation",
     …
   ]
 }
 …
```

## API

This package exports no identifiers.
The default export is `remarkLintBlockquoteIndentation`.

### `unified().use(remarkLintBlockquoteIndentation[, config])`

This rule supports standard configuration that all remark lint rules accept
(such as `false` to turn it off or `[1, options]` to configure it).

The following options (default: `'consistent'`) are accepted:

*   `number` (example: `2`)
    — preferred indent of `>` and spaces before content
*   `'consistent'`
    — detect the first used style and warn when further block quotes differ

## Recommendation

CommonMark specifies that when block quotes are used the `>` markers can be
followed by an optional space.
No space at all arguably looks rather ugly:

```markdown
>Mars and
>Venus.
```

There is no specific handling of more that one space, so if 5 spaces were
used after `>`, then indented code kicks in:

```markdown
>     neptune()
```

Due to this, it’s recommended to configure this rule with `2`.

## Examples

##### `ok.md`

When configured with `2`.

###### In

```markdown
> Hello

Paragraph.

> World
```

###### Out

No messages.

##### `ok.md`

When configured with `4`.

###### In

```markdown
>   Hello

Paragraph.

>   World
```

###### Out

No messages.

##### `not-ok.md`

###### In

```markdown
>  Hello

Paragraph.

>   World

Paragraph.

> World
```

###### Out

```text
5:5: Remove 1 space between block quote and content
9:3: Add 1 space between block quote and content
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

[downloads-badge]: https://img.shields.io/npm/dm/remark-lint-blockquote-indentation.svg

[downloads]: https://www.npmjs.com/package/remark-lint-blockquote-indentation

[size-badge]: https://img.shields.io/bundlephobia/minzip/remark-lint-blockquote-indentation.svg

[size]: https://bundlephobia.com/result?p=remark-lint-blockquote-indentation

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

<!--This file is generated-->

# remark-lint-maximum-line-length

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

[`remark-lint`][mono] rule to warn when lines are too long.

## Contents

*   [What is this?](#what-is-this)
*   [When should I use this?](#when-should-i-use-this)
*   [Presets](#presets)
*   [Install](#install)
*   [Use](#use)
*   [API](#api)
    *   [`unified().use(remarkLintMaximumLineLength[, config])`](#unifieduseremarklintmaximumlinelength-config)
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

You can use this package to check that lines do not exceed a certain size.

## Presets

This rule is included in the following presets:

| Preset | Setting |
| - | - |
| [`remark-preset-lint-markdown-style-guide`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-preset-lint-markdown-style-guide) | `80` |

## Install

This package is [ESM only][esm].
In Node.js (version 12.20+, 14.14+, or 16.0+), install with [npm][]:

```sh
npm install remark-lint-maximum-line-length
```

In Deno with [Skypack][]:

```js
import remarkLintMaximumLineLength from 'https://cdn.skypack.dev/remark-lint-maximum-line-length@3?dts'
```

In browsers with [Skypack][]:

```html
<script type="module">
  import remarkLintMaximumLineLength from 'https://cdn.skypack.dev/remark-lint-maximum-line-length@3?min'
</script>
```

## Use

On the API:

```js
import {read} from 'to-vfile'
import {reporter} from 'vfile-reporter'
import {remark} from 'remark'
import remarkLint from 'remark-lint'
import remarkLintMaximumLineLength from 'remark-lint-maximum-line-length'

main()

async function main() {
  const file = await remark()
    .use(remarkLint)
    .use(remarkLintMaximumLineLength)
    .process(await read('example.md'))

  console.error(reporter(file))
}
```

On the CLI:

```sh
remark --use remark-lint --use remark-lint-maximum-line-length example.md
```

On the CLI in a config file (here a `package.json`):

```diff
 …
 "remarkConfig": {
   "plugins": [
     …
     "remark-lint",
+    "remark-lint-maximum-line-length",
     …
   ]
 }
 …
```

## API

This package exports no identifiers.
The default export is `remarkLintMaximumLineLength`.

### `unified().use(remarkLintMaximumLineLength[, config])`

This rule supports standard configuration that all remark lint rules accept
(such as `false` to turn it off or `[1, options]` to configure it).

The following options (default: `80`) are accepted:

*   `number` (example: `72`)
    — max number of characters to accept in heading text

Ignores nodes that cannot be wrapped, such as headings, tables, code,
definitions, HTML, and JSX.
Ignores images, links, and code (inline) if they start before the wrap, end
after the wrap, and there’s no white space after them.

## Recommendation

Whether to wrap prose or not is a stylistic choice.

## Examples

##### `ok-mixed-line-endings.md`

When configured with `10`.

###### In

> 👉 **Note**: `␍␊` represents a carriage return and a line feed.

> 👉 **Note**: `␊` represents a line feed.

```markdown
0123456789␍␊
0123456789␊
01234␍␊
01234␊
```

###### Out

No messages.

##### `not-ok-mixed-line-endings.md`

When configured with `10`.

###### In

> 👉 **Note**: `␍␊` represents a carriage return and a line feed.

> 👉 **Note**: `␊` represents a line feed.

```markdown
012345678901␍␊
012345678901␊
01234567890␍␊
01234567890␊
```

###### Out

```text
1:13: Line must be at most 10 characters
2:13: Line must be at most 10 characters
3:12: Line must be at most 10 characters
4:12: Line must be at most 10 characters
```

##### `not-ok.md`

When configured with `80`.

###### In

```markdown
This line is simply not tooooooooooooooooooooooooooooooooooooooooooooooooooooooo
long.

Just like thiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiis one.

And this one is also very wrong: because the link starts aaaaaaafter the column: <http://line.com>

<http://this-long-url-with-a-long-domain-is-not-ok.co.uk/a-long-path?query=variables> and such.

And this one is also very wrong: because the code starts aaaaaaafter the column: `alpha.bravo()`

`alphaBravoCharlieDeltaEchoFoxtrotGolfHotelIndiaJuliettKiloLimaMikeNovemberOscar.papa()` and such.
```

###### Out

```text
4:86: Line must be at most 80 characters
6:99: Line must be at most 80 characters
8:96: Line must be at most 80 characters
10:97: Line must be at most 80 characters
12:99: Line must be at most 80 characters
```

##### `ok.md`

###### In

> 👉 **Note**: this example uses GFM ([`remark-gfm`][gfm]).

```markdown
This line is simply not toooooooooooooooooooooooooooooooooooooooooooo
long.

This is also fine: <http://this-long-url-with-a-long-domain.co.uk/a-long-path?query=variables>

<http://this-link-is-fine.com>

`alphaBravoCharlieDeltaEchoFoxtrotGolfHotelIndiaJuliettKiloLimaMikeNovemberOscarPapaQuebec.romeo()`

[foo](http://this-long-url-with-a-long-domain-is-ok.co.uk/a-long-path?query=variables)

<http://this-long-url-with-a-long-domain-is-ok.co.uk/a-long-path?query=variables>

![foo](http://this-long-url-with-a-long-domain-is-ok.co.uk/a-long-path?query=variables)

| An | exception | is | line | length | in | long | tables | because | those | can’t | just |
| -- | --------- | -- | ---- | ------ | -- | ---- | ------ | ------- | ----- | ----- | ---- |
| be | helped    |    |      |        |    |      |        |         |       |       | .    |

<a><b><i><p><q><s><u>alpha bravo charlie delta echo foxtrot golf</u></s></q></p></i></b></a>

The following is also fine (note the `.`), because there is no whitespace.

<http://this-long-url-with-a-long-domain-is-ok.co.uk/a-long-path?query=variables>.

In addition, definitions are also fine:

[foo]: <http://this-long-url-with-a-long-domain-is-ok.co.uk/a-long-path?query=variables>
```

###### Out

No messages.

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

[downloads-badge]: https://img.shields.io/npm/dm/remark-lint-maximum-line-length.svg

[downloads]: https://www.npmjs.com/package/remark-lint-maximum-line-length

[size-badge]: https://img.shields.io/bundlephobia/minzip/remark-lint-maximum-line-length.svg

[size]: https://bundlephobia.com/result?p=remark-lint-maximum-line-length

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

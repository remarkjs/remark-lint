<!--This file is generated-->

# remark-lint-maximum-line-length

[![Build][badge-build-image]][badge-build-url]
[![Coverage][badge-coverage-image]][badge-coverage-url]
[![Downloads][badge-downloads-image]][badge-downloads-url]
[![Size][badge-size-image]][badge-size-url]
[![Sponsors][badge-funding-sponsors-image]][badge-funding-url]
[![Backers][badge-funding-backers-image]][badge-funding-url]
[![Chat][badge-chat-image]][badge-chat-url]

[`remark-lint`][github-remark-lint] rule to warn when lines are too long.

## Contents

* [What is this?](#what-is-this)
* [When should I use this?](#when-should-i-use-this)
* [Presets](#presets)
* [Install](#install)
* [Use](#use)
* [API](#api)
  * [`unified().use(remarkLintMaximumLineLength[, options])`](#unifieduseremarklintmaximumlinelength-options)
  * [`Options`](#options)
* [Recommendation](#recommendation)
* [Examples](#examples)
* [Compatibility](#compatibility)
* [Contribute](#contribute)
* [License](#license)

## What is this?

This package checks the length of lines.

## When should I use this?

You can use this package to check that lines are within reason.

## Presets

This plugin is included in the following presets:

| Preset | Options |
| - | - |
| [`remark-preset-lint-markdown-style-guide`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-preset-lint-markdown-style-guide) | `80` |

## Install

This package is [ESM only][github-gist-esm].
In Node.js (version 16+),
install with [npm][npm-install]:

```sh
npm install remark-lint-maximum-line-length
```

In Deno with [`esm.sh`][esm-sh]:

```js
import remarkLintMaximumLineLength from 'https://esm.sh/remark-lint-maximum-line-length@4'
```

In browsers with [`esm.sh`][esm-sh]:

```html
<script type="module">
  import remarkLintMaximumLineLength from 'https://esm.sh/remark-lint-maximum-line-length@4?bundle'
</script>
```

## Use

On the API:

```js
import remarkLint from 'remark-lint'
import remarkLintMaximumLineLength from 'remark-lint-maximum-line-length'
import remarkParse from 'remark-parse'
import remarkStringify from 'remark-stringify'
import {read} from 'to-vfile'
import {unified} from 'unified'
import {reporter} from 'vfile-reporter'

const file = await read('example.md')

await unified()
  .use(remarkParse)
  .use(remarkLint)
  .use(remarkLintMaximumLineLength)
  .use(remarkStringify)
  .process(file)

console.error(reporter(file))
```

On the CLI:

```sh
remark --frail --use remark-lint --use remark-lint-maximum-line-length .
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
It exports the [TypeScript][typescript] type
[`Options`][api-options].
The default export is
[`remarkLintMaximumLineLength`][api-remark-lint-maximum-line-length].

### `unified().use(remarkLintMaximumLineLength[, options])`

Warn when lines are too long.

Nodes that cannot be wrapped are ignored,
such as JSX, HTML, code (flow), definitions, headings, and tables.

When code (phrasing), images, and links start before the wrap,
end after the wrap,
and contain no whitespace,
they are also ignored.

###### Parameters

* `options` ([`Options`][api-options] or `number`, optional)
  — configuration

###### Returns

Transform ([`Transformer` from `unified`][github-unified-transformer]).

### `Options`

Configuration (TypeScript type).

###### Properties

* `size` (`number`, default: `60`)
  — preferred max size
* `stringLength` (`(value: string) => number`, optional)
  — function to detect text size

## Recommendation

Whether to wrap prose or not is a stylistic choice.

To better represent how long lines “look”,
you can pass a `stringLength` function.

## Examples

##### `ok.md`

###### In

```markdown
Mercury mercury mercury mercury mercury mercury mercury mercury mercury mercury
mercury.

Mercury mercury mercury mercury mercury mercury mercury mercury mercury `mercury()`.

Mercury mercury mercury mercury mercury mercury mercury mercury mercury <https://localhost>.

Mercury mercury mercury mercury mercury mercury mercury mercury mercury [mercury](https://localhost).

Mercury mercury mercury mercury mercury mercury mercury mercury mercury ![mercury](https://localhost).

<div>Mercury mercury mercury mercury mercury mercury mercury mercury mercury</div>

[foo]: https://localhost/mercury/mercury/mercury/mercury/mercury/mercury/mercury/mercury
```

###### Out

No messages.

##### `not-ok.md`

When configured with `20`.

###### In

```markdown
Mercury mercury mercury
mercury.

Mercury mercury mercury `mercury()`.

Mercury mercury mercury <https://localhost>.

Mercury mercury mercury [m](example.com).

Mercury mercury mercury ![m](example.com).

`mercury()` mercury mercury mercury.

<https://localhost> mercury.

[m](example.com) mercury.

![m](example.com) mercury.

Mercury mercury ![m](example.com) mercury.
```

###### Out

```text
1:24: Unexpected `23` character line, expected at most `20` characters, remove `3` characters
4:37: Unexpected `36` character line, expected at most `20` characters, remove `16` characters
6:45: Unexpected `44` character line, expected at most `20` characters, remove `24` characters
8:42: Unexpected `41` character line, expected at most `20` characters, remove `21` characters
10:43: Unexpected `42` character line, expected at most `20` characters, remove `22` characters
12:37: Unexpected `36` character line, expected at most `20` characters, remove `16` characters
14:29: Unexpected `28` character line, expected at most `20` characters, remove `8` characters
16:26: Unexpected `25` character line, expected at most `20` characters, remove `5` characters
18:27: Unexpected `26` character line, expected at most `20` characters, remove `6` characters
20:43: Unexpected `42` character line, expected at most `20` characters, remove `22` characters
```

##### `string-length-default.md`

When configured with `40`.

###### In

```markdown
水星是太陽系的八大行星中最小和最靠近太陽的行星。
```

###### Out

No messages.

##### `string-length-custom.md`

When configured with `{ size: 40, stringLength: [Function: stringWidth] }`.

###### In

```markdown
水星是太陽系的八大行星中最小和最靠近太陽的行星。
```

###### Out

```text
1:25: Unexpected `48` character line, expected at most `40` characters, remove `8` characters
```

##### `long-autolinks-ok.md`

When configured with `20`.

###### In

```markdown
<https://localhost/mercury/>

<https://localhost/mercury/>
mercury.

Mercury
<https://localhost/mercury/>.

Mercury
<https://localhost/mercury/>
mercury.

Mercury
<https://localhost/mercury/>
mercury mercury.

Mercury mercury
<https://localhost/mercury/>
mercury mercury.
```

###### Out

No messages.

##### `long-autolinks-nok.md`

When configured with `20`.

###### In

```markdown
<https://localhost/mercury/> mercury.

Mercury <https://localhost/mercury/>.

Mercury
<https://localhost/mercury/> mercury.

Mercury <https://localhost/mercury/>
mercury.
```

###### Out

```text
1:38: Unexpected `37` character line, expected at most `20` characters, remove `17` characters
6:38: Unexpected `37` character line, expected at most `20` characters, remove `17` characters
```

##### `ok.md`

When configured with `20`.

###### In

> 👉 **Note**: this example uses
> frontmatter ([`remark-frontmatter`][github-remark-frontmatter]).

```markdown
---
description: Mercury mercury mercury mercury.
---
```

###### Out

No messages.

##### `ok.md`

When configured with `20`.

###### In

> 👉 **Note**: this example uses
> GFM ([`remark-gfm`][github-remark-gfm]).

```markdown
| Mercury | Mercury | Mercury |
| ------- | ------- | ------- |
```

###### Out

No messages.

##### `ok.md`

When configured with `20`.

###### In

> 👉 **Note**: this example uses
> math ([`remark-math`][github-remark-math]).

```markdown
$$
L = \frac{1}{2} \rho v^2 S C_L
$$
```

###### Out

No messages.

##### `ok.md`

When configured with `20`.

###### In

> 👉 **Note**: this example uses
> MDX ([`remark-mdx`][github-remark-mdx]).

```mdx
export const description = 'Mercury mercury mercury mercury.'

{description}
```

###### Out

No messages.

##### `ok-mixed-line-endings.md`

When configured with `10`.

###### In

```markdown
0123456789␍␊0123456789␊01234␍␊01234␊
```

###### Out

No messages.

##### `not-ok-mixed-line-endings.md`

When configured with `10`.

###### In

```markdown
012345678901␍␊012345678901␊01234567890␍␊01234567890␊
```

###### Out

```text
1:13: Unexpected `12` character line, expected at most `10` characters, remove `2` characters
2:13: Unexpected `12` character line, expected at most `10` characters, remove `2` characters
3:12: Unexpected `11` character line, expected at most `10` characters, remove `1` character
4:12: Unexpected `11` character line, expected at most `10` characters, remove `1` character
```

##### `not-ok.md`

When configured with `'🌍'`.

###### Out

```text
1:1: Unexpected value `🌍` for `size`, expected `number`
```

## Compatibility

Projects maintained by the unified collective are compatible with maintained
versions of Node.js.

When we cut a new major release, we drop support for unmaintained versions of
Node.
This means we try to keep the current release line,
`remark-lint-maximum-line-length@4`,
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

[api-remark-lint-maximum-line-length]: #unifieduseremarklintmaximumlinelength-options

[author]: https://wooorm.com

[badge-build-image]: https://github.com/remarkjs/remark-lint/workflows/main/badge.svg

[badge-build-url]: https://github.com/remarkjs/remark-lint/actions

[badge-chat-image]: https://img.shields.io/badge/chat-discussions-success.svg

[badge-chat-url]: https://github.com/remarkjs/remark/discussions

[badge-coverage-image]: https://img.shields.io/codecov/c/github/remarkjs/remark-lint.svg

[badge-coverage-url]: https://codecov.io/github/remarkjs/remark-lint

[badge-downloads-image]: https://img.shields.io/npm/dm/remark-lint-maximum-line-length.svg

[badge-downloads-url]: https://www.npmjs.com/package/remark-lint-maximum-line-length

[badge-funding-backers-image]: https://opencollective.com/unified/backers/badge.svg

[badge-funding-sponsors-image]: https://opencollective.com/unified/sponsors/badge.svg

[badge-funding-url]: https://opencollective.com/unified

[badge-size-image]: https://img.shields.io/bundlejs/size/remark-lint-maximum-line-length

[badge-size-url]: https://bundlejs.com/?q=remark-lint-maximum-line-length

[esm-sh]: https://esm.sh

[file-license]: https://github.com/remarkjs/remark-lint/blob/main/license

[github-dotfiles-coc]: https://github.com/remarkjs/.github/blob/main/code-of-conduct.md

[github-dotfiles-contributing]: https://github.com/remarkjs/.github/blob/main/contributing.md

[github-dotfiles-health]: https://github.com/remarkjs/.github

[github-dotfiles-support]: https://github.com/remarkjs/.github/blob/main/support.md

[github-gist-esm]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c

[github-remark-frontmatter]: https://github.com/remarkjs/remark-frontmatter

[github-remark-gfm]: https://github.com/remarkjs/remark-gfm

[github-remark-lint]: https://github.com/remarkjs/remark-lint

[github-remark-math]: https://github.com/remarkjs/remark-math

[github-remark-mdx]: https://mdxjs.com/packages/remark-mdx/

[github-unified-transformer]: https://github.com/unifiedjs/unified#transformer

[npm-install]: https://docs.npmjs.com/cli/install

[typescript]: https://www.typescriptlang.org

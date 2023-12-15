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
import remarkLintMaximumLineLength from 'https://esm.sh/remark-lint-maximum-line-length@3'
```

In browsers with [`esm.sh`][esm-sh]:

```html
<script type="module">
  import remarkLintMaximumLineLength from 'https://esm.sh/remark-lint-maximum-line-length@3?bundle'
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
It exports no additional [TypeScript][typescript] types.
The default export is
[`remarkLintMaximumLineLength`][api-remark-lint-maximum-line-length].

### `unified().use(remarkLintMaximumLineLength[, options])`

Warn when lines are too long.

Nodes that cannot be wrapped are ignored, such as JSX, HTML, code (flow),
definitions, headings, and tables.

When code (phrasing), images, and links start before the wrap,
end after the wrap,
and contain no whitespace,
they are also ignored.

###### Parameters

* `options` (`number`, default: `80`)
  — preferred max size

###### Returns

Transform ([`Transformer` from `unified`][github-unified-transformer]).

## Recommendation

Whether to wrap prose or not is a stylistic choice.

## Examples

##### `ok.md`

###### In

> 👉 **Note**: this example uses
> GFM ([`remark-gfm`][github-remark-gfm]).

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
1:13: Line must be at most 10 characters
2:13: Line must be at most 10 characters
3:12: Line must be at most 10 characters
4:12: Line must be at most 10 characters
```

## Compatibility

Projects maintained by the unified collective are compatible with maintained
versions of Node.js.

When we cut a new major release, we drop support for unmaintained versions of
Node.
This means we try to keep the current release line,
`remark-lint-maximum-line-length@3`,
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

[github-remark-gfm]: https://github.com/remarkjs/remark-gfm

[github-remark-lint]: https://github.com/remarkjs/remark-lint

[github-unified-transformer]: https://github.com/unifiedjs/unified#transformer

[npm-install]: https://docs.npmjs.com/cli/install

[typescript]: https://www.typescriptlang.org

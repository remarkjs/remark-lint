<!--This file is generated-->

# remark-lint-no-consecutive-blank-lines

[![Build][badge-build-image]][badge-build-url]
[![Coverage][badge-coverage-image]][badge-coverage-url]
[![Downloads][badge-downloads-image]][badge-downloads-url]
[![Size][badge-size-image]][badge-size-url]
[![Sponsors][badge-funding-sponsors-image]][badge-funding-url]
[![Backers][badge-funding-backers-image]][badge-funding-url]
[![Chat][badge-chat-image]][badge-chat-url]

[`remark-lint`][github-remark-lint] rule to warn when multiple blank lines are used.

## Contents

* [What is this?](#what-is-this)
* [When should I use this?](#when-should-i-use-this)
* [Presets](#presets)
* [Install](#install)
* [Use](#use)
* [API](#api)
  * [`unified().use(remarkLintNoConsecutiveBlankLines)`](#unifieduseremarklintnoconsecutiveblanklines)
* [Recommendation](#recommendation)
* [Fix](#fix)
* [Examples](#examples)
* [Compatibility](#compatibility)
* [Contribute](#contribute)
* [License](#license)

## What is this?

This package checks the number of blank lines.

## When should I use this?

You can use this package to check that there are no unneeded blank lines.

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
npm install remark-lint-no-consecutive-blank-lines
```

In Deno with [`esm.sh`][esm-sh]:

```js
import remarkLintNoConsecutiveBlankLines from 'https://esm.sh/remark-lint-no-consecutive-blank-lines@4'
```

In browsers with [`esm.sh`][esm-sh]:

```html
<script type="module">
  import remarkLintNoConsecutiveBlankLines from 'https://esm.sh/remark-lint-no-consecutive-blank-lines@4?bundle'
</script>
```

## Use

On the API:

```js
import remarkLint from 'remark-lint'
import remarkLintNoConsecutiveBlankLines from 'remark-lint-no-consecutive-blank-lines'
import remarkParse from 'remark-parse'
import remarkStringify from 'remark-stringify'
import {read} from 'to-vfile'
import {unified} from 'unified'
import {reporter} from 'vfile-reporter'

const file = await read('example.md')

await unified()
  .use(remarkParse)
  .use(remarkLint)
  .use(remarkLintNoConsecutiveBlankLines)
  .use(remarkStringify)
  .process(file)

console.error(reporter(file))
```

On the CLI:

```sh
remark --frail --use remark-lint --use remark-lint-no-consecutive-blank-lines .
```

On the CLI in a config file (here a `package.json`):

```diff
 …
 "remarkConfig": {
   "plugins": [
     …
     "remark-lint",
+    "remark-lint-no-consecutive-blank-lines",
     …
   ]
 }
 …
```

## API

This package exports no identifiers.
It exports no additional [TypeScript][typescript] types.
The default export is
[`remarkLintNoConsecutiveBlankLines`][api-remark-lint-no-consecutive-blank-lines].

### `unified().use(remarkLintNoConsecutiveBlankLines)`

Warn when multiple blank lines are used.

###### Parameters

There are no options.

###### Returns

Transform ([`Transformer` from `unified`][github-unified-transformer]).

## Recommendation

More than one blank line has no effect between blocks.

## Fix

[`remark-stringify`][github-remark-stringify] adds exactly one blank line
between any block.
It has a `join` option to configure more complex cases.

## Examples

##### `ok.md`

###### In

```markdown
# Planets

Mercury.

Venus.
```

###### Out

No messages.

##### `not-ok.md`

###### In

```markdown
# Planets


Mercury.



Venus.
```

###### Out

```text
4:1: Unexpected `2` blank lines before node, expected up to `1` blank line, remove `1` blank line
8:1: Unexpected `3` blank lines before node, expected up to `1` blank line, remove `2` blank lines
```

##### `initial.md`

###### In

```markdown
␊Mercury.
```

###### Out

```text
2:1: Unexpected `1` blank line before node, expected `0` blank lines, remove `1` blank line
```

##### `final-one.md`

###### In

```markdown
Mercury.␊
```

###### Out

No messages.

##### `final-more.md`

###### In

```markdown
Mercury.␊␊
```

###### Out

```text
1:9: Unexpected `1` blank line after node, expected `0` blank lines, remove `1` blank line
```

##### `empty-document.md`

###### Out

No messages.

##### `block-quote.md`

###### In

```markdown
> Mercury.

Venus.

>
> Earth.
>
```

###### Out

```text
6:3: Unexpected `1` blank line before node, expected `0` blank lines, remove `1` blank line
6:9: Unexpected `1` blank line after node, expected `0` blank lines, remove `1` blank line
```

##### `directive.md`

###### In

> 👉 **Note**: this example uses
> directives ([`remark-directive`][github-remark-directive]).

```markdown
:::mercury
Venus.


Earth.
:::
```

###### Out

```text
5:1: Unexpected `2` blank lines before node, expected up to `1` blank line, remove `1` blank line
```

##### `footnote.md`

###### In

> 👉 **Note**: this example uses
> GFM ([`remark-gfm`][github-remark-gfm]).

```markdown
[^x]:
    Mercury.

Venus.

[^y]:

    Earth.


    Mars.
```

###### Out

```text
8:5: Unexpected `1` blank line before node, expected `0` blank lines, remove `1` blank line
11:5: Unexpected `2` blank lines before node, expected up to `1` blank line, remove `1` blank line
```

##### `jsx.md`

###### In

> 👉 **Note**: this example uses
> MDX ([`remark-mdx`][github-remark-mdx]).

```mdx
<Mercury>
  Venus.


  Earth.
</Mercury>
```

###### Out

```text
5:3: Unexpected `2` blank lines before node, expected up to `1` blank line, remove `1` blank line
```

##### `list.md`

###### In

```markdown
* Mercury.
* Venus.

***

* Mercury.

* Venus.

***

* Mercury.


* Venus.
```

###### Out

```text
15:1: Unexpected `2` blank lines before node, expected up to `1` blank line, remove `1` blank line
```

##### `list-item.md`

###### In

```markdown
* Mercury.
  Venus.

***

* Mercury.

  Venus.

***

* Mercury.


  Venus.

***

*
  Mercury.
```

###### Out

```text
15:3: Unexpected `2` blank lines before node, expected up to `1` blank line, remove `1` blank line
20:3: Unexpected `1` blank line before node, expected `0` blank lines, remove `1` blank line
```

##### `deep-block-quote.md`

###### In

```markdown
* > * > # Venus␊␊
```

###### Out

```text
1:16: Unexpected `1` blank line after node, expected `0` blank lines, remove `1` blank line
```

##### `deep-list-item.md`

###### In

```markdown
> * > * # Venus␊␊
```

###### Out

```text
1:16: Unexpected `1` blank line after node, expected `0` blank lines, remove `1` blank line
```

## Compatibility

Projects maintained by the unified collective are compatible with maintained
versions of Node.js.

When we cut a new major release, we drop support for unmaintained versions of
Node.
This means we try to keep the current release line,
`remark-lint-no-consecutive-blank-lines@4`,
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

[api-remark-lint-no-consecutive-blank-lines]: #unifieduseremarklintnoconsecutiveblanklines

[author]: https://wooorm.com

[badge-build-image]: https://github.com/remarkjs/remark-lint/workflows/main/badge.svg

[badge-build-url]: https://github.com/remarkjs/remark-lint/actions

[badge-chat-image]: https://img.shields.io/badge/chat-discussions-success.svg

[badge-chat-url]: https://github.com/remarkjs/remark/discussions

[badge-coverage-image]: https://img.shields.io/codecov/c/github/remarkjs/remark-lint.svg

[badge-coverage-url]: https://codecov.io/github/remarkjs/remark-lint

[badge-downloads-image]: https://img.shields.io/npm/dm/remark-lint-no-consecutive-blank-lines.svg

[badge-downloads-url]: https://www.npmjs.com/package/remark-lint-no-consecutive-blank-lines

[badge-funding-backers-image]: https://opencollective.com/unified/backers/badge.svg

[badge-funding-sponsors-image]: https://opencollective.com/unified/sponsors/badge.svg

[badge-funding-url]: https://opencollective.com/unified

[badge-size-image]: https://img.shields.io/bundlejs/size/remark-lint-no-consecutive-blank-lines

[badge-size-url]: https://bundlejs.com/?q=remark-lint-no-consecutive-blank-lines

[esm-sh]: https://esm.sh

[file-license]: https://github.com/remarkjs/remark-lint/blob/main/license

[github-dotfiles-coc]: https://github.com/remarkjs/.github/blob/main/code-of-conduct.md

[github-dotfiles-contributing]: https://github.com/remarkjs/.github/blob/main/contributing.md

[github-dotfiles-health]: https://github.com/remarkjs/.github

[github-dotfiles-support]: https://github.com/remarkjs/.github/blob/main/support.md

[github-gist-esm]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c

[github-remark-directive]: https://github.com/remarkjs/remark-directive

[github-remark-gfm]: https://github.com/remarkjs/remark-gfm

[github-remark-lint]: https://github.com/remarkjs/remark-lint

[github-remark-mdx]: https://mdxjs.com/packages/remark-mdx/

[github-remark-stringify]: https://github.com/remarkjs/remark/tree/main/packages/remark-stringify

[github-unified-transformer]: https://github.com/unifiedjs/unified#transformer

[npm-install]: https://docs.npmjs.com/cli/install

[typescript]: https://www.typescriptlang.org

<!--This file is generated-->

# remark-lint-correct-media-syntax

[![Build][badge-build-image]][badge-build-url]
[![Coverage][badge-coverage-image]][badge-coverage-url]
[![Downloads][badge-downloads-image]][badge-downloads-url]
[![Size][badge-size-image]][badge-size-url]
[![Sponsors][badge-funding-sponsors-image]][badge-funding-url]
[![Backers][badge-funding-backers-image]][badge-funding-url]
[![Chat][badge-chat-image]][badge-chat-url]

[`remark-lint`][github-remark-lint] rule to warn for accidental bracket and paren
mixup for images and links.

## Contents

* [What is this?](#what-is-this)
* [When should I use this?](#when-should-i-use-this)
* [Presets](#presets)
* [Install](#install)
* [Use](#use)
* [API](#api)
  * [`unified().use(remarkLintCorrectMediaSyntax)`](#unifieduseremarklintcorrectmediasyntax)
* [Examples](#examples)
* [Compatibility](#compatibility)
* [Contribute](#contribute)
* [License](#license)

## What is this?

This package checks for accidental image or link mixup:
`(text)[url]` instead of `[text](url)`.

## When should I use this?

You can use this package to check that brackets and parentheses
that are used to form image and links are not accidentally swapped.

## Presets

This plugin is not included in presets maintained here.

## Install

This package is [ESM only][github-gist-esm].
In Node.js (version 16+),
install with [npm][npm-install]:

```sh
npm install remark-lint-correct-media-syntax
```

In Deno with [`esm.sh`][esm-sh]:

```js
import remarkLintCorrectMediaSyntax from 'https://esm.sh/remark-lint-correct-media-syntax@1'
```

In browsers with [`esm.sh`][esm-sh]:

```html
<script type="module">
  import remarkLintCorrectMediaSyntax from 'https://esm.sh/remark-lint-correct-media-syntax@1?bundle'
</script>
```

## Use

On the API:

```js
import remarkLint from 'remark-lint'
import remarkLintCorrectMediaSyntax from 'remark-lint-correct-media-syntax'
import remarkParse from 'remark-parse'
import remarkStringify from 'remark-stringify'
import {read} from 'to-vfile'
import {unified} from 'unified'
import {reporter} from 'vfile-reporter'

const file = await read('example.md')

await unified()
  .use(remarkParse)
  .use(remarkLint)
  .use(remarkLintCorrectMediaSyntax)
  .use(remarkStringify)
  .process(file)

console.error(reporter(file))
```

On the CLI:

```sh
remark --frail --use remark-lint --use remark-lint-correct-media-syntax .
```

On the CLI in a config file (here a `package.json`):

```diff
 …
 "remarkConfig": {
   "plugins": [
     …
     "remark-lint",
+    "remark-lint-correct-media-syntax",
     …
   ]
 }
 …
```

## API

This package exports no identifiers.
It exports no additional [TypeScript][typescript] types.
The default export is
[`remarkLintCorrectMediaSyntax`][api-remark-lint-correct-media-syntax].

### `unified().use(remarkLintCorrectMediaSyntax)`

Warn for accidental bracket and paren mixup for images and links.

###### Parameters

There are no parameters.

###### Returns

Transform ([`Transformer` from `unified`][github-unified-transformer]).

## Examples

##### `ok.md`

###### In

```markdown
[Mercury](https://example.com/mercury/) and
![Venus](https://example.com/venus.png).
```

###### Out

No messages.

##### `not-ok.md`

###### In

```markdown
(Mercury)[https://example.com/mercury/] and
!(Venus)[https://example.com/venus.png].
```

###### Out

```text
1:9-1:11: Unexpected `)[`, expected `[` and `]` around the text (label) and `(` and `)` around the URL for images and links, or an escape (`)\[`)
2:8-2:10: Unexpected `)[`, expected `[` and `]` around the text (label) and `(` and `)` around the URL for images and links, or an escape (`)\[`)
```

## Compatibility

Projects maintained by the unified collective are compatible with maintained
versions of Node.js.

When we cut a new major release, we drop support for unmaintained versions of
Node.
This means we try to keep the current release line,
`remark-lint-correct-media-syntax@1`,
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

[api-remark-lint-correct-media-syntax]: #unifieduseremarklintcorrectmediasyntax

[author]: https://wooorm.com

[badge-build-image]: https://github.com/remarkjs/remark-lint/workflows/main/badge.svg

[badge-build-url]: https://github.com/remarkjs/remark-lint/actions

[badge-chat-image]: https://img.shields.io/badge/chat-discussions-success.svg

[badge-chat-url]: https://github.com/remarkjs/remark/discussions

[badge-coverage-image]: https://img.shields.io/codecov/c/github/remarkjs/remark-lint.svg

[badge-coverage-url]: https://codecov.io/github/remarkjs/remark-lint

[badge-downloads-image]: https://img.shields.io/npm/dm/remark-lint-correct-media-syntax.svg

[badge-downloads-url]: https://www.npmjs.com/package/remark-lint-correct-media-syntax

[badge-funding-backers-image]: https://opencollective.com/unified/backers/badge.svg

[badge-funding-sponsors-image]: https://opencollective.com/unified/sponsors/badge.svg

[badge-funding-url]: https://opencollective.com/unified

[badge-size-image]: https://img.shields.io/bundlejs/size/remark-lint-correct-media-syntax

[badge-size-url]: https://bundlejs.com/?q=remark-lint-correct-media-syntax

[esm-sh]: https://esm.sh

[file-license]: https://github.com/remarkjs/remark-lint/blob/main/license

[github-dotfiles-coc]: https://github.com/remarkjs/.github/blob/main/code-of-conduct.md

[github-dotfiles-contributing]: https://github.com/remarkjs/.github/blob/main/contributing.md

[github-dotfiles-health]: https://github.com/remarkjs/.github

[github-dotfiles-support]: https://github.com/remarkjs/.github/blob/main/support.md

[github-gist-esm]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c

[github-remark-lint]: https://github.com/remarkjs/remark-lint

[github-unified-transformer]: https://github.com/unifiedjs/unified#transformer

[npm-install]: https://docs.npmjs.com/cli/install

[typescript]: https://www.typescriptlang.org

<!--This file is generated-->

# remark-lint-definition-spacing

[![Build][badge-build-image]][badge-build-url]
[![Coverage][badge-coverage-image]][badge-coverage-url]
[![Downloads][badge-downloads-image]][badge-downloads-url]
[![Size][badge-size-image]][badge-size-url]
[![Sponsors][badge-funding-sponsors-image]][badge-funding-url]
[![Backers][badge-funding-backers-image]][badge-funding-url]
[![Chat][badge-chat-image]][badge-chat-url]

[`remark-lint`][github-remark-lint] rule to warn when consecutive whitespace is used in
a definition label.

## Contents

* [What is this?](#what-is-this)
* [When should I use this?](#when-should-i-use-this)
* [Presets](#presets)
* [Install](#install)
* [Use](#use)
* [API](#api)
  * [`unified().use(remarkLintDefinitionSpacing)`](#unifieduseremarklintdefinitionspacing)
* [Recommendation](#recommendation)
* [Examples](#examples)
* [Compatibility](#compatibility)
* [Contribute](#contribute)
* [License](#license)

## What is this?

This package checks the whitepsace in definition labels.

GFM footnotes are not affected by this rule as footnote labels cannot
contain whitespace.

## When should I use this?

You can use this package to check that definition labels are consistent.

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
npm install remark-lint-definition-spacing
```

In Deno with [`esm.sh`][esm-sh]:

```js
import remarkLintDefinitionSpacing from 'https://esm.sh/remark-lint-definition-spacing@3'
```

In browsers with [`esm.sh`][esm-sh]:

```html
<script type="module">
  import remarkLintDefinitionSpacing from 'https://esm.sh/remark-lint-definition-spacing@3?bundle'
</script>
```

## Use

On the API:

```js
import remarkLint from 'remark-lint'
import remarkLintDefinitionSpacing from 'remark-lint-definition-spacing'
import remarkParse from 'remark-parse'
import remarkStringify from 'remark-stringify'
import {read} from 'to-vfile'
import {unified} from 'unified'
import {reporter} from 'vfile-reporter'

const file = await read('example.md')

await unified()
  .use(remarkParse)
  .use(remarkLint)
  .use(remarkLintDefinitionSpacing)
  .use(remarkStringify)
  .process(file)

console.error(reporter(file))
```

On the CLI:

```sh
remark --frail --use remark-lint --use remark-lint-definition-spacing .
```

On the CLI in a config file (here a `package.json`):

```diff
 …
 "remarkConfig": {
   "plugins": [
     …
     "remark-lint",
+    "remark-lint-definition-spacing",
     …
   ]
 }
 …
```

## API

This package exports no identifiers.
It exports no additional [TypeScript][typescript] types.
The default export is
[`remarkLintDefinitionSpacing`][api-remark-lint-definition-spacing].

### `unified().use(remarkLintDefinitionSpacing)`

Warn when consecutive whitespace is used in a definition label.

###### Parameters

There are no options.

###### Returns

Transform ([`Transformer` from `unified`][github-unified-transformer]).

## Recommendation

Definitions and references are matched together by collapsing whitespace.
Using more whitespace in labels might incorrectly indicate that they are of
importance.
Due to this, it’s recommended to use one space and turn this rule on.

## Examples

##### `ok.md`

###### In

```markdown
The first planet is [planet mercury][].

[planet mercury]: http://example.com
```

###### Out

No messages.

##### `not-ok-consecutive.md`

###### In

```markdown
[planet␠␠␠␠mercury]: http://example.com
```

###### Out

```text
1:1-1:40: Unexpected `4` consecutive spaces in definition label, expected `1` space, remove `3` spaces
```

##### `not-ok-non-space.md`

###### In

```markdown
[pla␉net␊mer␍cury]: http://e.com
```

###### Out

```text
1:1-3:20: Unexpected non-space whitespace character `\t` in definition label, expected `1` space, replace it
1:1-3:20: Unexpected non-space whitespace character `\n` in definition label, expected `1` space, replace it
1:1-3:20: Unexpected non-space whitespace character `\r` in definition label, expected `1` space, replace it
```

## Compatibility

Projects maintained by the unified collective are compatible with maintained
versions of Node.js.

When we cut a new major release, we drop support for unmaintained versions of
Node.
This means we try to keep the current release line,
`remark-lint-definition-spacing@3`,
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

[api-remark-lint-definition-spacing]: #unifieduseremarklintdefinitionspacing

[author]: https://wooorm.com

[badge-build-image]: https://github.com/remarkjs/remark-lint/workflows/main/badge.svg

[badge-build-url]: https://github.com/remarkjs/remark-lint/actions

[badge-chat-image]: https://img.shields.io/badge/chat-discussions-success.svg

[badge-chat-url]: https://github.com/remarkjs/remark/discussions

[badge-coverage-image]: https://img.shields.io/codecov/c/github/remarkjs/remark-lint.svg

[badge-coverage-url]: https://codecov.io/github/remarkjs/remark-lint

[badge-downloads-image]: https://img.shields.io/npm/dm/remark-lint-definition-spacing.svg

[badge-downloads-url]: https://www.npmjs.com/package/remark-lint-definition-spacing

[badge-funding-backers-image]: https://opencollective.com/unified/backers/badge.svg

[badge-funding-sponsors-image]: https://opencollective.com/unified/sponsors/badge.svg

[badge-funding-url]: https://opencollective.com/unified

[badge-size-image]: https://img.shields.io/bundlejs/size/remark-lint-definition-spacing

[badge-size-url]: https://bundlejs.com/?q=remark-lint-definition-spacing

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

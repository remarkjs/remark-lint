<!--This file is generated-->

# remark-lint-no-table-indentation

[![Build][badge-build-image]][badge-build-url]
[![Coverage][badge-coverage-image]][badge-coverage-url]
[![Downloads][badge-downloads-image]][badge-downloads-url]
[![Size][badge-size-image]][badge-size-url]
[![Sponsors][badge-funding-sponsors-image]][badge-funding-url]
[![Backers][badge-funding-backers-image]][badge-funding-url]
[![Chat][badge-chat-image]][badge-chat-url]

[`remark-lint`][github-remark-lint] rule to warn when GFM tables are indented.

## Contents

* [What is this?](#what-is-this)
* [When should I use this?](#when-should-i-use-this)
* [Presets](#presets)
* [Install](#install)
* [Use](#use)
* [API](#api)
  * [`unified().use(remarkLintNoTableIndentation)`](#unifieduseremarklintnotableindentation)
* [Recommendation](#recommendation)
* [Fix](#fix)
* [Examples](#examples)
* [Compatibility](#compatibility)
* [Contribute](#contribute)
* [License](#license)

## What is this?

This package checks the indent of GFM tables.
Tables are a GFM feature enabled with
[`remark-gfm`][github-remark-gfm].

## When should I use this?

You can use this package to check that tables are consistent.

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
npm install remark-lint-no-table-indentation
```

In Deno with [`esm.sh`][esm-sh]:

```js
import remarkLintNoTableIndentation from 'https://esm.sh/remark-lint-no-table-indentation@4'
```

In browsers with [`esm.sh`][esm-sh]:

```html
<script type="module">
  import remarkLintNoTableIndentation from 'https://esm.sh/remark-lint-no-table-indentation@4?bundle'
</script>
```

## Use

On the API:

```js
import remarkLint from 'remark-lint'
import remarkLintNoTableIndentation from 'remark-lint-no-table-indentation'
import remarkParse from 'remark-parse'
import remarkStringify from 'remark-stringify'
import {read} from 'to-vfile'
import {unified} from 'unified'
import {reporter} from 'vfile-reporter'

const file = await read('example.md')

await unified()
  .use(remarkParse)
  .use(remarkLint)
  .use(remarkLintNoTableIndentation)
  .use(remarkStringify)
  .process(file)

console.error(reporter(file))
```

On the CLI:

```sh
remark --frail --use remark-lint --use remark-lint-no-table-indentation .
```

On the CLI in a config file (here a `package.json`):

```diff
 …
 "remarkConfig": {
   "plugins": [
     …
     "remark-lint",
+    "remark-lint-no-table-indentation",
     …
   ]
 }
 …
```

## API

This package exports no identifiers.
It exports no additional [TypeScript][typescript] types.
The default export is
[`remarkLintNoTableIndentation`][api-remark-lint-no-table-indentation].

### `unified().use(remarkLintNoTableIndentation)`

Warn when GFM tables are indented.

###### Parameters

There are no options.

###### Returns

Transform ([`Transformer` from `unified`][github-unified-transformer]).

## Recommendation

There is no specific handling of indented tables (or anything else) in
markdown.
So it’s recommended to not indent tables and to turn this rule on.

## Fix

[`remark-stringify`][github-remark-stringify] with
[`remark-gfm`][github-remark-gfm] formats all tables without indent.

## Examples

##### `ok.md`

###### In

> 👉 **Note**: this example uses
> GFM ([`remark-gfm`][github-remark-gfm]).

```markdown
Paragraph.

| A     | B     |
| ----- | ----- |
| Alpha | Bravo |
```

###### Out

No messages.

##### `not-ok.md`

###### In

> 👉 **Note**: this example uses
> GFM ([`remark-gfm`][github-remark-gfm]).

```markdown
Paragraph.

␠␠␠| A     | B     |
␠␠␠| ----- | ----- |
␠␠␠| Alpha | Bravo |
```

###### Out

```text
3:4: Do not indent table rows
4:4: Do not indent table rows
5:4: Do not indent table rows
```

##### `not-ok-blockquote.md`

###### In

> 👉 **Note**: this example uses
> GFM ([`remark-gfm`][github-remark-gfm]).

```markdown
>␠␠| A |
>␠| - |
```

###### Out

```text
1:4: Do not indent table rows
```

##### `not-ok-list.md`

###### In

> 👉 **Note**: this example uses
> GFM ([`remark-gfm`][github-remark-gfm]).

```markdown
-␠␠␠paragraph

␠␠␠␠␠| A |
␠␠␠␠| - |
```

###### Out

```text
3:6: Do not indent table rows
```

## Compatibility

Projects maintained by the unified collective are compatible with maintained
versions of Node.js.

When we cut a new major release, we drop support for unmaintained versions of
Node.
This means we try to keep the current release line,
`remark-lint-no-table-indentation@4`,
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

[api-remark-lint-no-table-indentation]: #unifieduseremarklintnotableindentation

[author]: https://wooorm.com

[badge-build-image]: https://github.com/remarkjs/remark-lint/workflows/main/badge.svg

[badge-build-url]: https://github.com/remarkjs/remark-lint/actions

[badge-chat-image]: https://img.shields.io/badge/chat-discussions-success.svg

[badge-chat-url]: https://github.com/remarkjs/remark/discussions

[badge-coverage-image]: https://img.shields.io/codecov/c/github/remarkjs/remark-lint.svg

[badge-coverage-url]: https://codecov.io/github/remarkjs/remark-lint

[badge-downloads-image]: https://img.shields.io/npm/dm/remark-lint-no-table-indentation.svg

[badge-downloads-url]: https://www.npmjs.com/package/remark-lint-no-table-indentation

[badge-funding-backers-image]: https://opencollective.com/unified/backers/badge.svg

[badge-funding-sponsors-image]: https://opencollective.com/unified/sponsors/badge.svg

[badge-funding-url]: https://opencollective.com/unified

[badge-size-image]: https://img.shields.io/bundlejs/size/remark-lint-no-table-indentation

[badge-size-url]: https://bundlejs.com/?q=remark-lint-no-table-indentation

[esm-sh]: https://esm.sh

[file-license]: https://github.com/remarkjs/remark-lint/blob/main/license

[github-dotfiles-coc]: https://github.com/remarkjs/.github/blob/main/code-of-conduct.md

[github-dotfiles-contributing]: https://github.com/remarkjs/.github/blob/main/contributing.md

[github-dotfiles-health]: https://github.com/remarkjs/.github

[github-dotfiles-support]: https://github.com/remarkjs/.github/blob/main/support.md

[github-gist-esm]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c

[github-remark-gfm]: https://github.com/remarkjs/remark-gfm

[github-remark-lint]: https://github.com/remarkjs/remark-lint

[github-remark-stringify]: https://github.com/remarkjs/remark/tree/main/packages/remark-stringify

[github-unified-transformer]: https://github.com/unifiedjs/unified#transformer

[npm-install]: https://docs.npmjs.com/cli/install

[typescript]: https://www.typescriptlang.org

<!--This file is generated-->

# remark-lint-fenced-code-flag

[![Build][badge-build-image]][badge-build-url]
[![Coverage][badge-coverage-image]][badge-coverage-url]
[![Downloads][badge-downloads-image]][badge-downloads-url]
[![Size][badge-size-image]][badge-size-url]
[![Sponsors][badge-funding-sponsors-image]][badge-funding-url]
[![Backers][badge-funding-backers-image]][badge-funding-url]
[![Chat][badge-chat-image]][badge-chat-url]

[`remark-lint`][github-remark-lint] rule to warn when language flags of fenced code
are not used.

## Contents

* [What is this?](#what-is-this)
* [When should I use this?](#when-should-i-use-this)
* [Presets](#presets)
* [Install](#install)
* [Use](#use)
* [API](#api)
  * [`unified().use(remarkLintFencedCodeFlag[, options])`](#unifieduseremarklintfencedcodeflag-options)
  * [`Options`](#options)
* [Recommendation](#recommendation)
* [Examples](#examples)
* [Compatibility](#compatibility)
* [Contribute](#contribute)
* [License](#license)

## What is this?

This package checks the language flags of fenced code blocks,
whether they exist,
and optionally what values they hold.

## When should I use this?

You can use this package to check that the style of language flags of fenced
code blocks is consistent.

## Presets

This plugin is included in the following presets:

| Preset | Options |
| - | - |
| [`remark-preset-lint-markdown-style-guide`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-preset-lint-markdown-style-guide) | `{ allowEmpty: false }` |

## Install

This package is [ESM only][github-gist-esm].
In Node.js (version 16+),
install with [npm][npm-install]:

```sh
npm install remark-lint-fenced-code-flag
```

In Deno with [`esm.sh`][esm-sh]:

```js
import remarkLintFencedCodeFlag from 'https://esm.sh/remark-lint-fenced-code-flag@3'
```

In browsers with [`esm.sh`][esm-sh]:

```html
<script type="module">
  import remarkLintFencedCodeFlag from 'https://esm.sh/remark-lint-fenced-code-flag@3?bundle'
</script>
```

## Use

On the API:

```js
import remarkLint from 'remark-lint'
import remarkLintFencedCodeFlag from 'remark-lint-fenced-code-flag'
import remarkParse from 'remark-parse'
import remarkStringify from 'remark-stringify'
import {read} from 'to-vfile'
import {unified} from 'unified'
import {reporter} from 'vfile-reporter'

const file = await read('example.md')

await unified()
  .use(remarkParse)
  .use(remarkLint)
  .use(remarkLintFencedCodeFlag)
  .use(remarkStringify)
  .process(file)

console.error(reporter(file))
```

On the CLI:

```sh
remark --frail --use remark-lint --use remark-lint-fenced-code-flag .
```

On the CLI in a config file (here a `package.json`):

```diff
 …
 "remarkConfig": {
   "plugins": [
     …
     "remark-lint",
+    "remark-lint-fenced-code-flag",
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
[`remarkLintFencedCodeFlag`][api-remark-lint-fenced-code-flag].

### `unified().use(remarkLintFencedCodeFlag[, options])`

Warn when language flags of fenced code are not used.

###### Parameters

* `options` ([`Options`][api-options] or `Array<string>`, optional)
  — configuration or flags to allow

###### Returns

Transform ([`Transformer` from `unified`][github-unified-transformer]).

### `Options`

Configuration (TypeScript type).

###### Fields

* `allowEmpty` (`boolean`, default: `false`)
  — allow language flags to be omitted
* `flags` (`Array<string>`, optional)
  — flags to allow,
  other flags will result in a warning

## Recommendation

While omitting language flags is fine to signal that code is plain text,
it *could* point to a mistake.
It’s recommended to instead use a certain flag for plain text (such as
`txt`) and to turn this rule on.

## Examples

##### `ok.md`

###### In

````markdown
Some markdown:

```markdown
# Mercury
```
````

###### Out

No messages.

##### `not-ok.md`

###### In

````markdown
```
mercury()
```
````

###### Out

```text
1:1-3:4: Unexpected missing fenced code language flag in info string, expected keyword
```

##### `ok-allow-empty.md`

When configured with `{ allowEmpty: true }`.

###### In

````markdown
```
mercury()
```
````

###### Out

No messages.

##### `not-ok-allow-empty.md`

When configured with `{ allowEmpty: false }`.

###### In

````markdown
```
mercury()
```
````

###### Out

```text
1:1-3:4: Unexpected missing fenced code language flag in info string, expected keyword
```

##### `ok-array.md`

When configured with `[ 'markdown' ]`.

###### In

````markdown
```markdown
# Mercury
```
````

###### Out

No messages.

##### `ok-options.md`

When configured with `{ flags: [ 'markdown' ] }`.

###### In

````markdown
```markdown
# Mercury
```
````

###### Out

No messages.

##### `not-ok-array.md`

When configured with `[ 'markdown' ]`.

###### In

````markdown
```javascript
mercury()
```
````

###### Out

```text
1:1-3:4: Unexpected fenced code language flag `javascript` in info string, expected `markdown`
```

##### `not-ok-long-array.md`

When configured with `[ 'javascript', 'markdown', 'mdx', 'typescript' ]`.

###### In

````markdown
```html
<h1>Mercury</h1>
```
````

###### Out

```text
1:1-3:4: Unexpected fenced code language flag `html` in info string, expected `javascript`, `markdown`, `mdx`, …
```

##### `not-ok-options.md`

When configured with `'🌍'`.

###### Out

```text
1:1: Unexpected value `🌍` for `options`, expected array or object
```

## Compatibility

Projects maintained by the unified collective are compatible with maintained
versions of Node.js.

When we cut a new major release, we drop support for unmaintained versions of
Node.
This means we try to keep the current release line,
`remark-lint-fenced-code-flag@3`,
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

[api-options]: #options

[api-remark-lint-fenced-code-flag]: #unifieduseremarklintfencedcodeflag-options

[author]: https://wooorm.com

[badge-build-image]: https://github.com/remarkjs/remark-lint/workflows/main/badge.svg

[badge-build-url]: https://github.com/remarkjs/remark-lint/actions

[badge-chat-image]: https://img.shields.io/badge/chat-discussions-success.svg

[badge-chat-url]: https://github.com/remarkjs/remark/discussions

[badge-coverage-image]: https://img.shields.io/codecov/c/github/remarkjs/remark-lint.svg

[badge-coverage-url]: https://codecov.io/github/remarkjs/remark-lint

[badge-downloads-image]: https://img.shields.io/npm/dm/remark-lint-fenced-code-flag.svg

[badge-downloads-url]: https://www.npmjs.com/package/remark-lint-fenced-code-flag

[badge-funding-backers-image]: https://opencollective.com/unified/backers/badge.svg

[badge-funding-sponsors-image]: https://opencollective.com/unified/sponsors/badge.svg

[badge-funding-url]: https://opencollective.com/unified

[badge-size-image]: https://img.shields.io/bundlejs/size/remark-lint-fenced-code-flag

[badge-size-url]: https://bundlejs.com/?q=remark-lint-fenced-code-flag

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

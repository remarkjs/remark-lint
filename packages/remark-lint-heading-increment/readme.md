<!--This file is generated-->

# remark-lint-heading-increment

[![Build][badge-build-image]][badge-build-url]
[![Coverage][badge-coverage-image]][badge-coverage-url]
[![Downloads][badge-downloads-image]][badge-downloads-url]
[![Size][badge-size-image]][badge-size-url]
[![Sponsors][badge-funding-sponsors-image]][badge-funding-url]
[![Backers][badge-funding-backers-image]][badge-funding-url]
[![Chat][badge-chat-image]][badge-chat-url]

[`remark-lint`][github-remark-lint] rule to warn when heading ranks increment with more than
1 at a time.

## Contents

* [What is this?](#what-is-this)
* [When should I use this?](#when-should-i-use-this)
* [Presets](#presets)
* [Install](#install)
* [Use](#use)
* [API](#api)
  * [`unified().use(remarkLintHeadingIncrement)`](#unifieduseremarklintheadingincrement)
* [Recommendation](#recommendation)
* [Examples](#examples)
* [Compatibility](#compatibility)
* [Contribute](#contribute)
* [License](#license)

## What is this?

This package checks the increase of headings.

## When should I use this?

You can use this package to check the increase of headings.

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
npm install remark-lint-heading-increment
```

In Deno with [`esm.sh`][esm-sh]:

```js
import remarkLintHeadingIncrement from 'https://esm.sh/remark-lint-heading-increment@4'
```

In browsers with [`esm.sh`][esm-sh]:

```html
<script type="module">
  import remarkLintHeadingIncrement from 'https://esm.sh/remark-lint-heading-increment@4?bundle'
</script>
```

## Use

On the API:

```js
import remarkLint from 'remark-lint'
import remarkLintHeadingIncrement from 'remark-lint-heading-increment'
import remarkParse from 'remark-parse'
import remarkStringify from 'remark-stringify'
import {read} from 'to-vfile'
import {unified} from 'unified'
import {reporter} from 'vfile-reporter'

const file = await read('example.md')

await unified()
  .use(remarkParse)
  .use(remarkLint)
  .use(remarkLintHeadingIncrement)
  .use(remarkStringify)
  .process(file)

console.error(reporter(file))
```

On the CLI:

```sh
remark --frail --use remark-lint --use remark-lint-heading-increment .
```

On the CLI in a config file (here a `package.json`):

```diff
 …
 "remarkConfig": {
   "plugins": [
     …
     "remark-lint",
+    "remark-lint-heading-increment",
     …
   ]
 }
 …
```

## API

This package exports no identifiers.
It exports no additional [TypeScript][typescript] types.
The default export is
[`remarkLintHeadingIncrement`][api-remark-lint-heading-increment].

### `unified().use(remarkLintHeadingIncrement)`

Warn when heading ranks increment with more than 1 at a time.

###### Parameters

There are no options.

###### Returns

Transform ([`Transformer` from `unified`][github-unified-transformer]).

## Recommendation

While markdown is not only used for HTML,
HTML accessibility guidelines state that headings should increment by one at
a time.
As in,
say the previous heading had a rank of 2 (so `<h2>`),
then the following heading that is to be considered “inside” it should have
a rank of 3 (`<h3>`).
Due to this,
when HTML output is a goal of the document,
it’s recommended that this rule is turned on.

## Examples

##### `ok.md`

###### In

```markdown
# Mercury

## Nomenclature
```

###### Out

No messages.

##### `also-ok.md`

###### In

```markdown
#### Impact basins and craters

#### Plains

#### Compressional features
```

###### Out

No messages.

##### `not-ok.md`

###### In

```markdown
# Mercury

### Internal structure

### Surface geology

## Observation history

#### Mariner 10
```

###### Out

```text
3:1-3:23: Unexpected heading rank `3`, exected rank `2`
5:1-5:20: Unexpected heading rank `3`, exected rank `2`
9:1-9:16: Unexpected heading rank `4`, exected rank `3`
```

##### `html.md`

###### In

```markdown
# Mercury

<b>Mercury</b> is the first planet from the Sun and the smallest
in the Solar System.

<h3>Internal structure</h3>

<h2>Orbit, rotation, and longitude</h2>
```

###### Out

```text
6:1-6:28: Unexpected heading rank `3`, exected rank `2`
```

##### `mdx.mdx`

###### In

> 👉 **Note**: this example uses
> MDX ([`remark-mdx`][github-remark-mdx]).

```mdx
# Mercury

<b>Mercury</b> is the first planet from the Sun and the smallest
in the Solar System.

<h3>Internal structure</h3>

<h2>Orbit, rotation, and longitude</h2>
```

###### Out

```text
6:1-6:28: Unexpected heading rank `3`, exected rank `2`
```

## Compatibility

Projects maintained by the unified collective are compatible with maintained
versions of Node.js.

When we cut a new major release, we drop support for unmaintained versions of
Node.
This means we try to keep the current release line,
`remark-lint-heading-increment@4`,
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

[api-remark-lint-heading-increment]: #unifieduseremarklintheadingincrement

[author]: https://wooorm.com

[badge-build-image]: https://github.com/remarkjs/remark-lint/workflows/main/badge.svg

[badge-build-url]: https://github.com/remarkjs/remark-lint/actions

[badge-chat-image]: https://img.shields.io/badge/chat-discussions-success.svg

[badge-chat-url]: https://github.com/remarkjs/remark/discussions

[badge-coverage-image]: https://img.shields.io/codecov/c/github/remarkjs/remark-lint.svg

[badge-coverage-url]: https://codecov.io/github/remarkjs/remark-lint

[badge-downloads-image]: https://img.shields.io/npm/dm/remark-lint-heading-increment.svg

[badge-downloads-url]: https://www.npmjs.com/package/remark-lint-heading-increment

[badge-funding-backers-image]: https://opencollective.com/unified/backers/badge.svg

[badge-funding-sponsors-image]: https://opencollective.com/unified/sponsors/badge.svg

[badge-funding-url]: https://opencollective.com/unified

[badge-size-image]: https://img.shields.io/bundlejs/size/remark-lint-heading-increment

[badge-size-url]: https://bundlejs.com/?q=remark-lint-heading-increment

[esm-sh]: https://esm.sh

[file-license]: https://github.com/remarkjs/remark-lint/blob/main/license

[github-dotfiles-coc]: https://github.com/remarkjs/.github/blob/main/code-of-conduct.md

[github-dotfiles-contributing]: https://github.com/remarkjs/.github/blob/main/contributing.md

[github-dotfiles-health]: https://github.com/remarkjs/.github

[github-dotfiles-support]: https://github.com/remarkjs/.github/blob/main/support.md

[github-gist-esm]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c

[github-remark-lint]: https://github.com/remarkjs/remark-lint

[github-remark-mdx]: https://mdxjs.com/packages/remark-mdx/

[github-unified-transformer]: https://github.com/unifiedjs/unified#transformer

[npm-install]: https://docs.npmjs.com/cli/install

[typescript]: https://www.typescriptlang.org

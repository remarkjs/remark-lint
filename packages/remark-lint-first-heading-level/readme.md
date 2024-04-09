<!--This file is generated-->

# remark-lint-first-heading-level

[![Build][badge-build-image]][badge-build-url]
[![Coverage][badge-coverage-image]][badge-coverage-url]
[![Downloads][badge-downloads-image]][badge-downloads-url]
[![Size][badge-size-image]][badge-size-url]
[![Sponsors][badge-funding-sponsors-image]][badge-funding-url]
[![Backers][badge-funding-backers-image]][badge-funding-url]
[![Chat][badge-chat-image]][badge-chat-url]

[`remark-lint`][github-remark-lint] rule to warn when the first heading has an unexpected rank.

## Contents

* [What is this?](#what-is-this)
* [When should I use this?](#when-should-i-use-this)
* [Presets](#presets)
* [Install](#install)
* [Use](#use)
* [API](#api)
  * [`unified().use(remarkLintFirstHeadingLevel[, options])`](#unifieduseremarklintfirstheadinglevel-options)
  * [`Options`](#options)
* [Recommendation](#recommendation)
* [Examples](#examples)
* [Compatibility](#compatibility)
* [Contribute](#contribute)
* [License](#license)

## What is this?

This package checks the rank of the first heading.

## When should I use this?

You can use this package to check that the rank of first headings is
consistent.

## Presets

This plugin is not included in presets maintained here.

## Install

This package is [ESM only][github-gist-esm].
In Node.js (version 16+),
install with [npm][npm-install]:

```sh
npm install remark-lint-first-heading-level
```

In Deno with [`esm.sh`][esm-sh]:

```js
import remarkLintFirstHeadingLevel from 'https://esm.sh/remark-lint-first-heading-level@4'
```

In browsers with [`esm.sh`][esm-sh]:

```html
<script type="module">
  import remarkLintFirstHeadingLevel from 'https://esm.sh/remark-lint-first-heading-level@4?bundle'
</script>
```

## Use

On the API:

```js
import remarkLint from 'remark-lint'
import remarkLintFirstHeadingLevel from 'remark-lint-first-heading-level'
import remarkParse from 'remark-parse'
import remarkStringify from 'remark-stringify'
import {read} from 'to-vfile'
import {unified} from 'unified'
import {reporter} from 'vfile-reporter'

const file = await read('example.md')

await unified()
  .use(remarkParse)
  .use(remarkLint)
  .use(remarkLintFirstHeadingLevel)
  .use(remarkStringify)
  .process(file)

console.error(reporter(file))
```

On the CLI:

```sh
remark --frail --use remark-lint --use remark-lint-first-heading-level .
```

On the CLI in a config file (here a `package.json`):

```diff
 …
 "remarkConfig": {
   "plugins": [
     …
     "remark-lint",
+    "remark-lint-first-heading-level",
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
[`remarkLintFirstHeadingLevel`][api-remark-lint-first-heading-level].

### `unified().use(remarkLintFirstHeadingLevel[, options])`

Warn when the first heading has an unexpected rank.

###### Parameters

* `options` ([`Options`][api-options], default: `1`)
  — configuration

###### Returns

Transform ([`Transformer` from `unified`][github-unified-transformer]).

### `Options`

Configuration (TypeScript type).

###### Type

```ts
type Options = 1 | 2 | 3 | 4 | 5 | 6
```

## Recommendation

In most cases you’d want to first heading in a markdown document to start at
rank `1`.
In some cases a different rank makes more sense,
such as when building a blog and generating the primary heading from
frontmatter metadata,
in which case a value of `2` can be defined here or the rule can be turned
off.

## Examples

##### `ok.md`

###### In

```markdown
# Mercury
```

###### Out

No messages.

##### `ok-delay.md`

###### In

```markdown
Mercury.

# Venus
```

###### Out

No messages.

##### `not-ok.md`

###### In

```markdown
## Mercury

Venus.
```

###### Out

```text
1:1-1:11: Unexpected first heading rank `2`, expected rank `1`
```

##### `ok.md`

When configured with `2`.

###### In

```markdown
## Mercury

Venus.
```

###### Out

No messages.

##### `ok-html.md`

###### In

```markdown
<div>Mercury.</div>

<h1>Venus</h1>
```

###### Out

No messages.

##### `ok-mdx.mdx`

###### In

> 👉 **Note**: this example uses
> MDX ([`remark-mdx`][github-remark-mdx]).

```mdx
<div>Mercury.</div>

<h1>Venus</h1>
```

###### Out

No messages.

##### `not-ok-options.md`

When configured with `'🌍'`.

###### Out

```text
1:1: Unexpected value `🌍` for `options`, expected `1`, `2`, `3`, `4`, `5`, or `6`
```

## Compatibility

Projects maintained by the unified collective are compatible with maintained
versions of Node.js.

When we cut a new major release, we drop support for unmaintained versions of
Node.
This means we try to keep the current release line,
`remark-lint-first-heading-level@4`,
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

[api-remark-lint-first-heading-level]: #unifieduseremarklintfirstheadinglevel-options

[author]: https://wooorm.com

[badge-build-image]: https://github.com/remarkjs/remark-lint/workflows/main/badge.svg

[badge-build-url]: https://github.com/remarkjs/remark-lint/actions

[badge-chat-image]: https://img.shields.io/badge/chat-discussions-success.svg

[badge-chat-url]: https://github.com/remarkjs/remark/discussions

[badge-coverage-image]: https://img.shields.io/codecov/c/github/remarkjs/remark-lint.svg

[badge-coverage-url]: https://codecov.io/github/remarkjs/remark-lint

[badge-downloads-image]: https://img.shields.io/npm/dm/remark-lint-first-heading-level.svg

[badge-downloads-url]: https://www.npmjs.com/package/remark-lint-first-heading-level

[badge-funding-backers-image]: https://opencollective.com/unified/backers/badge.svg

[badge-funding-sponsors-image]: https://opencollective.com/unified/sponsors/badge.svg

[badge-funding-url]: https://opencollective.com/unified

[badge-size-image]: https://img.shields.io/bundlejs/size/remark-lint-first-heading-level

[badge-size-url]: https://bundlejs.com/?q=remark-lint-first-heading-level

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

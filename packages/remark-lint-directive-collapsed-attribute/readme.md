<!--This file is generated-->

# remark-lint-directive-collapsed-attribute

[![Build][badge-build-image]][badge-build-url]
[![Coverage][badge-coverage-image]][badge-coverage-url]
[![Downloads][badge-downloads-image]][badge-downloads-url]
[![Size][badge-size-image]][badge-size-url]
[![Sponsors][badge-funding-sponsors-image]][badge-funding-url]
[![Backers][badge-funding-backers-image]][badge-funding-url]
[![Chat][badge-chat-image]][badge-chat-url]

[`remark-lint`][github-remark-lint] rule to warn when verbose attribute values are used.

## Contents

* [What is this?](#what-is-this)
* [When should I use this?](#when-should-i-use-this)
* [Presets](#presets)
* [Install](#install)
* [Use](#use)
* [API](#api)
  * [`unified().use(remarkLintDirectiveCollapsedAttribute)`](#unifieduseremarklintdirectivecollapsedattribute)
* [Examples](#examples)
* [Compatibility](#compatibility)
* [Contribute](#contribute)
* [License](#license)

## What is this?

This package checks that collapsed attributes are used when
possible in directives.

## When should I use this?

You can use this package to check that collapsed attributes are used
when possible in directives.

## Presets

This plugin is not included in presets maintained here.

## Install

This package is [ESM only][github-gist-esm].
In Node.js (version 16+),
install with [npm][npm-install]:

```sh
npm install remark-lint-directive-collapsed-attribute
```

In Deno with [`esm.sh`][esm-sh]:

```js
import remarkLintDirectiveCollapsedAttribute from 'https://esm.sh/remark-lint-directive-collapsed-attribute@1'
```

In browsers with [`esm.sh`][esm-sh]:

```html
<script type="module">
  import remarkLintDirectiveCollapsedAttribute from 'https://esm.sh/remark-lint-directive-collapsed-attribute@1?bundle'
</script>
```

## Use

On the API:

```js
import remarkLint from 'remark-lint'
import remarkLintDirectiveCollapsedAttribute from 'remark-lint-directive-collapsed-attribute'
import remarkParse from 'remark-parse'
import remarkStringify from 'remark-stringify'
import {read} from 'to-vfile'
import {unified} from 'unified'
import {reporter} from 'vfile-reporter'

const file = await read('example.md')

await unified()
  .use(remarkParse)
  .use(remarkLint)
  .use(remarkLintDirectiveCollapsedAttribute)
  .use(remarkStringify)
  .process(file)

console.error(reporter(file))
```

On the CLI:

```sh
remark --frail --use remark-lint --use remark-lint-directive-collapsed-attribute .
```

On the CLI in a config file (here a `package.json`):

```diff
 …
 "remarkConfig": {
   "plugins": [
     …
     "remark-lint",
+    "remark-lint-directive-collapsed-attribute",
     …
   ]
 }
 …
```

## API

This package exports no identifiers.
It exports no additional [TypeScript][typescript] types.
The default export is
[`remarkLintDirectiveCollapsedAttribute`][api-remark-lint-directive-collapsed-attribute].

### `unified().use(remarkLintDirectiveCollapsedAttribute)`

Warn when verbose attribute values are used.

###### Parameters

There are no parameters.

###### Returns

Transform ([`Transformer` from `unified`][github-unified-transformer]).

## Examples

##### `ok.md`

###### In

> 👉 **Note**: this example uses
> directives ([`remark-directive`][github-remark-directive]).

```markdown
:planet[Jupiter]{largest}
```

###### Out

No messages.

##### `not-ok.md`

###### In

> 👉 **Note**: this example uses
> directives ([`remark-directive`][github-remark-directive]).

```markdown
:planet[Jupiter]{largest=""}
```

###### Out

```text
1:18-1:25: Unexpected verbose attribute value, expected collapsed attribute
```

## Compatibility

Projects maintained by the unified collective are compatible with maintained
versions of Node.js.

When we cut a new major release, we drop support for unmaintained versions of
Node.
This means we try to keep the current release line,
`remark-lint-directive-collapsed-attribute@1`,
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

[api-remark-lint-directive-collapsed-attribute]: #unifieduseremarklintdirectivecollapsedattribute

[author]: https://wooorm.com

[badge-build-image]: https://github.com/remarkjs/remark-lint/workflows/main/badge.svg

[badge-build-url]: https://github.com/remarkjs/remark-lint/actions

[badge-chat-image]: https://img.shields.io/badge/chat-discussions-success.svg

[badge-chat-url]: https://github.com/remarkjs/remark/discussions

[badge-coverage-image]: https://img.shields.io/codecov/c/github/remarkjs/remark-lint.svg

[badge-coverage-url]: https://codecov.io/github/remarkjs/remark-lint

[badge-downloads-image]: https://img.shields.io/npm/dm/remark-lint-directive-collapsed-attribute.svg

[badge-downloads-url]: https://www.npmjs.com/package/remark-lint-directive-collapsed-attribute

[badge-funding-backers-image]: https://opencollective.com/unified/backers/badge.svg

[badge-funding-sponsors-image]: https://opencollective.com/unified/sponsors/badge.svg

[badge-funding-url]: https://opencollective.com/unified

[badge-size-image]: https://img.shields.io/bundlejs/size/remark-lint-directive-collapsed-attribute

[badge-size-url]: https://bundlejs.com/?q=remark-lint-directive-collapsed-attribute

[esm-sh]: https://esm.sh

[file-license]: https://github.com/remarkjs/remark-lint/blob/main/license

[github-dotfiles-coc]: https://github.com/remarkjs/.github/blob/main/code-of-conduct.md

[github-dotfiles-contributing]: https://github.com/remarkjs/.github/blob/main/contributing.md

[github-dotfiles-health]: https://github.com/remarkjs/.github

[github-dotfiles-support]: https://github.com/remarkjs/.github/blob/main/support.md

[github-gist-esm]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c

[github-remark-directive]: https://github.com/remarkjs/remark-directive

[github-remark-lint]: https://github.com/remarkjs/remark-lint

[github-unified-transformer]: https://github.com/unifiedjs/unified#transformer

[npm-install]: https://docs.npmjs.com/cli/install

[typescript]: https://www.typescriptlang.org

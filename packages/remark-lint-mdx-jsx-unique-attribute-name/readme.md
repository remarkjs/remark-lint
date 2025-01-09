<!--This file is generated-->

# remark-lint-mdx-jsx-unique-attribute-name

[![Build][badge-build-image]][badge-build-url]
[![Coverage][badge-coverage-image]][badge-coverage-url]
[![Downloads][badge-downloads-image]][badge-downloads-url]
[![Size][badge-size-image]][badge-size-url]
[![Sponsors][badge-funding-sponsors-image]][badge-funding-url]
[![Backers][badge-funding-backers-image]][badge-funding-url]
[![Chat][badge-chat-image]][badge-chat-url]

[`remark-lint`][github-remark-lint] rule to warn when MDX JSX attribute names
are reused.

## Contents

* [What is this?](#what-is-this)
* [When should I use this?](#when-should-i-use-this)
* [Presets](#presets)
* [Install](#install)
* [Use](#use)
* [API](#api)
  * [`unified().use(remarkLintMdxJsxUniqueAttributeName)`](#unifieduseremarklintmdxjsxuniqueattributename)
* [Examples](#examples)
* [Compatibility](#compatibility)
* [Contribute](#contribute)
* [License](#license)

## What is this?

This package check that MDX JSX attribute names are unique.

## When should I use this?

You can use this package to check that MDX JSX attribute names
are unique.

## Presets

This plugin is not included in presets maintained here.

## Install

This package is [ESM only][github-gist-esm].
In Node.js (version 16+),
install with [npm][npm-install]:

```sh
npm install remark-lint-mdx-jsx-unique-attribute-name
```

In Deno with [`esm.sh`][esm-sh]:

```js
import remarkLintMdxJsxUniqueAttributeName from 'https://esm.sh/remark-lint-mdx-jsx-unique-attribute-name@0'
```

In browsers with [`esm.sh`][esm-sh]:

```html
<script type="module">
  import remarkLintMdxJsxUniqueAttributeName from 'https://esm.sh/remark-lint-mdx-jsx-unique-attribute-name@0?bundle'
</script>
```

## Use

On the API:

```js
import remarkLint from 'remark-lint'
import remarkLintMdxJsxUniqueAttributeName from 'remark-lint-mdx-jsx-unique-attribute-name'
import remarkParse from 'remark-parse'
import remarkStringify from 'remark-stringify'
import {read} from 'to-vfile'
import {unified} from 'unified'
import {reporter} from 'vfile-reporter'

const file = await read('example.md')

await unified()
  .use(remarkParse)
  .use(remarkLint)
  .use(remarkLintMdxJsxUniqueAttributeName)
  .use(remarkStringify)
  .process(file)

console.error(reporter(file))
```

On the CLI:

```sh
remark --frail --use remark-lint --use remark-lint-mdx-jsx-unique-attribute-name .
```

On the CLI in a config file (here a `package.json`):

```diff
 …
 "remarkConfig": {
   "plugins": [
     …
     "remark-lint",
+    "remark-lint-mdx-jsx-unique-attribute-name",
     …
   ]
 }
 …
```

## API

This package exports no identifiers.
It exports no additional [TypeScript][typescript] types.
The default export is
[`remarkLintMdxJsxUniqueAttributeName`][api-remark-lint-mdx-jsx-unique-attribute-name].

### `unified().use(remarkLintMdxJsxUniqueAttributeName)`

Warn when MDX JSX attribute names are reused.

###### Parameters

There are no parameters.

###### Returns

Transform ([`Transformer` from `unified`][github-unified-transformer]).

## Examples

##### `ok.mdx`

###### In

> 👉 **Note**: this example uses
> MDX ([`remark-mdx`][github-remark-mdx]).

```mdx
<Component id="mercury" value="Mercury" />
```

###### Out

No messages.

##### `not-ok.mdx`

###### In

> 👉 **Note**: this example uses
> MDX ([`remark-mdx`][github-remark-mdx]).

```mdx
<Component id="mercury" id="venus" value="Planet" />
```

###### Out

```text
1:25-1:35: Unexpected attribute name with equal text, expected unique attribute names
```

##### `other-attributes.mdx`

###### In

> 👉 **Note**: this example uses
> MDX ([`remark-mdx`][github-remark-mdx]).

```mdx
<Mercury closest />,
<Venus aphelion={0.728213} />, and
<Earth {...people} />.
```

###### Out

No messages.

## Compatibility

Projects maintained by the unified collective are compatible with maintained
versions of Node.js.

When we cut a new major release, we drop support for unmaintained versions of
Node.
This means we try to keep the current release line,
`remark-lint-mdx-jsx-unique-attribute-name@0`,
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

[api-remark-lint-mdx-jsx-unique-attribute-name]: #unifieduseremarklintmdxjsxuniqueattributename

[author]: https://wooorm.com

[badge-build-image]: https://github.com/remarkjs/remark-lint/workflows/main/badge.svg

[badge-build-url]: https://github.com/remarkjs/remark-lint/actions

[badge-chat-image]: https://img.shields.io/badge/chat-discussions-success.svg

[badge-chat-url]: https://github.com/remarkjs/remark/discussions

[badge-coverage-image]: https://img.shields.io/codecov/c/github/remarkjs/remark-lint.svg

[badge-coverage-url]: https://codecov.io/github/remarkjs/remark-lint

[badge-downloads-image]: https://img.shields.io/npm/dm/remark-lint-mdx-jsx-unique-attribute-name.svg

[badge-downloads-url]: https://www.npmjs.com/package/remark-lint-mdx-jsx-unique-attribute-name

[badge-funding-backers-image]: https://opencollective.com/unified/backers/badge.svg

[badge-funding-sponsors-image]: https://opencollective.com/unified/sponsors/badge.svg

[badge-funding-url]: https://opencollective.com/unified

[badge-size-image]: https://img.shields.io/bundlejs/size/remark-lint-mdx-jsx-unique-attribute-name

[badge-size-url]: https://bundlejs.com/?q=remark-lint-mdx-jsx-unique-attribute-name

[esm-sh]: https://esm.sh

[file-license]: https://github.com/remarkjs/remark-lint/blob/main/license

[github-dotfiles-coc]: https://github.com/remarkjs/.github/blob/main/code-of-conduct.md

[github-dotfiles-contributing]: https://github.com/remarkjs/.github/blob/main/contributing.md

[github-dotfiles-health]: https://github.com/remarkjs/.github

[github-dotfiles-support]: https://github.com/remarkjs/.github/blob/main/support.md

[github-gist-esm]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c

[github-remark-lint]: https://github.com/remarkjs/remark-lint

[github-remark-mdx]: https://github.com/mdx-js/mdx/tree/main/packages/remark-mdx

[github-unified-transformer]: https://github.com/unifiedjs/unified#transformer

[npm-install]: https://docs.npmjs.com/cli/install

[typescript]: https://www.typescriptlang.org

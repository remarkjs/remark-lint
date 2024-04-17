<!--This file is generated-->

# remark-lint-final-definition

[![Build][badge-build-image]][badge-build-url]
[![Coverage][badge-coverage-image]][badge-coverage-url]
[![Downloads][badge-downloads-image]][badge-downloads-url]
[![Size][badge-size-image]][badge-size-url]
[![Sponsors][badge-funding-sponsors-image]][badge-funding-url]
[![Backers][badge-funding-backers-image]][badge-funding-url]
[![Chat][badge-chat-image]][badge-chat-url]

[`remark-lint`][github-remark-lint] rule to warn when definitions are used *in* the
document instead of at the end.

## Contents

* [What is this?](#what-is-this)
* [When should I use this?](#when-should-i-use-this)
* [Presets](#presets)
* [Install](#install)
* [Use](#use)
* [API](#api)
  * [`unified().use(remarkLintFinalDefinition)`](#unifieduseremarklintfinaldefinition)
* [Recommendation](#recommendation)
* [Examples](#examples)
* [Compatibility](#compatibility)
* [Contribute](#contribute)
* [License](#license)

## What is this?

This package checks where definitions are placed.

## When should I use this?

You can use this package to check that definitions are consistently at the
end of the document.

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
npm install remark-lint-final-definition
```

In Deno with [`esm.sh`][esm-sh]:

```js
import remarkLintFinalDefinition from 'https://esm.sh/remark-lint-final-definition@4'
```

In browsers with [`esm.sh`][esm-sh]:

```html
<script type="module">
  import remarkLintFinalDefinition from 'https://esm.sh/remark-lint-final-definition@4?bundle'
</script>
```

## Use

On the API:

```js
import remarkLint from 'remark-lint'
import remarkLintFinalDefinition from 'remark-lint-final-definition'
import remarkParse from 'remark-parse'
import remarkStringify from 'remark-stringify'
import {read} from 'to-vfile'
import {unified} from 'unified'
import {reporter} from 'vfile-reporter'

const file = await read('example.md')

await unified()
  .use(remarkParse)
  .use(remarkLint)
  .use(remarkLintFinalDefinition)
  .use(remarkStringify)
  .process(file)

console.error(reporter(file))
```

On the CLI:

```sh
remark --frail --use remark-lint --use remark-lint-final-definition .
```

On the CLI in a config file (here a `package.json`):

```diff
 …
 "remarkConfig": {
   "plugins": [
     …
     "remark-lint",
+    "remark-lint-final-definition",
     …
   ]
 }
 …
```

## API

This package exports no identifiers.
It exports no additional [TypeScript][typescript] types.
The default export is
[`remarkLintFinalDefinition`][api-remark-lint-final-definition].

### `unified().use(remarkLintFinalDefinition)`

Warn when definitions are used *in* the document instead of at the end.

###### Parameters

There are no options.

###### Returns

Transform ([`Transformer` from `unified`][github-unified-transformer]).

## Recommendation

There are different strategies for placing definitions.
The simplest is perhaps to place them all at the bottem of documents.
If you prefer that, turn on this rule.

## Examples

##### `ok.md`

###### In

```markdown
Mercury.

[venus]: http://example.com
```

###### Out

No messages.

##### `ok.md`

###### In

```markdown
[mercury]: http://example.com/mercury/
[venus]: http://example.com/venus/
```

###### Out

No messages.

##### `ok-html-comments.md`

###### In

```markdown
Mercury.

[venus]: http://example.com/venus/

<!-- HTML comments in markdown are ignored. -->

[earth]: http://example.com/earth/
```

###### Out

No messages.

##### `ok-mdx-comments.mdx`

###### In

> 👉 **Note**: this example uses
> MDX ([`remark-mdx`][github-remark-mdx]).

```mdx
Mercury.

[venus]: http://example.com/venus/

{/* Comments in expressions in MDX are ignored. */}

[earth]: http://example.com/earth/
```

###### Out

No messages.

##### `not-ok.md`

###### In

```markdown
Mercury.

[venus]: https://example.com/venus/

Earth.
```

###### Out

```text
3:1-3:36: Unexpected definition before last content, expected definitions after line `5`
```

##### `gfm-nok.md`

###### In

> 👉 **Note**: this example uses
> GFM ([`remark-gfm`][github-remark-gfm]).

```markdown
Mercury.

[^venus]:
    **Venus** is the second planet from
    the Sun.

Earth.
```

###### Out

```text
3:1-5:13: Unexpected footnote definition before last content, expected definitions after line `7`
```

##### `gfm-ok.md`

###### In

> 👉 **Note**: this example uses
> GFM ([`remark-gfm`][github-remark-gfm]).

```markdown
Mercury.

Earth.

[^venus]:
    **Venus** is the second planet from
    the Sun.
```

###### Out

No messages.

## Compatibility

Projects maintained by the unified collective are compatible with maintained
versions of Node.js.

When we cut a new major release, we drop support for unmaintained versions of
Node.
This means we try to keep the current release line,
`remark-lint-final-definition@4`,
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

[api-remark-lint-final-definition]: #unifieduseremarklintfinaldefinition

[author]: https://wooorm.com

[badge-build-image]: https://github.com/remarkjs/remark-lint/workflows/main/badge.svg

[badge-build-url]: https://github.com/remarkjs/remark-lint/actions

[badge-chat-image]: https://img.shields.io/badge/chat-discussions-success.svg

[badge-chat-url]: https://github.com/remarkjs/remark/discussions

[badge-coverage-image]: https://img.shields.io/codecov/c/github/remarkjs/remark-lint.svg

[badge-coverage-url]: https://codecov.io/github/remarkjs/remark-lint

[badge-downloads-image]: https://img.shields.io/npm/dm/remark-lint-final-definition.svg

[badge-downloads-url]: https://www.npmjs.com/package/remark-lint-final-definition

[badge-funding-backers-image]: https://opencollective.com/unified/backers/badge.svg

[badge-funding-sponsors-image]: https://opencollective.com/unified/sponsors/badge.svg

[badge-funding-url]: https://opencollective.com/unified

[badge-size-image]: https://img.shields.io/bundlejs/size/remark-lint-final-definition

[badge-size-url]: https://bundlejs.com/?q=remark-lint-final-definition

[esm-sh]: https://esm.sh

[file-license]: https://github.com/remarkjs/remark-lint/blob/main/license

[github-dotfiles-coc]: https://github.com/remarkjs/.github/blob/main/code-of-conduct.md

[github-dotfiles-contributing]: https://github.com/remarkjs/.github/blob/main/contributing.md

[github-dotfiles-health]: https://github.com/remarkjs/.github

[github-dotfiles-support]: https://github.com/remarkjs/.github/blob/main/support.md

[github-gist-esm]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c

[github-remark-gfm]: https://github.com/remarkjs/remark-gfm

[github-remark-lint]: https://github.com/remarkjs/remark-lint

[github-remark-mdx]: https://mdxjs.com/packages/remark-mdx/

[github-unified-transformer]: https://github.com/unifiedjs/unified#transformer

[npm-install]: https://docs.npmjs.com/cli/install

[typescript]: https://www.typescriptlang.org

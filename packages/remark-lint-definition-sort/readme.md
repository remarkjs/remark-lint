<!--This file is generated-->

# remark-lint-definition-sort

[![Build][badge-build-image]][badge-build-url]
[![Coverage][badge-coverage-image]][badge-coverage-url]
[![Downloads][badge-downloads-image]][badge-downloads-url]
[![Size][badge-size-image]][badge-size-url]
[![Sponsors][badge-funding-sponsors-image]][badge-funding-url]
[![Backers][badge-funding-backers-image]][badge-funding-url]
[![Chat][badge-chat-image]][badge-chat-url]

[`remark-lint`][github-remark-lint] rule to warn when definitions are not sorted.

## Contents

* [What is this?](#what-is-this)
* [When should I use this?](#when-should-i-use-this)
* [Presets](#presets)
* [Install](#install)
* [Use](#use)
* [API](#api)
  * [`unified().use(remarkLintDefinitionSort)`](#unifieduseremarklintdefinitionsort)
* [Examples](#examples)
* [Compatibility](#compatibility)
* [Contribute](#contribute)
* [License](#license)

## What is this?

This package checks definition order.

## When should I use this?

You can use this package to check definition order.

## Presets

This plugin is not included in presets maintained here.

## Install

This package is [ESM only][github-gist-esm].
In Node.js (version 16+),
install with [npm][npm-install]:

```sh
npm install remark-lint-definition-sort
```

In Deno with [`esm.sh`][esm-sh]:

```js
import remarkLintDefinitionSort from 'https://esm.sh/remark-lint-definition-sort@1'
```

In browsers with [`esm.sh`][esm-sh]:

```html
<script type="module">
  import remarkLintDefinitionSort from 'https://esm.sh/remark-lint-definition-sort@1?bundle'
</script>
```

## Use

On the API:

```js
import remarkLint from 'remark-lint'
import remarkLintDefinitionSort from 'remark-lint-definition-sort'
import remarkParse from 'remark-parse'
import remarkStringify from 'remark-stringify'
import {read} from 'to-vfile'
import {unified} from 'unified'
import {reporter} from 'vfile-reporter'

const file = await read('example.md')

await unified()
  .use(remarkParse)
  .use(remarkLint)
  .use(remarkLintDefinitionSort)
  .use(remarkStringify)
  .process(file)

console.error(reporter(file))
```

On the CLI:

```sh
remark --frail --use remark-lint --use remark-lint-definition-sort .
```

On the CLI in a config file (here a `package.json`):

```diff
 …
 "remarkConfig": {
   "plugins": [
     …
     "remark-lint",
+    "remark-lint-definition-sort",
     …
   ]
 }
 …
```

## API

This package exports no identifiers.
It exports no additional [TypeScript][typescript] types.
The default export is
[`remarkLintDefinitionSort`][api-remark-lint-definition-sort].

### `unified().use(remarkLintDefinitionSort)`

Warn when when definitions are not sorted.

###### Parameters

There are no parameters.

###### Returns

Transform ([`Transformer` from `unified`][github-unified-transformer]).

## Examples

##### `ok.md`

###### In

```markdown
[mercury]: https://example.com/mercury/

[venus]: https://example.com/venus/
```

###### Out

No messages.

##### `gfm-ok.md`

###### In

> 👉 **Note**: this example uses
> GFM ([`remark-gfm`][github-remark-gfm]).

```markdown
[^mercury]:
    **Mercury** is the first planet from the Sun and the smallest
    in the Solar System.

[^venus]:
    **Venus** is the second planet from
    the Sun.
```

###### Out

No messages.

##### `together.md`

###### In

> 👉 **Note**: this example uses
> GFM ([`remark-gfm`][github-remark-gfm]).

```markdown
Definitions and footnote definitions are sorted separately.

[mercury]: https://example.com/mercury/
[venus]: https://example.com/venus/

[^mercury]:
    **Mercury** is the first planet from the Sun and the smallest
    in the Solar System.

[^venus]:
    **Venus** is the second planet from
    the Sun.
```

###### Out

No messages.

##### `together.md`

###### In

> 👉 **Note**: this example uses
> GFM ([`remark-gfm`][github-remark-gfm]).

```markdown
Definitions are sorted per “group”.

[mercury]: https://example.com/mercury/
[venus]: https://example.com/venus/

This paragraph introduces another group.

[earth]: https://example.com/earth/
[mars]: https://example.com/mars/
```

###### Out

No messages.

##### `comment.md`

###### In

```markdown
[earth]: https://example.com/earth/

<!-- HTML comments are ignored. -->

[mars]: https://example.com/mars/
```

###### Out

No messages.

##### `comment.mdx`

###### In

> 👉 **Note**: this example uses
> MDX ([`remark-mdx`][github-remark-mdx]).

```mdx
[earth]: https://example.com/earth/

{/* Comments in expressions in MDX are ignored. */}

[mars]: https://example.com/mars/
```

###### Out

No messages.

##### `not-ok.md`

###### In

```markdown
[venus]: https://example.com/venus/

[mercury]: https://example.com/mercury/

[earth]: https://example.com/earth/

[mars]: https://example.com/mars/
```

###### Out

```text
1:1-1:36: Unexpected definition `venus` in 1st place, expected alphabetically sorted definitions, move it to 4th place
3:1-3:40: Unexpected definition `mercury` in 2nd place, expected alphabetically sorted definitions, move it to 3rd place
5:1-5:36: Unexpected definition `earth` in 3rd place, expected alphabetically sorted definitions, move it to 1st place
7:1-7:34: Unexpected definition `mars` in 4th place, expected alphabetically sorted definitions, move it to 2nd place
```

##### `not-ok-gfm.md`

###### In

> 👉 **Note**: this example uses
> GFM ([`remark-gfm`][github-remark-gfm]).

```markdown
[^venus]:
    **Venus** is the second planet from
    the Sun.

[^mercury]:
    **Mercury** is the first planet from the Sun and the smallest
    in the Solar System.
```

###### Out

```text
1:1-3:13: Unexpected footnote definition `venus` in 1st place, expected alphabetically sorted definitions, move it to 2nd place
5:1-7:25: Unexpected footnote definition `mercury` in 2nd place, expected alphabetically sorted definitions, move it to 1st place
```

## Compatibility

Projects maintained by the unified collective are compatible with maintained
versions of Node.js.

When we cut a new major release, we drop support for unmaintained versions of
Node.
This means we try to keep the current release line,
`remark-lint-definition-sort@1`,
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

[api-remark-lint-definition-sort]: #unifieduseremarklintdefinitionsort

[author]: https://wooorm.com

[badge-build-image]: https://github.com/remarkjs/remark-lint/workflows/main/badge.svg

[badge-build-url]: https://github.com/remarkjs/remark-lint/actions

[badge-chat-image]: https://img.shields.io/badge/chat-discussions-success.svg

[badge-chat-url]: https://github.com/remarkjs/remark/discussions

[badge-coverage-image]: https://img.shields.io/codecov/c/github/remarkjs/remark-lint.svg

[badge-coverage-url]: https://codecov.io/github/remarkjs/remark-lint

[badge-downloads-image]: https://img.shields.io/npm/dm/remark-lint-definition-sort.svg

[badge-downloads-url]: https://www.npmjs.com/package/remark-lint-definition-sort

[badge-funding-backers-image]: https://opencollective.com/unified/backers/badge.svg

[badge-funding-sponsors-image]: https://opencollective.com/unified/sponsors/badge.svg

[badge-funding-url]: https://opencollective.com/unified

[badge-size-image]: https://img.shields.io/bundlejs/size/remark-lint-definition-sort

[badge-size-url]: https://bundlejs.com/?q=remark-lint-definition-sort

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

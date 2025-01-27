<!--This file is generated-->

# remark-lint-media-style

[![Build][badge-build-image]][badge-build-url]
[![Coverage][badge-coverage-image]][badge-coverage-url]
[![Downloads][badge-downloads-image]][badge-downloads-url]
[![Size][badge-size-image]][badge-size-url]
[![Sponsors][badge-funding-sponsors-image]][badge-funding-url]
[![Backers][badge-funding-backers-image]][badge-funding-url]
[![Chat][badge-chat-image]][badge-chat-url]

[`remark-lint`][github-remark-lint] rule to warn when the style of specifying
the URL of images and links is incorrect.

## Contents

* [What is this?](#what-is-this)
* [When should I use this?](#when-should-i-use-this)
* [Presets](#presets)
* [Install](#install)
* [Use](#use)
* [API](#api)
  * [`unified().use(remarkLintMediaStyle[, options])`](#unifieduseremarklintmediastyle-options)
  * [`Options`](#options)
  * [`Style`](#style)
* [Examples](#examples)
* [Compatibility](#compatibility)
* [Contribute](#contribute)
* [License](#license)

## What is this?

This package checks for media (image and link) style:
whether references or resources are used.

## When should I use this?

You can use this package to check that the style of specifying the URL
of images and links is correct.

## Presets

This plugin is not included in presets maintained here.

## Install

This package is [ESM only][github-gist-esm].
In Node.js (version 16+),
install with [npm][npm-install]:

```sh
npm install remark-lint-media-style
```

In Deno with [`esm.sh`][esm-sh]:

```js
import remarkLintMediaStyle from 'https://esm.sh/remark-lint-media-style@1'
```

In browsers with [`esm.sh`][esm-sh]:

```html
<script type="module">
  import remarkLintMediaStyle from 'https://esm.sh/remark-lint-media-style@1?bundle'
</script>
```

## Use

On the API:

```js
import remarkLint from 'remark-lint'
import remarkLintMediaStyle from 'remark-lint-media-style'
import remarkParse from 'remark-parse'
import remarkStringify from 'remark-stringify'
import {read} from 'to-vfile'
import {unified} from 'unified'
import {reporter} from 'vfile-reporter'

const file = await read('example.md')

await unified()
  .use(remarkParse)
  .use(remarkLint)
  .use(remarkLintMediaStyle)
  .use(remarkStringify)
  .process(file)

console.error(reporter(file))
```

On the CLI:

```sh
remark --frail --use remark-lint --use remark-lint-media-style .
```

On the CLI in a config file (here a `package.json`):

```diff
 …
 "remarkConfig": {
   "plugins": [
     …
     "remark-lint",
+    "remark-lint-media-style",
     …
   ]
 }
 …
```

## API

This package exports no identifiers.
It exports the [TypeScript][typescript] types
[`Options`][api-options] and
[`Style`][api-style].
The default export is
[`remarkLintMediaStyle`][api-remark-lint-media-style].

### `unified().use(remarkLintMediaStyle[, options])`

Warn when the style of specifying the URL of images and links is
incorrect.

###### Parameters

* `options` ([`Options`][api-options], default: `'consistent'`)
  — preferred style or whether to detect the first style and warn for
  further differences

###### Returns

Transform ([`Transformer` from `unified`][github-unified-transformer]).

### `Options`

Configuration (TypeScript type).

* `'consistent'`
  — detect the first used style and warn when further rules differ;
  “reference-reuse” cannot be detected
* [`Style`][api-style]
  — style to prefer

### `Style`

Style (TypeScript type).

* `'reference'`
  — prefer references
* `'reference-reuse'`
  — allow resources when used once,
  prefer references otherwise
* `'resource'`
  — prefer resources

## Examples

##### `ok-consistent-reference.md`

###### In

```markdown
[Mercury][] and [Venus][].

[mercury]: https://example.com/mercury/
[venus]: https://example.com/venus/
```

###### Out

No messages.

##### `ok-consistent-resource.md`

###### In

```markdown
[Mercury](https://example.com/mercury/) and
[Venus](https://example.com/venus/).
```

###### Out

No messages.

##### `ok-reference-reuse.md`

When configured with `'reference-reuse'`.

###### In

```markdown
[Mercury](https://example.com/mercury/),
[Venus][], and [Earth][].

**[Venus][]** is the second planet from the Sun.

[venus]: https://example.com/venus/
[earth]: https://example.com/earth/
```

###### Out

No messages.

##### `nok-reference.md`

When configured with `'reference'`.

###### In

```markdown
[Mercury](https://example.com/mercury/),
[Venus](https://example.com/venus/), and
[Earth][].

[earth]: https://example.com/earth/
```

###### Out

```text
1:1-1:40: Unexpected resource for url `https://example.com/mercury/`, expected a definition and a reference to it
2:1-2:36: Unexpected resource for url `https://example.com/venus/`, expected a definition and a reference to it
```

##### `nok-resource.md`

When configured with `'resource'`.

###### In

```markdown
[Mercury](https://example.com/mercury/),
[Venus](https://example.com/venus/), and
[Earth][].

[earth]: https://example.com/earth/
```

###### Out

```text
3:1-3:10: Unexpected reference for url `https://example.com/earth/`, expected resource
```

##### `nok-reference-reuse.md`

When configured with `'reference-reuse'`.

###### In

```markdown
[Mercury](https://example.com/mercury/),
[Venus](https://example.com/venus/), and [Earth][].

**[Venus](https://example.com/venus/)** is the second planet from the Sun.

[earth]: https://example.com/earth/
```

###### Out

```text
2:1-2:36: Unexpected resource for reused url `https://example.com/venus/`, expected a definition and a reference to it
4:3-4:38: Unexpected resource for reused url `https://example.com/venus/`, expected a definition and a reference to it
```

##### `reference-reuse-defined.md`

When configured with `'reference-reuse'`.

###### In

```markdown
[Mercury](https://example.com/mercury/).

[mercury]: https://example.com/mercury/
```

###### Out

```text
1:1-1:40: Unexpected resource for reused url `https://example.com/mercury/`, expected a reference to `mercury`
```

##### `not-ok.md`

When configured with `'🌍'`.

###### Out

```text
1:1: Unexpected value `🌍` for `options`, expected `'reference-reuse'`, `'reference'`, `'resource'`, or `'consistent'`
```

##### `definitions.md`

###### In

```markdown
[mercury]: https://example.com/mercury/
[venus]: https://example.com/venus/
```

###### Out

No messages.

## Compatibility

Projects maintained by the unified collective are compatible with maintained
versions of Node.js.

When we cut a new major release, we drop support for unmaintained versions of
Node.
This means we try to keep the current release line,
`remark-lint-media-style@1`,
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

[api-remark-lint-media-style]: #unifieduseremarklintmediastyle-options

[api-style]: #style

[author]: https://wooorm.com

[badge-build-image]: https://github.com/remarkjs/remark-lint/workflows/main/badge.svg

[badge-build-url]: https://github.com/remarkjs/remark-lint/actions

[badge-chat-image]: https://img.shields.io/badge/chat-discussions-success.svg

[badge-chat-url]: https://github.com/remarkjs/remark/discussions

[badge-coverage-image]: https://img.shields.io/codecov/c/github/remarkjs/remark-lint.svg

[badge-coverage-url]: https://codecov.io/github/remarkjs/remark-lint

[badge-downloads-image]: https://img.shields.io/npm/dm/remark-lint-media-style.svg

[badge-downloads-url]: https://www.npmjs.com/package/remark-lint-media-style

[badge-funding-backers-image]: https://opencollective.com/unified/backers/badge.svg

[badge-funding-sponsors-image]: https://opencollective.com/unified/sponsors/badge.svg

[badge-funding-url]: https://opencollective.com/unified

[badge-size-image]: https://img.shields.io/bundlejs/size/remark-lint-media-style

[badge-size-url]: https://bundlejs.com/?q=remark-lint-media-style

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

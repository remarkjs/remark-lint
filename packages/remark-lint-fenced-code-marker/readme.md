<!--This file is generated-->

# remark-lint-fenced-code-marker

[![Build][badge-build-image]][badge-build-url]
[![Coverage][badge-coverage-image]][badge-coverage-url]
[![Downloads][badge-downloads-image]][badge-downloads-url]
[![Size][badge-size-image]][badge-size-url]
[![Sponsors][badge-funding-sponsors-image]][badge-funding-url]
[![Backers][badge-funding-backers-image]][badge-funding-url]
[![Chat][badge-chat-image]][badge-chat-url]

[`remark-lint`][github-remark-lint] rule to warn when fenced code markers are
inconsistent.

## Contents

* [What is this?](#what-is-this)
* [When should I use this?](#when-should-i-use-this)
* [Presets](#presets)
* [Install](#install)
* [Use](#use)
* [API](#api)
  * [`unified().use(remarkLintFencedCodeMarker[, options])`](#unifieduseremarklintfencedcodemarker-options)
  * [`Marker`](#marker)
  * [`Options`](#options)
* [Recommendation](#recommendation)
* [Fix](#fix)
* [Examples](#examples)
* [Compatibility](#compatibility)
* [Contribute](#contribute)
* [License](#license)

## What is this?

This package checks fenced code block markers.

## When should I use this?

You can use this package to check that fenced code block markers are
consistent.

## Presets

This plugin is included in the following presets:

| Preset | Options |
| - | - |
| [`remark-preset-lint-consistent`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-preset-lint-consistent) | `'consistent'` |
| [`remark-preset-lint-markdown-style-guide`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-preset-lint-markdown-style-guide) | ``'`'`` |

## Install

This package is [ESM only][github-gist-esm].
In Node.js (version 16+),
install with [npm][npm-install]:

```sh
npm install remark-lint-fenced-code-marker
```

In Deno with [`esm.sh`][esm-sh]:

```js
import remarkLintFencedCodeMarker from 'https://esm.sh/remark-lint-fenced-code-marker@4'
```

In browsers with [`esm.sh`][esm-sh]:

```html
<script type="module">
  import remarkLintFencedCodeMarker from 'https://esm.sh/remark-lint-fenced-code-marker@4?bundle'
</script>
```

## Use

On the API:

```js
import remarkLint from 'remark-lint'
import remarkLintFencedCodeMarker from 'remark-lint-fenced-code-marker'
import remarkParse from 'remark-parse'
import remarkStringify from 'remark-stringify'
import {read} from 'to-vfile'
import {unified} from 'unified'
import {reporter} from 'vfile-reporter'

const file = await read('example.md')

await unified()
  .use(remarkParse)
  .use(remarkLint)
  .use(remarkLintFencedCodeMarker)
  .use(remarkStringify)
  .process(file)

console.error(reporter(file))
```

On the CLI:

```sh
remark --frail --use remark-lint --use remark-lint-fenced-code-marker .
```

On the CLI in a config file (here a `package.json`):

```diff
 …
 "remarkConfig": {
   "plugins": [
     …
     "remark-lint",
+    "remark-lint-fenced-code-marker",
     …
   ]
 }
 …
```

## API

This package exports no identifiers.
It exports the [TypeScript][typescript] types
[`Marker`][api-marker] and
[`Options`][api-options].
The default export is
[`remarkLintFencedCodeMarker`][api-remark-lint-fenced-code-marker].

### `unified().use(remarkLintFencedCodeMarker[, options])`

Warn when fenced code markers are inconsistent.

###### Parameters

* `options` ([`Options`][api-options], default: `'consistent'`)
  — preferred style or whether to detect the first style and warn for
  further differences

###### Returns

Transform ([`Transformer` from `unified`][github-unified-transformer]).

### `Marker`

Marker (TypeScript type).

###### Type

```ts
type Marker = '`' | '~'
```

### `Options`

Configuration (TypeScript type).

###### Type

```ts
type Options = Marker | 'consistent'
```

## Recommendation

Tildes are uncommon.
So it’s recommended to configure this rule with ``'`'``.

## Fix

[`remark-stringify`][github-remark-stringify] formats fenced code with grave
accents by default.
Pass `fence: '~'` to always use tildes.

## Examples

##### `ok-indented.md`

###### In

```markdown
Indented code blocks are not affected by this rule:

    mercury()
```

###### Out

No messages.

##### `ok-tick.md`

When configured with ``'`'``.

###### In

````markdown
```javascript
mercury()
```

```
venus()
```
````

###### Out

No messages.

##### `ok-tilde.md`

When configured with `'~'`.

###### In

```markdown
~~~javascript
mercury()
~~~

~~~
venus()
~~~
```

###### Out

No messages.

##### `not-ok-consistent-tick.md`

###### In

````markdown
```javascript
mercury()
```

~~~
venus()
~~~
````

###### Out

```text
5:1-7:4: Unexpected fenced code marker `~`, expected `` ` ``
```

##### `not-ok-consistent-tilde.md`

###### In

````markdown
~~~javascript
mercury()
~~~

```
venus()
```
````

###### Out

```text
5:1-7:4: Unexpected fenced code marker `` ` ``, expected `~`
```

##### `not-ok-incorrect.md`

When configured with `'🌍'`.

###### Out

```text
1:1: Unexpected value `🌍` for `options`, expected ``'`'``, `'~'`, or `'consistent'`
```

## Compatibility

Projects maintained by the unified collective are compatible with maintained
versions of Node.js.

When we cut a new major release, we drop support for unmaintained versions of
Node.
This means we try to keep the current release line,
`remark-lint-fenced-code-marker@4`,
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

[api-marker]: #marker

[api-options]: #options

[api-remark-lint-fenced-code-marker]: #unifieduseremarklintfencedcodemarker-options

[author]: https://wooorm.com

[badge-build-image]: https://github.com/remarkjs/remark-lint/workflows/main/badge.svg

[badge-build-url]: https://github.com/remarkjs/remark-lint/actions

[badge-chat-image]: https://img.shields.io/badge/chat-discussions-success.svg

[badge-chat-url]: https://github.com/remarkjs/remark/discussions

[badge-coverage-image]: https://img.shields.io/codecov/c/github/remarkjs/remark-lint.svg

[badge-coverage-url]: https://codecov.io/github/remarkjs/remark-lint

[badge-downloads-image]: https://img.shields.io/npm/dm/remark-lint-fenced-code-marker.svg

[badge-downloads-url]: https://www.npmjs.com/package/remark-lint-fenced-code-marker

[badge-funding-backers-image]: https://opencollective.com/unified/backers/badge.svg

[badge-funding-sponsors-image]: https://opencollective.com/unified/sponsors/badge.svg

[badge-funding-url]: https://opencollective.com/unified

[badge-size-image]: https://img.shields.io/bundlejs/size/remark-lint-fenced-code-marker

[badge-size-url]: https://bundlejs.com/?q=remark-lint-fenced-code-marker

[esm-sh]: https://esm.sh

[file-license]: https://github.com/remarkjs/remark-lint/blob/main/license

[github-dotfiles-coc]: https://github.com/remarkjs/.github/blob/main/code-of-conduct.md

[github-dotfiles-contributing]: https://github.com/remarkjs/.github/blob/main/contributing.md

[github-dotfiles-health]: https://github.com/remarkjs/.github

[github-dotfiles-support]: https://github.com/remarkjs/.github/blob/main/support.md

[github-gist-esm]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c

[github-remark-lint]: https://github.com/remarkjs/remark-lint

[github-remark-stringify]: https://github.com/remarkjs/remark/tree/main/packages/remark-stringify

[github-unified-transformer]: https://github.com/unifiedjs/unified#transformer

[npm-install]: https://docs.npmjs.com/cli/install

[typescript]: https://www.typescriptlang.org

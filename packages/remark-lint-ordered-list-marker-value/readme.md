<!--This file is generated-->

# remark-lint-ordered-list-marker-value

[![Build][badge-build-image]][badge-build-url]
[![Coverage][badge-coverage-image]][badge-coverage-url]
[![Downloads][badge-downloads-image]][badge-downloads-url]
[![Size][badge-size-image]][badge-size-url]
[![Sponsors][badge-funding-sponsors-image]][badge-funding-url]
[![Backers][badge-funding-backers-image]][badge-funding-url]
[![Chat][badge-chat-image]][badge-chat-url]

[`remark-lint`][github-remark-lint] rule to warn when ordered list values are inconsistent.

## Contents

* [What is this?](#what-is-this)
* [When should I use this?](#when-should-i-use-this)
* [Presets](#presets)
* [Install](#install)
* [Use](#use)
* [API](#api)
  * [`unified().use(remarkLintOrderedListMarkerValue[, options])`](#unifieduseremarklintorderedlistmarkervalue-options)
  * [`Options`](#options)
* [Recommendation](#recommendation)
* [Fix](#fix)
* [Examples](#examples)
* [Compatibility](#compatibility)
* [Contribute](#contribute)
* [License](#license)

## What is this?

This package checks ordered list values.

## When should I use this?

You can use this package to check ordered lists.

## Presets

This plugin is included in the following presets:

| Preset | Options |
| - | - |
| [`remark-preset-lint-markdown-style-guide`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-preset-lint-markdown-style-guide) | `'one'` |

## Install

This package is [ESM only][github-gist-esm].
In Node.js (version 16+),
install with [npm][npm-install]:

```sh
npm install remark-lint-ordered-list-marker-value
```

In Deno with [`esm.sh`][esm-sh]:

```js
import remarkLintOrderedListMarkerValue from 'https://esm.sh/remark-lint-ordered-list-marker-value@3'
```

In browsers with [`esm.sh`][esm-sh]:

```html
<script type="module">
  import remarkLintOrderedListMarkerValue from 'https://esm.sh/remark-lint-ordered-list-marker-value@3?bundle'
</script>
```

## Use

On the API:

```js
import remarkLint from 'remark-lint'
import remarkLintOrderedListMarkerValue from 'remark-lint-ordered-list-marker-value'
import remarkParse from 'remark-parse'
import remarkStringify from 'remark-stringify'
import {read} from 'to-vfile'
import {unified} from 'unified'
import {reporter} from 'vfile-reporter'

const file = await read('example.md')

await unified()
  .use(remarkParse)
  .use(remarkLint)
  .use(remarkLintOrderedListMarkerValue)
  .use(remarkStringify)
  .process(file)

console.error(reporter(file))
```

On the CLI:

```sh
remark --frail --use remark-lint --use remark-lint-ordered-list-marker-value .
```

On the CLI in a config file (here a `package.json`):

```diff
 …
 "remarkConfig": {
   "plugins": [
     …
     "remark-lint",
+    "remark-lint-ordered-list-marker-value",
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
[`remarkLintOrderedListMarkerValue`][api-remark-lint-ordered-list-marker-value].

### `unified().use(remarkLintOrderedListMarkerValue[, options])`

Warn when ordered list values are inconsistent.

###### Parameters

* `options` ([`Options`][api-options], default: `'ordered'`)
  — preferred style

###### Returns

Transform ([`Transformer` from `unified`][github-unified-transformer]).

### `Options`

Configuration (TypeScript type).

* `'ordered'`
  — values should increment by one from the first item
* `'single'`
  — values should stay the same as the first item
* `'one'`
  — values should always be exactly `1`

###### Type

```ts
type Options = 'one' | 'ordered' | 'single'
```

## Recommendation

While `'single'` might be the smartest style,
as it makes it easier to move items around without having to renumber
everything and doesn’t have problems with aligning content of the 9th and
the 10th item,
it’s not used a lot and arguably looks unnatural.
`'one'` is like `'single'` but forces every list to start at `1`.
While not often needed,
starting lists at other values is sometimes useful.
So `'ordered'` is recommended,
although `'single'` is also a viable choice.

## Fix

[`remark-stringify`][github-remark-stringify] retains the value of the first
item and increments further items by default.
Pass `incrementListMarker: false` to not increment further items.

## Examples

##### `ok.md`

###### In

```markdown
The default value is `ordered`, so unless changed, the below
is OK.

1.  Foo
2.  Bar
3.  Baz

Paragraph.

3.  Alpha
4.  Bravo
5.  Charlie

Unordered lists are not affected by this rule.

*   Anton
```

###### Out

No messages.

##### `ok.md`

When configured with `'one'`.

###### In

```markdown
1.  Foo
1.  Bar
1.  Baz

Paragraph.

1.  Alpha
1.  Bravo
1.  Charlie
```

###### Out

No messages.

##### `ok.md`

When configured with `'single'`.

###### In

```markdown
1.  Foo
1.  Bar
1.  Baz

Paragraph.

3.  Alpha
3.  Bravo
3.  Charlie

Paragraph.

0.  Delta
0.  Echo
0.  Foxtrot
```

###### Out

No messages.

##### `ok.md`

When configured with `'ordered'`.

###### In

```markdown
1.  Foo
2.  Bar
3.  Baz

Paragraph.

3.  Alpha
4.  Bravo
5.  Charlie

Paragraph.

0.  Delta
1.  Echo
2.  Foxtrot
```

###### Out

No messages.

##### `not-ok.md`

When configured with `'one'`.

###### In

```markdown
1.  Foo
2.  Bar
```

###### Out

```text
2:1-2:8: Marker should be `1`, was `2`
```

##### `also-not-ok.md`

When configured with `'one'`.

###### In

```markdown
2.  Foo
1.  Bar
```

###### Out

```text
1:1-1:8: Marker should be `1`, was `2`
```

##### `not-ok.md`

When configured with `'ordered'`.

###### In

```markdown
1.  Foo
1.  Bar
```

###### Out

```text
2:1-2:8: Marker should be `2`, was `1`
```

##### `not-ok.md`

When configured with `'💩'`.

###### Out

```text
1:1: Incorrect ordered list item marker value `💩`: use either `'ordered'`, `'one'`, or `'single'`
```

## Compatibility

Projects maintained by the unified collective are compatible with maintained
versions of Node.js.

When we cut a new major release, we drop support for unmaintained versions of
Node.
This means we try to keep the current release line,
`remark-lint-ordered-list-marker-value@3`,
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

[api-remark-lint-ordered-list-marker-value]: #unifieduseremarklintorderedlistmarkervalue-options

[author]: https://wooorm.com

[badge-build-image]: https://github.com/remarkjs/remark-lint/workflows/main/badge.svg

[badge-build-url]: https://github.com/remarkjs/remark-lint/actions

[badge-chat-image]: https://img.shields.io/badge/chat-discussions-success.svg

[badge-chat-url]: https://github.com/remarkjs/remark/discussions

[badge-coverage-image]: https://img.shields.io/codecov/c/github/remarkjs/remark-lint.svg

[badge-coverage-url]: https://codecov.io/github/remarkjs/remark-lint

[badge-downloads-image]: https://img.shields.io/npm/dm/remark-lint-ordered-list-marker-value.svg

[badge-downloads-url]: https://www.npmjs.com/package/remark-lint-ordered-list-marker-value

[badge-funding-backers-image]: https://opencollective.com/unified/backers/badge.svg

[badge-funding-sponsors-image]: https://opencollective.com/unified/sponsors/badge.svg

[badge-funding-url]: https://opencollective.com/unified

[badge-size-image]: https://img.shields.io/bundlejs/size/remark-lint-ordered-list-marker-value

[badge-size-url]: https://bundlejs.com/?q=remark-lint-ordered-list-marker-value

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

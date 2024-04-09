<!--This file is generated-->

# remark-lint-list-item-indent

[![Build][badge-build-image]][badge-build-url]
[![Coverage][badge-coverage-image]][badge-coverage-url]
[![Downloads][badge-downloads-image]][badge-downloads-url]
[![Size][badge-size-image]][badge-size-url]
[![Sponsors][badge-funding-sponsors-image]][badge-funding-url]
[![Backers][badge-funding-backers-image]][badge-funding-url]
[![Chat][badge-chat-image]][badge-chat-url]

[`remark-lint`][github-remark-lint] rule to warn when the whitespace after list item markers violate
a given style.

## Contents

* [What is this?](#what-is-this)
* [When should I use this?](#when-should-i-use-this)
* [Presets](#presets)
* [Install](#install)
* [Use](#use)
* [API](#api)
  * [`unified().use(remarkLintListItemIndent[, options])`](#unifieduseremarklintlistitemindent-options)
  * [`Options`](#options)
* [Recommendation](#recommendation)
* [Fix](#fix)
* [Examples](#examples)
* [Compatibility](#compatibility)
* [Contribute](#contribute)
* [License](#license)

## What is this?

This package checks the style of whitespace after list item markers.

## When should I use this?

You can use this package to check that the style of whitespace after list
item markers and before content is consistent.

## Presets

This plugin is included in the following presets:

| Preset | Options |
| - | - |
| [`remark-preset-lint-markdown-style-guide`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-preset-lint-markdown-style-guide) | `'mixed'` |
| [`remark-preset-lint-recommended`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-preset-lint-recommended) | `'one'` |

## Install

This package is [ESM only][github-gist-esm].
In Node.js (version 16+),
install with [npm][npm-install]:

```sh
npm install remark-lint-list-item-indent
```

In Deno with [`esm.sh`][esm-sh]:

```js
import remarkLintListItemIndent from 'https://esm.sh/remark-lint-list-item-indent@4'
```

In browsers with [`esm.sh`][esm-sh]:

```html
<script type="module">
  import remarkLintListItemIndent from 'https://esm.sh/remark-lint-list-item-indent@4?bundle'
</script>
```

## Use

On the API:

```js
import remarkLint from 'remark-lint'
import remarkLintListItemIndent from 'remark-lint-list-item-indent'
import remarkParse from 'remark-parse'
import remarkStringify from 'remark-stringify'
import {read} from 'to-vfile'
import {unified} from 'unified'
import {reporter} from 'vfile-reporter'

const file = await read('example.md')

await unified()
  .use(remarkParse)
  .use(remarkLint)
  .use(remarkLintListItemIndent)
  .use(remarkStringify)
  .process(file)

console.error(reporter(file))
```

On the CLI:

```sh
remark --frail --use remark-lint --use remark-lint-list-item-indent .
```

On the CLI in a config file (here a `package.json`):

```diff
 …
 "remarkConfig": {
   "plugins": [
     …
     "remark-lint",
+    "remark-lint-list-item-indent",
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
[`remarkLintListItemIndent`][api-remark-lint-list-item-indent].

### `unified().use(remarkLintListItemIndent[, options])`

Warn when the whitespace after list item markers violate a given style.

###### Parameters

* `options` ([`Options`][api-options], default: `'one'`)
  — preferred style

###### Returns

Transform ([`Transformer` from `unified`][github-unified-transformer]).

### `Options`

Configuration (TypeScript type).

* `'mixed'`
  — prefer `'one'` for tight lists and `'tab'` for loose lists
* `'one'`
  — prefer the size of the bullet and a single space
* `'tab'`
  — prefer the size of the bullet and a single space to the next tab stop

###### Type

```ts
type Options = 'mixed' | 'one' | 'tab'
```

## Recommendation

First some background.
The number of spaces that occur after list markers (`*`, `-`, and `+` for
unordered lists and `.` and `)` for unordered lists) and before the content
on the first line,
defines how much indentation can be used for further lines.
At least one space is required and up to 4 spaces are allowed.
If there is no further content after the marker then it’s a blank line which
is handled as if there was one space.
If there are 5 or more spaces and then content then it’s also seen as one
space and the rest is seen as indented code.

Regardless of ordered and unordered,
there are two kinds of lists in markdown,
tight and loose.
Lists are tight by default but if there is a blank line between two list
items or between two blocks inside an item,
that turns the whole list into a loose list.
When turning markdown into HTML,
paragraphs in tight lists are not wrapped in `<p>` tags.

How indentation of lists works in markdown has historically been a mess,
especially with how they interact with indented code.
CommonMark made that a *lot* better,
but there remain (documented but complex) edge cases and some behavior
intuitive.
Due to this, `'tab'` works the best in most markdown parsers *and* in
CommonMark.
Currently the situation between markdown parsers is better,
so the default `'one'`,
which seems to be the most common style used by authors,
is okay.

## Fix

[`remark-stringify`][github-remark-stringify] uses `listItemIndent: 'one'`
by default.
`listItemIndent: 'mixed'` or `listItemIndent: 'tab'` is also supported.

## Examples

##### `ok.md`

###### In

```markdown
*␠Mercury.
*␠Venus.

111.␠Earth
␠␠␠␠␠and Mars.

*␠**Jupiter**.

␠␠Jupiter is the fifth planet from the Sun and the largest in the Solar
␠␠System.

*␠Saturn.

␠␠Saturn is the sixth planet from the Sun and the second-largest in the Solar System, after Jupiter.
```

###### Out

No messages.

##### `ok.md`

When configured with `'mixed'`.

###### In

```markdown
*␠Mercury.
*␠Venus.

111.␠Earth
␠␠␠␠␠and Mars.

*␠␠␠**Jupiter**.

␠␠␠␠Jupiter is the fifth planet from the Sun and the largest in the Solar
␠␠␠␠System.

*␠␠␠Saturn.

␠␠␠␠Saturn is the sixth planet from the Sun and the second-largest in the Solar System, after Jupiter.
```

###### Out

No messages.

##### `not-ok.md`

When configured with `'mixed'`.

###### In

```markdown
*␠␠␠Mercury.
*␠␠␠Venus.

111.␠␠␠␠Earth
␠␠␠␠␠␠␠␠and Mars.

*␠**Jupiter**.

␠␠Jupiter is the fifth planet from the Sun and the largest in the Solar
␠␠System.

*␠Saturn.

␠␠Saturn is the sixth planet from the Sun and the second-largest in the Solar System, after Jupiter.
```

###### Out

```text
1:5: Unexpected `3` spaces between list item marker and content in tight list, expected `1` space, remove `2` spaces
2:5: Unexpected `3` spaces between list item marker and content in tight list, expected `1` space, remove `2` spaces
4:9: Unexpected `4` spaces between list item marker and content in tight list, expected `1` space, remove `3` spaces
7:3: Unexpected `1` space between list item marker and content in loose list, expected `3` spaces, add `2` spaces
12:3: Unexpected `1` space between list item marker and content in loose list, expected `3` spaces, add `2` spaces
```

##### `ok.md`

When configured with `'one'`.

###### In

```markdown
*␠Mercury.
*␠Venus.

111.␠Earth
␠␠␠␠␠and Mars.

*␠**Jupiter**.

␠␠Jupiter is the fifth planet from the Sun and the largest in the Solar
␠␠System.

*␠Saturn.

␠␠Saturn is the sixth planet from the Sun and the second-largest in the Solar System, after Jupiter.
```

###### Out

No messages.

##### `not-ok.md`

When configured with `'one'`.

###### In

```markdown
*␠␠␠Mercury.
*␠␠␠Venus.

111.␠␠␠␠Earth
␠␠␠␠␠␠␠␠and Mars.

*␠␠␠**Jupiter**.

␠␠␠␠Jupiter is the fifth planet from the Sun and the largest in the Solar
␠␠␠␠System.

*␠␠␠Saturn.

␠␠␠␠Saturn is the sixth planet from the Sun and the second-largest in the Solar System, after Jupiter.
```

###### Out

```text
1:5: Unexpected `3` spaces between list item marker and content, expected `1` space, remove `2` spaces
2:5: Unexpected `3` spaces between list item marker and content, expected `1` space, remove `2` spaces
4:9: Unexpected `4` spaces between list item marker and content, expected `1` space, remove `3` spaces
7:5: Unexpected `3` spaces between list item marker and content, expected `1` space, remove `2` spaces
12:5: Unexpected `3` spaces between list item marker and content, expected `1` space, remove `2` spaces
```

##### `ok.md`

When configured with `'tab'`.

###### In

```markdown
*␠␠␠Mercury.
*␠␠␠Venus.

111.␠␠␠␠Earth
␠␠␠␠␠␠␠␠and Mars.

*␠␠␠**Jupiter**.

␠␠␠␠Jupiter is the fifth planet from the Sun and the largest in the Solar
␠␠␠␠System.

*␠␠␠Saturn.

␠␠␠␠Saturn is the sixth planet from the Sun and the second-largest in the Solar System, after Jupiter.
```

###### Out

No messages.

##### `not-ok.md`

When configured with `'tab'`.

###### In

```markdown
*␠Mercury.
*␠Venus.

111.␠Earth
␠␠␠␠␠and Mars.

*␠**Jupiter**.

␠␠Jupiter is the fifth planet from the Sun and the largest in the Solar
␠␠System.

*␠Saturn.

␠␠Saturn is the sixth planet from the Sun and the second-largest in the Solar System, after Jupiter.
```

###### Out

```text
1:3: Unexpected `1` space between list item marker and content, expected `3` spaces, add `2` spaces
2:3: Unexpected `1` space between list item marker and content, expected `3` spaces, add `2` spaces
4:6: Unexpected `1` space between list item marker and content, expected `4` spaces, add `3` spaces
7:3: Unexpected `1` space between list item marker and content, expected `3` spaces, add `2` spaces
12:3: Unexpected `1` space between list item marker and content, expected `3` spaces, add `2` spaces
```

##### `not-ok.md`

When configured with `'🌍'`.

###### Out

```text
1:1: Unexpected value `🌍` for `options`, expected `'mixed'`, `'one'`, or `'tab'`
```

##### `gfm.md`

When configured with `'mixed'`.

###### In

> 👉 **Note**: this example uses
> GFM ([`remark-gfm`][github-remark-gfm]).

```markdown
*␠[x] Mercury.

1.␠␠[ ] Venus.

2.␠␠[ ] Earth.
```

###### Out

No messages.

##### `gfm.md`

When configured with `'one'`.

###### In

> 👉 **Note**: this example uses
> GFM ([`remark-gfm`][github-remark-gfm]).

```markdown
*␠[x] Mercury.

1.␠[ ] Venus.

2.␠[ ] Earth.
```

###### Out

No messages.

##### `gfm.md`

When configured with `'tab'`.

###### In

> 👉 **Note**: this example uses
> GFM ([`remark-gfm`][github-remark-gfm]).

```markdown
*␠␠␠[x] Mercury.

1.␠␠[ ] Venus.

2.␠␠[ ] Earth.
```

###### Out

No messages.

##### `loose-tight.md`

When configured with `'mixed'`.

###### In

```markdown
Loose lists have blank lines between items:

*␠␠␠Mercury.

*␠␠␠Venus.

…or between children of items:

1.␠␠Earth.

␠␠␠␠Earth is the third planet from the Sun and the only astronomical
␠␠␠␠object known to harbor life.
```

###### Out

No messages.

## Compatibility

Projects maintained by the unified collective are compatible with maintained
versions of Node.js.

When we cut a new major release, we drop support for unmaintained versions of
Node.
This means we try to keep the current release line,
`remark-lint-list-item-indent@4`,
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

[api-remark-lint-list-item-indent]: #unifieduseremarklintlistitemindent-options

[author]: https://wooorm.com

[badge-build-image]: https://github.com/remarkjs/remark-lint/workflows/main/badge.svg

[badge-build-url]: https://github.com/remarkjs/remark-lint/actions

[badge-chat-image]: https://img.shields.io/badge/chat-discussions-success.svg

[badge-chat-url]: https://github.com/remarkjs/remark/discussions

[badge-coverage-image]: https://img.shields.io/codecov/c/github/remarkjs/remark-lint.svg

[badge-coverage-url]: https://codecov.io/github/remarkjs/remark-lint

[badge-downloads-image]: https://img.shields.io/npm/dm/remark-lint-list-item-indent.svg

[badge-downloads-url]: https://www.npmjs.com/package/remark-lint-list-item-indent

[badge-funding-backers-image]: https://opencollective.com/unified/backers/badge.svg

[badge-funding-sponsors-image]: https://opencollective.com/unified/sponsors/badge.svg

[badge-funding-url]: https://opencollective.com/unified

[badge-size-image]: https://img.shields.io/bundlejs/size/remark-lint-list-item-indent

[badge-size-url]: https://bundlejs.com/?q=remark-lint-list-item-indent

[esm-sh]: https://esm.sh

[file-license]: https://github.com/remarkjs/remark-lint/blob/main/license

[github-dotfiles-coc]: https://github.com/remarkjs/.github/blob/main/code-of-conduct.md

[github-dotfiles-contributing]: https://github.com/remarkjs/.github/blob/main/contributing.md

[github-dotfiles-health]: https://github.com/remarkjs/.github

[github-dotfiles-support]: https://github.com/remarkjs/.github/blob/main/support.md

[github-gist-esm]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c

[github-remark-gfm]: https://github.com/remarkjs/remark-gfm

[github-remark-lint]: https://github.com/remarkjs/remark-lint

[github-remark-stringify]: https://github.com/remarkjs/remark/tree/main/packages/remark-stringify

[github-unified-transformer]: https://github.com/unifiedjs/unified#transformer

[npm-install]: https://docs.npmjs.com/cli/install

[typescript]: https://www.typescriptlang.org

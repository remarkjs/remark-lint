<!--This file is generated-->

# remark-lint-list-item-indent

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

[`remark-lint`][mono] rule to warn when spacing between list item markers and
content is inconsistent.

## Contents

*   [What is this?](#what-is-this)
*   [When should I use this?](#when-should-i-use-this)
*   [Presets](#presets)
*   [Install](#install)
*   [Use](#use)
*   [API](#api)
    *   [`unified().use(remarkLintListItemIndent[, config])`](#unifieduseremarklintlistitemindent-config)
*   [Recommendation](#recommendation)
*   [Fix](#fix)
*   [Examples](#examples)
*   [Compatibility](#compatibility)
*   [Contribute](#contribute)
*   [License](#license)

## What is this?

This package is a [unified][] ([remark][]) plugin, specifically a `remark-lint`
rule.
Lint rules check markdown code style.

## When should I use this?

You can use this package to check that the spacing between list item markers
and content is inconsistent.

## Presets

This rule is included in the following presets:

| Preset | Setting |
| - | - |
| [`remark-preset-lint-markdown-style-guide`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-preset-lint-markdown-style-guide) | `'mixed'` |
| [`remark-preset-lint-recommended`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-preset-lint-recommended) | `'tab-size'` |

## Install

This package is [ESM only][esm].
In Node.js (version 12.20+, 14.14+, or 16.0+), install with [npm][]:

```sh
npm install remark-lint-list-item-indent
```

In Deno with [Skypack][]:

```js
import remarkLintListItemIndent from 'https://cdn.skypack.dev/remark-lint-list-item-indent@3?dts'
```

In browsers with [Skypack][]:

```html
<script type="module">
  import remarkLintListItemIndent from 'https://cdn.skypack.dev/remark-lint-list-item-indent@3?min'
</script>
```

## Use

On the API:

```js
import {read} from 'to-vfile'
import {reporter} from 'vfile-reporter'
import {remark} from 'remark'
import remarkLint from 'remark-lint'
import remarkLintListItemIndent from 'remark-lint-list-item-indent'

main()

async function main() {
  const file = await remark()
    .use(remarkLint)
    .use(remarkLintListItemIndent)
    .process(await read('example.md'))

  console.error(reporter(file))
}
```

On the CLI:

```sh
remark --use remark-lint --use remark-lint-list-item-indent example.md
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
The default export is `remarkLintListItemIndent`.

### `unified().use(remarkLintListItemIndent[, config])`

This rule supports standard configuration that all remark lint rules accept
(such as `false` to turn it off or `[1, options]` to configure it).

The following options (default: `'tab-size'`) are accepted:

*   `'space'`
    — prefer a single space
*   `'tab-size'`
    — prefer spaces the size of the next tab stop
*   `'mixed'`
    — prefer `'space'` for tight lists and `'tab-size'` for loose lists

## Recommendation

First, some background.
The number of spaces that occur after list markers (`*`, `-`, and `+` for
unordered lists, or `.` and `)` for unordered lists) and before the content
on the first line, defines how much indentation can be used for further
lines.
At least one space is required and up to 4 spaces are allowed (if there is no
further content after the marker then it’s a blank line which is handled as
if there was one space; if there are 5 or more spaces and then content, it’s
also seen as one space and the rest is seen as indented code).

There are two types of lists in markdown (other than ordered and unordered):
tight and loose lists.
Lists are tight by default but if there is a blank line between two list
items or between two blocks inside an item, that turns the whole list into a
loose list.
When turning markdown into HTML, paragraphs in tight lists are not wrapped
in `<p>` tags.

Historically, how indentation of lists works in markdown has been a mess,
especially with how they interact with indented code.
CommonMark made that a *lot* better, but there remain (documented but
complex) edge cases and some behavior intuitive.
Due to this, the default of this list is `'tab-size'`, which worked the best
in most markdown parsers.
Currently, the situation between markdown parsers is better, so choosing
`'space'` (which seems to be the most common style used by authors) should
be okay.

## Fix

[`remark-stringify`](https://github.com/remarkjs/remark/tree/main/packages/remark-stringify)
uses `'tab-size'` (named `'tab'` there) by default.
[`listItemIndent: '1'` (for `'space'`) or `listItemIndent: 'mixed'`](https://github.com/remarkjs/remark/tree/main/packages/remark-stringify#optionslistitemindent)
is supported.

## Examples

##### `ok.md`

###### In

> 👉 **Note**: `·` represents a space.

```markdown
*···List
····item.

Paragraph.

11.·List
····item.

Paragraph.

*···List
····item.

*···List
····item.
```

###### Out

No messages.

##### `ok.md`

When configured with `'mixed'`.

###### In

> 👉 **Note**: `·` represents a space.

```markdown
*·List item.

Paragraph.

11.·List item

Paragraph.

*···List
····item.

*···List
····item.
```

###### Out

No messages.

##### `not-ok.md`

When configured with `'mixed'`.

###### In

> 👉 **Note**: `·` represents a space.

```markdown
*···List item.
```

###### Out

```text
1:5: Incorrect list-item indent: remove 2 spaces
```

##### `ok.md`

When configured with `'space'`.

###### In

> 👉 **Note**: `·` represents a space.

```markdown
*·List item.

Paragraph.

11.·List item

Paragraph.

*·List
··item.

*·List
··item.
```

###### Out

No messages.

##### `not-ok.md`

When configured with `'space'`.

###### In

> 👉 **Note**: `·` represents a space.

```markdown
*···List
····item.
```

###### Out

```text
1:5: Incorrect list-item indent: remove 2 spaces
```

##### `not-ok.md`

When configured with `'tab-size'`.

###### In

> 👉 **Note**: `·` represents a space.

```markdown
*·List
··item.
```

###### Out

```text
1:3: Incorrect list-item indent: add 2 spaces
```

##### `not-ok.md`

When configured with `'💩'`.

###### Out

```text
1:1: Incorrect list-item indent style `💩`: use either `'tab-size'`, `'space'`, or `'mixed'`
```

## Compatibility

Projects maintained by the unified collective are compatible with all maintained
versions of Node.js.
As of now, that is Node.js 12.20+, 14.14+, and 16.0+.
Our projects sometimes work with older versions, but this is not guaranteed.

## Contribute

See [`contributing.md`][contributing] in [`remarkjs/.github`][health] for ways
to get started.
See [`support.md`][support] for ways to get help.

This project has a [code of conduct][coc].
By interacting with this repository, organization, or community you agree to
abide by its terms.

## License

[MIT][license] © [Titus Wormer][author]

[build-badge]: https://github.com/remarkjs/remark-lint/workflows/main/badge.svg

[build]: https://github.com/remarkjs/remark-lint/actions

[coverage-badge]: https://img.shields.io/codecov/c/github/remarkjs/remark-lint.svg

[coverage]: https://codecov.io/github/remarkjs/remark-lint

[downloads-badge]: https://img.shields.io/npm/dm/remark-lint-list-item-indent.svg

[downloads]: https://www.npmjs.com/package/remark-lint-list-item-indent

[size-badge]: https://img.shields.io/bundlephobia/minzip/remark-lint-list-item-indent.svg

[size]: https://bundlephobia.com/result?p=remark-lint-list-item-indent

[sponsors-badge]: https://opencollective.com/unified/sponsors/badge.svg

[backers-badge]: https://opencollective.com/unified/backers/badge.svg

[collective]: https://opencollective.com/unified

[chat-badge]: https://img.shields.io/badge/chat-discussions-success.svg

[chat]: https://github.com/remarkjs/remark/discussions

[unified]: https://github.com/unifiedjs/unified

[remark]: https://github.com/remarkjs/remark

[mono]: https://github.com/remarkjs/remark-lint

[esm]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c

[skypack]: https://www.skypack.dev

[npm]: https://docs.npmjs.com/cli/install

[health]: https://github.com/remarkjs/.github

[contributing]: https://github.com/remarkjs/.github/blob/main/contributing.md

[support]: https://github.com/remarkjs/.github/blob/main/support.md

[coc]: https://github.com/remarkjs/.github/blob/main/code-of-conduct.md

[license]: https://github.com/remarkjs/remark-lint/blob/main/license

[author]: https://wooorm.com

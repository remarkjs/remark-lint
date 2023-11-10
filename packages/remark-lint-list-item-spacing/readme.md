<!--This file is generated-->

# remark-lint-list-item-spacing

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

[`remark-lint`][mono] rule to warn when lists are loose when they should be tight,
or vice versa.

## Contents

* [What is this?](#what-is-this)
* [When should I use this?](#when-should-i-use-this)
* [Presets](#presets)
* [Install](#install)
* [Use](#use)
* [API](#api)
  * [`unified().use(remarkLintListItemSpacing[, config])`](#unifieduseremarklintlistitemspacing-config)
* [Recommendation](#recommendation)
* [Examples](#examples)
* [Compatibility](#compatibility)
* [Contribute](#contribute)
* [License](#license)

## What is this?

This package is a [unified][] ([remark][]) plugin, specifically a `remark-lint`
rule.
Lint rules check markdown code style.

## When should I use this?

You can use this package to check that lists are loose or tight when
they should be.

## Presets

This rule is included in the following presets:

| Preset | Setting |
| - | - |
| [`remark-preset-lint-markdown-style-guide`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-preset-lint-markdown-style-guide) | |

## Install

This package is [ESM only][esm].
In Node.js (version 12.20+, 14.14+, or 16.0+), install with [npm][]:

```sh
npm install remark-lint-list-item-spacing
```

In Deno with [`esm.sh`][esmsh]:

```js
import remarkLintListItemSpacing from 'https://esm.sh/remark-lint-list-item-spacing@4'
```

In browsers with [`esm.sh`][esmsh]:

```html
<script type="module">
  import remarkLintListItemSpacing from 'https://esm.sh/remark-lint-list-item-spacing@4?bundle'
</script>
```

## Use

On the API:

```js
import {read} from 'to-vfile'
import {reporter} from 'vfile-reporter'
import {remark} from 'remark'
import remarkLint from 'remark-lint'
import remarkLintListItemSpacing from 'remark-lint-list-item-spacing'

main()

async function main() {
  const file = await remark()
    .use(remarkLint)
    .use(remarkLintListItemSpacing)
    .process(await read('example.md'))

  console.error(reporter(file))
}
```

On the CLI:

```sh
remark --use remark-lint --use remark-lint-list-item-spacing example.md
```

On the CLI in a config file (here a `package.json`):

```diff
 …
 "remarkConfig": {
   "plugins": [
     …
     "remark-lint",
+    "remark-lint-list-item-spacing",
     …
   ]
 }
 …
```

## API

This package exports no identifiers.
The default export is `remarkLintListItemSpacing`.

### `unified().use(remarkLintListItemSpacing[, config])`

This rule supports standard configuration that all remark lint rules accept
(such as `false` to turn it off or `[1, options]` to configure it).

The following options (default: `undefined`) are accepted:

* `Object` with the following fields:
  * `checkBlanks` (`boolean`, default: `false`)
    — adhere to CommonMark looseness instead of markdown-style-guide
    preference

## Recommendation

First, some background.
There are two types of lists in markdown (other than ordered and unordered):
tight and loose lists.
Lists are tight by default but if there is a blank line between two list
items or between two blocks inside an item, that turns the whole list into a
loose list.
When turning markdown into HTML, paragraphs in tight lists are not wrapped
in `<p>` tags.

This rule defaults to the
[`markdown style guide`](https://cirosantilli.com/markdown-style-guide/)
preference for which lists should be loose or not: loose when at least one
item spans more than one line, tight otherwise.
With `{checkBlanks: true}`, this rule dictates that when at least one item is
loose, all items must be loose.

## Examples

##### `ok.md`

###### In

```markdown
A tight list:

-   item 1
-   item 2
-   item 3

A loose list:

-   Wrapped
    item

-   item 2

-   item 3
```

###### Out

No messages.

##### `not-ok.md`

###### In

```markdown
A tight list:

-   Wrapped
    item
-   item 2
-   item 3

A loose list:

-   item 1

-   item 2

-   item 3
```

###### Out

```text
4:9-5:1: Missing new line after list item
5:11-6:1: Missing new line after list item
10:11-12:1: Extraneous new line after list item
12:11-14:1: Extraneous new line after list item
```

##### `ok.md`

When configured with `{ checkBlanks: true }`.

###### In

```markdown
A tight list:

-   item 1
    - item 1.A
-   item 2
    > Block quote

A loose list:

-   item 1

    - item 1.A

-   item 2

    > Block quote
```

###### Out

No messages.

##### `not-ok.md`

When configured with `{ checkBlanks: true }`.

###### In

```markdown
A tight list:

-   item 1

    - item 1.A
-   item 2

    > Block quote
-   item 3

A loose list:

-   item 1
    - item 1.A

-   item 2
    > Block quote
```

###### Out

```text
5:15-6:1: Missing new line after list item
8:18-9:1: Missing new line after list item
14:15-16:1: Extraneous new line after list item
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

[downloads-badge]: https://img.shields.io/npm/dm/remark-lint-list-item-spacing.svg

[downloads]: https://www.npmjs.com/package/remark-lint-list-item-spacing

[size-badge]: https://img.shields.io/bundlephobia/minzip/remark-lint-list-item-spacing.svg

[size]: https://bundlephobia.com/result?p=remark-lint-list-item-spacing

[sponsors-badge]: https://opencollective.com/unified/sponsors/badge.svg

[backers-badge]: https://opencollective.com/unified/backers/badge.svg

[collective]: https://opencollective.com/unified

[chat-badge]: https://img.shields.io/badge/chat-discussions-success.svg

[chat]: https://github.com/remarkjs/remark/discussions

[unified]: https://github.com/unifiedjs/unified

[remark]: https://github.com/remarkjs/remark

[mono]: https://github.com/remarkjs/remark-lint

[esm]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c

[esmsh]: https://esm.sh

[npm]: https://docs.npmjs.com/cli/install

[health]: https://github.com/remarkjs/.github

[contributing]: https://github.com/remarkjs/.github/blob/main/contributing.md

[support]: https://github.com/remarkjs/.github/blob/main/support.md

[coc]: https://github.com/remarkjs/.github/blob/main/code-of-conduct.md

[license]: https://github.com/remarkjs/remark-lint/blob/main/license

[author]: https://wooorm.com

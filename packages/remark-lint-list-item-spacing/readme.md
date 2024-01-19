<!--This file is generated-->

# remark-lint-list-item-spacing

[![Build][badge-build-image]][badge-build-url]
[![Coverage][badge-coverage-image]][badge-coverage-url]
[![Downloads][badge-downloads-image]][badge-downloads-url]
[![Size][badge-size-image]][badge-size-url]
[![Sponsors][badge-funding-sponsors-image]][badge-funding-url]
[![Backers][badge-funding-backers-image]][badge-funding-url]
[![Chat][badge-chat-image]][badge-chat-url]

[`remark-lint`][github-remark-lint] rule to warn when lists violate a given style.

## Contents

* [What is this?](#what-is-this)
* [When should I use this?](#when-should-i-use-this)
* [Presets](#presets)
* [Install](#install)
* [Use](#use)
* [API](#api)
  * [`unified().use(remarkLintListItemSpacing[, options])`](#unifieduseremarklintlistitemspacing-options)
  * [`Options`](#options)
* [Recommendation](#recommendation)
* [Examples](#examples)
* [Compatibility](#compatibility)
* [Contribute](#contribute)
* [License](#license)

## What is this?

This package checks blank lines between list items.

## When should I use this?

You can use this package to check the style of lists.

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
npm install remark-lint-list-item-spacing
```

In Deno with [`esm.sh`][esm-sh]:

```js
import remarkLintListItemSpacing from 'https://esm.sh/remark-lint-list-item-spacing@4'
```

In browsers with [`esm.sh`][esm-sh]:

```html
<script type="module">
  import remarkLintListItemSpacing from 'https://esm.sh/remark-lint-list-item-spacing@4?bundle'
</script>
```

## Use

On the API:

```js
import remarkLint from 'remark-lint'
import remarkLintListItemSpacing from 'remark-lint-list-item-spacing'
import remarkParse from 'remark-parse'
import remarkStringify from 'remark-stringify'
import {read} from 'to-vfile'
import {unified} from 'unified'
import {reporter} from 'vfile-reporter'

const file = await read('example.md')

await unified()
  .use(remarkParse)
  .use(remarkLint)
  .use(remarkLintListItemSpacing)
  .use(remarkStringify)
  .process(file)

console.error(reporter(file))
```

On the CLI:

```sh
remark --frail --use remark-lint --use remark-lint-list-item-spacing .
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
It exports the [TypeScript][typescript] type
[`Options`][api-options].
The default export is
[`remarkLintListItemSpacing`][api-remark-lint-list-item-spacing].

### `unified().use(remarkLintListItemSpacing[, options])`

Warn when lists violate a given style.

###### Parameters

* `options` ([`Options`][api-options], optional)
  — configuration

###### Returns

Transform ([`Transformer` from `unified`][github-unified-transformer]).

### `Options`

Configuration (TypeScript type).

###### Fields

* `checkBlanks` (`boolean`, default: `false`)
  — expect blank lines between items based on whether an item has blank
  lines *in* them;
  the default is to expect blank lines based on whether items span multiple
  lines

## Recommendation

First some background.
Regardless of ordered and unordered,
there are two kinds of lists in markdown,
tight and loose.
Lists are tight by default but if there is a blank line between two list
items or between two blocks inside an item,
that turns the whole list into a loose list.
When turning markdown into HTML,
paragraphs in tight lists are not wrapped in `<p>` tags.

This rule defaults to the [`markdown-style-guide`][markdown-style-guide]
preference for which lists should be loose or not:
loose when at least one item spans more than one line and tight otherwise.
With `{checkBlanks: true}`,
this rule follows whether a list is loose or not according to Commonmark,
and when one item is loose,
all items must be loose.

## Examples

##### `ok.md`

###### In

```markdown
* Mercury.
* Venus.

+   Mercury and
    Venus.

+   Earth.
```

###### Out

No messages.

##### `ok-check-blanks.md`

When configured with `{ checkBlanks: true }`.

###### In

```markdown
* Mercury.
* Venus.

+   Mercury

    Mercury is the first planet from the Sun and the smallest in the Solar
    System.

+   Earth.
```

###### Out

No messages.

##### `not-ok.md`

###### In

```markdown
* Mercury.

* Venus.

+   Mercury and
    Venus.
+   Earth.

*   Mercury.

    Mercury is the first planet from the Sun and the smallest in the Solar
    System.
*   Earth.
```

###### Out

```text
1:11-3:1: Unexpected `1` blank line between list items, expected `0` blank lines, remove `1` blank line
6:11-7:1: Unexpected `0` blank lines between list items, expected `1` blank line, add `1` blank line
12:12-13:1: Unexpected `0` blank lines between list items, expected `1` blank line, add `1` blank line
```

##### `not-ok-blank.md`

When configured with `{ checkBlanks: true }`.

###### In

```markdown
* Mercury.

* Venus.

+   Mercury and
    Venus.

+   Earth.

*   Mercury.

    Mercury is the first planet from the Sun and the smallest in the Solar
    System.
*   Earth.
```

###### Out

```text
1:11-3:1: Unexpected `1` blank line between list items, expected `0` blank lines, remove `1` blank line
6:11-8:1: Unexpected `1` blank line between list items, expected `0` blank lines, remove `1` blank line
13:12-14:1: Unexpected `0` blank lines between list items, expected `1` blank line, add `1` blank line
```

## Compatibility

Projects maintained by the unified collective are compatible with maintained
versions of Node.js.

When we cut a new major release, we drop support for unmaintained versions of
Node.
This means we try to keep the current release line,
`remark-lint-list-item-spacing@4`,
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

[api-remark-lint-list-item-spacing]: #unifieduseremarklintlistitemspacing-options

[author]: https://wooorm.com

[badge-build-image]: https://github.com/remarkjs/remark-lint/workflows/main/badge.svg

[badge-build-url]: https://github.com/remarkjs/remark-lint/actions

[badge-chat-image]: https://img.shields.io/badge/chat-discussions-success.svg

[badge-chat-url]: https://github.com/remarkjs/remark/discussions

[badge-coverage-image]: https://img.shields.io/codecov/c/github/remarkjs/remark-lint.svg

[badge-coverage-url]: https://codecov.io/github/remarkjs/remark-lint

[badge-downloads-image]: https://img.shields.io/npm/dm/remark-lint-list-item-spacing.svg

[badge-downloads-url]: https://www.npmjs.com/package/remark-lint-list-item-spacing

[badge-funding-backers-image]: https://opencollective.com/unified/backers/badge.svg

[badge-funding-sponsors-image]: https://opencollective.com/unified/sponsors/badge.svg

[badge-funding-url]: https://opencollective.com/unified

[badge-size-image]: https://img.shields.io/bundlejs/size/remark-lint-list-item-spacing

[badge-size-url]: https://bundlejs.com/?q=remark-lint-list-item-spacing

[esm-sh]: https://esm.sh

[file-license]: https://github.com/remarkjs/remark-lint/blob/main/license

[github-dotfiles-coc]: https://github.com/remarkjs/.github/blob/main/code-of-conduct.md

[github-dotfiles-contributing]: https://github.com/remarkjs/.github/blob/main/contributing.md

[github-dotfiles-health]: https://github.com/remarkjs/.github

[github-dotfiles-support]: https://github.com/remarkjs/.github/blob/main/support.md

[github-gist-esm]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c

[github-remark-lint]: https://github.com/remarkjs/remark-lint

[github-unified-transformer]: https://github.com/unifiedjs/unified#transformer

[markdown-style-guide]: https://cirosantilli.com/markdown-style-guide/

[npm-install]: https://docs.npmjs.com/cli/install

[typescript]: https://www.typescriptlang.org

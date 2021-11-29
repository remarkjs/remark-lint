<!--This file is generated-->

# remark-lint-ordered-list-marker-style

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

[`remark-lint`][mono] rule to warn when ordered list markers are inconsistent.

## Contents

*   [What is this?](#what-is-this)
*   [When should I use this?](#when-should-i-use-this)
*   [Presets](#presets)
*   [Install](#install)
*   [Use](#use)
*   [API](#api)
    *   [`unified().use(remarkLintOrderedListMarkerStyle[, config])`](#unifieduseremarklintorderedlistmarkerstyle-config)
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

You can use this package to check that ordered list markers are consistent.

## Presets

This rule is included in the following presets:

| Preset | Setting |
| - | - |
| [`remark-preset-lint-consistent`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-preset-lint-consistent) | `'consistent'` |
| [`remark-preset-lint-markdown-style-guide`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-preset-lint-markdown-style-guide) | `'.'` |
| [`remark-preset-lint-recommended`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-preset-lint-recommended) | `'.'` |

## Install

This package is [ESM only][esm].
In Node.js (version 12.20+, 14.14+, or 16.0+), install with [npm][]:

```sh
npm install remark-lint-ordered-list-marker-style
```

In Deno with [Skypack][]:

```js
import remarkLintOrderedListMarkerStyle from 'https://cdn.skypack.dev/remark-lint-ordered-list-marker-style@3?dts'
```

In browsers with [Skypack][]:

```html
<script type="module">
  import remarkLintOrderedListMarkerStyle from 'https://cdn.skypack.dev/remark-lint-ordered-list-marker-style@3?min'
</script>
```

## Use

On the API:

```js
import {read} from 'to-vfile'
import {reporter} from 'vfile-reporter'
import {remark} from 'remark'
import remarkLint from 'remark-lint'
import remarkLintOrderedListMarkerStyle from 'remark-lint-ordered-list-marker-style'

main()

async function main() {
  const file = await remark()
    .use(remarkLint)
    .use(remarkLintOrderedListMarkerStyle)
    .process(await read('example.md'))

  console.error(reporter(file))
}
```

On the CLI:

```sh
remark --use remark-lint --use remark-lint-ordered-list-marker-style example.md
```

On the CLI in a config file (here a `package.json`):

```diff
 …
 "remarkConfig": {
   "plugins": [
     …
     "remark-lint",
+    "remark-lint-ordered-list-marker-style",
     …
   ]
 }
 …
```

## API

This package exports no identifiers.
The default export is `remarkLintOrderedListMarkerStyle`.

### `unified().use(remarkLintOrderedListMarkerStyle[, config])`

This rule supports standard configuration that all remark lint rules accept
(such as `false` to turn it off or `[1, options]` to configure it).

The following options (default: `'consistent'`) are accepted:

*   `'.'`
    — prefer dots
*   `')'`
    — prefer parens
*   `'consistent'`
    — detect the first used style and warn when further markers differ

## Recommendation

Parens for list markers were not supported in markdown before CommonMark.
While they should work in most places now, not all markdown parsers follow
CommonMark.
Due to this, it’s recommended to prefer dots.

## Fix

[`remark-stringify`](https://github.com/remarkjs/remark/tree/main/packages/remark-stringify)
formats ordered lists with dots by default.
Pass
[`bulletOrdered: ')'`](https://github.com/remarkjs/remark/tree/main/packages/remark-stringify#optionsbulletordered)
to always use parens.

## Examples

##### `ok.md`

###### In

```markdown
1.  Foo


1.  Bar

Unordered lists are not affected by this rule.

* Foo
```

###### Out

No messages.

##### `not-ok.md`

###### In

```markdown
1.  Foo

2)  Bar
```

###### Out

```text
3:1-3:8: Marker style should be `.`
```

##### `ok.md`

When configured with `'.'`.

###### In

```markdown
1.  Foo

2.  Bar
```

###### Out

No messages.

##### `ok.md`

When configured with `')'`.

###### In

```markdown
1)  Foo

2)  Bar
```

###### Out

No messages.

##### `not-ok.md`

When configured with `'💩'`.

###### Out

```text
1:1: Incorrect ordered list item marker style `💩`: use either `'.'` or `')'`
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

[downloads-badge]: https://img.shields.io/npm/dm/remark-lint-ordered-list-marker-style.svg

[downloads]: https://www.npmjs.com/package/remark-lint-ordered-list-marker-style

[size-badge]: https://img.shields.io/bundlephobia/minzip/remark-lint-ordered-list-marker-style.svg

[size]: https://bundlephobia.com/result?p=remark-lint-ordered-list-marker-style

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

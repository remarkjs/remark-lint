<!--This file is generated-->

# remark-lint-list-item-bullet-indent

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

[`remark-lint`][mono] rule to warn when list items are indented.

## Contents

*   [What is this?](#what-is-this)
*   [When should I use this?](#when-should-i-use-this)
*   [Presets](#presets)
*   [Install](#install)
*   [Use](#use)
*   [API](#api)
    *   [`unified().use(remarkLintListItemBulletIndent[, config])`](#unifieduseremarklintlistitembulletindent-config)
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

You can use this package to check that list items are not indented.

## Presets

This rule is included in the following presets:

| Preset | Setting |
| - | - |
| [`remark-preset-lint-recommended`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-preset-lint-recommended) | |

## Install

This package is [ESM only][esm].
In Node.js (version 12.20+, 14.14+, or 16.0+), install with [npm][]:

```sh
npm install remark-lint-list-item-bullet-indent
```

In Deno with [Skypack][]:

```js
import remarkLintListItemBulletIndent from 'https://cdn.skypack.dev/remark-lint-list-item-bullet-indent@4?dts'
```

In browsers with [Skypack][]:

```html
<script type="module">
  import remarkLintListItemBulletIndent from 'https://cdn.skypack.dev/remark-lint-list-item-bullet-indent@4?min'
</script>
```

## Use

On the API:

```js
import {read} from 'to-vfile'
import {reporter} from 'vfile-reporter'
import {remark} from 'remark'
import remarkLint from 'remark-lint'
import remarkLintListItemBulletIndent from 'remark-lint-list-item-bullet-indent'

main()

async function main() {
  const file = await remark()
    .use(remarkLint)
    .use(remarkLintListItemBulletIndent)
    .process(await read('example.md'))

  console.error(reporter(file))
}
```

On the CLI:

```sh
remark --use remark-lint --use remark-lint-list-item-bullet-indent example.md
```

On the CLI in a config file (here a `package.json`):

```diff
 …
 "remarkConfig": {
   "plugins": [
     …
     "remark-lint",
+    "remark-lint-list-item-bullet-indent",
     …
   ]
 }
 …
```

## API

This package exports no identifiers.
The default export is `remarkLintListItemBulletIndent`.

### `unified().use(remarkLintListItemBulletIndent[, config])`

This rule supports standard configuration that all remark lint rules accept
(such as `false` to turn it off or `[1, options]` to configure it).

There are no options.

## Recommendation

There is no specific handling of indented list items (or anything else) in
markdown.
While it is possible to use an indent to align ordered lists on their marker:

```markdown
  1. One
 10. Ten
100. Hundred
```

…such a style is uncommon and a bit hard to maintain: adding a 10th item
means 9 other items have to change (more arduous, while unlikely, would be
the 100th item).
Hence, it’s recommended to not indent items and to turn this rule on.

## Fix

[`remark-stringify`](https://github.com/remarkjs/remark/tree/main/packages/remark-stringify)
formats all items without indent.

## Examples

##### `ok.md`

###### In

```markdown
Paragraph.

* List item
* List item
```

###### Out

No messages.

##### `not-ok.md`

###### In

> 👉 **Note**: `·` represents a space.

```markdown
Paragraph.

·* List item
·* List item
```

###### Out

```text
3:2: Incorrect indentation before bullet: remove 1 space
4:2: Incorrect indentation before bullet: remove 1 space
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

[downloads-badge]: https://img.shields.io/npm/dm/remark-lint-list-item-bullet-indent.svg

[downloads]: https://www.npmjs.com/package/remark-lint-list-item-bullet-indent

[size-badge]: https://img.shields.io/bundlephobia/minzip/remark-lint-list-item-bullet-indent.svg

[size]: https://bundlephobia.com/result?p=remark-lint-list-item-bullet-indent

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

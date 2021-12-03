<!--This file is generated-->

# remark-lint-no-heading-indent

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

[`remark-lint`][mono] rule to warn when headings are indented.

## Contents

*   [What is this?](#what-is-this)
*   [When should I use this?](#when-should-i-use-this)
*   [Presets](#presets)
*   [Install](#install)
*   [Use](#use)
*   [API](#api)
    *   [`unified().use(remarkLintNoHeadingIndent[, config])`](#unifieduseremarklintnoheadingindent-config)
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

You can use this package to check that headings are not indented.

## Presets

This rule is not included in a preset maintained here.

## Install

This package is [ESM only][esm].
In Node.js (version 12.20+, 14.14+, or 16.0+), install with [npm][]:

```sh
npm install remark-lint-no-heading-indent
```

In Deno with [Skypack][]:

```js
import remarkLintNoHeadingIndent from 'https://cdn.skypack.dev/remark-lint-no-heading-indent@4?dts'
```

In browsers with [Skypack][]:

```html
<script type="module">
  import remarkLintNoHeadingIndent from 'https://cdn.skypack.dev/remark-lint-no-heading-indent@4?min'
</script>
```

## Use

On the API:

```js
import {read} from 'to-vfile'
import {reporter} from 'vfile-reporter'
import {remark} from 'remark'
import remarkLint from 'remark-lint'
import remarkLintNoHeadingIndent from 'remark-lint-no-heading-indent'

main()

async function main() {
  const file = await remark()
    .use(remarkLint)
    .use(remarkLintNoHeadingIndent)
    .process(await read('example.md'))

  console.error(reporter(file))
}
```

On the CLI:

```sh
remark --use remark-lint --use remark-lint-no-heading-indent example.md
```

On the CLI in a config file (here a `package.json`):

```diff
 …
 "remarkConfig": {
   "plugins": [
     …
     "remark-lint",
+    "remark-lint-no-heading-indent",
     …
   ]
 }
 …
```

## API

This package exports no identifiers.
The default export is `remarkLintNoHeadingIndent`.

### `unified().use(remarkLintNoHeadingIndent[, config])`

This rule supports standard configuration that all remark lint rules accept
(such as `false` to turn it off or `[1, options]` to configure it).

There are no options.

## Recommendation

There is no specific handling of indented headings (or anything else) in
markdown.
While it is possible to use an indent to headings on their text:

```markdown
   # One
  ## Two
 ### Three
#### Four
```

…such style is uncommon, a bit hard to maintain, and it’s impossible to add a
heading with a rank of 5 as it would form indented code instead.
Hence, it’s recommended to not indent headings and to turn this rule on.

## Fix

[`remark-stringify`](https://github.com/remarkjs/remark/tree/main/packages/remark-stringify)
formats all headings without indent.

## Examples

##### `ok.md`

###### In

> 👉 **Note**: `·` represents a space.

```markdown
#·Hello world

Foo
-----

#·Hello world·#

Bar
=====
```

###### Out

No messages.

##### `not-ok.md`

###### In

> 👉 **Note**: `·` represents a space.

```markdown
···# Hello world

·Foo
-----

·# Hello world #

···Bar
=====
```

###### Out

```text
1:4: Remove 3 spaces before this heading
3:2: Remove 1 space before this heading
6:2: Remove 1 space before this heading
8:4: Remove 3 spaces before this heading
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

[downloads-badge]: https://img.shields.io/npm/dm/remark-lint-no-heading-indent.svg

[downloads]: https://www.npmjs.com/package/remark-lint-no-heading-indent

[size-badge]: https://img.shields.io/bundlephobia/minzip/remark-lint-no-heading-indent.svg

[size]: https://bundlephobia.com/result?p=remark-lint-no-heading-indent

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

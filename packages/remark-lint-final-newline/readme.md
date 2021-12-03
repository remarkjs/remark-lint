<!--This file is generated-->

# remark-lint-final-newline

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

[`remark-lint`][mono] rule to warn when files don’t end in a newline.

## Contents

*   [What is this?](#what-is-this)
*   [When should I use this?](#when-should-i-use-this)
*   [Presets](#presets)
*   [Install](#install)
*   [Use](#use)
*   [API](#api)
    *   [`unified().use(remarkLintFinalNewline[, config])`](#unifieduseremarklintfinalnewline-config)
*   [Recommendation](#recommendation)
*   [Fix](#fix)
*   [Example](#example)
*   [Compatibility](#compatibility)
*   [Contribute](#contribute)
*   [License](#license)

## What is this?

This package is a [unified][] ([remark][]) plugin, specifically a `remark-lint`
rule.
Lint rules check markdown code style.

## When should I use this?

You can use this package to check that fenced code markers are consistent.

## Presets

This rule is included in the following presets:

| Preset | Setting |
| - | - |
| [`remark-preset-lint-recommended`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-preset-lint-recommended) | |

## Install

This package is [ESM only][esm].
In Node.js (version 12.20+, 14.14+, or 16.0+), install with [npm][]:

```sh
npm install remark-lint-final-newline
```

In Deno with [Skypack][]:

```js
import remarkLintFinalNewline from 'https://cdn.skypack.dev/remark-lint-final-newline@2?dts'
```

In browsers with [Skypack][]:

```html
<script type="module">
  import remarkLintFinalNewline from 'https://cdn.skypack.dev/remark-lint-final-newline@2?min'
</script>
```

## Use

On the API:

```js
import {read} from 'to-vfile'
import {reporter} from 'vfile-reporter'
import {remark} from 'remark'
import remarkLint from 'remark-lint'
import remarkLintFinalNewline from 'remark-lint-final-newline'

main()

async function main() {
  const file = await remark()
    .use(remarkLint)
    .use(remarkLintFinalNewline)
    .process(await read('example.md'))

  console.error(reporter(file))
}
```

On the CLI:

```sh
remark --use remark-lint --use remark-lint-final-newline example.md
```

On the CLI in a config file (here a `package.json`):

```diff
 …
 "remarkConfig": {
   "plugins": [
     …
     "remark-lint",
+    "remark-lint-final-newline",
     …
   ]
 }
 …
```

## API

This package exports no identifiers.
The default export is `remarkLintFinalNewline`.

### `unified().use(remarkLintFinalNewline[, config])`

This rule supports standard configuration that all remark lint rules accept
(such as `false` to turn it off or `[1, options]` to configure it).

There are no options.

## Recommendation

Turn this rule on.
See [StackExchange](https://unix.stackexchange.com/questions/18743) for more
info.

## Fix

[`remark-stringify`](https://github.com/remarkjs/remark/tree/main/packages/remark-stringify)
always adds final line endings.

## Example

##### `ok.md`

###### In

> 👉 **Note**: `␊` represents a line feed (`\n`).

```markdown
Alpha␊
```

###### Out

No messages.

##### `not-ok.md`

###### In

> 👉 **Note**: `␀` represents the end of the file.

```markdown
Bravo␀
```

###### Out

```text
1:1: Missing newline character at end of file
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

[downloads-badge]: https://img.shields.io/npm/dm/remark-lint-final-newline.svg

[downloads]: https://www.npmjs.com/package/remark-lint-final-newline

[size-badge]: https://img.shields.io/bundlephobia/minzip/remark-lint-final-newline.svg

[size]: https://bundlephobia.com/result?p=remark-lint-final-newline

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

<!--This file is generated-->

# remark-lint-no-shell-dollars

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

[`remark-lint`][mono] rule to warn every line in shell code is preceded by `$`s.

## Contents

*   [What is this?](#what-is-this)
*   [When should I use this?](#when-should-i-use-this)
*   [Presets](#presets)
*   [Install](#install)
*   [Use](#use)
*   [API](#api)
    *   [`unified().use(remarkLintNoShellDollars[, config])`](#unifieduseremarklintnoshelldollars-config)
*   [Recommendation](#recommendation)
*   [Examples](#examples)
*   [Compatibility](#compatibility)
*   [Contribute](#contribute)
*   [License](#license)

## What is this?

This package is a [unified][] ([remark][]) plugin, specifically a `remark-lint`
rule.
Lint rules check markdown code style.

## When should I use this?

You can use this package to check that not all lines in shell code are
preceded by dollars (`$`).

## Presets

This rule is included in the following presets:

| Preset | Setting |
| - | - |
| [`remark-preset-lint-markdown-style-guide`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-preset-lint-markdown-style-guide) | |

## Install

This package is [ESM only][esm].
In Node.js (version 12.20+, 14.14+, or 16.0+), install with [npm][]:

```sh
npm install remark-lint-no-shell-dollars
```

In Deno with [Skypack][]:

```js
import remarkLintNoShellDollars from 'https://cdn.skypack.dev/remark-lint-no-shell-dollars@3?dts'
```

In browsers with [Skypack][]:

```html
<script type="module">
  import remarkLintNoShellDollars from 'https://cdn.skypack.dev/remark-lint-no-shell-dollars@3?min'
</script>
```

## Use

On the API:

```js
import {read} from 'to-vfile'
import {reporter} from 'vfile-reporter'
import {remark} from 'remark'
import remarkLint from 'remark-lint'
import remarkLintNoShellDollars from 'remark-lint-no-shell-dollars'

main()

async function main() {
  const file = await remark()
    .use(remarkLint)
    .use(remarkLintNoShellDollars)
    .process(await read('example.md'))

  console.error(reporter(file))
}
```

On the CLI:

```sh
remark --use remark-lint --use remark-lint-no-shell-dollars example.md
```

On the CLI in a config file (here a `package.json`):

```diff
 …
 "remarkConfig": {
   "plugins": [
     …
     "remark-lint",
+    "remark-lint-no-shell-dollars",
     …
   ]
 }
 …
```

## API

This package exports no identifiers.
The default export is `remarkLintNoShellDollars`.

### `unified().use(remarkLintNoShellDollars[, config])`

This rule supports standard configuration that all remark lint rules accept
(such as `false` to turn it off or `[1, options]` to configure it).

There are no options.

## Recommendation

Dollars make copy/pasting hard.
Either put both dollars in front of some lines (to indicate shell commands)
and don’t put them in front of other lines, or use fenced code to indicate
shell commands on their own, followed by another fenced code that contains
just the output.

## Examples

##### `ok.md`

###### In

````markdown
```bash
echo a
```

```sh
echo a
echo a > file
```

```zsh
$ echo a
a
$ echo a > file
```

Some empty code:

```command
```

It’s fine to use dollars in non-shell code.

```js
$('div').remove()
```
````

###### Out

No messages.

##### `not-ok.md`

###### In

````markdown
```sh
$ echo a
```

```bash
$ echo a
$ echo a > file
```
````

###### Out

```text
1:1-3:4: Do not use dollar signs before shell commands
5:1-8:4: Do not use dollar signs before shell commands
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

[downloads-badge]: https://img.shields.io/npm/dm/remark-lint-no-shell-dollars.svg

[downloads]: https://www.npmjs.com/package/remark-lint-no-shell-dollars

[size-badge]: https://img.shields.io/bundlephobia/minzip/remark-lint-no-shell-dollars.svg

[size]: https://bundlephobia.com/result?p=remark-lint-no-shell-dollars

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

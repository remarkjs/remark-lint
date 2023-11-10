<!--This file is generated-->

# remark-lint-code-block-style

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

[`remark-lint`][mono] rule to warn when code blocks violate a given style.

## Contents

* [What is this?](#what-is-this)
* [When should I use this?](#when-should-i-use-this)
* [Presets](#presets)
* [Install](#install)
* [Use](#use)
* [API](#api)
  * [`unified().use(remarkLintCodeBlockStyle[, config])`](#unifieduseremarklintcodeblockstyle-config)
* [Recommendation](#recommendation)
* [Fix](#fix)
* [Examples](#examples)
* [Compatibility](#compatibility)
* [Contribute](#contribute)
* [License](#license)

## What is this?

This package is a [unified][] ([remark][]) plugin, specifically a `remark-lint`
rule.
Lint rules check markdown code style.

## When should I use this?

You can use this package to check that code blocks are consistent.

## Presets

This rule is included in the following presets:

| Preset | Setting |
| - | - |
| [`remark-preset-lint-consistent`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-preset-lint-consistent) | `'consistent'` |
| [`remark-preset-lint-markdown-style-guide`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-preset-lint-markdown-style-guide) | `'fenced'` |

## Install

This package is [ESM only][esm].
In Node.js (version 12.20+, 14.14+, or 16.0+), install with [npm][]:

```sh
npm install remark-lint-code-block-style
```

In Deno with [`esm.sh`][esmsh]:

```js
import remarkLintCodeBlockStyle from 'https://esm.sh/remark-lint-code-block-style@3'
```

In browsers with [`esm.sh`][esmsh]:

```html
<script type="module">
  import remarkLintCodeBlockStyle from 'https://esm.sh/remark-lint-code-block-style@3?bundle'
</script>
```

## Use

On the API:

```js
import {read} from 'to-vfile'
import {reporter} from 'vfile-reporter'
import {remark} from 'remark'
import remarkLint from 'remark-lint'
import remarkLintCodeBlockStyle from 'remark-lint-code-block-style'

main()

async function main() {
  const file = await remark()
    .use(remarkLint)
    .use(remarkLintCodeBlockStyle)
    .process(await read('example.md'))

  console.error(reporter(file))
}
```

On the CLI:

```sh
remark --use remark-lint --use remark-lint-code-block-style example.md
```

On the CLI in a config file (here a `package.json`):

```diff
 …
 "remarkConfig": {
   "plugins": [
     …
     "remark-lint",
+    "remark-lint-code-block-style",
     …
   ]
 }
 …
```

## API

This package exports no identifiers.
The default export is `remarkLintCodeBlockStyle`.

### `unified().use(remarkLintCodeBlockStyle[, config])`

This rule supports standard configuration that all remark lint rules accept
(such as `false` to turn it off or `[1, options]` to configure it).

The following options (default: `'consistent'`) are accepted:

* `'fenced'`
  — prefer fenced code blocks:
  ````markdown
  ```js
  code()
  ```
  ````
* `'indented'`
  — prefer indented code blocks:
  ```markdown
      code()
  ```
* `'consistent'`
  — detect the first used style and warn when further code blocks differ

## Recommendation

Indentation in markdown is complex, especially because lists and indented
code can interfere in unexpected ways.
Fenced code has more features than indented code: importantly, specifying a
programming language.
Since CommonMark took the idea of fenced code from GFM, fenced code became
widely supported.
Due to this, it’s recommended to configure this rule with `'fenced'`.

## Fix

[`remark-stringify`](https://github.com/remarkjs/remark/tree/main/packages/remark-stringify)
formats code blocks as fenced code when they have a language flag and as
indented code otherwise.
Pass
[`fences: true`](https://github.com/remarkjs/remark/tree/main/packages/remark-stringify#optionsfences)
to always use fenced code.

## Examples

##### `ok.md`

When configured with `'indented'`.

###### In

```markdown
    alpha()

Paragraph.

    bravo()
```

###### Out

No messages.

##### `not-ok.md`

When configured with `'indented'`.

###### In

````markdown
```
alpha()
```

Paragraph.

```
bravo()
```
````

###### Out

```text
1:1-3:4: Code blocks should be indented
7:1-9:4: Code blocks should be indented
```

##### `ok.md`

When configured with `'fenced'`.

###### In

````markdown
```
alpha()
```

Paragraph.

```
bravo()
```
````

###### Out

No messages.

##### `not-ok-fenced.md`

When configured with `'fenced'`.

###### In

```markdown
    alpha()

Paragraph.

    bravo()
```

###### Out

```text
1:1-1:12: Code blocks should be fenced
5:1-5:12: Code blocks should be fenced
```

##### `not-ok-consistent.md`

###### In

````markdown
    alpha()

Paragraph.

```
bravo()
```
````

###### Out

```text
5:1-7:4: Code blocks should be indented
```

##### `not-ok-incorrect.md`

When configured with `'💩'`.

###### Out

```text
1:1: Incorrect code block style `💩`: use either `'consistent'`, `'fenced'`, or `'indented'`
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

[downloads-badge]: https://img.shields.io/npm/dm/remark-lint-code-block-style.svg

[downloads]: https://www.npmjs.com/package/remark-lint-code-block-style

[size-badge]: https://img.shields.io/bundlephobia/minzip/remark-lint-code-block-style.svg

[size]: https://bundlephobia.com/result?p=remark-lint-code-block-style

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

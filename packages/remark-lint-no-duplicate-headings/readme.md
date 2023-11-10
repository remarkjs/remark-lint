<!--This file is generated-->

# remark-lint-no-duplicate-headings

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

[`remark-lint`][mono] rule to warn when headings with the same text are found.

## Contents

* [What is this?](#what-is-this)
* [When should I use this?](#when-should-i-use-this)
* [Presets](#presets)
* [Install](#install)
* [Use](#use)
* [API](#api)
  * [`unified().use(remarkLintNoDuplicateHeadings[, config])`](#unifieduseremarklintnoduplicateheadings-config)
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

You can use this package to check that headings with the same text are
used once.

## Presets

This rule is included in the following presets:

| Preset | Setting |
| - | - |
| [`remark-preset-lint-markdown-style-guide`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-preset-lint-markdown-style-guide) | |

## Install

This package is [ESM only][esm].
In Node.js (version 12.20+, 14.14+, or 16.0+), install with [npm][]:

```sh
npm install remark-lint-no-duplicate-headings
```

In Deno with [`esm.sh`][esmsh]:

```js
import remarkLintNoDuplicateHeadings from 'https://esm.sh/remark-lint-no-duplicate-headings@3'
```

In browsers with [`esm.sh`][esmsh]:

```html
<script type="module">
  import remarkLintNoDuplicateHeadings from 'https://esm.sh/remark-lint-no-duplicate-headings@3?bundle'
</script>
```

## Use

On the API:

```js
import {read} from 'to-vfile'
import {reporter} from 'vfile-reporter'
import {remark} from 'remark'
import remarkLint from 'remark-lint'
import remarkLintNoDuplicateHeadings from 'remark-lint-no-duplicate-headings'

main()

async function main() {
  const file = await remark()
    .use(remarkLint)
    .use(remarkLintNoDuplicateHeadings)
    .process(await read('example.md'))

  console.error(reporter(file))
}
```

On the CLI:

```sh
remark --use remark-lint --use remark-lint-no-duplicate-headings example.md
```

On the CLI in a config file (here a `package.json`):

```diff
 …
 "remarkConfig": {
   "plugins": [
     …
     "remark-lint",
+    "remark-lint-no-duplicate-headings",
     …
   ]
 }
 …
```

## API

This package exports no identifiers.
The default export is `remarkLintNoDuplicateHeadings`.

### `unified().use(remarkLintNoDuplicateHeadings[, config])`

This rule supports standard configuration that all remark lint rules accept
(such as `false` to turn it off or `[1, options]` to configure it).

There are no options.

## Recommendation

Headings having unique text helps screen reader users (who typically use
“jump to heading” features to navigate within a page, which reads headings
out loud).
It also helps because often headings receive automatic unique IDs, and when
the same heading text is used, they are suffixed with a number based on where
they are positioned in the document, which makes linking to them prone to
changes.

## Examples

##### `ok.md`

###### In

```markdown
# Foo

## Bar
```

###### Out

No messages.

##### `not-ok.md`

###### In

```markdown
# Foo

## Foo

## [Foo](http://foo.com/bar)
```

###### Out

```text
3:1-3:7: Do not use headings with similar content (1:1)
5:1-5:29: Do not use headings with similar content (3:1)
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

[downloads-badge]: https://img.shields.io/npm/dm/remark-lint-no-duplicate-headings.svg

[downloads]: https://www.npmjs.com/package/remark-lint-no-duplicate-headings

[size-badge]: https://img.shields.io/bundlephobia/minzip/remark-lint-no-duplicate-headings.svg

[size]: https://bundlephobia.com/result?p=remark-lint-no-duplicate-headings

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

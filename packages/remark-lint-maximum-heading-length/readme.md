<!--This file is generated-->

# remark-lint-maximum-heading-length

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

[`remark-lint`][mono] rule to warn when headings are too long.

## Contents

*   [What is this?](#what-is-this)
*   [When should I use this?](#when-should-i-use-this)
*   [Presets](#presets)
*   [Install](#install)
*   [Use](#use)
*   [API](#api)
    *   [`unified().use(remarkLintMaximumHeadingLength[, config])`](#unifieduseremarklintmaximumheadinglength-config)
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

You can use this package to check that heading text is within reason.

## Presets

This rule is included in the following presets:

| Preset | Setting |
| - | - |
| [`remark-preset-lint-markdown-style-guide`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-preset-lint-markdown-style-guide) | |

## Install

This package is [ESM only][esm].
In Node.js (version 12.20+, 14.14+, or 16.0+), install with [npm][]:

```sh
npm install remark-lint-maximum-heading-length
```

In Deno with [Skypack][]:

```js
import remarkLintMaximumHeadingLength from 'https://cdn.skypack.dev/remark-lint-maximum-heading-length@3?dts'
```

In browsers with [Skypack][]:

```html
<script type="module">
  import remarkLintMaximumHeadingLength from 'https://cdn.skypack.dev/remark-lint-maximum-heading-length@3?min'
</script>
```

## Use

On the API:

```js
import {read} from 'to-vfile'
import {reporter} from 'vfile-reporter'
import {remark} from 'remark'
import remarkLint from 'remark-lint'
import remarkLintMaximumHeadingLength from 'remark-lint-maximum-heading-length'

main()

async function main() {
  const file = await remark()
    .use(remarkLint)
    .use(remarkLintMaximumHeadingLength)
    .process(await read('example.md'))

  console.error(reporter(file))
}
```

On the CLI:

```sh
remark --use remark-lint --use remark-lint-maximum-heading-length example.md
```

On the CLI in a config file (here a `package.json`):

```diff
 …
 "remarkConfig": {
   "plugins": [
     …
     "remark-lint",
+    "remark-lint-maximum-heading-length",
     …
   ]
 }
 …
```

## API

This package exports no identifiers.
The default export is `remarkLintMaximumHeadingLength`.

### `unified().use(remarkLintMaximumHeadingLength[, config])`

This rule supports standard configuration that all remark lint rules accept
(such as `false` to turn it off or `[1, options]` to configure it).

The following options (default: `60`) are accepted:

*   `number` (example: `72`)
    — max number of characters to accept in heading text

Ignores syntax, only checks the plain text content.

## Recommendation

While this rule is sometimes annoying, reasonable size headings
do help SEO purposes (bots prefer reasonable headings), visual users
(headings are typically displayed quite large), and users of screen readers
(who typically use “jump to heading” features to navigate within a page,
which reads every heading out loud).

## Examples

##### `not-ok.md`

When configured with `40`.

###### In

```markdown
# Alpha bravo charlie delta echo foxtrot golf hotel
```

###### Out

```text
1:1-1:52: Use headings shorter than `40`
```

##### `ok.md`

###### In

```markdown
# Alpha bravo charlie delta echo foxtrot golf hotel

# ![Alpha bravo charlie delta echo foxtrot golf hotel](http://example.com/nato.png)
```

###### Out

No messages.

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

[downloads-badge]: https://img.shields.io/npm/dm/remark-lint-maximum-heading-length.svg

[downloads]: https://www.npmjs.com/package/remark-lint-maximum-heading-length

[size-badge]: https://img.shields.io/bundlephobia/minzip/remark-lint-maximum-heading-length.svg

[size]: https://bundlephobia.com/result?p=remark-lint-maximum-heading-length

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

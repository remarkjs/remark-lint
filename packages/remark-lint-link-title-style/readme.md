<!--This file is generated-->

# remark-lint-link-title-style

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

[`remark-lint`][mono] rule to warn when title markers are inconsistent.

## Contents

*   [What is this?](#what-is-this)
*   [When should I use this?](#when-should-i-use-this)
*   [Presets](#presets)
*   [Install](#install)
*   [Use](#use)
*   [API](#api)
    *   [`unified().use(remarkLintLinkTitleStyle[, config])`](#unifieduseremarklintlinktitlestyle-config)
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

You can use this package to check that title markers are consistent.

## Presets

This rule is included in the following presets:

| Preset | Setting |
| - | - |
| [`remark-preset-lint-consistent`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-preset-lint-consistent) | `'consistent'` |
| [`remark-preset-lint-markdown-style-guide`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-preset-lint-markdown-style-guide) | `'"'` |

## Install

This package is [ESM only][esm].
In Node.js (version 12.20+, 14.14+, or 16.0+), install with [npm][]:

```sh
npm install remark-lint-link-title-style
```

In Deno with [Skypack][]:

```js
import remarkLintLinkTitleStyle from 'https://cdn.skypack.dev/remark-lint-link-title-style@3?dts'
```

In browsers with [Skypack][]:

```html
<script type="module">
  import remarkLintLinkTitleStyle from 'https://cdn.skypack.dev/remark-lint-link-title-style@3?min'
</script>
```

## Use

On the API:

```js
import {read} from 'to-vfile'
import {reporter} from 'vfile-reporter'
import {remark} from 'remark'
import remarkLint from 'remark-lint'
import remarkLintLinkTitleStyle from 'remark-lint-link-title-style'

main()

async function main() {
  const file = await remark()
    .use(remarkLint)
    .use(remarkLintLinkTitleStyle)
    .process(await read('example.md'))

  console.error(reporter(file))
}
```

On the CLI:

```sh
remark --use remark-lint --use remark-lint-link-title-style example.md
```

On the CLI in a config file (here a `package.json`):

```diff
 …
 "remarkConfig": {
   "plugins": [
     …
     "remark-lint",
+    "remark-lint-link-title-style",
     …
   ]
 }
 …
```

## API

This package exports no identifiers.
The default export is `remarkLintLinkTitleStyle`.

### `unified().use(remarkLintLinkTitleStyle[, config])`

This rule supports standard configuration that all remark lint rules accept
(such as `false` to turn it off or `[1, options]` to configure it).

The following options (default: `'consistent'`) are accepted:

*   `'"'`
    — prefer double quotes
*   `"'"`
    — prefer single quotes
*   `'()'`
    — prefer parens
*   `'consistent'`
    — detect the first used style and warn when further titles differ

## Recommendation

Parens in titles were not supported in markdown before CommonMark.
While they should work in most places now, not all markdown parsers follow
CommonMark.
Parens for titles also arguably look a bit weird because they’re inside more
parens: `[text](url (title))`.

In HTML, attributes are commonly written with double quotes.
Due to this, titles are almost exclusively wrapped in double quotes in
markdown, so it’s recommended to configure this rule with `'"'`.

## Fix

[`remark-stringify`](https://github.com/remarkjs/remark/tree/main/packages/remark-stringify)
formats titles with double quotes by default.
Pass
[`quote: "'"`](https://github.com/remarkjs/remark/tree/main/packages/remark-stringify#optionsquote)
to use single quotes.
There is no option to use parens.

## Examples

##### `ok.md`

When configured with `'"'`.

###### In

```markdown
[Example](http://example.com#without-title)
[Example](http://example.com "Example Domain")
![Example](http://example.com "Example Domain")

[Example]: http://example.com "Example Domain"

You can use parens in URLs if they’re not a title (see GH-166):

[Example](#Heading-(optional))
```

###### Out

No messages.

##### `not-ok.md`

When configured with `'"'`.

###### In

```markdown
[Example]: http://example.com 'Example Domain'
```

###### Out

```text
1:31-1:47: Titles should use `"` as a quote
```

##### `ok.md`

When configured with `"'"`.

###### In

```markdown
[Example](http://example.com#without-title)
[Example](http://example.com 'Example Domain')
![Example](http://example.com 'Example Domain')

[Example]: http://example.com 'Example Domain'
```

###### Out

No messages.

##### `not-ok.md`

When configured with `"'"`.

###### In

```markdown
[Example]: http://example.com "Example Domain"
```

###### Out

```text
1:31-1:47: Titles should use `'` as a quote
```

##### `ok.md`

When configured with `'()'`.

###### In

```markdown
[Example](http://example.com#without-title)
[Example](http://example.com (Example Domain))
![Example](http://example.com (Example Domain))

[Example]: http://example.com (Example Domain)
```

###### Out

No messages.

##### `not-ok.md`

When configured with `'()'`.

###### In

```markdown
[Example](http://example.com 'Example Domain')
```

###### Out

```text
1:30-1:46: Titles should use `()` as a quote
```

##### `not-ok.md`

###### In

```markdown
[Example](http://example.com "Example Domain")
[Example](http://example.com 'Example Domain')
```

###### Out

```text
2:30-2:46: Titles should use `"` as a quote
```

##### `not-ok.md`

When configured with `'💩'`.

###### Out

```text
1:1: Incorrect link title style marker `💩`: use either `'consistent'`, `'"'`, `'\''`, or `'()'`
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

[downloads-badge]: https://img.shields.io/npm/dm/remark-lint-link-title-style.svg

[downloads]: https://www.npmjs.com/package/remark-lint-link-title-style

[size-badge]: https://img.shields.io/bundlephobia/minzip/remark-lint-link-title-style.svg

[size]: https://bundlephobia.com/result?p=remark-lint-link-title-style

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

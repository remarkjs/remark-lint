<!--This file is generated-->

# remark-preset-lint-markdown-style-guide

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

Preset of [`remark-lint`][mono] rules that follow an opinionated style guide.

## Contents

* [What is this?](#what-is-this)
* [When should I use this?](#when-should-i-use-this)
* [Rules](#rules)
* [Install](#install)
* [Use](#use)
* [API](#api)
  * [`unified().use(remarkPresetLintMarkdownStyleGuide)`](#unifieduseremarkpresetlintmarkdownstyleguide)
* [Compatibility](#compatibility)
* [Contribute](#contribute)
* [License](#license)

## What is this?

This package is a [unified][] ([remark][]) preset, specifically consisting of
`remark-lint` rules.
Lint rules check markdown code style.

## When should I use this?

You can use this package to check that markdown follows the
[Markdown Style Guide](https://cirosantilli.com/markdown-style-guide/).

This uses the following style guide option system: `wrap:space`,
`header:atx`, `list-marker:hyphen`, `list-space:mixed`, and `code:fenced`.

###### `space-sentence`

Both `space-sentence:1` and `space-sentence:2` are not supported by
`remark-lint` as they relate to prose rather than markdown syntax.
You could set-up
[`remark-retext`](https://github.com/remarkjs/remark-retext)
with
[`retext-sentence-spacing`](https://github.com/retextjs/retext-sentence-spacing)
to check this.

###### `wrap`

`wrap:inner-sentence` and `wrap:sentence` are not supported by `remark-lint`.

The default is `wrap:space`.
To use `wrap:no`, turn off `remark-lint-maximum-line-length` like so:

```diff
 "plugins": [
   …
   "remark-preset-lint-markdown-style-guide",
+  ["remark-lint-maximum-line-length", false],
   …
 ]
```

###### `header`

The default is `header:atx`.
To use `header:setext`, change the setting for `remark-lint-heading-style`
like so:

```diff
 "plugins": [
   …
   "remark-preset-lint-markdown-style-guide",
+  ["remark-lint-heading-style", "setext"],
   …
 ]
```

###### `list-marker`

The default is `list-marker:hyphen`.
For `list-marker:asterisk` or `list-marker:plus`, change the setting for
`remark-lint-unordered-list-marker-style` like so:

```diff
 "plugins": [
   …
   "remark-preset-lint-markdown-style-guide",
+  ["remark-lint-unordered-list-marker-style", "*"],
   …
 ]
```

###### `list-space`

The default is `list-space:mixed`.
For `list-space:1`, change the setting for `remark-lint-list-item-indent`
like so:

```diff
 "plugins": [
   …
   "remark-preset-lint-markdown-style-guide",
+  ["remark-lint-list-item-indent", "space"],
   …
 ]
```

###### `code`

The default is `code:fenced`.
For `code:indented`, change the setting for `remark-lint-code-block-style`
like so:

```diff
 "plugins": [
   …
   "remark-preset-lint-markdown-style-guide",
+  ["remark-lint-code-block-style", "indented"],
   …
 ]
```

## Rules

This preset configures [`remark-lint`][mono] with the following rules:

| Rule | Setting |
| - | - |
| [`remark-lint-file-extension`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-file-extension) | `'md'` |
| [`remark-lint-no-file-name-mixed-case`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-no-file-name-mixed-case) | |
| [`remark-lint-no-file-name-articles`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-no-file-name-articles) | |
| [`remark-lint-no-file-name-irregular-characters`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-no-file-name-irregular-characters) | |
| [`remark-lint-no-file-name-consecutive-dashes`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-no-file-name-consecutive-dashes) | |
| [`remark-lint-no-file-name-outer-dashes`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-no-file-name-outer-dashes) | |
| [`remark-lint-no-consecutive-blank-lines`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-no-consecutive-blank-lines) | |
| [`remark-lint-maximum-line-length`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-maximum-line-length) | `80` |
| [`remark-lint-no-shell-dollars`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-no-shell-dollars) | |
| [`remark-lint-hard-break-spaces`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-hard-break-spaces) | |
| [`remark-lint-heading-style`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-heading-style) | `'atx'` |
| [`remark-lint-heading-increment`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-heading-increment) | |
| [`remark-lint-no-duplicate-headings`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-no-duplicate-headings) | |
| [`remark-lint-no-multiple-toplevel-headings`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-no-multiple-toplevel-headings) | |
| [`remark-lint-maximum-heading-length`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-maximum-heading-length) | |
| [`remark-lint-no-heading-punctuation`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-no-heading-punctuation) | `':.'` |
| [`remark-lint-blockquote-indentation`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-blockquote-indentation) | `2` |
| [`remark-lint-no-blockquote-without-marker`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-no-blockquote-without-marker) | |
| [`remark-lint-unordered-list-marker-style`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-unordered-list-marker-style) | `'-'` |
| [`remark-lint-ordered-list-marker-style`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-ordered-list-marker-style) | `'.'` |
| [`remark-lint-ordered-list-marker-value`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-ordered-list-marker-value) | `'one'` |
| [`remark-lint-list-item-indent`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-list-item-indent) | `'mixed'` |
| [`remark-lint-list-item-content-indent`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-list-item-content-indent) | |
| [`remark-lint-list-item-spacing`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-list-item-spacing) | |
| [`remark-lint-code-block-style`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-code-block-style) | `'fenced'` |
| [`remark-lint-fenced-code-flag`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-fenced-code-flag) | `{ allowEmpty: false }` |
| [`remark-lint-fenced-code-marker`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-fenced-code-marker) | ``'`'`` |
| [`remark-lint-rule-style`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-rule-style) | `'---'` |
| [`remark-lint-no-table-indentation`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-no-table-indentation) | |
| [`remark-lint-table-pipes`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-table-pipes) | |
| [`remark-lint-table-pipe-alignment`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-table-pipe-alignment) | |
| [`remark-lint-table-cell-padding`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-table-cell-padding) | `'padded'` |
| [`remark-lint-no-inline-padding`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-no-inline-padding) | |
| [`remark-lint-no-shortcut-reference-image`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-no-shortcut-reference-image) | |
| [`remark-lint-no-shortcut-reference-link`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-no-shortcut-reference-link) | |
| [`remark-lint-final-definition`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-final-definition) | |
| [`remark-lint-definition-case`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-definition-case) | |
| [`remark-lint-definition-spacing`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-definition-spacing) | |
| [`remark-lint-link-title-style`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-link-title-style) | `'"'` |
| [`remark-lint-strong-marker`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-strong-marker) | `'*'` |
| [`remark-lint-emphasis-marker`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-emphasis-marker) | `'*'` |
| [`remark-lint-no-emphasis-as-heading`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-no-emphasis-as-heading) | |
| [`remark-lint-no-literal-urls`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-no-literal-urls) | |

## Install

This package is [ESM only][esm].
In Node.js (version 12.20+, 14.14+, or 16.0+), install with [npm][]:

```sh
npm install remark-preset-lint-markdown-style-guide
```

In Deno with [`esm.sh`][esmsh]:

```js
import remarkPresetLintMarkdownStyleGuide from 'https://esm.sh/remark-preset-lint-markdown-style-guide@5'
```

In browsers with [`esm.sh`][esmsh]:

```html
<script type="module">
  import remarkPresetLintMarkdownStyleGuide from 'https://esm.sh/remark-preset-lint-markdown-style-guide@5?bundle'
</script>
```

## Use

On the API:

```js
import {read} from 'to-vfile'
import {reporter} from 'vfile-reporter'
import {remark} from 'remark'
import remarkPresetLintMarkdownStyleGuide from 'remark-preset-lint-markdown-style-guide'

main()

async function main() {
  const file = await remark()
    .use(remarkPresetLintMarkdownStyleGuide)
    .process(await read('example.md'))

  console.error(reporter(file))
}
```

On the CLI:

```sh
remark --use remark-preset-lint-markdown-style-guide example.md
```

On the CLI in a config file (here a `package.json`):

```diff
 …
 "remarkConfig": {
   "plugins": [
     …
+    "remark-preset-lint-markdown-style-guide",
     …
   ]
 }
 …
```

## API

This package exports no identifiers.
The default export is `remarkPresetLintMarkdownStyleGuide`.

### `unified().use(remarkPresetLintMarkdownStyleGuide)`

Use the preset.
Presets don’t have options.
You can reconfigure rules in them by using the afterwards with different
options.

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

[downloads-badge]: https://img.shields.io/npm/dm/remark-preset-lint-markdown-style-guide.svg

[downloads]: https://www.npmjs.com/package/remark-preset-lint-markdown-style-guide

[size-badge]: https://img.shields.io/bundlephobia/minzip/remark-preset-lint-markdown-style-guide.svg

[size]: https://bundlephobia.com/result?p=remark-preset-lint-markdown-style-guide

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

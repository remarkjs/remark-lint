<!--This file is generated-->

# remark-preset-lint-markdown-style-guide

[![Build][badge-build-image]][badge-build-url]
[![Coverage][badge-coverage-image]][badge-coverage-url]
[![Downloads][badge-downloads-image]][badge-downloads-url]
[![Size][badge-size-image]][badge-size-url]
[![Sponsors][badge-funding-sponsors-image]][badge-funding-url]
[![Backers][badge-funding-backers-image]][badge-funding-url]
[![Chat][badge-chat-image]][badge-chat-url]

Preset of [`remark-lint`][github-remark-lint] rules that follow an opinionated style guide.

## Contents

* [What is this?](#what-is-this)
* [When should I use this?](#when-should-i-use-this)
* [Plugins](#plugins)
* [Install](#install)
* [Use](#use)
* [API](#api)
  * [`unified().use(remarkPresetLintMarkdownStyleGuide)`](#unifieduseremarkpresetlintmarkdownstyleguide)
* [Compatibility](#compatibility)
* [Contribute](#contribute)
* [License](#license)

## What is this?

This package is a preset containing `remark-lint` rules.
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

## Plugins

This preset includes the following plugins:

| Plugin | Options |
| - | - |
| [`remark-lint`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint) | |
| [`remark-lint-blockquote-indentation`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-blockquote-indentation) | `2` |
| [`remark-lint-code-block-style`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-code-block-style) | `'fenced'` |
| [`remark-lint-definition-case`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-definition-case) | |
| [`remark-lint-definition-spacing`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-definition-spacing) | |
| [`remark-lint-emphasis-marker`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-emphasis-marker) | `'*'` |
| [`remark-lint-fenced-code-flag`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-fenced-code-flag) | `{ allowEmpty: false }` |
| [`remark-lint-fenced-code-marker`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-fenced-code-marker) | ``'`'`` |
| [`remark-lint-file-extension`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-file-extension) | `'md'` |
| [`remark-lint-final-definition`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-final-definition) | |
| [`remark-lint-hard-break-spaces`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-hard-break-spaces) | |
| [`remark-lint-heading-increment`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-heading-increment) | |
| [`remark-lint-heading-style`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-heading-style) | `'atx'` |
| [`remark-lint-link-title-style`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-link-title-style) | `'"'` |
| [`remark-lint-list-item-content-indent`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-list-item-content-indent) | |
| [`remark-lint-list-item-indent`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-list-item-indent) | `'mixed'` |
| [`remark-lint-list-item-spacing`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-list-item-spacing) | |
| [`remark-lint-maximum-heading-length`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-maximum-heading-length) | |
| [`remark-lint-maximum-line-length`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-maximum-line-length) | `80` |
| [`remark-lint-no-blockquote-without-marker`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-no-blockquote-without-marker) | |
| [`remark-lint-no-consecutive-blank-lines`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-no-consecutive-blank-lines) | |
| [`remark-lint-no-duplicate-headings`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-no-duplicate-headings) | |
| [`remark-lint-no-emphasis-as-heading`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-no-emphasis-as-heading) | |
| [`remark-lint-no-file-name-articles`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-no-file-name-articles) | |
| [`remark-lint-no-file-name-consecutive-dashes`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-no-file-name-consecutive-dashes) | |
| [`remark-lint-no-file-name-irregular-characters`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-no-file-name-irregular-characters) | |
| [`remark-lint-no-file-name-mixed-case`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-no-file-name-mixed-case) | |
| [`remark-lint-no-file-name-outer-dashes`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-no-file-name-outer-dashes) | |
| [`remark-lint-no-heading-punctuation`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-no-heading-punctuation) | `':.'` |
| [`remark-lint-no-literal-urls`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-no-literal-urls) | |
| [`remark-lint-no-multiple-toplevel-headings`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-no-multiple-toplevel-headings) | |
| [`remark-lint-no-shell-dollars`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-no-shell-dollars) | |
| [`remark-lint-no-shortcut-reference-image`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-no-shortcut-reference-image) | |
| [`remark-lint-no-shortcut-reference-link`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-no-shortcut-reference-link) | |
| [`remark-lint-no-table-indentation`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-no-table-indentation) | |
| [`remark-lint-ordered-list-marker-style`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-ordered-list-marker-style) | `'.'` |
| [`remark-lint-ordered-list-marker-value`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-ordered-list-marker-value) | `'one'` |
| [`remark-lint-rule-style`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-rule-style) | `'---'` |
| [`remark-lint-strong-marker`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-strong-marker) | `'*'` |
| [`remark-lint-table-cell-padding`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-table-cell-padding) | `'padded'` |
| [`remark-lint-table-pipe-alignment`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-table-pipe-alignment) | |
| [`remark-lint-table-pipes`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-table-pipes) | |
| [`remark-lint-unordered-list-marker-style`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-unordered-list-marker-style) | `'-'` |

## Install

This package is [ESM only][github-gist-esm].
In Node.js (version 16+),
install with [npm][npm-install]:

```sh
npm install remark-preset-lint-markdown-style-guide
```

In Deno with [`esm.sh`][esm-sh]:

```js
import remarkPresetLintMarkdownStyleGuide from 'https://esm.sh/remark-preset-lint-markdown-style-guide@5'
```

In browsers with [`esm.sh`][esm-sh]:

```html
<script type="module">
  import remarkPresetLintMarkdownStyleGuide from 'https://esm.sh/remark-preset-lint-markdown-style-guide@5?bundle'
</script>
```

## Use

On the API:

```js
import remarkParse from 'remark-parse'
import remarkPresetLintMarkdownStyleGuide from 'remark-preset-lint-markdown-style-guide'
import remarkStringify from 'remark-stringify'
import {read} from 'to-vfile'
import {unified} from 'unified'
import {reporter} from 'vfile-reporter'

const file = await read('example.md')

await unified()
  .use(remarkParse)
  .use(remarkPresetLintMarkdownStyleGuide)
  .use(remarkStringify)
  .process(file)

console.error(reporter(file))
```

On the CLI:

```sh
remark --frail --use remark-preset-lint-markdown-style-guide .
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
It exports no additional [TypeScript][typescript] types.
The default export is
[`remarkPresetLintMarkdownStyleGuide`][api-remark-preset-lint-markdown-style-guide].

### `unified().use(remarkPresetLintMarkdownStyleGuide)`

Check that markdown follows “Markdown Style Guide”.

You can reconfigure rules in the preset by using them afterwards with different
options.

## Compatibility

Projects maintained by the unified collective are compatible with maintained
versions of Node.js.

When we cut a new major release, we drop support for unmaintained versions of
Node.
This means we try to keep the current release line,
`remark-preset-lint-markdown-style-guide@5`,
compatible with Node.js 12.

## Contribute

See [`contributing.md`][github-dotfiles-contributing] in [`remarkjs/.github`][github-dotfiles-health] for ways
to get started.
See [`support.md`][github-dotfiles-support] for ways to get help.

This project has a [code of conduct][github-dotfiles-coc].
By interacting with this repository, organization, or community you agree to
abide by its terms.

## License

[MIT][file-license] © [Titus Wormer][author]

[api-remark-preset-lint-markdown-style-guide]: #unifieduseremarkpresetlintmarkdownstyleguide

[author]: https://wooorm.com

[badge-build-image]: https://github.com/remarkjs/remark-lint/workflows/main/badge.svg

[badge-build-url]: https://github.com/remarkjs/remark-lint/actions

[badge-chat-image]: https://img.shields.io/badge/chat-discussions-success.svg

[badge-chat-url]: https://github.com/remarkjs/remark/discussions

[badge-coverage-image]: https://img.shields.io/codecov/c/github/remarkjs/remark-lint.svg

[badge-coverage-url]: https://codecov.io/github/remarkjs/remark-lint

[badge-downloads-image]: https://img.shields.io/npm/dm/remark-preset-lint-markdown-style-guide.svg

[badge-downloads-url]: https://www.npmjs.com/package/remark-preset-lint-markdown-style-guide

[badge-funding-backers-image]: https://opencollective.com/unified/backers/badge.svg

[badge-funding-sponsors-image]: https://opencollective.com/unified/sponsors/badge.svg

[badge-funding-url]: https://opencollective.com/unified

[badge-size-image]: https://img.shields.io/bundlejs/size/remark-preset-lint-markdown-style-guide

[badge-size-url]: https://bundlejs.com/?q=remark-preset-lint-markdown-style-guide

[esm-sh]: https://esm.sh

[file-license]: https://github.com/remarkjs/remark-lint/blob/main/license

[github-dotfiles-coc]: https://github.com/remarkjs/.github/blob/main/code-of-conduct.md

[github-dotfiles-contributing]: https://github.com/remarkjs/.github/blob/main/contributing.md

[github-dotfiles-health]: https://github.com/remarkjs/.github

[github-dotfiles-support]: https://github.com/remarkjs/.github/blob/main/support.md

[github-gist-esm]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c

[github-remark-lint]: https://github.com/remarkjs/remark-lint

[npm-install]: https://docs.npmjs.com/cli/install

[typescript]: https://www.typescriptlang.org

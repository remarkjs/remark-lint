<!--This file is generated-->

# remark-preset-lint-markdown-style-guide

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

remark preset to configure `remark-lint` with settings that the
[Markdown Style Guide](http://www.cirosantilli.com/markdown-style-guide/)
recommends.

This uses the following Style Guide option system: `wrap:space`,
`header:atx`, `list-marker:hyphen`, `list-space:mixed`, and
`code:fenced`.

###### `space-sentence`

Both `space-sentence:1` and `space-sentence:2` are not supported
by `remark-lint`.
You could set-up
[`remark-retext`](https://github.com/remarkjs/remark-retext)
with
[`retext-sentence-spacing`](https://github.com/retextjs/retext-sentence-spacing)
to check this though.

###### `wrap`

`wrap:inner-sentence` and `wrap:sentence` are not supported by
`remark-lint`.

The default is `wrap:space`.
To use `wrap:no`, turn off `remark-lint-maximum-line-length` like so:

```diff
 "plugins": [
   …
   "preset-lint-markdown-style-guide",
+  ["lint-maximum-line-length", false]
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
   "preset-lint-markdown-style-guide",
+  ["lint-heading-style", "setext"]
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
   "preset-lint-markdown-style-guide",
+  ["lint-unordered-list-marker-style", "*"]
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
   "preset-lint-markdown-style-guide",
+  ["lint-list-item-indent", "space"]
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
   "preset-lint-markdown-style-guide",
+  ["lint-code-block-style", "indented"]
   …
 ]
```

## Rules

This preset configures [`remark-lint`](https://github.com/remarkjs/remark-lint) with the following rules:

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
| [`remark-lint-no-auto-link-without-protocol`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-no-auto-link-without-protocol) | |

## Install

[npm][]:

```sh
npm install remark-preset-lint-markdown-style-guide
```

## Use

You probably want to use it on the CLI through a config file:

```diff
 …
 "remarkConfig": {
+  "plugins": ["preset-lint-markdown-style-guide"]
 }
 …
```

Or use it on the CLI directly

```sh
remark -u preset-lint-markdown-style-guide readme.md
```

Or use this on the API:

```diff
 import {remark} from 'remark'
 import {reporter} from 'vfile-reporter'
 import remarkPresetLintMarkdownStyleGuide from 'remark-preset-lint-markdown-style-guide'

 remark()
+  .use(remarkPresetLintMarkdownStyleGuide)
   .process('_Emphasis_ and **importance**')
   .then((file) => {
     console.error(reporter(file))
   })
```

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

[npm]: https://docs.npmjs.com/cli/install

[health]: https://github.com/remarkjs/.github

[contributing]: https://github.com/remarkjs/.github/blob/HEAD/contributing.md

[support]: https://github.com/remarkjs/.github/blob/HEAD/support.md

[coc]: https://github.com/remarkjs/.github/blob/HEAD/code-of-conduct.md

[license]: https://github.com/remarkjs/remark-lint/blob/main/license

[author]: https://wooorm.com

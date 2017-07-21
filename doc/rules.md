# Rules

This document describes how to configure rules and lists all available official
rules.  Each rule is a separate package. See their readme’s for more
information.

## Table of Contents

*   [Configuration](#configuration)
*   [List of Rules](#list-of-rules)

## Configuration

`false` turns rules off — the code no longer runs:

```js
remark()
  .use(require('remark-lint-final-newline'), false)
  // ...
```

`true` turns a rule on again:

```js
remark()
  .use(require('remark-lint-final-newline'), true)
  // ...
```

Rules can be configured with a severity too.  The following is ignores all
messages from the plugin:

```js
remark()
  .use(require('remark-lint-final-newline'), [0])
  // ...
```

...and passing `[1]` explicitly sets the normal behaviour (warn for problems).
To trigger an error instead of a warning, pass `2`:

```js
remark()
  .use(require('remark-lint-final-newline'), [2])
  // ...
```

It’s also possible to pass both a severity and configuration:

```js
remark()
  .use(require('remark-lint-maximum-line-length'), [2, 70])
  // ...
```

Lastly, strings can also be passed, instead of numbers:
`off` instead of `0`, `warn` or `on` instead of `1`, and
`error` instead of `2`.

```js
remark()
  .use(require('remark-lint-maximum-line-length'), ['error', 70])
  // ...
```

## List of Rules

This lists contains all “official” rules, developed in this repository.
For rules developed outside of this repo, view the [List of External
Rules][external].

<!--rules start-->

*   [`blockquote-indentation`](https://github.com/wooorm/remark-lint/tree/master/packages/remark-lint-blockquote-indentation) — warn when blockquotes are either indented too much or too little
*   [`checkbox-character-style`](https://github.com/wooorm/remark-lint/tree/master/packages/remark-lint-checkbox-character-style) — warn when list item checkboxes violate a given style
*   [`checkbox-content-indent`](https://github.com/wooorm/remark-lint/tree/master/packages/remark-lint-checkbox-content-indent) — warn when list item checkboxes are followed by too much white-space
*   [`code-block-style`](https://github.com/wooorm/remark-lint/tree/master/packages/remark-lint-code-block-style) — warn when code-blocks do not adhere to a given style
*   [`definition-case`](https://github.com/wooorm/remark-lint/tree/master/packages/remark-lint-definition-case) — warn when definition labels are not lower-case
*   [`definition-spacing`](https://github.com/wooorm/remark-lint/tree/master/packages/remark-lint-definition-spacing) — warn when consecutive white space is used in a definition
*   [`emphasis-marker`](https://github.com/wooorm/remark-lint/tree/master/packages/remark-lint-emphasis-marker) — warn when emphasis markers violate the given style
*   [`fenced-code-flag`](https://github.com/wooorm/remark-lint/tree/master/packages/remark-lint-fenced-code-flag) — warn when fenced code blocks occur without language flag
*   [`fenced-code-marker`](https://github.com/wooorm/remark-lint/tree/master/packages/remark-lint-fenced-code-marker) — warn when fenced code markers violate the given style
*   [`file-extension`](https://github.com/wooorm/remark-lint/tree/master/packages/remark-lint-file-extension) — warn when the file’s extension violates the given style
*   [`final-definition`](https://github.com/wooorm/remark-lint/tree/master/packages/remark-lint-final-definition) — warn when definitions are not placed at the end of the file
*   [`final-newline`](https://github.com/wooorm/remark-lint/tree/master/packages/remark-lint-final-newline) — warn when a newline at the end of a file is missing
*   [`first-heading-level`](https://github.com/wooorm/remark-lint/tree/master/packages/remark-lint-first-heading-level) — warn when the first heading has a level other than a specified value
*   [`hard-break-spaces`](https://github.com/wooorm/remark-lint/tree/master/packages/remark-lint-hard-break-spaces) — warn when too many spaces are used to create a hard break
*   [`heading-increment`](https://github.com/wooorm/remark-lint/tree/master/packages/remark-lint-heading-increment) — warn when headings increment with more than 1 level at a time
*   [`heading-style`](https://github.com/wooorm/remark-lint/tree/master/packages/remark-lint-heading-style) — warn when heading style violates the given style
*   [`linebreak-style`](https://github.com/wooorm/remark-lint/tree/master/packages/remark-lint-linebreak-style) — warn when linebreaks violate a given or detected style
*   [`link-title-style`](https://github.com/wooorm/remark-lint/tree/master/packages/remark-lint-link-title-style) — warn when link and definition titles occur with incorrect quotes
*   [`list-item-bullet-indent`](https://github.com/wooorm/remark-lint/tree/master/packages/remark-lint-list-item-bullet-indent) — warn when list item bullets are indented
*   [`list-item-content-indent`](https://github.com/wooorm/remark-lint/tree/master/packages/remark-lint-list-item-content-indent) — warn when the content of a list item has mixed indentation
*   [`list-item-indent`](https://github.com/wooorm/remark-lint/tree/master/packages/remark-lint-list-item-indent) — warn when the spacing between a list item’s bullet and its content violates a given style
*   [`list-item-spacing`](https://github.com/wooorm/remark-lint/tree/master/packages/remark-lint-list-item-spacing) — warn when list looseness is incorrect
*   [`maximum-heading-length`](https://github.com/wooorm/remark-lint/tree/master/packages/remark-lint-maximum-heading-length) — warn when headings are too long
*   [`maximum-line-length`](https://github.com/wooorm/remark-lint/tree/master/packages/remark-lint-maximum-line-length) — warn when lines are too long
*   [`no-auto-link-without-protocol`](https://github.com/wooorm/remark-lint/tree/master/packages/remark-lint-no-auto-link-without-protocol) — warn for angle-bracketed links without protocol
*   [`no-blockquote-without-marker`](https://github.com/wooorm/remark-lint/tree/master/packages/remark-lint-no-blockquote-without-marker) — warn when blank lines without markers (\`>\`) are found in a blockquote
*   [`no-consecutive-blank-lines`](https://github.com/wooorm/remark-lint/tree/master/packages/remark-lint-no-consecutive-blank-lines) — warn for too many consecutive blank lines
*   [`no-duplicate-definitions`](https://github.com/wooorm/remark-lint/tree/master/packages/remark-lint-no-duplicate-definitions) — warn on duplicate definitions
*   [`no-duplicate-headings`](https://github.com/wooorm/remark-lint/tree/master/packages/remark-lint-no-duplicate-headings) — warn on duplicate headings
*   [`no-duplicate-headings-in-section`](https://github.com/wooorm/remark-lint/tree/master/packages/remark-lint-no-duplicate-headings-in-section) — warn on duplicate headings in a section
*   [`no-emphasis-as-heading`](https://github.com/wooorm/remark-lint/tree/master/packages/remark-lint-no-emphasis-as-heading) — warn when emphasis or importance is used instead of a heading
*   [`no-empty-url`](https://github.com/wooorm/remark-lint/tree/master/packages/remark-lint-no-empty-url) — warn on empty URLs in links and images
*   [`no-file-name-articles`](https://github.com/wooorm/remark-lint/tree/master/packages/remark-lint-no-file-name-articles) — warn when file name start with an article
*   [`no-file-name-consecutive-dashes`](https://github.com/wooorm/remark-lint/tree/master/packages/remark-lint-no-file-name-consecutive-dashes) — warn when file names contain consecutive dashes
*   [`no-file-name-irregular-characters`](https://github.com/wooorm/remark-lint/tree/master/packages/remark-lint-no-file-name-irregular-characters) — warn when file names contain irregular characters
*   [`no-file-name-mixed-case`](https://github.com/wooorm/remark-lint/tree/master/packages/remark-lint-no-file-name-mixed-case) — warn when file names use mixed case
*   [`no-file-name-outer-dashes`](https://github.com/wooorm/remark-lint/tree/master/packages/remark-lint-no-file-name-outer-dashes) — warn when file names contain initial or final dashes
*   [`no-heading-content-indent`](https://github.com/wooorm/remark-lint/tree/master/packages/remark-lint-no-heading-content-indent) — warn when heading content is indented
*   [`no-heading-indent`](https://github.com/wooorm/remark-lint/tree/master/packages/remark-lint-no-heading-indent) — warn when headings are indented
*   [`no-heading-like-paragraph`](https://github.com/wooorm/remark-lint/tree/master/packages/remark-lint-no-heading-like-paragraph) — for too many hashes (h7+ “headings”)
*   [`no-heading-punctuation`](https://github.com/wooorm/remark-lint/tree/master/packages/remark-lint-no-heading-punctuation) — warn when headings end in illegal characters
*   [`no-html`](https://github.com/wooorm/remark-lint/tree/master/packages/remark-lint-no-html) — warn when HTML nodes are used
*   [`no-inline-padding`](https://github.com/wooorm/remark-lint/tree/master/packages/remark-lint-no-inline-padding) — warn when inline nodes are padded with spaces
*   [`no-literal-urls`](https://github.com/wooorm/remark-lint/tree/master/packages/remark-lint-no-literal-urls) — warn when URLs without angle-brackets are used
*   [`no-missing-blank-lines`](https://github.com/wooorm/remark-lint/tree/master/packages/remark-lint-no-missing-blank-lines) — warn when missing blank lines
*   [`no-multiple-toplevel-headings`](https://github.com/wooorm/remark-lint/tree/master/packages/remark-lint-no-multiple-toplevel-headings) — warn when multiple top-level headings are used
*   [`no-paragraph-content-indent`](https://github.com/wooorm/remark-lint/tree/master/packages/remark-lint-no-paragraph-content-indent) — warn when the content in paragraphs are indented
*   [`no-reference-like-url`](https://github.com/wooorm/remark-lint/tree/master/packages/remark-lint-no-reference-like-url) — warn when URLs are also defined identifiers
*   [`no-shell-dollars`](https://github.com/wooorm/remark-lint/tree/master/packages/remark-lint-no-shell-dollars) — warn when shell code is prefixed by dollars
*   [`no-shortcut-reference-image`](https://github.com/wooorm/remark-lint/tree/master/packages/remark-lint-no-shortcut-reference-image) — warn when shortcut reference images are used
*   [`no-shortcut-reference-link`](https://github.com/wooorm/remark-lint/tree/master/packages/remark-lint-no-shortcut-reference-link) — warn when shortcut reference links are used
*   [`no-table-indentation`](https://github.com/wooorm/remark-lint/tree/master/packages/remark-lint-no-table-indentation) — warn when tables are indented
*   [`no-tabs`](https://github.com/wooorm/remark-lint/tree/master/packages/remark-lint-no-tabs) — warn when hard tabs are used instead of spaces
*   [`no-undefined-references`](https://github.com/wooorm/remark-lint/tree/master/packages/remark-lint-no-undefined-references) — warn when references to undefined definitions are found
*   [`no-unused-definitions`](https://github.com/wooorm/remark-lint/tree/master/packages/remark-lint-no-unused-definitions) — warn when unused definitions are found
*   [`ordered-list-marker-style`](https://github.com/wooorm/remark-lint/tree/master/packages/remark-lint-ordered-list-marker-style) — warn when the markers of ordered lists violate a given style
*   [`ordered-list-marker-value`](https://github.com/wooorm/remark-lint/tree/master/packages/remark-lint-ordered-list-marker-value) — warn when the marker value of ordered lists violates a given style
*   [`rule-style`](https://github.com/wooorm/remark-lint/tree/master/packages/remark-lint-rule-style) — warn when horizontal rules violate a given style
*   [`strong-marker`](https://github.com/wooorm/remark-lint/tree/master/packages/remark-lint-strong-marker) — warn when importance (strong) markers violate the given style
*   [`table-cell-padding`](https://github.com/wooorm/remark-lint/tree/master/packages/remark-lint-table-cell-padding) — warn when table cells are incorrectly padded
*   [`table-pipe-alignment`](https://github.com/wooorm/remark-lint/tree/master/packages/remark-lint-table-pipe-alignment) — warn when table pipes are not aligned
*   [`table-pipes`](https://github.com/wooorm/remark-lint/tree/master/packages/remark-lint-table-pipes) — warn when table rows are not fenced with pipes
*   [`unordered-list-marker-style`](https://github.com/wooorm/remark-lint/tree/master/packages/remark-lint-unordered-list-marker-style) — warn when markers of unordered lists violate a given style

<!--rules end-->

[external]: https://github.com/wooorm/remark-lint#list-of-external-rules

# [markdownlint](https://github.com/mivok/markdownlint)

This table documents the similarity and difference between
[**markdownlint**](https://github.com/mivok/markdownlint/blob/master/docs/RULES.md)
rules and **remark-lint**’s rules.

| markdownlint | remark                        | note                                                                                     |
| ------------ | ----------------------------- | ---------------------------------------------------------------------------------------- |
| MD001        | heading-increment             |                                                                                          |
| MD002        | first-heading-level           |                                                                                          |
| MD003        | heading-style                 |                                                                                          |
| MD004        | unordered-list-marker-style   |                                                                                          |
| MD005        | -                             | mixture of `list-item-indent`, `list-item-bullet-indent`, and `list-item-content-indent` |
| MD006        | list-item-bullet-indent       |                                                                                          |
| MD007        | list-item-bullet-indent       |                                                                                          |
| MD009        | -                             | Partially by hard-break-spaces                                                           |
| MD010        | no-tabs                       |                                                                                          |
| MD011        | no-shortcut-reference-link    | Although a different message, this will lead you in the right direction                  |
| MD012        | no-consecutive-blank-lines    |                                                                                          |
| MD013        | maximum-line-length           |                                                                                          |
| MD014        | no-shell-dollars              |                                                                                          |
| MD018        | no-heading-content-indent     | Only works in pedantic mode                                                              |
| MD019        | no-heading-content-indent     |                                                                                          |
| MD020        | no-heading-content-indent     | Only works in pedantic mode                                                              |
| MD021        | no-heading-content-indent     |                                                                                          |
| MD022        | no-missing-blank-lines        |                                                                                          |
| MD023        | no-heading-indent             |                                                                                          |
| MD024        | no-duplicate-headings         |                                                                                          |
| MD025        | no-multiple-toplevel-headings |                                                                                          |
| MD026        | no-heading-punctuation        |                                                                                          |
| MD027        | blockquote-indentation        | Won’t warn when that’s your preferred, consistent style                                  |
| MD028        | no-blockquote-without-caret   |                                                                                          |
| MD029        | ordered-list-marker-value     | markdownlint defaults to `one`, whereas remark-lint defaults to `ordered`                |
| MD030        | list-item-indent              |                                                                                          |
| MD031        | no-missing-blank-lines        |                                                                                          |
| MD032        | no-missing-blank-lines        |                                                                                          |
| MD033        | no-html                       |                                                                                          |
| MD034        | no-literal-urls               |                                                                                          |
| MD035        | rule-style                    |                                                                                          |
| MD036        | emphasis-heading              | remark-lint only warns when the emphasis is followed by a colon, but that might change.  |
| MD037        | no-inline-padding             |                                                                                          |
| MD038        | no-inline-padding             |                                                                                          |
| MD039        | no-inline-padding             |                                                                                          |
| MD039        | no-inline-padding             |                                                                                          |
| MD040        | fenced-code-flag              |                                                                                          |

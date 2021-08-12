<!--This file is generated-->

# remark-preset-lint-consistent

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

remark preset to configure `remark-lint` with settings that enforce
consistency.

## Rules

This preset configures [`remark-lint`](https://github.com/remarkjs/remark-lint) with the following rules:

| Rule | Setting |
| - | - |
| [`remark-lint-blockquote-indentation`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-blockquote-indentation) | `'consistent'` |
| [`remark-lint-checkbox-character-style`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-checkbox-character-style) | `'consistent'` |
| [`remark-lint-code-block-style`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-code-block-style) | `'consistent'` |
| [`remark-lint-emphasis-marker`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-emphasis-marker) | `'consistent'` |
| [`remark-lint-fenced-code-marker`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-fenced-code-marker) | `'consistent'` |
| [`remark-lint-heading-style`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-heading-style) | `'consistent'` |
| [`remark-lint-link-title-style`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-link-title-style) | `'consistent'` |
| [`remark-lint-list-item-content-indent`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-list-item-content-indent) | |
| [`remark-lint-ordered-list-marker-style`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-ordered-list-marker-style) | `'consistent'` |
| [`remark-lint-rule-style`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-rule-style) | `'consistent'` |
| [`remark-lint-strong-marker`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-strong-marker) | `'consistent'` |
| [`remark-lint-table-cell-padding`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-table-cell-padding) | `'consistent'` |

## Install

This package is [ESM only][esm]:
Node 12+ is needed to use it and it must be `imported`ed instead of `required`d.

[npm][]:

```sh
npm install remark-preset-lint-consistent
```

This package exports no identifiers.
The default export is `remarkPresetLintConsistent`.

## Use

You probably want to use it on the CLI through a config file:

```diff
 …
 "remarkConfig": {
+  "plugins": ["preset-lint-consistent"]
 }
 …
```

Or use it on the CLI directly

```sh
remark -u preset-lint-consistent readme.md
```

Or use this on the API:

```diff
 import {remark} from 'remark'
 import {reporter} from 'vfile-reporter'
 import remarkPresetLintConsistent from 'remark-preset-lint-consistent'

 remark()
+  .use(remarkPresetLintConsistent)
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

[downloads-badge]: https://img.shields.io/npm/dm/remark-preset-lint-consistent.svg

[downloads]: https://www.npmjs.com/package/remark-preset-lint-consistent

[size-badge]: https://img.shields.io/bundlephobia/minzip/remark-preset-lint-consistent.svg

[size]: https://bundlephobia.com/result?p=remark-preset-lint-consistent

[sponsors-badge]: https://opencollective.com/unified/sponsors/badge.svg

[backers-badge]: https://opencollective.com/unified/backers/badge.svg

[collective]: https://opencollective.com/unified

[chat-badge]: https://img.shields.io/badge/chat-discussions-success.svg

[chat]: https://github.com/remarkjs/remark/discussions

[esm]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c

[npm]: https://docs.npmjs.com/cli/install

[health]: https://github.com/remarkjs/.github

[contributing]: https://github.com/remarkjs/.github/blob/HEAD/contributing.md

[support]: https://github.com/remarkjs/.github/blob/HEAD/support.md

[coc]: https://github.com/remarkjs/.github/blob/HEAD/code-of-conduct.md

[license]: https://github.com/remarkjs/remark-lint/blob/main/license

[author]: https://wooorm.com

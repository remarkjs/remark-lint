<!--This file is generated-->

# remark-preset-lint-consistent

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

Preset of [`remark-lint`][mono] rules to warn for inconsistencies.

## Contents

* [What is this?](#what-is-this)
* [When should I use this?](#when-should-i-use-this)
* [Rules](#rules)
* [Install](#install)
* [Use](#use)
* [API](#api)
  * [`unified().use(remarkPresetLintConsistent)`](#unifieduseremarkpresetlintconsistent)
* [Compatibility](#compatibility)
* [Contribute](#contribute)
* [License](#license)

## What is this?

This package is a [unified][] ([remark][]) preset, specifically consisting of
`remark-lint` rules.
Lint rules check markdown code style.

## When should I use this?

You can use this package to check that markdown is consistent.

## Rules

This preset configures [`remark-lint`][mono] with the following rules:

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

This package is [ESM only][esm].
In Node.js (version 12.20+, 14.14+, or 16.0+), install with [npm][]:

```sh
npm install remark-preset-lint-consistent
```

In Deno with [`esm.sh`][esmsh]:

```js
import remarkPresetLintConsistent from 'https://esm.sh/remark-preset-lint-consistent@5'
```

In browsers with [`esm.sh`][esmsh]:

```html
<script type="module">
  import remarkPresetLintConsistent from 'https://esm.sh/remark-preset-lint-consistent@5?bundle'
</script>
```

## Use

On the API:

```js
import {read} from 'to-vfile'
import {reporter} from 'vfile-reporter'
import {remark} from 'remark'
import remarkPresetLintConsistent from 'remark-preset-lint-consistent'

main()

async function main() {
  const file = await remark()
    .use(remarkPresetLintConsistent)
    .process(await read('example.md'))

  console.error(reporter(file))
}
```

On the CLI:

```sh
remark --use remark-preset-lint-consistent example.md
```

On the CLI in a config file (here a `package.json`):

```diff
 …
 "remarkConfig": {
   "plugins": [
     …
+    "remark-preset-lint-consistent",
     …
   ]
 }
 …
```

## API

This package exports no identifiers.
The default export is `remarkPresetLintConsistent`.

### `unified().use(remarkPresetLintConsistent)`

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

[downloads-badge]: https://img.shields.io/npm/dm/remark-preset-lint-consistent.svg

[downloads]: https://www.npmjs.com/package/remark-preset-lint-consistent

[size-badge]: https://img.shields.io/bundlephobia/minzip/remark-preset-lint-consistent.svg

[size]: https://bundlephobia.com/result?p=remark-preset-lint-consistent

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

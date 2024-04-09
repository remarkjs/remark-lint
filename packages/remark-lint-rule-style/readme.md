<!--This file is generated-->

# remark-lint-rule-style

[![Build][badge-build-image]][badge-build-url]
[![Coverage][badge-coverage-image]][badge-coverage-url]
[![Downloads][badge-downloads-image]][badge-downloads-url]
[![Size][badge-size-image]][badge-size-url]
[![Sponsors][badge-funding-sponsors-image]][badge-funding-url]
[![Backers][badge-funding-backers-image]][badge-funding-url]
[![Chat][badge-chat-image]][badge-chat-url]

[`remark-lint`][github-remark-lint] rule to warn when thematic breaks (horizontal rules) are
inconsistent.

## Contents

* [What is this?](#what-is-this)
* [When should I use this?](#when-should-i-use-this)
* [Presets](#presets)
* [Install](#install)
* [Use](#use)
* [API](#api)
  * [`unified().use(remarkLintRuleStyle[, options])`](#unifieduseremarklintrulestyle-options)
  * [`Options`](#options)
* [Recommendation](#recommendation)
* [Fix](#fix)
* [Examples](#examples)
* [Compatibility](#compatibility)
* [Contribute](#contribute)
* [License](#license)

## What is this?

This package checks markers and whitespace of thematic rules.

## When should I use this?

You can use this package to check that thematic breaks are consistent.

## Presets

This plugin is included in the following presets:

| Preset | Options |
| - | - |
| [`remark-preset-lint-consistent`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-preset-lint-consistent) | `'consistent'` |
| [`remark-preset-lint-markdown-style-guide`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-preset-lint-markdown-style-guide) | `'---'` |

## Install

This package is [ESM only][github-gist-esm].
In Node.js (version 16+),
install with [npm][npm-install]:

```sh
npm install remark-lint-rule-style
```

In Deno with [`esm.sh`][esm-sh]:

```js
import remarkLintRuleStyle from 'https://esm.sh/remark-lint-rule-style@4'
```

In browsers with [`esm.sh`][esm-sh]:

```html
<script type="module">
  import remarkLintRuleStyle from 'https://esm.sh/remark-lint-rule-style@4?bundle'
</script>
```

## Use

On the API:

```js
import remarkLint from 'remark-lint'
import remarkLintRuleStyle from 'remark-lint-rule-style'
import remarkParse from 'remark-parse'
import remarkStringify from 'remark-stringify'
import {read} from 'to-vfile'
import {unified} from 'unified'
import {reporter} from 'vfile-reporter'

const file = await read('example.md')

await unified()
  .use(remarkParse)
  .use(remarkLint)
  .use(remarkLintRuleStyle)
  .use(remarkStringify)
  .process(file)

console.error(reporter(file))
```

On the CLI:

```sh
remark --frail --use remark-lint --use remark-lint-rule-style .
```

On the CLI in a config file (here a `package.json`):

```diff
 …
 "remarkConfig": {
   "plugins": [
     …
     "remark-lint",
+    "remark-lint-rule-style",
     …
   ]
 }
 …
```

## API

This package exports no identifiers.
It exports the [TypeScript][typescript] type
[`Options`][api-options].
The default export is
[`remarkLintRuleStyle`][api-remark-lint-rule-style].

### `unified().use(remarkLintRuleStyle[, options])`

Warn when thematic breaks (horizontal rules) are inconsistent.

###### Parameters

* `options` ([`Options`][api-options], default: `'consistent'`)
  — preferred style or whether to detect the first style and warn for
  further differences

### `Options`

Configuration (TypeScript type).

* `'consistent'`
  — detect the first used style and warn when further rules differ
* `string` (example: `'** * **'`, `'___'`)
  — thematic break to prefer

###### Type

```ts
type Options = string | 'consistent'
```

## Recommendation

Rules consist of a `*`, `-`, or `_` character,
which occurs at least three times with nothing else except for arbitrary
spaces or tabs on a single line.
Using spaces, tabs, or more than three markers is unnecessary work to type
out.
As asterisks can be used as a marker for more markdown constructs,
it’s recommended to use that for rules (and lists, emphasis, strong) too.
So it’s recommended to pass `'***'`.

## Fix

[`remark-stringify`][github-remark-stringify] formats rules with `***` by
default.
There are three settings to control rules:

* `rule` (default: `'*'`) — marker
* `ruleRepetition` (default: `3`) — repetitions
* `ruleSpaces` (default: `false`) — use spaces between markers

## Examples

##### `ok.md`

###### In

```markdown
Two rules:

* * *

* * *
```

###### Out

No messages.

##### `ok.md`

When configured with `'_______'`.

###### In

```markdown
_______

_______
```

###### Out

No messages.

##### `not-ok.md`

###### In

```markdown
***

* * *
```

###### Out

```text
3:1-3:6: Unexpected thematic rule `* * *`, expected `***`
```

##### `not-ok.md`

When configured with `'🌍'`.

###### Out

```text
1:1: Unexpected value `🌍` for `options`, expected thematic rule or `'consistent'`
```

## Compatibility

Projects maintained by the unified collective are compatible with maintained
versions of Node.js.

When we cut a new major release, we drop support for unmaintained versions of
Node.
This means we try to keep the current release line,
`remark-lint-rule-style@4`,
compatible with Node.js 16.

## Contribute

See [`contributing.md`][github-dotfiles-contributing] in [`remarkjs/.github`][github-dotfiles-health] for ways
to get started.
See [`support.md`][github-dotfiles-support] for ways to get help.

This project has a [code of conduct][github-dotfiles-coc].
By interacting with this repository, organization, or community you agree to
abide by its terms.

## License

[MIT][file-license] © [Titus Wormer][author]

[api-options]: #options

[api-remark-lint-rule-style]: #unifieduseremarklintrulestyle-options

[author]: https://wooorm.com

[badge-build-image]: https://github.com/remarkjs/remark-lint/workflows/main/badge.svg

[badge-build-url]: https://github.com/remarkjs/remark-lint/actions

[badge-chat-image]: https://img.shields.io/badge/chat-discussions-success.svg

[badge-chat-url]: https://github.com/remarkjs/remark/discussions

[badge-coverage-image]: https://img.shields.io/codecov/c/github/remarkjs/remark-lint.svg

[badge-coverage-url]: https://codecov.io/github/remarkjs/remark-lint

[badge-downloads-image]: https://img.shields.io/npm/dm/remark-lint-rule-style.svg

[badge-downloads-url]: https://www.npmjs.com/package/remark-lint-rule-style

[badge-funding-backers-image]: https://opencollective.com/unified/backers/badge.svg

[badge-funding-sponsors-image]: https://opencollective.com/unified/sponsors/badge.svg

[badge-funding-url]: https://opencollective.com/unified

[badge-size-image]: https://img.shields.io/bundlejs/size/remark-lint-rule-style

[badge-size-url]: https://bundlejs.com/?q=remark-lint-rule-style

[esm-sh]: https://esm.sh

[file-license]: https://github.com/remarkjs/remark-lint/blob/main/license

[github-dotfiles-coc]: https://github.com/remarkjs/.github/blob/main/code-of-conduct.md

[github-dotfiles-contributing]: https://github.com/remarkjs/.github/blob/main/contributing.md

[github-dotfiles-health]: https://github.com/remarkjs/.github

[github-dotfiles-support]: https://github.com/remarkjs/.github/blob/main/support.md

[github-gist-esm]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c

[github-remark-lint]: https://github.com/remarkjs/remark-lint

[github-remark-stringify]: https://github.com/remarkjs/remark/tree/main/packages/remark-stringify

[npm-install]: https://docs.npmjs.com/cli/install

[typescript]: https://www.typescriptlang.org

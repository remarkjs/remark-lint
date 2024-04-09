<!--This file is generated-->

# unified-lint-rule

[![Build][badge-build-image]][badge-build-url]
[![Coverage][badge-coverage-image]][badge-coverage-url]
[![Downloads][badge-downloads-image]][badge-downloads-url]
[![Size][badge-size-image]][badge-size-url]
[![Sponsors][badge-funding-sponsors-image]][badge-funding-url]
[![Backers][badge-funding-backers-image]][badge-funding-url]
[![Chat][badge-chat-image]][badge-chat-url]

**[unified][github-unified]** helper to help make lint rules.

## Contents

* [What is this?](#what-is-this)
* [When should I use this?](#when-should-i-use-this)
* [Install](#install)
* [Use](#use)
* [API](#api)
  * [`lintRule(meta, rule)`](#lintrulemeta-rule)
  * [`Label`](#label)
  * [`Meta`](#meta)
  * [`Rule`](#rule)
  * [`Severity`](#severity)
* [Compatibility](#compatibility)
* [Contribute](#contribute)
* [License](#license)

## What is this?

This package is a helper that makes it a bit easier to create linting rules.

## When should I use this?

You can use this package when you want to make custom lint rules.

## Install

This package is [ESM only][github-gist-esm].
In Node.js (version 16+),
install with [npm][npm-install]:

```sh
npm install unified-lint-rule
```

In Deno with [`esm.sh`][esm-sh]:

```js
import {lintRule} from 'https://esm.sh/unified-lint-rule@3'
```

In browsers with [`esm.sh`][esm-sh]:

```html
<script type="module">
  import {lintRule} from 'https://esm.sh/unified-lint-rule@3?bundle'
</script>
```

## Use

```js
import {lintRule} from 'unified-lint-rule'

const remarkLintFileExtension = lintRule(
  'remark-lint:file-extension',
  function (tree, file, options) {
    const ext = file.extname
    const option = options || 'md'

    if (ext && ext.slice(1) !== option) {
      file.message('Incorrect extension: use `' + option + '`')
    }
  }
)

export default remarkLintFileExtension
```

## API

This package exports the identifier
[`lintRule`][api-lint-rule].
It exports the [TypeScript][typescript] types
[`Label`][api-label],
[`Meta`][api-meta], and
[`Severity`][api-severity].
There is no default export.

### `lintRule(meta, rule)`

Create a plugin.

###### Parameters

* `meta` ([`Meta`][api-meta] or `string`)
  — info or origin
* `rule` ([`Rule`][api-rule])
  — rule

###### Returns

Plugin ([`Plugin` from `unified`][github-unified-plugin]).

### `Label`

Severity label (TypeScript type);
`'off'`: `0`, `'on'` and `warn`: `1`, `'error'`: `2`.

###### Type

```ts
type Label = 'error' | 'on' | 'off' | 'warn'
```

### `Meta`

Rule metadata (TypeScript type).

###### Fields

* `origin` (`string`)
  — name of the lint rule
* `url` (`string`, optional)
  — link to documentation

### `Rule`

Rule (TypeScript type).

###### Parameters

* `tree` ([`Node` from `unist`][github-unist-node])
  — tree
* `file` ([`VFile`][github-vfile])
  — file
* `options` (`any`, optional)
  — parameter

###### Returns

Nothing (`Promise<undefined>` or `undefined`).

### `Severity`

Severity number (TypeScript type);
`0`: `'off'`, `1`: `'on'` and `warn`, `2`: `'error'`.

###### Type

```ts
type Severity = 0 | 1 | 2
```

## Compatibility

Projects maintained by the unified collective are compatible with maintained
versions of Node.js.

When we cut a new major release, we drop support for unmaintained versions of
Node.
This means we try to keep the current release line,
`unified-lint-rule@3`,
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

[api-label]: #label

[api-lint-rule]: #lintrulemeta-rule

[api-meta]: #meta

[api-rule]: #rule

[api-severity]: #severity

[author]: https://wooorm.com

[badge-build-image]: https://github.com/remarkjs/remark-lint/workflows/main/badge.svg

[badge-build-url]: https://github.com/remarkjs/remark-lint/actions

[badge-chat-image]: https://img.shields.io/badge/chat-discussions-success.svg

[badge-chat-url]: https://github.com/remarkjs/remark/discussions

[badge-coverage-image]: https://img.shields.io/codecov/c/github/remarkjs/remark-lint.svg

[badge-coverage-url]: https://codecov.io/github/remarkjs/remark-lint

[badge-downloads-image]: https://img.shields.io/npm/dm/unified-lint-rule.svg

[badge-downloads-url]: https://www.npmjs.com/package/unified-lint-rule

[badge-funding-backers-image]: https://opencollective.com/unified/backers/badge.svg

[badge-funding-sponsors-image]: https://opencollective.com/unified/sponsors/badge.svg

[badge-funding-url]: https://opencollective.com/unified

[badge-size-image]: https://img.shields.io/bundlejs/size/unified-lint-rule

[badge-size-url]: https://bundlejs.com/?q=unified-lint-rule

[esm-sh]: https://esm.sh

[file-license]: https://github.com/remarkjs/remark-lint/blob/main/license

[github-dotfiles-coc]: https://github.com/remarkjs/.github/blob/main/code-of-conduct.md

[github-dotfiles-contributing]: https://github.com/remarkjs/.github/blob/main/contributing.md

[github-dotfiles-health]: https://github.com/remarkjs/.github

[github-dotfiles-support]: https://github.com/remarkjs/.github/blob/main/support.md

[github-gist-esm]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c

[github-unified]: https://github.com/unifiedjs/unified

[github-unified-plugin]: https://github.com/unifiedjs/unified#plugin

[github-unist-node]: https://github.com/syntax-tree/unist#node

[github-vfile]: https://github.com/vfile/vfile

[npm-install]: https://docs.npmjs.com/cli/install

[typescript]: https://www.typescriptlang.org

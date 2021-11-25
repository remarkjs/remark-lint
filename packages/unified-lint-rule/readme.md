# unified-lint-rule

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

**[unified][]** plugin to help make lint rules.

See the [monorepo readme][mono] for more info on remark lint.

## Contents

*   [What is this?](#what-is-this)
*   [When should I use this?](#when-should-i-use-this)
*   [Install](#install)
*   [Use](#use)
*   [API](#api)
    *   [`lintRule(origin|meta, rule)`](#lintruleoriginmeta-rule)
*   [Compatibility](#compatibility)
*   [Contribute](#contribute)
*   [License](#license)

## What is this?

This package is a [unified][] plugin that makes it a bit easier to create
linting rules.

**unified** is a project that transforms content with abstract syntax trees
(ASTs).
This is a plugin that make it easier to inspect trees.

## When should I use this?

You can use this package when you want to make custom lint rules.

## Install

This package is [ESM only][esm].
In Node.js (version 12.20+, 14.14+, or 16.0+), install with [npm][]:

```sh
npm install unified-lint-rule
```

In Deno with [Skypack][]:

```js
import {lintRule} from 'https://cdn.skypack.dev/unified-lint-rule@2?dts'
```

In browsers with [Skypack][]:

```html
<script type="module">
  import {lintRule} from 'https://cdn.skypack.dev/unified-lint-rule@2?min'
</script>
```

## Use

```js
import {lintRule} from 'unified-lint-rule'

const remarkLintFileExtension = lintRule(
  'remark-lint:file-extension',
  (tree, file, option = 'md') => {
    var ext = file.extname

    if (ext && ext.slice(1) !== option) {
      file.message('Incorrect extension: use `' + option + '`')
    }
  }
)

export default remarkLintFileExtension
```

## API

This package exports the following identifier: `lintRule`.
There is no default export.

### `lintRule(origin|meta, rule)`

Create a plugin.

###### Parameters

*   `origin` (`string`)
    — treated as a `meta` of `{origin}`
*   `meta` (`Object`)
    — rule metadata
*   `meta.origin` (`string`)
    — message origin, either a rule name (`'file-extension'`) or both
    a rule source and name joined with `:` (`'remark-lint:file-extension'`)
*   `meta.url` (`string`, optional)
    — URL to documentation for messages
*   `rule` (`Function`, optional)
    — your code, like a transform function, except that an extra `option` is
    passed

###### Returns

A unified plugin that handles all kinds of options (see [Configure][configure]
in the monorepo readme for how them).

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

[downloads-badge]: https://img.shields.io/npm/dm/unified-lint-rule.svg

[downloads]: https://www.npmjs.com/package/unified-lint-rule

[size-badge]: https://img.shields.io/bundlephobia/minzip/unified-lint-rule.svg

[size]: https://bundlephobia.com/result?p=unified-lint-rule

[sponsors-badge]: https://opencollective.com/unified/sponsors/badge.svg

[backers-badge]: https://opencollective.com/unified/backers/badge.svg

[collective]: https://opencollective.com/unified

[chat-badge]: https://img.shields.io/badge/chat-discussions-success.svg

[chat]: https://github.com/remarkjs/remark/discussions

[esm]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c

[skypack]: https://www.skypack.dev

[npm]: https://docs.npmjs.com/cli/install

[health]: https://github.com/remarkjs/.github

[contributing]: https://github.com/remarkjs/.github/blob/main/contributing.md

[support]: https://github.com/remarkjs/.github/blob/main/support.md

[coc]: https://github.com/remarkjs/.github/blob/main/code-of-conduct.md

[license]: https://github.com/remarkjs/remark-lint/blob/main/license

[author]: https://wooorm.com

[unified]: https://github.com/unifiedjs/unified

[mono]: https://github.com/remarkjs/remark-lint

[configure]: https://github.com/remarkjs/remark-lint#configure

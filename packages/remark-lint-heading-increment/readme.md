<!--This file is generated-->

# remark-lint-heading-increment

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

[`remark-lint`][mono] rule to warn when heading ranks increment with more than
1 at a time.

## Contents

* [What is this?](#what-is-this)
* [When should I use this?](#when-should-i-use-this)
* [Presets](#presets)
* [Install](#install)
* [Use](#use)
* [API](#api)
  * [`unified().use(remarkLintHeadingIncrement[, config])`](#unifieduseremarklintheadingincrement-config)
* [Recommendation](#recommendation)
* [Examples](#examples)
* [Compatibility](#compatibility)
* [Contribute](#contribute)
* [License](#license)

## What is this?

This package is a [unified][] ([remark][]) plugin, specifically a `remark-lint`
rule.
Lint rules check markdown code style.

## When should I use this?

You can use this package to check that heading ranks increment with one
at a time.

## Presets

This rule is included in the following presets:

| Preset | Setting |
| - | - |
| [`remark-preset-lint-markdown-style-guide`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-preset-lint-markdown-style-guide) | |

## Install

This package is [ESM only][esm].
In Node.js (version 12.20+, 14.14+, or 16.0+), install with [npm][]:

```sh
npm install remark-lint-heading-increment
```

In Deno with [`esm.sh`][esmsh]:

```js
import remarkLintHeadingIncrement from 'https://esm.sh/remark-lint-heading-increment@3'
```

In browsers with [`esm.sh`][esmsh]:

```html
<script type="module">
  import remarkLintHeadingIncrement from 'https://esm.sh/remark-lint-heading-increment@3?bundle'
</script>
```

## Use

On the API:

```js
import {read} from 'to-vfile'
import {reporter} from 'vfile-reporter'
import {remark} from 'remark'
import remarkLint from 'remark-lint'
import remarkLintHeadingIncrement from 'remark-lint-heading-increment'

main()

async function main() {
  const file = await remark()
    .use(remarkLint)
    .use(remarkLintHeadingIncrement)
    .process(await read('example.md'))

  console.error(reporter(file))
}
```

On the CLI:

```sh
remark --use remark-lint --use remark-lint-heading-increment example.md
```

On the CLI in a config file (here a `package.json`):

```diff
 …
 "remarkConfig": {
   "plugins": [
     …
     "remark-lint",
+    "remark-lint-heading-increment",
     …
   ]
 }
 …
```

## API

This package exports no identifiers.
The default export is `remarkLintHeadingIncrement`.

### `unified().use(remarkLintHeadingIncrement[, config])`

This rule supports standard configuration that all remark lint rules accept
(such as `false` to turn it off or `[1, options]` to configure it).

There are no options.

## Recommendation

While markdown is not only used for HTML, HTML accessibility guidelines
state that headings should increment by one at a time.
As in, say the previous heading had a rank of 2 (so `<h2>`), then the
following heading that is to be considered “inside” it should have a rank of
3 (`<h3>`).
Due to this, it’s recommended that when HTML output is a goal of the
document, that this rule is turned on.

## Examples

##### `ok.md`

###### In

```markdown
# Alpha

## Bravo
```

###### Out

No messages.

##### `not-ok.md`

###### In

```markdown
# Charlie

### Delta
```

###### Out

```text
3:1-3:10: Heading levels should increment by one level at a time
```

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

[downloads-badge]: https://img.shields.io/npm/dm/remark-lint-heading-increment.svg

[downloads]: https://www.npmjs.com/package/remark-lint-heading-increment

[size-badge]: https://img.shields.io/bundlephobia/minzip/remark-lint-heading-increment.svg

[size]: https://bundlephobia.com/result?p=remark-lint-heading-increment

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

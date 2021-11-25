<!--This file is generated-->

# remark-lint-no-unneeded-full-reference-link

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

[`remark-lint`][mono] rule to warn when full reference links are used that
could be collapsed.

## Contents

*   [What is this?](#what-is-this)
*   [When should I use this?](#when-should-i-use-this)
*   [Presets](#presets)
*   [Install](#install)
*   [Use](#use)
*   [API](#api)
    *   [`unified().use(remarkLintNoUnneededFullReferenceLink[, config])`](#unifieduseremarklintnounneededfullreferencelink-config)
*   [Recommendation](#recommendation)
*   [Examples](#examples)
*   [Compatibility](#compatibility)
*   [Contribute](#contribute)
*   [License](#license)

## What is this?

This package is a [unified][] ([remark][]) plugin, specifically a `remark-lint`
rule.
Lint rules check markdown code style.

## When should I use this?

You can use this package to check that collapsed reference links are
used instead of full references where possible.

## Presets

This rule is not included in a preset maintained here.

## Install

This package is [ESM only][esm].
In Node.js (version 12.20+, 14.14+, or 16.0+), install with [npm][]:

```sh
npm install remark-lint-no-unneeded-full-reference-link
```

In Deno with [Skypack][]:

```js
import remarkLintNoUnneededFullReferenceLink from 'https://cdn.skypack.dev/remark-lint-no-unneeded-full-reference-link@3?dts'
```

In browsers with [Skypack][]:

```html
<script type="module">
  import remarkLintNoUnneededFullReferenceLink from 'https://cdn.skypack.dev/remark-lint-no-unneeded-full-reference-link@3?min'
</script>
```

## Use

On the API:

```js
import {read} from 'to-vfile'
import {reporter} from 'vfile-reporter'
import {remark} from 'remark'
import remarkLint from 'remark-lint'
import remarkLintNoUnneededFullReferenceLink from 'remark-lint-no-unneeded-full-reference-link'

main()

async function main() {
  const file = await remark()
    .use(remarkLint)
    .use(remarkLintNoUnneededFullReferenceLink)
    .process(await read('example.md'))

  console.error(reporter(file))
}
```

On the CLI:

```sh
remark --use remark-lint --use remark-lint-no-unneeded-full-reference-link example.md
```

On the CLI in a config file (here a `package.json`):

```diff
 …
 "remarkConfig": {
   "plugins": [
     …
     "remark-lint",
+    "remark-lint-no-unneeded-full-reference-link",
     …
   ]
 }
 …
```

## API

This package exports no identifiers.
The default export is `remarkLintNoUnneededFullReferenceLink`.

### `unified().use(remarkLintNoUnneededFullReferenceLink[, config])`

This rule supports standard configuration that all remark lint rules accept
(such as `false` to turn it off or `[1, options]` to configure it).

There are no options.

## Recommendation

Full reference syntax (`![Alt][alt]`) is quite verbose compared to
the concise collapsed reference syntax (`![Alt][]`).

## Examples

##### `ok.md`

###### In

```markdown
[alpha][]
[Bravo][]
[Charlie][delta]

This only works if the link text is a `text` node:
[`echo`][]
[*foxtrot*][]

[alpha]: a
[bravo]: b
[delta]: d
[`echo`]: e
[*foxtrot*]: f
```

###### Out

No messages.

##### `not-ok.md`

###### In

```markdown
[alpha][alpha]
[Bravo][bravo]
[charlie][Charlie]

[alpha]: a
[bravo]: b
[charlie]: c
```

###### Out

```text
1:1-1:15: Remove the link label as it matches the reference text
2:1-2:15: Remove the link label as it matches the reference text
3:1-3:19: Remove the link label as it matches the reference text
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

[downloads-badge]: https://img.shields.io/npm/dm/remark-lint-no-unneeded-full-reference-link.svg

[downloads]: https://www.npmjs.com/package/remark-lint-no-unneeded-full-reference-link

[size-badge]: https://img.shields.io/bundlephobia/minzip/remark-lint-no-unneeded-full-reference-link.svg

[size]: https://bundlephobia.com/result?p=remark-lint-no-unneeded-full-reference-link

[sponsors-badge]: https://opencollective.com/unified/sponsors/badge.svg

[backers-badge]: https://opencollective.com/unified/backers/badge.svg

[collective]: https://opencollective.com/unified

[chat-badge]: https://img.shields.io/badge/chat-discussions-success.svg

[chat]: https://github.com/remarkjs/remark/discussions

[unified]: https://github.com/unifiedjs/unified

[remark]: https://github.com/remarkjs/remark

[mono]: https://github.com/remarkjs/remark-lint

[esm]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c

[skypack]: https://www.skypack.dev

[npm]: https://docs.npmjs.com/cli/install

[health]: https://github.com/remarkjs/.github

[contributing]: https://github.com/remarkjs/.github/blob/main/contributing.md

[support]: https://github.com/remarkjs/.github/blob/main/support.md

[coc]: https://github.com/remarkjs/.github/blob/main/code-of-conduct.md

[license]: https://github.com/remarkjs/remark-lint/blob/main/license

[author]: https://wooorm.com

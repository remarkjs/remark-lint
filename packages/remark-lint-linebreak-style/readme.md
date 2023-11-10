<!--This file is generated-->

# remark-lint-linebreak-style

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

[`remark-lint`][mono] rule to warn when line endings don’t match a given style.

## Contents

* [What is this?](#what-is-this)
* [When should I use this?](#when-should-i-use-this)
* [Presets](#presets)
* [Install](#install)
* [Use](#use)
* [API](#api)
  * [`unified().use(remarkLintLinebreakStyle[, config])`](#unifieduseremarklintlinebreakstyle-config)
* [Recommendation](#recommendation)
* [Fix](#fix)
* [Examples](#examples)
* [Compatibility](#compatibility)
* [Contribute](#contribute)
* [License](#license)

## What is this?

This package is a [unified][] ([remark][]) plugin, specifically a `remark-lint`
rule.
Lint rules check markdown code style.

## When should I use this?

You can use this package to check that line endings are consistent.

## Presets

This rule is not included in a preset maintained here.

## Install

This package is [ESM only][esm].
In Node.js (version 12.20+, 14.14+, or 16.0+), install with [npm][]:

```sh
npm install remark-lint-linebreak-style
```

In Deno with [`esm.sh`][esmsh]:

```js
import remarkLintLinebreakStyle from 'https://esm.sh/remark-lint-linebreak-style@3'
```

In browsers with [`esm.sh`][esmsh]:

```html
<script type="module">
  import remarkLintLinebreakStyle from 'https://esm.sh/remark-lint-linebreak-style@3?bundle'
</script>
```

## Use

On the API:

```js
import {read} from 'to-vfile'
import {reporter} from 'vfile-reporter'
import {remark} from 'remark'
import remarkLint from 'remark-lint'
import remarkLintLinebreakStyle from 'remark-lint-linebreak-style'

main()

async function main() {
  const file = await remark()
    .use(remarkLint)
    .use(remarkLintLinebreakStyle)
    .process(await read('example.md'))

  console.error(reporter(file))
}
```

On the CLI:

```sh
remark --use remark-lint --use remark-lint-linebreak-style example.md
```

On the CLI in a config file (here a `package.json`):

```diff
 …
 "remarkConfig": {
   "plugins": [
     …
     "remark-lint",
+    "remark-lint-linebreak-style",
     …
   ]
 }
 …
```

## API

This package exports no identifiers.
The default export is `remarkLintLinebreakStyle`.

### `unified().use(remarkLintLinebreakStyle[, config])`

This rule supports standard configuration that all remark lint rules accept
(such as `false` to turn it off or `[1, options]` to configure it).

The following options (default: `'consistent'`) are accepted:

* `'unix'`
  — prefer Unix line endings (`\n`, `␊`):
* `'window'`
  — prefer Windows line endings (`\r\n`, `␍␊`):
* `'consistent'`
  — detect the first used style and warn when further line endings differ

## Recommendation

In Git projects, you can configure it to automatically switch between line
endings based on who checks the repo out.
In other places, you might manually want to force that one or the other is
used, in which case this rule can be used and configured.

## Fix

[`remark-stringify`](https://github.com/remarkjs/remark/tree/main/packages/remark-stringify)
always uses Unix linebreaks.

## Examples

##### `ok-consistent-as-windows.md`

###### In

> 👉 **Note**: `␍␊` represents a carriage return and a line feed.

```markdown
Alpha␍␊
Bravo␍␊
```

###### Out

No messages.

##### `ok-consistent-as-unix.md`

###### In

> 👉 **Note**: `␊` represents a line feed.

```markdown
Alpha␊
Bravo␊
```

###### Out

No messages.

##### `not-ok-unix.md`

When configured with `'unix'`.

###### In

> 👉 **Note**: `␍␊` represents a carriage return and a line feed.

```markdown
Alpha␍␊
```

###### Out

```text
1:7: Expected linebreaks to be unix (`\n`), not windows (`\r\n`)
```

##### `not-ok-windows.md`

When configured with `'windows'`.

###### In

> 👉 **Note**: `␊` represents a line feed.

```markdown
Alpha␊
```

###### Out

```text
1:6: Expected linebreaks to be windows (`\r\n`), not unix (`\n`)
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

[downloads-badge]: https://img.shields.io/npm/dm/remark-lint-linebreak-style.svg

[downloads]: https://www.npmjs.com/package/remark-lint-linebreak-style

[size-badge]: https://img.shields.io/bundlephobia/minzip/remark-lint-linebreak-style.svg

[size]: https://bundlephobia.com/result?p=remark-lint-linebreak-style

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

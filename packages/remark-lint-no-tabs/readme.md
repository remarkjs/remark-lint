<!--This file is generated-->

# remark-lint-no-tabs

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

[`remark-lint`][mono] rule to warn when tabs are used.

## Contents

*   [What is this?](#what-is-this)
*   [When should I use this?](#when-should-i-use-this)
*   [Presets](#presets)
*   [Install](#install)
*   [Use](#use)
*   [API](#api)
    *   [`unified().use(remarkLintNoTabs[, config])`](#unifieduseremarklintnotabs-config)
*   [Recommendation](#recommendation)
*   [Fix](#fix)
*   [Examples](#examples)
*   [Compatibility](#compatibility)
*   [Contribute](#contribute)
*   [License](#license)

## What is this?

This package is a [unified][] ([remark][]) plugin, specifically a `remark-lint`
rule.
Lint rules check markdown code style.

## When should I use this?

You can use this package to check that tabs are not used.

## Presets

This rule is not included in a preset maintained here.

## Install

This package is [ESM only][esm].
In Node.js (version 12.20+, 14.14+, or 16.0+), install with [npm][]:

```sh
npm install remark-lint-no-tabs
```

In Deno with [Skypack][]:

```js
import remarkLintNoTabs from 'https://cdn.skypack.dev/remark-lint-no-tabs@3?dts'
```

In browsers with [Skypack][]:

```html
<script type="module">
  import remarkLintNoTabs from 'https://cdn.skypack.dev/remark-lint-no-tabs@3?min'
</script>
```

## Use

On the API:

```js
import {read} from 'to-vfile'
import {reporter} from 'vfile-reporter'
import {remark} from 'remark'
import remarkLint from 'remark-lint'
import remarkLintNoTabs from 'remark-lint-no-tabs'

main()

async function main() {
  const file = await remark()
    .use(remarkLint)
    .use(remarkLintNoTabs)
    .process(await read('example.md'))

  console.error(reporter(file))
}
```

On the CLI:

```sh
remark --use remark-lint --use remark-lint-no-tabs example.md
```

On the CLI in a config file (here a `package.json`):

```diff
 …
 "remarkConfig": {
   "plugins": [
     …
     "remark-lint",
+    "remark-lint-no-tabs",
     …
   ]
 }
 …
```

## API

This package exports no identifiers.
The default export is `remarkLintNoTabs`.

### `unified().use(remarkLintNoTabs[, config])`

This rule supports standard configuration that all remark lint rules accept
(such as `false` to turn it off or `[1, options]` to configure it).

There are no options.

## Recommendation

Regardless of the debate in other languages of whether to use tabs vs.
spaces, when it comes to markdown, tabs do not work as expected.
Largely around contains such as block quotes and lists.
Take for example block quotes: `>\ta` gives a paragraph with the text `a`
in a blockquote, so one might expect that `>\t\ta` results in indented code
with the text `a` in a block quote.

```markdown
>\ta

>\t\ta
```

Yields:

```html
<blockquote>
<p>a</p>
</blockquote>
<blockquote>
<pre><code>  a
</code></pre>
</blockquote>
```

Because markdown uses a hardcoded tab size of 4, the first tab could be
represented as 3 spaces (because there’s a `>` before).
One of those “spaces” is taken because block quotes allow the `>` to be
followed by one space, leaving 2 spaces.
The next tab can be represented as 4 spaces, so together we have 6 spaces.
The indented code uses 4 spaces, so there are two spaces left, which are
shown in the indented code.

## Fix

[`remark-stringify`](https://github.com/remarkjs/remark/tree/main/packages/remark-stringify)
uses spaces exclusively for indentation.

## Examples

##### `ok.md`

###### In

> 👉 **Note**: `·` represents a space.

```markdown
Foo Bar

····Foo
```

###### Out

No messages.

##### `not-ok.md`

###### In

> 👉 **Note**: `»` represents a tab.

```markdown
»Here's one before a code block.

Here's a tab:», and here is another:».

And this is in `inline»code`.

>»This is in a block quote.

*»And…

»1.»in a list.

And this is a tab as the last character.»
```

###### Out

```text
1:1: Use spaces instead of tabs
3:14: Use spaces instead of tabs
3:37: Use spaces instead of tabs
5:23: Use spaces instead of tabs
7:2: Use spaces instead of tabs
9:2: Use spaces instead of tabs
11:1: Use spaces instead of tabs
11:4: Use spaces instead of tabs
13:41: Use spaces instead of tabs
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

[downloads-badge]: https://img.shields.io/npm/dm/remark-lint-no-tabs.svg

[downloads]: https://www.npmjs.com/package/remark-lint-no-tabs

[size-badge]: https://img.shields.io/bundlephobia/minzip/remark-lint-no-tabs.svg

[size]: https://bundlephobia.com/result?p=remark-lint-no-tabs

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

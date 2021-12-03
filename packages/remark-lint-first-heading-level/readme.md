<!--This file is generated-->

# remark-lint-first-heading-level

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

[`remark-lint`][mono] rule to warn when the first heading has an unexpected rank.

## Contents

*   [What is this?](#what-is-this)
*   [When should I use this?](#when-should-i-use-this)
*   [Presets](#presets)
*   [Install](#install)
*   [Use](#use)
*   [API](#api)
    *   [`unified().use(remarkLintFirstHeadingLevel[, config])`](#unifieduseremarklintfirstheadinglevel-config)
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

You can use this package to check the heading rank of the first heading.

## Presets

This rule is not included in a preset maintained here.

## Install

This package is [ESM only][esm].
In Node.js (version 12.20+, 14.14+, or 16.0+), install with [npm][]:

```sh
npm install remark-lint-first-heading-level
```

In Deno with [Skypack][]:

```js
import remarkLintFirstHeadingLevel from 'https://cdn.skypack.dev/remark-lint-first-heading-level@3?dts'
```

In browsers with [Skypack][]:

```html
<script type="module">
  import remarkLintFirstHeadingLevel from 'https://cdn.skypack.dev/remark-lint-first-heading-level@3?min'
</script>
```

## Use

On the API:

```js
import {read} from 'to-vfile'
import {reporter} from 'vfile-reporter'
import {remark} from 'remark'
import remarkLint from 'remark-lint'
import remarkLintFirstHeadingLevel from 'remark-lint-first-heading-level'

main()

async function main() {
  const file = await remark()
    .use(remarkLint)
    .use(remarkLintFirstHeadingLevel)
    .process(await read('example.md'))

  console.error(reporter(file))
}
```

On the CLI:

```sh
remark --use remark-lint --use remark-lint-first-heading-level example.md
```

On the CLI in a config file (here a `package.json`):

```diff
 …
 "remarkConfig": {
   "plugins": [
     …
     "remark-lint",
+    "remark-lint-first-heading-level",
     …
   ]
 }
 …
```

## API

This package exports no identifiers.
The default export is `remarkLintFirstHeadingLevel`.

### `unified().use(remarkLintFirstHeadingLevel[, config])`

This rule supports standard configuration that all remark lint rules accept
(such as `false` to turn it off or `[1, options]` to configure it).

The following options (default: `1`) are accepted:

*   `number` (example `1`)
    — expected rank of first heading

## Recommendation

In most cases you’d want to first heading in a markdown document to start at
rank 1.
In some cases a different rank makes more sense, such as when building a blog
and generating the primary heading from frontmatter metadata, in which case
a value of `2` can be defined here.

## Examples

##### `ok.md`

When configured with `2`.

###### In

```markdown
## Delta

Paragraph.
```

###### Out

No messages.

##### `ok-html.md`

When configured with `2`.

###### In

```markdown
<h2>Echo</h2>

Paragraph.
```

###### Out

No messages.

##### `not-ok.md`

When configured with `2`.

###### In

```markdown
# Foxtrot

Paragraph.
```

###### Out

```text
1:1-1:10: First heading level should be `2`
```

##### `not-ok-html.md`

When configured with `2`.

###### In

```markdown
<h1>Golf</h1>

Paragraph.
```

###### Out

```text
1:1-1:14: First heading level should be `2`
```

##### `ok.md`

###### In

```markdown
# The default is to expect a level one heading
```

###### Out

No messages.

##### `ok-html.md`

###### In

```markdown
<h1>An HTML heading is also seen by this rule.</h1>
```

###### Out

No messages.

##### `ok-delayed.md`

###### In

```markdown
You can use markdown content before the heading.

<div>Or non-heading HTML</div>

<h1>So the first heading, be it HTML or markdown, is checked</h1>
```

###### Out

No messages.

##### `not-ok.md`

###### In

```markdown
## Bravo

Paragraph.
```

###### Out

```text
1:1-1:9: First heading level should be `1`
```

##### `not-ok-html.md`

###### In

```markdown
<h2>Charlie</h2>

Paragraph.
```

###### Out

```text
1:1-1:17: First heading level should be `1`
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

[downloads-badge]: https://img.shields.io/npm/dm/remark-lint-first-heading-level.svg

[downloads]: https://www.npmjs.com/package/remark-lint-first-heading-level

[size-badge]: https://img.shields.io/bundlephobia/minzip/remark-lint-first-heading-level.svg

[size]: https://bundlephobia.com/result?p=remark-lint-first-heading-level

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

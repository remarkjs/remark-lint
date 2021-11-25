<!--This file is generated-->

# remark-lint-ordered-list-marker-value

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

[`remark-lint`][mono] rule to warn when ordered list values are inconsistent.

## Contents

*   [What is this?](#what-is-this)
*   [When should I use this?](#when-should-i-use-this)
*   [Presets](#presets)
*   [Install](#install)
*   [Use](#use)
*   [API](#api)
    *   [`unified().use(remarkLintOrderedListMarkerValue[, config])`](#unifieduseremarklintorderedlistmarkervalue-config)
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

You can use this package to check that ordered list values are consistent.

## Presets

This rule is included in the following presets:

| Preset | Setting |
| - | - |
| [`remark-preset-lint-markdown-style-guide`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-preset-lint-markdown-style-guide) | `'one'` |

## Install

This package is [ESM only][esm].
In Node.js (version 12.20+, 14.14+, or 16.0+), install with [npm][]:

```sh
npm install remark-lint-ordered-list-marker-value
```

In Deno with [Skypack][]:

```js
import remarkLintOrderedListMarkerValue from 'https://cdn.skypack.dev/remark-lint-ordered-list-marker-value@3?dts'
```

In browsers with [Skypack][]:

```html
<script type="module">
  import remarkLintOrderedListMarkerValue from 'https://cdn.skypack.dev/remark-lint-ordered-list-marker-value@3?min'
</script>
```

## Use

On the API:

```js
import {read} from 'to-vfile'
import {reporter} from 'vfile-reporter'
import {remark} from 'remark'
import remarkLint from 'remark-lint'
import remarkLintOrderedListMarkerValue from 'remark-lint-ordered-list-marker-value'

main()

async function main() {
  const file = await remark()
    .use(remarkLint)
    .use(remarkLintOrderedListMarkerValue)
    .process(await read('example.md'))

  console.error(reporter(file))
}
```

On the CLI:

```sh
remark --use remark-lint --use remark-lint-ordered-list-marker-value example.md
```

On the CLI in a config file (here a `package.json`):

```diff
 …
 "remarkConfig": {
   "plugins": [
     …
     "remark-lint",
+    "remark-lint-ordered-list-marker-value",
     …
   ]
 }
 …
```

## API

This package exports no identifiers.
The default export is `remarkLintOrderedListMarkerValue`.

### `unified().use(remarkLintOrderedListMarkerValue[, config])`

This rule supports standard configuration that all remark lint rules accept
(such as `false` to turn it off or `[1, options]` to configure it).

The following options (default: `'ordered'`) are accepted:

*   `'ordered'`
    — values should increment by one from the first item
*   `'single'`
    — values should stay the same as the first item
*   `'one'`
    — values should always be exactly `1`

## Recommendation

While `'single'` might be the smartest style, as it makes it easier to move
items around without having to renumber everything and doesn’t have
problems with aligning content of the 9th and the 10th item, it’s not used a
lot and arguably looks unnatural.
`'one'` is like `'single'` but forces every list to start at `1`.
While not often needed, starting lists at other values is sometimes useful.
Due to this, `'ordered'` is recommended, although `'single'` is also a viable
choice.

## Fix

[`remark-stringify`](https://github.com/remarkjs/remark/tree/main/packages/remark-stringify)
retains the value of the first item and increments further items by default.
Pass
[`incrementListMarker: false`](https://github.com/remarkjs/remark/tree/main/packages/remark-stringify#optionsincrementlistmarker)
to not increment further items.

## Examples

##### `ok.md`

###### In

```markdown
The default value is `ordered`, so unless changed, the below
is OK.

1.  Foo
2.  Bar
3.  Baz

Paragraph.

3.  Alpha
4.  Bravo
5.  Charlie

Unordered lists are not affected by this rule.

*   Anton
```

###### Out

No messages.

##### `ok.md`

When configured with `'one'`.

###### In

```markdown
1.  Foo
1.  Bar
1.  Baz

Paragraph.

1.  Alpha
1.  Bravo
1.  Charlie
```

###### Out

No messages.

##### `not-ok.md`

When configured with `'one'`.

###### In

```markdown
1.  Foo
2.  Bar
```

###### Out

```text
2:1-2:8: Marker should be `1`, was `2`
```

##### `also-not-ok.md`

When configured with `'one'`.

###### In

```markdown
2.  Foo
1.  Bar
```

###### Out

```text
1:1-1:8: Marker should be `1`, was `2`
```

##### `ok.md`

When configured with `'single'`.

###### In

```markdown
1.  Foo
1.  Bar
1.  Baz

Paragraph.

3.  Alpha
3.  Bravo
3.  Charlie

Paragraph.

0.  Delta
0.  Echo
0.  Foxtrot
```

###### Out

No messages.

##### `ok.md`

When configured with `'ordered'`.

###### In

```markdown
1.  Foo
2.  Bar
3.  Baz

Paragraph.

3.  Alpha
4.  Bravo
5.  Charlie

Paragraph.

0.  Delta
1.  Echo
2.  Foxtrot
```

###### Out

No messages.

##### `not-ok.md`

When configured with `'ordered'`.

###### In

```markdown
1.  Foo
1.  Bar
```

###### Out

```text
2:1-2:8: Marker should be `2`, was `1`
```

##### `not-ok.md`

When configured with `'💩'`.

###### Out

```text
1:1: Incorrect ordered list item marker value `💩`: use either `'ordered'`, `'one'`, or `'single'`
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

[downloads-badge]: https://img.shields.io/npm/dm/remark-lint-ordered-list-marker-value.svg

[downloads]: https://www.npmjs.com/package/remark-lint-ordered-list-marker-value

[size-badge]: https://img.shields.io/bundlephobia/minzip/remark-lint-ordered-list-marker-value.svg

[size]: https://bundlephobia.com/result?p=remark-lint-ordered-list-marker-value

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

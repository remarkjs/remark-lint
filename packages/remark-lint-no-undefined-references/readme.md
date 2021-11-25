<!--This file is generated-->

# remark-lint-no-undefined-references

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

[`remark-lint`][mono] rule to warn when undefined definitions are referenced.

## Contents

*   [What is this?](#what-is-this)
*   [When should I use this?](#when-should-i-use-this)
*   [Presets](#presets)
*   [Install](#install)
*   [Use](#use)
*   [API](#api)
    *   [`unified().use(remarkLintNoUndefinedReferences[, config])`](#unifieduseremarklintnoundefinedreferences-config)
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

You can use this package to check that referenced definitions are defined.

## Presets

This rule is included in the following presets:

| Preset | Setting |
| - | - |
| [`remark-preset-lint-recommended`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-preset-lint-recommended) | |

## Install

This package is [ESM only][esm].
In Node.js (version 12.20+, 14.14+, or 16.0+), install with [npm][]:

```sh
npm install remark-lint-no-undefined-references
```

In Deno with [Skypack][]:

```js
import remarkLintNoUndefinedReferences from 'https://cdn.skypack.dev/remark-lint-no-undefined-references@4?dts'
```

In browsers with [Skypack][]:

```html
<script type="module">
  import remarkLintNoUndefinedReferences from 'https://cdn.skypack.dev/remark-lint-no-undefined-references@4?min'
</script>
```

## Use

On the API:

```js
import {read} from 'to-vfile'
import {reporter} from 'vfile-reporter'
import {remark} from 'remark'
import remarkLint from 'remark-lint'
import remarkLintNoUndefinedReferences from 'remark-lint-no-undefined-references'

main()

async function main() {
  const file = await remark()
    .use(remarkLint)
    .use(remarkLintNoUndefinedReferences)
    .process(await read('example.md'))

  console.error(reporter(file))
}
```

On the CLI:

```sh
remark --use remark-lint --use remark-lint-no-undefined-references example.md
```

On the CLI in a config file (here a `package.json`):

```diff
 …
 "remarkConfig": {
   "plugins": [
     …
     "remark-lint",
+    "remark-lint-no-undefined-references",
     …
   ]
 }
 …
```

## API

This package exports no identifiers.
The default export is `remarkLintNoUndefinedReferences`.

### `unified().use(remarkLintNoUndefinedReferences[, config])`

This rule supports standard configuration that all remark lint rules accept
(such as `false` to turn it off or `[1, options]` to configure it).

The following options (default: `undefined`) are accepted:

*   `Object` with the following fields:
    *   `allow` (`Array<string>`, default: `[]`)
        — text that you want to allowed between `[` and `]` even though it’s
        undefined

## Recommendation

Shortcut references use an implicit syntax that could also occur as plain
text.
For example, it is reasonable to expect an author adding `[…]` to abbreviate
some text somewhere in a document:

```markdown
> Some […] quote.
```

This isn’t a problem, but it might become one when an author later adds a
definition:

```markdown
Some text. […][]

[…] #read-more "Read more"
```

The second author might expect only their newly added text to form a link,
but their changes also result in a link for the first author’s text.

## Examples

##### `ok.md`

###### In

```markdown
[foo][]

Just a [ bracket.

Typically, you’d want to use escapes (with a backslash: \\) to escape what
could turn into a \[reference otherwise].

Just two braces can’t link: [].

[foo]: https://example.com
```

###### Out

No messages.

##### `not-ok.md`

###### In

```markdown
[bar]

[baz][]

[text][qux]

Spread [over
lines][]

> in [a
> block quote][]

[asd][a

Can include [*emphasis*].

Multiple pairs: [a][b][c].
```

###### Out

```text
1:1-1:6: Found reference to undefined definition
3:1-3:8: Found reference to undefined definition
5:1-5:12: Found reference to undefined definition
7:8-8:9: Found reference to undefined definition
10:6-11:17: Found reference to undefined definition
13:1-13:6: Found reference to undefined definition
15:13-15:25: Found reference to undefined definition
17:17-17:23: Found reference to undefined definition
17:23-17:26: Found reference to undefined definition
```

##### `ok-allow.md`

When configured with `{ allow: [ '...', '…' ] }`.

###### In

```markdown
> Eliding a portion of a quoted passage […] is acceptable.
```

###### Out

No messages.

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

[downloads-badge]: https://img.shields.io/npm/dm/remark-lint-no-undefined-references.svg

[downloads]: https://www.npmjs.com/package/remark-lint-no-undefined-references

[size-badge]: https://img.shields.io/bundlephobia/minzip/remark-lint-no-undefined-references.svg

[size]: https://bundlephobia.com/result?p=remark-lint-no-undefined-references

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

<!--This file is generated-->

# remark-lint-no-undefined-references

[![Build][badge-build-image]][badge-build-url]
[![Coverage][badge-coverage-image]][badge-coverage-url]
[![Downloads][badge-downloads-image]][badge-downloads-url]
[![Size][badge-size-image]][badge-size-url]
[![Sponsors][badge-funding-sponsors-image]][badge-funding-url]
[![Backers][badge-funding-backers-image]][badge-funding-url]
[![Chat][badge-chat-image]][badge-chat-url]

[`remark-lint`][github-remark-lint] rule to warn when undefined definitions are referenced.

## Contents

* [What is this?](#what-is-this)
* [When should I use this?](#when-should-i-use-this)
* [Presets](#presets)
* [Install](#install)
* [Use](#use)
* [API](#api)
  * [`unified().use(remarkLintNoUndefinedReferences[, options])`](#unifieduseremarklintnoundefinedreferences-options)
  * [`Options`](#options)
* [Recommendation](#recommendation)
* [Examples](#examples)
* [Compatibility](#compatibility)
* [Contribute](#contribute)
* [License](#license)

## What is this?

This package checks that referenced definitions are defined.

## When should I use this?

You can use this package to check for broken references.

## Presets

This plugin is included in the following presets:

| Preset | Options |
| - | - |
| [`remark-preset-lint-recommended`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-preset-lint-recommended) | |

## Install

This package is [ESM only][github-gist-esm].
In Node.js (version 16+),
install with [npm][npm-install]:

```sh
npm install remark-lint-no-undefined-references
```

In Deno with [`esm.sh`][esm-sh]:

```js
import remarkLintNoUndefinedReferences from 'https://esm.sh/remark-lint-no-undefined-references@5'
```

In browsers with [`esm.sh`][esm-sh]:

```html
<script type="module">
  import remarkLintNoUndefinedReferences from 'https://esm.sh/remark-lint-no-undefined-references@5?bundle'
</script>
```

## Use

On the API:

```js
import remarkLint from 'remark-lint'
import remarkLintNoUndefinedReferences from 'remark-lint-no-undefined-references'
import remarkParse from 'remark-parse'
import remarkStringify from 'remark-stringify'
import {read} from 'to-vfile'
import {unified} from 'unified'
import {reporter} from 'vfile-reporter'

const file = await read('example.md')

await unified()
  .use(remarkParse)
  .use(remarkLint)
  .use(remarkLintNoUndefinedReferences)
  .use(remarkStringify)
  .process(file)

console.error(reporter(file))
```

On the CLI:

```sh
remark --frail --use remark-lint --use remark-lint-no-undefined-references .
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
It exports the [TypeScript][typescript] type
[`Options`][api-options].
The default export is
[`remarkLintNoUndefinedReferences`][api-remark-lint-no-undefined-references].

### `unified().use(remarkLintNoUndefinedReferences[, options])`

Warn when undefined definitions are referenced.

###### Parameters

* `options` ([`Options`][api-options], optional)
  — configuration

###### Returns

Transform ([`Transformer` from `unified`][github-unified-transformer]).

### `Options`

Configuration (TypeScript type).

###### Fields

* `allow` (`Array<RegExp | string>`, optional)
  — list of values to allow between `[` and `]`
* `allowShortcutLink` (`boolean`, default: `false`)
  — allow shortcut references, which are just brackets such as `[text]`

## Recommendation

Shortcut references use an implicit syntax that could also occur as plain
text.
To illustrate,
it is reasonable to expect an author adding `[…]` to abbreviate some text
somewhere in a document:

```markdown
> Some […] quote.
```

This isn’t a problem,
but it might become one when an author later adds a definition:

```markdown
Some new text […][].

[…]: #read-more
```

The second author might expect only their newly added text to form a link,
but their changes also result in a link for the text by the first author.

## Examples

##### `ok.md`

###### In

```markdown
[Mercury][] is the first planet from the Sun and the smallest in the Solar
System.

Venus is the second planet from the [Sun.

Earth is the third planet from the \[Sun] and the only astronomical object
known to harbor life\.

Mars is the fourth planet from the Sun: [].

[mercury]: https://example.com/mercury/
```

###### Out

No messages.

##### `not-ok.md`

###### In

```markdown
[Mercury] is the first planet from the Sun and the smallest in the Solar
System.

[Venus][] is the second planet from the Sun.

[Earth][earth] is the third planet from the Sun and the only astronomical
object known to harbor life.

![Mars] is the fourth planet from the Sun in the [Solar
System].

> Jupiter is the fifth planet from the Sun and the largest in the [Solar
> System][].

[Saturn][ is the sixth planet from the Sun and the second-largest
in the Solar System, after Jupiter.

[*Uranus*][] is the seventh planet from the Sun.

[Neptune][neptune][more] is the eighth and farthest planet from the Sun.
```

###### Out

```text
1:1-1:10: Unexpected reference to undefined definition, expected corresponding definition (`mercury`) for a link or escaped opening bracket (`\[`) for regular text
4:1-4:10: Unexpected reference to undefined definition, expected corresponding definition (`venus`) for a link or escaped opening bracket (`\[`) for regular text
6:1-6:15: Unexpected reference to undefined definition, expected corresponding definition (`earth`) for a link or escaped opening bracket (`\[`) for regular text
9:2-9:8: Unexpected reference to undefined definition, expected corresponding definition (`mars`) for an image or escaped opening bracket (`\[`) for regular text
9:50-10:8: Unexpected reference to undefined definition, expected corresponding definition (`solar system`) for a link or escaped opening bracket (`\[`) for regular text
12:67-13:12: Unexpected reference to undefined definition, expected corresponding definition (`solar > system`) for a link or escaped opening bracket (`\[`) for regular text
15:1-15:9: Unexpected reference to undefined definition, expected corresponding definition (`saturn`) for a link or escaped opening bracket (`\[`) for regular text
18:1-18:13: Unexpected reference to undefined definition, expected corresponding definition (`*uranus*`) for a link or escaped opening bracket (`\[`) for regular text
20:1-20:19: Unexpected reference to undefined definition, expected corresponding definition (`neptune`) for a link or escaped opening bracket (`\[`) for regular text
20:19-20:25: Unexpected reference to undefined definition, expected corresponding definition (`more`) for a link or escaped opening bracket (`\[`) for regular text
```

##### `ok-allow.md`

When configured with `{ allow: [ '…' ] }`.

###### In

```markdown
Mercury is the first planet from the Sun and the smallest in the Solar
System. […]
```

###### Out

No messages.

##### `source.md`

When configured with `{ allow: [ { source: '^mer' }, 'venus' ] }`.

###### In

```markdown
[Mercury][] is the first planet from the Sun and the smallest in the Solar
System.

[Venus][] is the second planet from the Sun.
```

###### Out

No messages.

##### `gfm.md`

###### In

> 👉 **Note**: this example uses
> GFM ([`remark-gfm`][github-remark-gfm]).

```markdown
Mercury[^mercury] is the first planet from the Sun and the smallest in the
Solar System.

[^venus]:
    **Venus** is the second planet from the Sun.
```

###### Out

```text
1:8-1:18: Unexpected reference to undefined definition, expected corresponding definition (`mercury`) for a footnote or escaped opening bracket (`\[`) for regular text
```

##### `allow-shortcut-link.md`

When configured with `{ allowShortcutLink: true }`.

###### In

```markdown
[Mercury] is the first planet from the Sun and the smallest in the Solar
System.

[Venus][] is the second planet from the Sun.

[Earth][earth] is the third planet from the Sun and the only astronomical object
known to harbor life.
```

###### Out

```text
4:1-4:10: Unexpected reference to undefined definition, expected corresponding definition (`venus`) for a link or escaped opening bracket (`\[`) for regular text
6:1-6:15: Unexpected reference to undefined definition, expected corresponding definition (`earth`) for a link or escaped opening bracket (`\[`) for regular text
```

## Compatibility

Projects maintained by the unified collective are compatible with maintained
versions of Node.js.

When we cut a new major release, we drop support for unmaintained versions of
Node.
This means we try to keep the current release line,
`remark-lint-no-undefined-references@5`,
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

[api-remark-lint-no-undefined-references]: #unifieduseremarklintnoundefinedreferences-options

[author]: https://wooorm.com

[badge-build-image]: https://github.com/remarkjs/remark-lint/workflows/main/badge.svg

[badge-build-url]: https://github.com/remarkjs/remark-lint/actions

[badge-chat-image]: https://img.shields.io/badge/chat-discussions-success.svg

[badge-chat-url]: https://github.com/remarkjs/remark/discussions

[badge-coverage-image]: https://img.shields.io/codecov/c/github/remarkjs/remark-lint.svg

[badge-coverage-url]: https://codecov.io/github/remarkjs/remark-lint

[badge-downloads-image]: https://img.shields.io/npm/dm/remark-lint-no-undefined-references.svg

[badge-downloads-url]: https://www.npmjs.com/package/remark-lint-no-undefined-references

[badge-funding-backers-image]: https://opencollective.com/unified/backers/badge.svg

[badge-funding-sponsors-image]: https://opencollective.com/unified/sponsors/badge.svg

[badge-funding-url]: https://opencollective.com/unified

[badge-size-image]: https://img.shields.io/bundlejs/size/remark-lint-no-undefined-references

[badge-size-url]: https://bundlejs.com/?q=remark-lint-no-undefined-references

[esm-sh]: https://esm.sh

[file-license]: https://github.com/remarkjs/remark-lint/blob/main/license

[github-dotfiles-coc]: https://github.com/remarkjs/.github/blob/main/code-of-conduct.md

[github-dotfiles-contributing]: https://github.com/remarkjs/.github/blob/main/contributing.md

[github-dotfiles-health]: https://github.com/remarkjs/.github

[github-dotfiles-support]: https://github.com/remarkjs/.github/blob/main/support.md

[github-gist-esm]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c

[github-remark-gfm]: https://github.com/remarkjs/remark-gfm

[github-remark-lint]: https://github.com/remarkjs/remark-lint

[github-unified-transformer]: https://github.com/unifiedjs/unified#transformer

[npm-install]: https://docs.npmjs.com/cli/install

[typescript]: https://www.typescriptlang.org

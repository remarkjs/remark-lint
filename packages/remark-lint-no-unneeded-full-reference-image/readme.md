<!--This file is generated-->

# remark-lint-no-unneeded-full-reference-image

[![Build][badge-build-image]][badge-build-url]
[![Coverage][badge-coverage-image]][badge-coverage-url]
[![Downloads][badge-downloads-image]][badge-downloads-url]
[![Size][badge-size-image]][badge-size-url]
[![Sponsors][badge-funding-sponsors-image]][badge-funding-url]
[![Backers][badge-funding-backers-image]][badge-funding-url]
[![Chat][badge-chat-image]][badge-chat-url]

[`remark-lint`][github-remark-lint] rule to warn when unneeded full reference images are used.

## Contents

* [What is this?](#what-is-this)
* [When should I use this?](#when-should-i-use-this)
* [Presets](#presets)
* [Install](#install)
* [Use](#use)
* [API](#api)
  * [`unified().use(remarkLintNoUnneededFullReferenceImage)`](#unifieduseremarklintnounneededfullreferenceimage)
* [Recommendation](#recommendation)
* [Examples](#examples)
* [Compatibility](#compatibility)
* [Contribute](#contribute)
* [License](#license)

## What is this?

This package checks for unneeded full reference images.

## When should I use this?

You can use this package to check that reference images are consistent.

## Presets

This plugin is not included in presets maintained here.

## Install

This package is [ESM only][github-gist-esm].
In Node.js (version 16+),
install with [npm][npm-install]:

```sh
npm install remark-lint-no-unneeded-full-reference-image
```

In Deno with [`esm.sh`][esm-sh]:

```js
import remarkLintNoUnneededFullReferenceImage from 'https://esm.sh/remark-lint-no-unneeded-full-reference-image@4'
```

In browsers with [`esm.sh`][esm-sh]:

```html
<script type="module">
  import remarkLintNoUnneededFullReferenceImage from 'https://esm.sh/remark-lint-no-unneeded-full-reference-image@4?bundle'
</script>
```

## Use

On the API:

```js
import remarkLint from 'remark-lint'
import remarkLintNoUnneededFullReferenceImage from 'remark-lint-no-unneeded-full-reference-image'
import remarkParse from 'remark-parse'
import remarkStringify from 'remark-stringify'
import {read} from 'to-vfile'
import {unified} from 'unified'
import {reporter} from 'vfile-reporter'

const file = await read('example.md')

await unified()
  .use(remarkParse)
  .use(remarkLint)
  .use(remarkLintNoUnneededFullReferenceImage)
  .use(remarkStringify)
  .process(file)

console.error(reporter(file))
```

On the CLI:

```sh
remark --frail --use remark-lint --use remark-lint-no-unneeded-full-reference-image .
```

On the CLI in a config file (here a `package.json`):

```diff
 …
 "remarkConfig": {
   "plugins": [
     …
     "remark-lint",
+    "remark-lint-no-unneeded-full-reference-image",
     …
   ]
 }
 …
```

## API

This package exports no identifiers.
It exports no additional [TypeScript][typescript] types.
The default export is
[`remarkLintNoUnneededFullReferenceImage`][api-remark-lint-no-unneeded-full-reference-image].

### `unified().use(remarkLintNoUnneededFullReferenceImage)`

Warn when unneeded full reference images are used.

###### Parameters

There are no options.

###### Returns

Transform ([`Transformer` from `unified`][github-unified-transformer]).

## Recommendation

Full reference syntax (`![Alt][alt]`) is quite verbose compared to
the concise collapsed reference syntax (`![Alt][]`).

## Examples

##### `ok.md`

###### In

```markdown
![Mercury][] and ![Venus][venus-image].

[mercury]: /mercury.png
[venus-image]: /venus.png
```

###### Out

No messages.

##### `not-ok.md`

###### In

```markdown
![Mercury][mercury].

[mercury]: /mercury.png
```

###### Out

```text
1:1-1:20: Unexpected full reference image (`![text][label]`) where the identifier can be inferred from the text, expected collapsed reference (`![text][]`)
```

##### `escape.md`

###### In

> 👉 **Note**: this example uses
> GFM ([`remark-gfm`][github-remark-gfm]).

```markdown
Matrix:

| Kind                      | Text normal | Text escape  | Text character reference |
| ------------------------- | ----------- | ------------ | ------------------------ |
| Label normal              | ![&][&]     | ![\&][&]     | ![&amp;][&]              |
| Label escape              | ![&][\&]    | ![\&][\&]    | ![&amp;][\&]             |
| Label character reference | ![&][&amp;] | ![\&][&amp;] | ![&amp;][&amp;]          |

When using the above matrix, the first row will go to `/a.png`, the second
to `b`, third to `c`.
Removing all labels, you’d instead get it per column: `/a.png`, `b`, `c`.
That shows the label is not needed when it matches the text, and is otherwise.

[&]: /a.png
[\&]: /b.png
[&amp;]: /c.png
```

###### Out

```text
5:31-5:38: Unexpected full reference image (`![text][label]`) where the identifier can be inferred from the text, expected collapsed reference (`![text][]`)
6:45-6:54: Unexpected full reference image (`![text][label]`) where the identifier can be inferred from the text, expected collapsed reference (`![text][]`)
7:60-7:75: Unexpected full reference image (`![text][label]`) where the identifier can be inferred from the text, expected collapsed reference (`![text][]`)
```

## Compatibility

Projects maintained by the unified collective are compatible with maintained
versions of Node.js.

When we cut a new major release, we drop support for unmaintained versions of
Node.
This means we try to keep the current release line,
`remark-lint-no-unneeded-full-reference-image@4`,
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

[api-remark-lint-no-unneeded-full-reference-image]: #unifieduseremarklintnounneededfullreferenceimage

[author]: https://wooorm.com

[badge-build-image]: https://github.com/remarkjs/remark-lint/workflows/main/badge.svg

[badge-build-url]: https://github.com/remarkjs/remark-lint/actions

[badge-chat-image]: https://img.shields.io/badge/chat-discussions-success.svg

[badge-chat-url]: https://github.com/remarkjs/remark/discussions

[badge-coverage-image]: https://img.shields.io/codecov/c/github/remarkjs/remark-lint.svg

[badge-coverage-url]: https://codecov.io/github/remarkjs/remark-lint

[badge-downloads-image]: https://img.shields.io/npm/dm/remark-lint-no-unneeded-full-reference-image.svg

[badge-downloads-url]: https://www.npmjs.com/package/remark-lint-no-unneeded-full-reference-image

[badge-funding-backers-image]: https://opencollective.com/unified/backers/badge.svg

[badge-funding-sponsors-image]: https://opencollective.com/unified/sponsors/badge.svg

[badge-funding-url]: https://opencollective.com/unified

[badge-size-image]: https://img.shields.io/bundlejs/size/remark-lint-no-unneeded-full-reference-image

[badge-size-url]: https://bundlejs.com/?q=remark-lint-no-unneeded-full-reference-image

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

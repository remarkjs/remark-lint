<!--This file is generated-->

# remark-lint-strikethrough-marker

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

Warn for violating strikethrough markers.

Options: `'consistent'`, `'~'`, or `'~~'`, default: `'consistent'`.

`'consistent'` detects the first used strikethrough style and warns when
subsequent strikethrough use different styles.

## Fix

See [Using remark to fix your Markdown](https://github.com/remarkjs/remark-lint#using-remark-to-fix-your-markdown)
on how to automatically fix warnings for this rule.

## Presets

This rule is not included in any default preset

## Example

##### `ok.md`

When configured with `'~'`.

###### In

Note: this example uses [GFM][].

```markdown
~foo~
```

###### Out

No messages.

##### `not-ok.md`

When configured with `'~'`.

###### In

Note: this example uses [GFM][].

```markdown
~~foo~~
```

###### Out

```text
1:1-1:8: Strikethrough should use `~` as a marker
```

##### `ok.md`

When configured with `'~~'`.

###### In

Note: this example uses [GFM][].

```markdown
~~foo~~
```

###### Out

No messages.

##### `not-ok.md`

When configured with `'~~'`.

###### In

Note: this example uses [GFM][].

```markdown
~foo~
```

###### Out

```text
1:1-1:6: Strikethrough should use `~~` as a marker
```

##### `not-ok.md`

###### In

Note: this example uses [GFM][].

```markdown
~~foo~~
~bar~
```

###### Out

```text
2:1-2:6: Strikethrough should use `~~` as a marker
```

##### `not-ok.md`

When configured with `'💩'`.

###### Out

```text
1:1: Incorrect strikethrough marker `💩`: use either `'consistent'`, `'~'`, or `'~~'`
```

## Install

[npm][]:

```sh
npm install remark-lint-strikethrough-marker
```

## Use

You probably want to use it on the CLI through a config file:

```diff
 …
 "remarkConfig": {
   "plugins": [
     …
     "lint",
+    "lint-strikethrough-marker",
     …
   ]
 }
 …
```

Or use it on the CLI directly

```sh
remark -u lint -u lint-strikethrough-marker readme.md
```

Or use this on the API:

```diff
 import {remark} from 'remark'
 import {reporter} from 'vfile-reporter'
 import remarkLint from 'remark-lint'
 import remarkLintStrikethroughMarker from 'remark-lint-strikethrough-marker'

 remark()
   .use(remarkLint)
+  .use(remarkLintStrikethroughMarker)
   .process('_Emphasis_ and **importance**')
   .then((file) => {
     console.error(reporter(file))
   })
```

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

[downloads-badge]: https://img.shields.io/npm/dm/remark-lint-strikethrough-marker.svg

[downloads]: https://www.npmjs.com/package/remark-lint-strikethrough-marker

[size-badge]: https://img.shields.io/bundlephobia/minzip/remark-lint-strikethrough-marker.svg

[size]: https://bundlephobia.com/result?p=remark-lint-strikethrough-marker

[sponsors-badge]: https://opencollective.com/unified/sponsors/badge.svg

[backers-badge]: https://opencollective.com/unified/backers/badge.svg

[collective]: https://opencollective.com/unified

[chat-badge]: https://img.shields.io/badge/chat-discussions-success.svg

[chat]: https://github.com/remarkjs/remark/discussions

[npm]: https://docs.npmjs.com/cli/install

[health]: https://github.com/remarkjs/.github

[contributing]: https://github.com/remarkjs/.github/blob/HEAD/contributing.md

[support]: https://github.com/remarkjs/.github/blob/HEAD/support.md

[coc]: https://github.com/remarkjs/.github/blob/HEAD/code-of-conduct.md

[license]: https://github.com/remarkjs/remark-lint/blob/main/license

[author]: https://wooorm.com

[gfm]: https://github.com/remarkjs/remark-gfm

<!--This file is generated-->

# remark-lint-no-undefined-references

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

Warn when references to undefined definitions are found.

Options: `Object`, optional.

The object can have an `allow` field, set to an array of strings that may
appear between `[` and `]`, but that should not be treated as link
identifiers.

## Presets

This rule is included in the following presets:

| Preset | Setting |
| - | - |
| [`remark-preset-lint-recommended`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-preset-lint-recommended) | |

## Example

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

## Install

[npm][]:

```sh
npm install remark-lint-no-undefined-references
```

## Use

You probably want to use it on the CLI through a config file:

```diff
 …
 "remarkConfig": {
   "plugins": [
     …
     "lint",
+    "lint-no-undefined-references",
     …
   ]
 }
 …
```

Or use it on the CLI directly

```sh
remark -u lint -u lint-no-undefined-references readme.md
```

Or use this on the API:

```diff
 var remark = require('remark')
 var report = require('vfile-reporter')

 remark()
   .use(require('remark-lint'))
+  .use(require('remark-lint-no-undefined-references'))
   .process('_Emphasis_ and **importance**', function (err, file) {
     console.error(report(err || file))
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

[build-badge]: https://img.shields.io/travis/remarkjs/remark-lint/main.svg

[build]: https://travis-ci.org/remarkjs/remark-lint

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

[npm]: https://docs.npmjs.com/cli/install

[health]: https://github.com/remarkjs/.github

[contributing]: https://github.com/remarkjs/.github/blob/HEAD/contributing.md

[support]: https://github.com/remarkjs/.github/blob/HEAD/support.md

[coc]: https://github.com/remarkjs/.github/blob/HEAD/code-of-conduct.md

[license]: https://github.com/remarkjs/remark-lint/blob/main/license

[author]: https://wooorm.com

<!--This file is generated-->

# remark-lint-list-item-spacing

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

Warn when list looseness is incorrect, such as being tight when it should
be loose, and vice versa.

According to the [`markdown-style-guide`](http://www.cirosantilli.com/markdown-style-guide/),
if one or more list items in a list spans more than one line, the list is
required to have blank lines between each item.
And otherwise, there should not be blank lines between items.

By default, all items must be spread out (a blank line must be between
them) if one or more items are multiline (span more than one line).
Otherwise, the list must be tight (no blank line must be between items).

If you pass `{checkBlanks: true}`, all items must be spread out if one or
more items contain blank lines.
Otherwise, the list must be tight.

## Presets

This rule is included in the following presets:

| Preset | Setting |
| - | - |
| [`remark-preset-lint-markdown-style-guide`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-preset-lint-markdown-style-guide) | |

## Example

##### `ok.md`

###### In

```markdown
A tight list:

-   item 1
-   item 2
-   item 3

A loose list:

-   Wrapped
    item

-   item 2

-   item 3
```

###### Out

No messages.

##### `not-ok.md`

###### In

```markdown
A tight list:

-   Wrapped
    item
-   item 2
-   item 3

A loose list:

-   item 1

-   item 2

-   item 3
```

###### Out

```text
4:9-5:1: Missing new line after list item
5:11-6:1: Missing new line after list item
10:11-12:1: Extraneous new line after list item
12:11-14:1: Extraneous new line after list item
```

##### `ok.md`

When configured with `{ checkBlanks: true }`.

###### In

```markdown
A tight list:

-   item 1
    - item 1.A
-   item 2
    > Block quote

A loose list:

-   item 1

    - item 1.A

-   item 2

    > Block quote
```

###### Out

No messages.

##### `not-ok.md`

When configured with `{ checkBlanks: true }`.

###### In

```markdown
A tight list:

-   item 1

    - item 1.A
-   item 2

    > Block quote
-   item 3

A loose list:

-   item 1
    - item 1.A

-   item 2
    > Block quote
```

###### Out

```text
5:15-6:1: Missing new line after list item
8:18-9:1: Missing new line after list item
14:15-16:1: Extraneous new line after list item
```

## Install

[npm][]:

```sh
npm install remark-lint-list-item-spacing
```

## Use

You probably want to use it on the CLI through a config file:

```diff
 …
 "remarkConfig": {
   "plugins": [
     …
     "lint",
+    "lint-list-item-spacing",
     …
   ]
 }
 …
```

Or use it on the CLI directly

```sh
remark -u lint -u lint-list-item-spacing readme.md
```

Or use this on the API:

```diff
 var remark = require('remark')
 var report = require('vfile-reporter')

 remark()
   .use(require('remark-lint'))
+  .use(require('remark-lint-list-item-spacing'))
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

[downloads-badge]: https://img.shields.io/npm/dm/remark-lint-list-item-spacing.svg

[downloads]: https://www.npmjs.com/package/remark-lint-list-item-spacing

[size-badge]: https://img.shields.io/bundlephobia/minzip/remark-lint-list-item-spacing.svg

[size]: https://bundlephobia.com/result?p=remark-lint-list-item-spacing

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

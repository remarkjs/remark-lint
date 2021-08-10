# ![remark-lint][logo]

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Chat][chat-badge]][chat]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]

[**remark**][remark] plugins to lint Markdown.

Ensuring the Markdown you (and contributors) write is of great quality will
provide better rendering in all the different markdown parsers, and makes sure
less refactoring is needed afterwards.

What is quality?
That’s up to you, but there are sensible [presets][].

`remark-lint` is built on [**remark**][remark], a powerful Markdown processor
powered by [plugins][remark-plugins] (such as these).

## Contents

*   [Install](#install)
*   [CLI](#cli)
*   [API](#api)
*   [Configuring `remark-lint`](#configuring-remark-lint)
*   [Using remark to fix your Markdown](#using-remark-to-fix-your-markdown)
*   [Integrations](#integrations)
*   [Rules](#rules)
*   [List of presets](#list-of-presets)
*   [List of external rules](#list-of-external-rules)
*   [Create a custom rule](#create-a-custom-rule)
*   [Security](#security)
*   [Related](#related)
*   [Contribute](#contribute)
*   [License](#license)

## Install

This package is [ESM only](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c):
Node 12+ is needed to use it and it must be `import`ed instead of `require`d.

[npm][]:

```sh
npm install remark-lint
```

## CLI

![][screenshot]

Use `remark-lint` with [`remark-cli`][cli] through a
[preset][preset-recommended].

```sh
npm install --save-dev remark-cli remark-preset-lint-recommended
```

Then, configure **remark** in your `package.json`:

```js
  // …
  "scripts": {
    "lint-md": "remark ."
  },
  // …
  "remarkConfig": {
    "plugins": ["remark-preset-lint-recommended"]
  }
  // …
```

Let’s say there’s an `example.md` that looks as follows:

```markdown
* Hello

[World][]
```

Now, running our `lint-md` script with `npm run lint-md` yields:

```txt
example.md
       1:3  warning  Incorrect list-item indent: add 2 spaces  list-item-indent
  3:1-3:10  warning  Found reference to undefined definition   no-undefined-references
⚠ 2 warnings
```

See [`doc/rules.md`][rules] for what those warnings are (and how to turn them
off).

## API

Use `remark-lint` together with [`remark`][api]:

```sh
npm install remark remark-preset-lint-markdown-style-guide
```

Let’s say `example.js` looks as follows:

```js
import {remark} from 'remark'
import {reporter} from 'vfile-reporter'
import remarkPresetLintMarkdownStyleGuide from 'remark-preset-lint-markdown-style-guide'

const file = remark()
  .use(remarkPresetLintMarkdownStyleGuide)
  .processSync('_Hello world_')

console.log(reporter(file))
```

Now, running `node example.js` yields:

```txt
  1:1-1:14  warning  Emphasis should use `*` as a marker  emphasis-marker  remark-lint

⚠ 1 warning
```

## Configuring `remark-lint`

`remark-lint` is a **remark** plugin and when used on the CLI supports
configuration through its [configuration files][cli].

An example `.remarkrc` file could look as follows:

```json
{
  "plugins": [
    "remark-preset-lint-recommended",
    ["remark-lint-list-item-indent", false]
  ]
}
```

The preset turns on `remark-lint-list-item-indent`, but setting a plugin to
`false` later turns it off again.

Using our `example.md` from before:

```markdown
* Hello

[World][]
```

Now, running `npm run lint-md` yields:

```bash
example.md
   3:1-3:10  warning  Found reference to undefined definition   no-undefined-references  remark-lint

⚠ 2 warnings
```

You can also provide configuration comments to turn a rule on or off inside a
file.
Note that you cannot change a setting, such as `maximum-line-length`, just
whether messages are shown or not.
Read more about configuration comments in
[`remark-message-control`][message-control]s documentation.

The following file will warn twice for the duplicate headings:

```markdown
# Hello

## Hello

### Hello
```

The following file will warn once (the second heading is ignored, but the third
is enabled again):

```markdown
# Hello

<!--lint disable no-duplicate-headings-->

## Hello

<!--lint enable no-duplicate-headings-->

### Hello
```

> **Note**: You’ll need the blank lines between comments and other nodes!

## Using remark to fix your Markdown

[`remark-stringify`][remark-stringify] can format markdown syntax.
It ensures a single style is used: list items use one type of bullet (`*`, `-`,
`+`), emphasis (`*` or `_`) and importance (`__` or `**`) use a standard marker,
[and more][remark-stringify-options].

###### Example

If you `import('remark')`, [`remark-stringify`][remark-stringify] is included
unless an output format other than markdown (such as HTML) is defined.

Say we have the following file, `example.js`, showing how formatting rules can
be used:

```js
import {reporter} from 'vfile-reporter'
import {remark} from 'remark'
import remarkLintEmphasisMarker from 'remark-lint-emphasis-marker'
import remarkLintStrongMarker from 'remark-lint-strong-marker'

remark()
  .use(remarkLintEmphasisMarker, '*')
  .use(remarkLintStrongMarker, '*')
  // ^ two `remark-lint` rules.
  .use({
    settings: {emphasis: '*', strong: '*'}
    // ^ `remark-stringify` settings.
  })
  .process('_Hello_, __world__!')
  .then((file) => {
    console.error(reporter(file))
    console.log(String(file))
  })
```

Now, running `node example` yields warnings and a formatted file:

```txt
    1:1-1:8  warning  Emphasis should use `*` as a marker  emphasis-marker  remark-lint
  1:10-1:19  warning  Strong should use `*` as a marker    strong-marker    remark-lint

⚠ 2 warnings
*Hello*, **world**!
```

###### Example

If you’re using [`remark-stringify`][remark-stringify] explicitly, you can pass
options like any other plugin, like so:

```js
import {reporter} from 'vfile-reporter'
import {unified} from 'unified'
import remarkParse from 'remark-parse'
import remarkStringify from 'remark-stringify'
import remarkLintEmphasisMarker from 'remark-lint-emphasis-marker'
import remarkLintStrongMarker from 'remark-lint-strong-marker'

unified()
  .use(remarkParse)
  .use(remarkLintEmphasisMarker, '*')
  .use(remarkLintStrongMarker, '*')
  // ^ two `remark-lint` rules.
  .use(remarkStringify, {emphasis: '*', strong: '*'})
  // ^ `remark-stringify` with settings.
  .process('_Hello_, __world__!')
  .then((file) => {
    console.error(reporter(file))
    console.log(String(file))
  })
```

Now, when running `node example`, this results in the same output as the
previous example.

###### Example

If you’re using [`remark-cli`][cli], [`remark-stringify`][remark-stringify] is
included unless an output format other than markdown (such as HTML) is defined.
In this case you can configure `remark-stringify` settings using the
[`-s, --settings`][cli-settings] flag or a `"settings"` field in [remark
configuration files][cli-config].

Say we have the following file, `example.md`:

```markdown
_Hello_, __world__!
```

And our `package.json` looks as follows:

```js
  // …
  "remarkConfig": {
    "settings": {
      "emphasis": "*",
      "strong": "*"
    },
    "plugins": [
      "remark-lint-emphasis-marker",
      "remark-lint-strong-marker"
    ]
  }
  // …
```

Now, running `remark example.md` yields warnings and a formatted file:

```txt
*Hello*, **world**!
example.md
    1:1-1:8  warning  Emphasis should use `*` as a marker  emphasis-marker  remark-lint
  1:10-1:19  warning  Strong should use `*` as a marker    strong-marker    remark-lint

⚠ 2 warnings
```

> Note: running `remark example.md -o` or `remark example.md --output`
> overwrites `example.md` and formats it.
> So, if you’d run that twice (the first pass lints and fixes the Markdown, the
> second pass checks it again), you’d see the output `example.md: written` as
> all warnings are now fixed.

## Integrations

*   [`linter-remark`](https://github.com/wooorm/linter-remark)
    ([Atom](https://atom.io))
    — use all of remark from Atom
*   [`vscode-remark-lint`](https://github.com/drewbourne/vscode-remark-lint)
    ([VS Code](https://code.visualstudio.com))
    — use `remark-lint` from Visual Studio Code
*   [`SublimeLinter-contrib-remark-lint`](https://packagecontrol.io/packages/SublimeLinter-contrib-remark-lint)
    ([Sublime](https://www.sublimetext.com))
    — use `remark-lint` from Sublime Text
*   [`ale`](https://github.com/w0rp/ale)
    ([Vim](https://www.vim.org))
    — use `remark-lint` from Vim
*   [`gulp-remark`](https://github.com/remarkjs/gulp-remark)
    ([Gulp](https://gulpjs.com))
    — use all of remark with Gulp
*   [`grunt-remark`](https://github.com/remarkjs/grunt-remark)
    ([Grunt](https://gruntjs.com/))
    — use all of remark with Grunt
*   [`jest-runner-remark`](https://github.com/keplersj/jest-runner-remark)
    ([Jest](https://jestjs.io))
    — use all of remark with Jest

We’re interested in more integrations.
Let us know if we can help.

## Rules

[`doc/rules.md`][rules] lists all available official rules.

## List of presets

Presets can be loaded just like other plugins.

<!--presets start-->

*   [`remark-preset-lint-consistent`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-preset-lint-consistent) — rules that enforce consistency
*   [`remark-preset-lint-markdown-style-guide`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-preset-lint-markdown-style-guide) — rules that enforce the markdown style guide
*   [`remark-preset-lint-recommended`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-preset-lint-recommended) — rules that prevent mistakes or stuff that fails across vendors.

<!--presets end-->

## List of external rules

External rules can be loaded just like normal rules.

<!--
This list is ordered based on the name without prefix, so excluding
`remark-lint-no-` or `remark-lint-`
-->

*   [`remark-lint-alphabetize-lists`](https://github.com/vhf/remark-lint-alphabetize-lists)
    — Ensure list items are in alphabetical order
*   [`remark-lint-appropriate-heading`](https://github.com/RichardLitt/remark-lint-appropriate-heading)
    — Check that the top level heading matches the directory name
*   [`remark-lint-blank-lines-1-0-2`](https://github.com/vhf/remark-lint-blank-lines-1-0-2)
    — Ensure a specific number of lines between blocks
*   [`remark-lint-books-links`](https://github.com/vhf/remark-lint-books-links)
    — Ensure links in lists of books follow a standard format
*   [`remark-lint-code`](https://github.com/Qard/remark-lint-code)
    — Lint fenced code blocks by corresponding language tags,
    currently supporting [ESLint](https://github.com/Qard/remark-lint-code-eslint)
*   [`remark-lint-match-punctuation`](https://github.com/laysent/remark-lint-plugins/tree/HEAD/packages/remark-lint-match-punctuation)
    — Ensures punctuations are used in pairs if necessary.
*   [`remark-lint-mdash-style`](https://github.com/alexandrtovmach/remark-lint-mdash-style)
    — Ensure em-dash (`—`) style follows a standard format
*   [`remark-lint-no-chinese-punctuation-in-number`](https://github.com/laysent/remark-lint-plugins/tree/HEAD/packages/remark-lint-no-chinese-punctuation-in-number)
    — Ensures that Chinese punctuation’s not used in numbers
*   [`remark-lint-no-dead-urls`](https://github.com/davidtheclark/remark-lint-no-dead-urls)
    — Check that external links are alive
*   [`remark-lint-no-long-code`](https://github.com/laysent/remark-lint-plugins/tree/HEAD/packages/remark-lint-no-long-code)
    — Ensures that each line in code block won't be too long.
*   [`remark-lint-no-repeat-punctuation`](https://github.com/laysent/remark-lint-plugins/tree/HEAD/packages/remark-lint-no-repeat-punctuation)
    — Ensures punctuation is not repeated
*   [`remark-lint-emoji-limit`](https://github.com/zerok/remark-lint-emoji-limit)
    — Enforce a limit of emoji per paragraph
*   [`remark-lint-no-empty-sections`](https://github.com/vhf/remark-lint-no-empty-sections)
    — Ensure every heading is followed by content (forming a section)
*   [`remark-lint-heading-length`](https://github.com/zerok/remark-lint-heading-length)
    — Ensure headings have the appropriate length
*   [`remark-lint-heading-whitespace`](https://github.com/vhf/remark-lint-heading-whitespace)
    — Ensure heading parsing is not broken by weird whitespace
*   [`remark-lint-are-links-valid`](https://github.com/wemake-services/remark-lint-are-links-valid)
    — Check if your links are reachable and/or unique
*   [`remark-lint-spaces-around-number`](https://github.com/laysent/remark-lint-plugins/tree/HEAD/packages/remark-lint-spaces-around-number)
    — Ensures there are spaces around number and Chinese.
*   [`remark-lint-spaces-around-word`](https://github.com/laysent/remark-lint-plugins/tree/HEAD/packages/remark-lint-spaces-around-word)
    — Ensures there are spaces around English word and Chinese.
*   [`remark-lint-no-url-trailing-slash`](https://github.com/vhf/remark-lint-no-url-trailing-slash)
    — Ensure that the `href` of links has no trailing slash
*   [`remark-lint-write-good`](https://github.com/zerok/remark-lint-write-good)
    — Wrapper for `write-good`
*   [`remark-lint-double-link`](https://github.com/Scrum/remark-lint-double-link)
    — Ensure the same URL is not linked multiple times.

## Create a custom rule

Follow this comprehensive [tutorial](https://github.com/remarkjs/remark-lint/blob/main/doc/create-a-custom-rule.md) on how to create your own custom rule for `remark`.

## Security

Use of `remark-lint` does not mutate the tree so there are no openings for
[cross-site scripting (XSS)][xss] attacks.
Messages from linting rules may be hidden from user content though, causing
builds to fail or pass, or changing a report.

## Related

*   [`remark-validate-links`](https://github.com/remarkjs/remark-validate-links)
    — Validate if links point to existing headings and files in markdown

## Contribute

See [`contributing.md`][contributing] in [`remarkjs/.github`][health] for ways
to get started.
See [`support.md`][support] for ways to get help.

This project has a [code of conduct][coc].
By interacting with this repository, organization, or community you agree to
abide by its terms.

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[build-badge]: https://github.com/remarkjs/remark-lint/workflows/main/badge.svg

[build]: https://github.com/remarkjs/remark-lint/actions

[coverage-badge]: https://img.shields.io/codecov/c/github/remarkjs/remark-lint.svg

[coverage]: https://codecov.io/github/remarkjs/remark-lint

[downloads-badge]: https://img.shields.io/npm/dm/remark-lint.svg

[downloads]: https://www.npmjs.com/package/remark-lint

[chat-badge]: https://img.shields.io/badge/chat-discussions-success.svg

[chat]: https://github.com/remarkjs/remark/discussions

[sponsors-badge]: https://opencollective.com/unified/sponsors/badge.svg

[backers-badge]: https://opencollective.com/unified/backers/badge.svg

[collective]: https://opencollective.com/unified

[npm]: https://docs.npmjs.com/cli/install

[health]: https://github.com/remarkjs/.github

[contributing]: https://github.com/remarkjs/.github/blob/HEAD/contributing.md

[support]: https://github.com/remarkjs/.github/blob/HEAD/support.md

[coc]: https://github.com/remarkjs/.github/blob/HEAD/code-of-conduct.md

[license]: license

[author]: https://wooorm.com

[cli-settings]: https://github.com/unifiedjs/unified-args#--setting-settings

[cli-config]: https://github.com/unifiedjs/unified-engine/blob/HEAD/doc/configure.md

[remark]: https://github.com/remarkjs/remark

[remark-plugins]: https://github.com/remarkjs/remark/blob/HEAD/doc/plugins.md

[remark-stringify]: https://github.com/remarkjs/remark/tree/HEAD/packages/remark-stringify

[remark-stringify-options]: https://github.com/remarkjs/remark/tree/HEAD/packages/remark-stringify#options

[api]: https://github.com/remarkjs/remark/tree/HEAD/packages/remark

[cli]: https://github.com/remarkjs/remark/tree/HEAD/packages/remark-cli

[message-control]: https://github.com/remarkjs/remark-message-control#markers

[preset-recommended]: https://github.com/remarkjs/remark-lint/blob/main/packages/remark-preset-lint-recommended

[logo]: https://raw.githubusercontent.com/remarkjs/remark-lint/02295bc/logo.svg?sanitize=true

[screenshot]: https://raw.githubusercontent.com/remarkjs/remark-lint/02295bc/screenshot.png

[rules]: doc/rules.md

[presets]: #list-of-presets

[xss]: https://en.wikipedia.org/wiki/Cross-site_scripting

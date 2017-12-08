# ![remark-lint][logo]

[![Build Status][build-badge]][build-status]
[![Coverage Status][coverage-badge]][coverage-status]
[![Chat][chat-badge]][chat]

**remark-lint** is a markdown code style linter.  Another linter?  Yes.
Ensuring the markdown you (and contributors) write is of great quality will
provide better rendering in all the different markdown parsers, and makes
sure less refactoring is needed afterwards.

What is quality? That’s up to you, but there are sensible [presets][].

**remark-lint** is built on [**remark**][remark], a powerful markdown
processor powered by [plugins][remark-plugins] (such as this one).

## Table of Contents

*   [Installation](#installation)
*   [Command line](#command-line)
*   [Programmatic](#programmatic)
*   [Rules](#rules)
*   [Configuring remark-lint](#configuring-remark-lint)
*   [Using remark to fix your markdown](#using-remark-to-fix-your-markdown)
*   [Editor Integrations](#editor-integrations)
*   [List of Presets](#list-of-presets)
*   [List of External Rules](#list-of-external-rules)
*   [Related](#related)
*   [Contribute](#contribute)
*   [License](#license)

## Installation

[npm][]:

```bash
npm install remark-lint
```

## Command line

![Example of how remark-lint looks on screen][screenshot]

Use `remark-lint` with [`remark-cli`][cli], and a [preset][preset-recommended].

```bash
npm install --save remark-cli remark-preset-lint-recommended
```

Then, configure **remark** in your `package.json`:

```js
  // ...
  "scripts": {
    "lint-md": "remark ."
  },
  // ...
  "remarkConfig": {
    "plugins": ["remark-preset-lint-recommended"]
  }
  // ...
```

Let’s say there’s an `example.md`, which looks as follows:

```md
* Hello

[World][]
```

Now, running our `lint-md` script with npm, `npm run lint-md`, yields:

```txt
example.md
       1:3  warning  Incorrect list-item indent: add 2 spaces  list-item-indent
  3:1-3:10  warning  Found reference to undefined definition   no-undefined-references
⚠ 2 warnings
```

See [`doc/rules.md`][rules] for what those warnings are (and how to
turn them off).

## Programmatic

Use `remark-lint` together with [`remark`][api]:

```bash
npm install remark remark-lint remark-lint-first-heading-level
```

Let’s say `example.js` looks as follows:

```js
var report = require('vfile-reporter');
var remark = require('remark');
var styleGuide = require('remark-preset-lint-markdown-style-guide');

var file = remark().use(styleGuide).processSync('_Hello world_');

console.log(report(file));
```

Now, running `node example.js` yields:

```txt
  1:1-1:14  warning  Emphasis should use `*` as a marker  emphasis-marker  remark-lint

⚠ 1 warning
```

## Rules

[`doc/rules.md`][rules] lists all available official rules.

## Configuring remark-lint

**remark-lint** is a **remark** plug-in and supports configuration
through its [configuration files][cli].

An example `.remarkrc` file could look as follows:

```json
{
  "plugins": [
    "remark-preset-lint-recommended",
    ["remark-lint-list-item-indent", false]
  ]
}
```

Where the object at `plugins.lint` is a map of `ruleId`s and
their values, which precede over presets.

Using our `example.md` from before:

```md
* Hello

[World][]
```

Now, running `npm run lint-md` yields:

```bash
example.md
   3:1-3:10  warning  Found reference to undefined definition   no-undefined-references

⚠ 2 warnings
```

In addition, you can also provide configuration comments to turn a rule
on or off inside a file.  Note that you cannot change what a setting,
such as `maximum-line-length`, just whether they are shown or not.
Read more about configuration comments in
[**remark-message-control**][message-control]s documentation.

The following file will warn twice for the duplicate headings:

```markdown
# Hello

## Hello

### Hello
```

The following file will warn once (the second heading is ignored,
but the third is re-enabled):

```markdown
# Hello

<!--lint disable no-duplicate-headings-->

## Hello

<!--lint enable no-duplicate-headings-->

### Hello
```

> **Note**: You’ll need the blank lines between comments and other nodes!

## Using remark to fix your markdown

[`remark-stringify`][remark-stringify] can format markdown syntax. It ensures a
single style is used: list items use one type of bullet (`*`, `-`, `+`),
emphasis (`*` or `_`) and importance (`__` or `**`) use a standard marker, table
fences are aligned, [and more][remark-stringify-options].

###### Example

If you `require('remark')`, [`remark-stringify`][remark-stringify] is included
unless an output format other than markdown (such as HTML) is defined.

Say we have the following file, `example.js`, showing how formatting rules can
be used:

```js
var report = require('vfile-reporter');
var remark = require('remark');
var emphasisMarker = require('remark-lint-emphasis-marker');
var strongMarker = require('remark-lint-strong-marker');

remark()
  .use(emphasisMarker, '*')
  .use(strongMarker, '*')
  // ^ two `remark-lint` rules.
  .use({
    settings: {emphasis: '*', strong: '*'}
    // ^ `remark-stringify` settings.
  })
  .process('_Hello_, __world__!', function (err, file) {
    console.error(report(err || file));
    console.log(String(file));
  });
```

Now, running `node example` yields warnings and a formatted file:

```txt
    1:1-1:8  warning  Emphasis should use `*` as a marker  emphasis-marker  remark-lint
  1:10-1:19  warning  Strong should use `*` as a marker    strong-marker    remark-lint

⚠ 2 warnings
*Hello*, **world**!
```

###### Example

If you’re using [`remark-stringify`][remark-stringify] yourself, you can pass
options like any other plugin, like so:

```js
var report = require('vfile-reporter');
var unified = require('unified');
var parse = require('remark-parse');
var stringify = require('remark-stringify');
var emphasisMarker = require('remark-lint-emphasis-marker');
var strongMarker = require('remark-lint-strong-marker');

unified()
  .use(parse)
  .use(emphasisMarker, '*')
  .use(strongMarker, '*')
  // ^ two `remark-lint` rules.
  .use(stringify, {emphasis: '*', strong: '*'})
  // ^ `remark-stringify` with settings.
  .process('_Hello_, __world__!', function (err, file) {
    console.error(report(err || file));
    console.log(String(file));
  });
```

Now, when running `node example`, this results in the same output as the
previous example.

###### Example

If you’re using [`remark-cli`][cli], [`remark-stringify`][remark-stringify] is
included unless an output format other than markdown (such as HTML) is defined.
In this case you can configure `remark-stringify` settings using the [`-s,
--settings`][cli-settings] flag or a `"settings"` property in [remark
configuration files][cli-config].

Say we have the following file, `example.md`:

```markdown
_Hello_, __world__!
```

And our `package.json` looks as follows:

```js
  // ...
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
  // ...
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
> overwrites `example.md` and formats it. So, if you’d run that twice (the first
> pass lints and fixes the markdown, the second pass checks it again), you’d see
> the output `example.md: written` as all warnings are now fixed.

## Editor Integrations

Currently, **remark-lint** is integrated with Atom through
[**linter-markdown**][linter-markdown].

If you want to run all of **remark** from **Atom**, use
[**linter-remark**][linter-remark].

To run **remark**, optionally with **remark-lint** from **Gulp**, use
[**gulp-remark**][gulp-remark].

To check markdown documents editing with Vim, use
[**ale**][ale].

I’m very interested in more integrations.  Let me know if I can help.

## List of Presets

Presets can be loaded through the [`preset` setting][config-preset].

<!--presets start-->

*   [`remark-preset-lint-consistent`](https://github.com/remarkjs/remark-lint/tree/master/packages/remark-preset-lint-consistent) — rules that enforce consistency
*   [`remark-preset-lint-markdown-style-guide`](https://github.com/remarkjs/remark-lint/tree/master/packages/remark-preset-lint-markdown-style-guide) — rules that enforce the markdown style guide
*   [`remark-preset-lint-recommended`](https://github.com/remarkjs/remark-lint/tree/master/packages/remark-preset-lint-recommended) — rules that prevent mistakes or syntaxes that do not work correctly across vendors

<!--presets end-->

## List of External Rules

External rules can be loaded just like normal rules.

⚠️ means the rule has not been updated for remark-lint 6.0.0.

<!--
This list is ordered based on the name without prefix, so
excluding `remark-lint-no-` or `remark-lint-`
-->

*   [`remark-lint-alphabetize-lists`](https://github.com/vhf/remark-lint-alphabetize-lists)
    — Ensure list items are in alphabetical order
*   [`remark-lint-appropriate-heading`](https://github.com/RichardLitt/remark-lint-appropriate-heading)
    — Check that the top-level heading matches the directory name
*   [`remark-lint-blank-lines-1-0-2`](https://github.com/vhf/remark-lint-blank-lines-1-0-2)
    — Ensure a specific number of lines between blocks
*   [`remark-lint-books-links`](https://github.com/vhf/remark-lint-books-links)
    — Ensure links in lists of books follow a standard format
*   [`remark-lint-code`](https://github.com/Qard/remark-lint-code)
    — Lint fenced code blocks by corresponding language tags,
    currently supporting [ESLint](https://github.com/Qard/remark-lint-code-eslint)
*   [`remark-lint-no-dead-urls`](https://github.com/davidtheclark/remark-lint-no-dead-urls)
    — Check that external links are alive
*   [`remark-lint-emoji-limit`](https://github.com/zerok/remark-lint-emoji-limit)
    — Enforce a limit of emoji per paragraph
*   [`remark-lint-no-empty-sections`](https://github.com/vhf/remark-lint-no-empty-sections)
    — Ensure every heading is followed by content (forming a section)
*   [`remark-lint-heading-length`](https://github.com/zerok/remark-lint-heading-length)
    — Ensure headings have the appropriate length
*   [`remark-lint-no-leading-spaces`](https://github.com/verekia/remark-lint-no-leading-spaces)
    — ⚠️ Warn about leading white-space
*   [`remark-lint-list-item-punctuation`](https://github.com/wemake-services/remark-lint-list-item-punctuation)
    — ⚠️ check if list items end in periods
*   [`remark-lint-are-links-valid`](https://github.com/wemake-services/remark-lint-are-links-valid)
    — Check if your links are reachable and/or unique
*   [`remark-lint-sentence-newline`](https://github.com/chcokr/remark-lint-sentence-newline)
    — ⚠️ Ensure sentences are followed by a newline
*   [`remark-lint-no-trailing-spaces`](https://github.com/verekia/remark-lint-no-trailing-spaces)
    — ⚠️ Warn about trailing white-space
*   [`remark-lint-no-url-trailing-slash`](https://github.com/vhf/remark-lint-no-url-trailing-slash)
    — Ensure that the `href` of links has no trailing slash
*   [`remark-lint-write-good`](https://github.com/zerok/remark-lint-write-good)
    — Wrapper for write-good

## Related

*   [`remark-validate-links`](https://github.com/remarkjs/remark-validate-links)
    — Validate if links point to existing headings and files in markdown

## Contribute

See [`contribute.md` in `remarkjs/remarkj`][contribute] for ways to get started.

This organisation has a [Code of Conduct][coc].  By interacting with this
repository, organisation, or community you agree to abide by its terms.

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[build-badge]: https://img.shields.io/travis/remarkjs/remark-lint.svg

[build-status]: https://travis-ci.org/remarkjs/remark-lint

[coverage-badge]: https://img.shields.io/codecov/c/github/remarkjs/remark-lint.svg

[coverage-status]: https://codecov.io/github/remarkjs/remark-lint

[chat-badge]: https://img.shields.io/gitter/room/remarkjs/Lobby.svg

[chat]: https://gitter.im/remarkjs/Lobby

[license]: LICENSE

[author]: http://wooorm.com

[npm]: https://docs.npmjs.com/cli/install

[remark]: https://github.com/remarkjs/remark

[logo]: https://cdn.rawgit.com/remarkjs/remark-lint/b177ac6/logo.svg

[screenshot]: https://cdn.rawgit.com/remarkjs/remark-lint/master/screenshot.png

[rules]: doc/rules.md

[api]: https://github.com/remarkjs/remark/tree/master/packages/remark

[cli]: https://github.com/remarkjs/remark/tree/master/packages/remark-cli

[remark-plugins]: https://github.com/remarkjs/remark/blob/master/doc/plugins.md

[linter-markdown]: https://atom.io/packages/linter-markdown

[message-control]: https://github.com/remarkjs/remark-message-control#markers

[linter-remark]: https://github.com/wooorm/linter-remark

[gulp-remark]: https://github.com/denysdovhan/gulp-remark

[ale]: https://github.com/w0rp/ale

[config-preset]: https://github.com/unifiedjs/unified-engine/blob/master/doc/configure.md#presets

[preset-recommended]: https://github.com/remarkjs/remark-lint/blob/master/packages/remark-preset-lint-recommended

[presets]: #list-of-presets

[remark-stringify]: https://github.com/remarkjs/remark/tree/master/packages/remark-stringify

[remark-stringify-options]: https://github.com/remarkjs/remark/tree/master/packages/remark-stringify#options

[cli-settings]: https://github.com/unifiedjs/unified-args#--setting-settings

[cli-config]: https://github.com/unifiedjs/unified-engine/blob/master/doc/configure.md

[contribute]: https://github.com/remarkjs/remark/blob/master/contributing.md

[coc]: https://github.com/remarkjs/remark/blob/master/code-of-conduct.md

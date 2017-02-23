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
*   [License](#license)

## Installation

[npm][]:

```bash
npm install remark-lint
```

## Command line

![Example of how remark-lint looks on screen][screenshot]

Use `remark-lint` together with [`remark-cli`][cli], and a
[preset][preset-recommended].

```bash
npm install --save remark-cli remark-lint remark-preset-lint-recommended
```

Then, configure **remark** in your `package.json`:

```js
  // ...
  "scripts": {
    "lint-md": "remark ."
  },
  // ...
  "remarkConfig": {
    "presets": ["lint-recommended"]
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
npm install remark remark-lint
```

Let’s say `example.js` looks as follows:

```js
var report = require('vfile-reporter');
var remark = require('remark');
var lint = require('remark-lint');

var file = remark().use(lint, {firstHeadingLevel: true}).process('## Hello world!');

console.log(report(file));
```

Now, running `node example.js` yields:

```txt
  1:1-1:16  warning  First heading level should be `1`  first-heading-level

⚠ 1 warning
```

### `remark.use(lint[, options])`

Adds warnings for style violations to the processed [virtual file][vfile].

When processing a file, these warnings are available at `file.messages`, and
look as follows:

```js
{ [1:1-1:16: First heading level should be `1`]
  message: 'First heading level should be `1`',
  name: '1:1-1:16',
  file: '',
  reason: 'First heading level should be `1`',
  line: 1,
  column: 1,
  location: {
    start: { line: 1, column: 1, offset: 0 },
    end: { line: 1, column: 16, offset: 15 } },
  fatal: false,
  ruleId: 'first-heading-level',
  source: 'remark-lint' }
```

See [`VFileMessage`][vfile-message] for more information.

## Rules

[`doc/rules.md`][rules] describes all available rules, what they check
for, examples of markdown they warn for, and how to fix their warnings.

## Configuring remark-lint

**remark-lint** is a **remark** plug-in and supports configuration
through its [configuration files][cli].

An example `.remarkrc` file could look as follows:

```json
{
  "presets": ["lint-recommended"],
  "plugins": {
    "lint": {
      "list-item-indent": false
    }
  }
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

One of **remark**’s cool parts is that it compiles to very clean, and highly
cross-vendor supported markdown.  It’ll ensure list items use a single bullet,
emphasis and strong use a standard marker, and that your table fences are
aligned.

**remark** should be able to fix most of your styling issues automatically,
and I strongly suggest checking out how it can make your life easier :+1:

## Editor Integrations

Currently, **remark-lint** is integrated with Atom through
[**linter-markdown**][linter-markdown].

If you want to run all of **remark** from **Atom**, use
[**linter-remark**][linter-remark].

To run **remark**, optionally with **remark-lint** from **Gulp**, use
[**gulp-remark**][gulp-remark].

I’m very interested in more integrations.  Let me know if I can help.

## List of Presets

Presets can be loaded through the [`preset` setting][config-preset].

*   [`remark-preset-lint-consistent`][preset-consistent]
    — Rules that enforce consistency;
*   [`remark-preset-lint-recommended`][preset-recommended]
    — Rules that prevent mistakes or syntaxes that do not work
    correctly across vendors.

## List of External Rules

External rules can be loaded just like normal rules.

<!--
This list is ordered based on the name without prefix, so
excluding `remark-lint-no-` or `remark-lint-`
-->

*   [`vhf/remark-lint-alphabetize-lists`](https://github.com/vhf/remark-lint-alphabetize-lists)
    — Ensure list items are in alphabetical order;
*   [`RichardLitt/remark-lint-appropriate-heading`](https://github.com/RichardLitt/remark-lint-appropriate-heading)
    — Check that the top-level heading matches the directory name;
*   [`vhf/remark-lint-blank-lines-1-0-2`](https://github.com/vhf/remark-lint-blank-lines-1-0-2)
    — Ensure a specific number of lines between blocks;
*   [`vhf/remark-lint-books-links`](https://github.com/vhf/remark-lint-books-links)
    — Ensure links in lists of books follow a standard format;
*   [`Qard/remark-lint-code`](https://github.com/Qard/remark-lint-code)
    — Lint fenced code blocks by corresponding language tags,
    currently supporting [ESLint](https://github.com/Qard/remark-lint-code-eslint).
*   [`vhf/remark-lint-no-empty-sections`](https://github.com/vhf/remark-lint-no-empty-sections)
    — Ensure every heading is followed by content (forming a section);
*   [`chcokr/remark-lint-sentence-newline`](https://github.com/chcokr/remark-lint-sentence-newline)
    — Ensure sentences are followed by a newline;
*   [`vhf/remark-lint-no-url-trailing-slash`](https://github.com/vhf/remark-lint-no-url-trailing-slash)
    — Ensure that the `href` of links has no trailing slash.

## Related

*   [`wooorm/remark-validate-links`](https://github.com/wooorm/remark-validate-links)
    — Validate if links point to existing headings and files in markdown.

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[build-badge]: https://img.shields.io/travis/wooorm/remark-lint.svg

[build-status]: https://travis-ci.org/wooorm/remark-lint

[coverage-badge]: https://img.shields.io/codecov/c/github/wooorm/remark-lint.svg

[coverage-status]: https://codecov.io/github/wooorm/remark-lint

[chat-badge]: https://img.shields.io/gitter/room/wooorm/remark.svg

[chat]: https://gitter.im/wooorm/remark

[license]: LICENSE

[author]: http://wooorm.com

[npm]: https://docs.npmjs.com/cli/install

[remark]: https://github.com/wooorm/remark

[logo]: https://cdn.rawgit.com/wooorm/remark-lint/b177ac6/logo.svg

[screenshot]: https://cdn.rawgit.com/wooorm/remark-lint/master/screenshot.png

[rules]: doc/rules.md

[api]: https://github.com/wooorm/remark/tree/master/packages/remark

[cli]: https://github.com/wooorm/remark/tree/master/packages/remark-cli

[remark-plugins]: https://github.com/wooorm/remark/blob/master/doc/plugins.md

[linter-markdown]: https://atom.io/packages/linter-markdown

[message-control]: https://github.com/wooorm/remark-message-control#markers

[vfile]: https://github.com/wooorm/vfile

[vfile-message]: https://github.com/wooorm/vfile#vfilemessage

[linter-remark]: https://github.com/wooorm/linter-remark

[gulp-remark]: https://github.com/denysdovhan/gulp-remark

[config-preset]: https://github.com/wooorm/unified-engine/blob/master/doc/configure.md#presets

[preset-consistent]: https://github.com/wooorm/remark-lint/blob/master/packages/remark-preset-lint-consistent

[preset-recommended]: https://github.com/wooorm/remark-lint/blob/master/packages/remark-preset-lint-recommended

[presets]: #list-of-presets

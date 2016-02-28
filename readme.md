# ![remark-lint][logo]

[![Build Status][travis-badge]][travis-ci]
[![Coverage Status][coverage-badge]][coverage-ci]

**remark-lint** is a markdown code style linter.  Another linter?  Yes.
Ensuring the markdown you (and contributors) write is of great quality will
provide better rendering in all the different markdown parsers, and makes
sure less refactoring is needed afterwards. What is quality? That’s up to you,
but the defaults are sensible :ok_hand:.

**remark-lint** has lots of tests.  Supports Node, io.js, and the browser.
100% coverage.  50+ rules.  It’s built on [**remark**][remark],
a powerful markdown processor powered by [plugins][remark-plugins]
(such as this one).

## Table of Contents

*   [Installation](#installation)
*   [Command line](#command-line)
*   [Programmatic](#programmatic)
*   [Rules](#rules)
*   [Configuring remark-lint](#configuring-remark-lint)
*   [Using remark to fix your markdown](#using-remark-to-fix-your-markdown)
*   [Editor Integrations](#editor-integrations)
*   [List of External Rules](#list-of-external-rules)
*   [Related](#related)
*   [License](#license)

## Installation

[npm][npm-install]:

```bash
npm install remark-lint
```

**remark-lint** is also available as an AMD, CommonJS, and globals
module, [uncompressed and compressed][releases].

## Command line

![Example of how remark-lint looks on screen][screenshot]

Use remark-lint together with remark:

```bash
npm install --global remark remark-lint
```

Let’s say `example.md` looks as follows:

```md
* Hello

[World][]
```

Then, to run **remark-lint** on `example.md`:

```bash
remark example.md -u remark-lint
#
# Yields:
#
# example.md
#         1:3  warning  Incorrect list-item indent: add 2 spaces  list-item-indent
#    3:1-3:10  warning  Found reference to undefined definition   no-undefined-references
#
# ⚠ 2 warnings
```

See [`doc/rules.md`][rules] for what those warnings are (and how to
turn them off).

## Programmatic

[`doc/api.md`][api] describes how to use **remark-lint**’s
programatic interface in JavaScript.

## Rules

[`doc/rules.md`][rules] describes all available rules, what they check
for, examples of markdown they warn for, and how to fix their warnings.

## Configuring remark-lint

**remark-lint** is just a **remark** plug-in.  Meaning, you can opt to
configure using configuration files.  Read more about these files
(`.remarkrc` or `package.json`) in [**remark**’s docs][remarkrc].

An example `.remarkrc` file could look as follows:

```json
{
  "plugins": {
    "lint": {
      "no-multiple-toplevel-headings": false,
      "list-item-indent": false,
      "maximum-line-length": 79
    }
  },
  "settings": {
    "commonmark": true
  }
}
```

Where the object at `plugins.lint` is a map of `ruleId`s and their values. The
object at `settings` determines how **remark** parses (and compiles)
markdown code. Read more about the latter on
[**remark**’s readme][remark-process].

Using our `example.md` from before:

```md
* Hello

[World][]
```

We now run the below command _without_ the `-u remark-lint` since
our `.remarkrc` includes the lint plugin.

```bash
remark example.md
#
# Yields:
#
# example.md
#    3:1-3:10  warning  Found reference to undefined definition   no-undefined-references
#
# ⚠ 2 warnings
```

In addition, you can also provide configuration comments to turn a rule
on or off inside a file. Note that you cannot change what a setting,
such as `maximum-line-length`, checks for, as you’re either enabling
or disabling warnings). Read more about configuration comments in
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

## Using remark to fix your markdown

One of **remark**’s cool parts is that it compiles to very clean, and highly
cross-vendor supported markdown. It’ll ensure list items use a single bullet,
emphasis and strong use a standard marker, and that your table fences are
aligned.

**remark** should be able to fix most of your styling issues automatically,
and I strongly suggest checking out how it can make your life easier :+1:

## Editor Integrations

Currently, **remark-lint** is integrated with Atom through
[**linter-markdown**][linter-markdown].

I’m very interested in more integrations. Let me know if I can help.

## List of External Rules

<!--
This list is ordered based on the name without prefix, so
excluding `remark-lint-no-` or `remark-lint-`
-->

*   [`vhf/remark-lint-alphabetize-lists`](https://github.com/vhf/remark-lint-alphabetize-lists)
    — Ensure list items are in alphabetical order;

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

[travis-badge]: https://img.shields.io/travis/wooorm/remark-lint.svg

[travis-ci]: https://travis-ci.org/wooorm/remark-lint

[coverage-badge]: https://img.shields.io/codecov/c/github/wooorm/remark-lint.svg

[coverage-ci]: https://codecov.io/github/wooorm/remark-lint

[npm-install]: https://docs.npmjs.com/cli/install

[releases]: https://github.com/wooorm/remark-lint/releases

[author]: http://wooorm.com

[logo]: https://cdn.rawgit.com/wooorm/remark-lint/master/logo.svg

[screenshot]: https://cdn.rawgit.com/wooorm/remark-lint/master/screenshot.png

[rules]: doc/rules.md

[api]: doc/api.md

[license]: LICENSE

[remark]: https://github.com/wooorm/remark

[remark-plugins]: https://github.com/wooorm/remark/blob/master/doc/plugins.md

[remarkrc]: https://github.com/wooorm/remark/blob/master/doc/remarkrc.5.md

[remark-process]: https://github.com/wooorm/remark#remarkprocessvalue-options-done

[linter-markdown]: https://atom.io/packages/linter-markdown

[message-control]: https://github.com/wooorm/remark-message-control#markers

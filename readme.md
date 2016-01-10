# ![remark-lint](https://cdn.rawgit.com/wooorm/remark-lint/master/logo.svg)

[![Build Status](https://img.shields.io/travis/wooorm/remark-lint.svg)](https://travis-ci.org/wooorm/remark-lint) [![Coverage Status](https://img.shields.io/codecov/c/github/wooorm/remark-lint.svg)](https://codecov.io/github/wooorm/remark-lint)

**remark-lint** is a markdown code style linter.  Another linter?  Yes.
Ensuring the markdown you (and contributors) write is of great quality will
provide better rendering in all the different markdown parsers, and makes
sure less refactoring is needed afterwards. What is quality? That’s up to you,
but the defaults are sensible :ok\_hand:.

**remark-lint** has lots of tests.  Supports Node, io.js, and the browser.
100% coverage.  50+ rules.  It’s built on [**remark**](https://github.com/wooorm/remark),
a powerful markdown processor powered by [plugins](https://github.com/wooorm/remark/blob/master/doc/plugins.md)
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

[npm](https://docs.npmjs.com/cli/install):

```bash
npm install remark-lint
```

**remark-lint** is also available for [duo](http://duojs.org/#getting-started),
and as an AMD, CommonJS, and globals module, [uncompressed and
compressed](https://github.com/wooorm/remark-lint/releases).

## Command line

![Example of how remark-lint looks on screen](https://cdn.rawgit.com/wooorm/remark-lint/master/screenshot.png)

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

See [doc/rules.md](doc/rules.md) for what those warnings are (and how to
turn them off).

## Programmatic

[doc/api.md](doc/api.md) describes how to use **remark-lint**’s
programatic interface in JavaScript.

## Rules

[doc/rules.md](doc/rules.md) describes all available rules, what they check
for, examples of markdown they warn for, and how to fix their warnings.

## Configuring remark-lint

**remark-lint** is just a **remark** plug-in.  Meaning, you can opt to
configure using configuration files.  Read more about these files
(`.remarkrc` or `package.json`) in [**remark**’s docs](https://github.com/wooorm/remark/blob/master/doc/remarkrc.5.md).

An example `.remarkrc` file could look as follows:

```json
{
  "plugins": {
    "lint": {
        "no-multiple-toplevel-headings": false,
        "maximum-line-length": 79,
        "emphasis-marker": "_",
        "strong-marker": "*"
    }
  },
  "settings": {
    "commonmark": true
  }
}
```

Where the object at `plugins.lint` is a map of `ruleId`s and their values.
The object at `settings` determines how **remark** parses (and compiles)
markdown code.  Read more about the latter on [**remark**’s readme](https://github.com/wooorm/remark#remarkprocessvalue-options-done).

In addition, you can also provide configuration comments to turn a rule
on or off inside a file (note that you cannot change what a setting, such as
`maximum-line-length`, you’re either enabling or disabling warnings).

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

Currently, **remark-lint** is integrated with Atom through [**linter-markdown**](https://atom.io/packages/linter-markdown).

I’m very interested in more integrations. Let me know if I can help.

## List of External Rules

*   [`chcokr/remark-lint-sentence-newline`](https://github.com/chcokr/remark-lint-sentence-newline)
    — Ensure sentences are followed by a newline;

*   [`vhf/remark-lint-alphabetize-lists`](https://github.com/vhf/remark-lint-alphabetize-lists)
    — Ensure list items are in alphabetical order;

*   [`vhf/remark-lint-blank-lines-1-0-2`](https://github.com/vhf/remark-lint-blank-lines-1-0-2)
    — Ensure a specific number of lines between blocks;

*   [`vhf/remark-lint-books-links`](https://github.com/vhf/remark-lint-books-links)
    — Ensure links in lists of books follow a standard format;

*   [`vhf/remark-lint-no-empty-sections`](https://github.com/vhf/remark-lint-no-empty-sections)
    — Ensure every heading is followed by content (forming a section);

*   [`vhf/remark-lint-no-url-trailing-slash`](https://github.com/vhf/remark-lint-no-url-trailing-slash)
    — Ensure that the `href` of links has no trailing slash.

## Related

*   [`wooorm/remark-validate-links`](https://github.com/wooorm/remark-validate-links)
    — Validate if links point to existing headings and files in markdown.

## License

[MIT](LICENSE) © [Titus Wormer](http://wooorm.com)

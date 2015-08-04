# ![mdast-lint](https://cdn.rawgit.com/wooorm/mdast-lint/master/logo.svg)

[![Build Status](https://img.shields.io/travis/wooorm/mdast-lint.svg?style=flat)](https://travis-ci.org/wooorm/mdast-lint) [![Coverage Status](https://img.shields.io/coveralls/wooorm/mdast-lint.svg?style=flat)](https://coveralls.io/r/wooorm/mdast-lint?branch=master)

**mdast-lint** is a markdown code style linter.  Another linter?  Yes.
Ensuring the markdown you (and contributors) write is of great quality will
provide better rendering in all the different markdown parsers, and makes
sure less refactoring is needed afterwards. What is quality? That’s up to you,
but the defaults are sensible :ok_hand:.

**mdast-lint** has lots of tests.  Supports Node, io.js, and the browser.
100% coverage.  50+ rules.  It’s built on [**mdast**](https://github.com/wooorm/mdast),
a powerful markdown processor powered by [plugins](https://github.com/wooorm/mdast/blob/master/doc/plugins.md)
(such as this one).

## Table of Contents

*   [Installation](#installation)
*   [Command line](#command-line)
*   [Programmatic](#programmatic)
*   [Rules](#rules)
*   [Configuring mdast-lint](#configuring-mdast-lint)
*   [Using mdast to fix your markdown](#using-mdast-to-fix-your-markdown)
*   [Editor Integrations](#editor-integrations)
*   [License](#license)

## Installation

[npm](https://docs.npmjs.com/cli/install):

```bash
npm install mdast-lint
```

**mdast-lint** is also available for bower, duo, and for AMD,
CommonJS, and globals.

## Command line

![Example how mdast-lint looks on screen](https://cdn.rawgit.com/wooorm/mdast-lint/master/screen-shot.png)

Use mdast-lint together with mdast:

```bash
npm install --global mdast mdast-lint
```

Let’s say `example.md` looks as follows:

```md
* Hello

-   World
```

Then, to run **mdast-lint** on `example.md`:

```bash
mdast -u mdast-lint example.md
#
# Yields:
#
# example.md
#   1:3  warning  Incorrect list-item content indent: add 2 spaces  list-item-indent
#   3:1  warning  Invalid ordered list item marker: should be `*`   unordered-list-marker-style
#
# ✖ 2 problems (0 errors, 2 warnings)
#
# *   Hello
#
#
# *   World
#
```

See [doc/rules.md](doc/rules.md) for what those warnings are (and how to
turn them off).

## Programmatic

[doc/api.md](doc/api.md) describes how to use **mdast-lint**’s
programatic interface in JavaScript.

## Rules

[doc/rules.md](doc/rules.md) describes all available rules, what they check
for, examples of markdown they warn for, and how to fix their warnings.

## Configuring mdast-lint

**mdast-lint** is just an **mdast** plug-in.  Meaning, you can opt to
configure using configuration files.  Read more about these files
(`.mdastrc` or `package.json`) in [**mdast**’s docs](https://github.com/wooorm/mdast/blob/master/doc/mdastrc.5.md).

An example `.mdastrc` file could look as follows:

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
The object at `settings` determines how **mdast** parses (and compiles)
markdown code.  Read more about the latter on [**mdast**’s readme](https://github.com/wooorm/mdast#mdastprocessvalue-options-done).

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

## Using mdast to fix your markdown

One of **mdast**’s cool parts is that it compiles to very clean, and highly
cross-vendor supported markdown. It’ll ensure list items use a single bullet,
emphasis and strong use a standard marker, and that your table fences are
aligned.

**mdast** should be able to fix most of your styling issues automatically,
and I strongly suggest checking out how it can make your life easier :+1:

## Editor Integrations

Currently, **mdast-lint** is integrated with Atom through [**leipert/linter-markdown**](https://atom.io/packages/linter-markdown).

I’m very interested in more integrations. Let me know if I can help.

## License

[MIT](LICENSE) © [Titus Wormer](http://wooorm.com)

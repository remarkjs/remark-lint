<!--This file is generated-->

# remark-lint-first-heading-level

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

Warn when the first heading has a level other than a specified value.

Options: `number`, default: `1`.

## Presets

This rule is not included in any default preset

## Example

##### `ok.md`

When configured with `2`.

###### In

```markdown
## Delta

Paragraph.
```

###### Out

No messages.

##### `ok-html.md`

When configured with `2`.

###### In

```markdown
<h2>Echo</h2>

Paragraph.
```

###### Out

No messages.

##### `not-ok.md`

When configured with `2`.

###### In

```markdown
# Foxtrot

Paragraph.
```

###### Out

```text
1:1-1:10: First heading level should be `2`
```

##### `not-ok-html.md`

When configured with `2`.

###### In

```markdown
<h1>Golf</h1>

Paragraph.
```

###### Out

```text
1:1-1:14: First heading level should be `2`
```

##### `ok.md`

###### In

```markdown
# The default is to expect a level one heading
```

###### Out

No messages.

##### `ok-html.md`

###### In

```markdown
<h1>An HTML heading is also seen by this rule.</h1>
```

###### Out

No messages.

##### `ok-delayed.md`

###### In

```markdown
You can use markdown content before the heading.

<div>Or non-heading HTML</div>

<h1>So the first heading, be it HTML or markdown, is checked</h1>
```

###### Out

No messages.

##### `not-ok.md`

###### In

```markdown
## Bravo

Paragraph.
```

###### Out

```text
1:1-1:9: First heading level should be `1`
```

##### `not-ok-html.md`

###### In

```markdown
<h2>Charlie</h2>

Paragraph.
```

###### Out

```text
1:1-1:17: First heading level should be `1`
```

## Install

[npm][]:

```sh
npm install remark-lint-first-heading-level
```

## Use

You probably want to use it on the CLI through a config file:

```diff
 …
 "remarkConfig": {
   "plugins": [
     …
     "lint",
+    "lint-first-heading-level",
     …
   ]
 }
 …
```

Or use it on the CLI directly

```sh
remark -u lint -u lint-first-heading-level readme.md
```

Or use this on the API:

```diff
 var remark = require('remark')
 var report = require('vfile-reporter')

 remark()
   .use(require('remark-lint'))
+  .use(require('remark-lint-first-heading-level'))
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

[downloads-badge]: https://img.shields.io/npm/dm/remark-lint-first-heading-level.svg

[downloads]: https://www.npmjs.com/package/remark-lint-first-heading-level

[size-badge]: https://img.shields.io/bundlephobia/minzip/remark-lint-first-heading-level.svg

[size]: https://bundlephobia.com/result?p=remark-lint-first-heading-level

[sponsors-badge]: https://opencollective.com/unified/sponsors/badge.svg

[backers-badge]: https://opencollective.com/unified/backers/badge.svg

[collective]: https://opencollective.com/unified

[chat-badge]: https://img.shields.io/badge/chat-spectrum.svg

[chat]: https://spectrum.chat/unified/remark

[npm]: https://docs.npmjs.com/cli/install

[health]: https://github.com/remarkjs/.github

[contributing]: https://github.com/remarkjs/.github/blob/HEAD/contributing.md

[support]: https://github.com/remarkjs/.github/blob/HEAD/support.md

[coc]: https://github.com/remarkjs/.github/blob/HEAD/code-of-conduct.md

[license]: https://github.com/remarkjs/remark-lint/blob/main/license

[author]: https://wooorm.com

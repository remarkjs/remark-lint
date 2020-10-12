<!--This file is generated-->

# remark-lint-no-paragraph-content-indent

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

Warn when the content in paragraphs is indented.

## Presets

This rule is not included in any default preset

## Example

##### `ok.md`

###### In

```markdown
Alpha

Bravo
Charlie.
**Delta**.

*   Echo
    Foxtrot.

> Golf
> Hotel.

`india()`
juliett.

-   `kilo()`
    lima.

-   `mike()` - november.

![image]() text

![image reference][] text

[![][text]][text]
```

###### Out

No messages.

##### `not-ok.md`

###### In

Note: `·` represents a space.

```markdown
·Alpha

Bravo
·Charlie.

*   Delta
    ·Echo.

> Foxtrot
> ·Golf.

`hotel()`
·india.

-   `juliett()`
    ·kilo.

·![lima]() mike

* november
oscar
  ·papa.
```

###### Out

```text
1:2: Expected no indentation in paragraph content
4:2: Expected no indentation in paragraph content
7:6: Expected no indentation in paragraph content
10:4: Expected no indentation in paragraph content
13:2: Expected no indentation in paragraph content
16:6: Expected no indentation in paragraph content
18:2: Expected no indentation in paragraph content
22:4: Expected no indentation in paragraph content
```

## Install

[npm][]:

```sh
npm install remark-lint-no-paragraph-content-indent
```

## Use

You probably want to use it on the CLI through a config file:

```diff
 …
 "remarkConfig": {
   "plugins": [
     …
     "lint",
+    "lint-no-paragraph-content-indent",
     …
   ]
 }
 …
```

Or use it on the CLI directly

```sh
remark -u lint -u lint-no-paragraph-content-indent readme.md
```

Or use this on the API:

```diff
 var remark = require('remark')
 var report = require('vfile-reporter')

 remark()
   .use(require('remark-lint'))
+  .use(require('remark-lint-no-paragraph-content-indent'))
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

[downloads-badge]: https://img.shields.io/npm/dm/remark-lint-no-paragraph-content-indent.svg

[downloads]: https://www.npmjs.com/package/remark-lint-no-paragraph-content-indent

[size-badge]: https://img.shields.io/bundlephobia/minzip/remark-lint-no-paragraph-content-indent.svg

[size]: https://bundlephobia.com/result?p=remark-lint-no-paragraph-content-indent

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

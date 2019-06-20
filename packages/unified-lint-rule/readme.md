# unified-lint-rule

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

[**unified**][unified] plugin to make it a bit easier to create linting rules.

Each rule in [`remark-lint`][lint] uses this project, so see that for examples!

## Install

[npm][]:

```sh
npm install unified-lint-rule
```

## Use

```js
var rule = require('unified-lint-rule')

module.exports = rule('remark-lint:file-extension', fileExtension)

function fileExtension(tree, file, pref) {
  var ext = file.extname

  pref = typeof pref === 'string' ? pref : 'md'

  if (ext && ext.slice(1) !== pref) {
    file.message('Invalid extension: use `' + pref + '`')
  }
}
```

## Contribute

See [`contributing.md`][contributing] in [`remarkjs/.github`][health] for ways
to get started.
See [`support.md`][support] for ways to get help.

This project has a [Code of Conduct][coc].
By interacting with this repository, organisation, or community you agree to
abide by its terms.

## License

[MIT][license] © [Titus Wormer][author]

[build-badge]: https://img.shields.io/travis/remarkjs/remark-lint/master.svg

[build]: https://travis-ci.org/remarkjs/remark-lint

[coverage-badge]: https://img.shields.io/codecov/c/github/remarkjs/remark-lint.svg

[coverage]: https://codecov.io/github/remarkjs/remark-lint

[downloads-badge]: https://img.shields.io/npm/dm/unified-lint-rule.svg

[downloads]: https://www.npmjs.com/package/unified-lint-rule

[size-badge]: https://img.shields.io/bundlephobia/minzip/unified-lint-rule.svg

[size]: https://bundlephobia.com/result?p=unified-lint-rule

[sponsors-badge]: https://opencollective.com/unified/sponsors/badge.svg

[backers-badge]: https://opencollective.com/unified/backers/badge.svg

[collective]: https://opencollective.com/unified

[chat-badge]: https://img.shields.io/badge/join%20the%20community-on%20spectrum-7b16ff.svg

[chat]: https://spectrum.chat/unified/remark

[npm]: https://docs.npmjs.com/cli/install

[health]: https://github.com/remarkjs/.github

[contributing]: https://github.com/remarkjs/.github/blob/master/contributing.md

[support]: https://github.com/remarkjs/.github/blob/master/support.md

[coc]: https://github.com/remarkjs/.github/blob/master/code-of-conduct.md

[license]: https://github.com/remarkjs/remark-lint/blob/master/license

[author]: https://wooorm.com

[unified]: https://github.com/unifiedjs/unified

[lint]: https://github.com/remarkjs/remark-lint

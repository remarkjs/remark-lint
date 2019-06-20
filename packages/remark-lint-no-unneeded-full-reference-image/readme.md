<!--This file is generated-->

# remark-lint-no-unneeded-full-reference-image

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

Warn when full reference images are used that could be collapsed.

Full references (such as `[Remark][remark]`) can also be written as a
collapsed reference (`[Remark][]`) if normalising the reference text yields
the label.

## Presets

This rule is not included in any default preset

## Example

##### `valid.md`

###### In

```markdown
![alpha][]
![Bravo][]
![Charlie][delta]
```

###### Out

No messages.

##### `invalid.md`

###### In

```markdown
![alpha][alpha]
![Bravo][bravo]
![charlie][Charlie]
```

###### Out

```text
1:1-1:16: Remove the image label as it matches the reference text
2:1-2:16: Remove the image label as it matches the reference text
3:1-3:20: Remove the image label as it matches the reference text
```

## Install

[npm][]:

```sh
npm install remark-lint-no-unneeded-full-reference-image
```

## Use

You probably want to use it on the CLI through a config file:

```diff
 ...
 "remarkConfig": {
   "plugins": [
     ...
     "lint",
+    "lint-no-unneeded-full-reference-image",
     ...
   ]
 }
 ...
```

Or use it on the CLI directly

```sh
remark -u lint -u lint-no-unneeded-full-reference-image readme.md
```

Or use this on the API:

```diff
 var remark = require('remark');
 var report = require('vfile-reporter');

 remark()
   .use(require('remark-lint'))
+  .use(require('remark-lint-no-unneeded-full-reference-image'))
   .process('_Emphasis_ and **importance**', function (err, file) {
     console.error(report(err || file));
   });
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

[downloads-badge]: https://img.shields.io/npm/dm/remark-lint-no-unneeded-full-reference-image.svg

[downloads]: https://www.npmjs.com/package/remark-lint-no-unneeded-full-reference-image

[size-badge]: https://img.shields.io/bundlephobia/minzip/remark-lint-no-unneeded-full-reference-image.svg

[size]: https://bundlephobia.com/result?p=remark-lint-no-unneeded-full-reference-image

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

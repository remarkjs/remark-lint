<!--This file is generated-->

# remark-preset-lint-recommended

remark preset to configure remark-lint with settings that
prevent mistakes or syntaxes that do not work correctly
across vendors.

## Rules

This preset configures [`remark-lint`](https://github.com/remarkjs/remark-lint) with the following rules:

| Rule | Setting |
| ---- | ------- |
| [`final-newline`](https://github.com/remarkjs/remark-lint/tree/master/packages/remark-lint-final-newline) |  |
| [`list-item-bullet-indent`](https://github.com/remarkjs/remark-lint/tree/master/packages/remark-lint-list-item-bullet-indent) |  |
| [`list-item-indent`](https://github.com/remarkjs/remark-lint/tree/master/packages/remark-lint-list-item-indent) | `'tab-size'` |
| [`no-auto-link-without-protocol`](https://github.com/remarkjs/remark-lint/tree/master/packages/remark-lint-no-auto-link-without-protocol) |  |
| [`no-blockquote-without-marker`](https://github.com/remarkjs/remark-lint/tree/master/packages/remark-lint-no-blockquote-without-marker) |  |
| [`no-literal-urls`](https://github.com/remarkjs/remark-lint/tree/master/packages/remark-lint-no-literal-urls) |  |
| [`ordered-list-marker-style`](https://github.com/remarkjs/remark-lint/tree/master/packages/remark-lint-ordered-list-marker-style) | `'.'` |
| [`hard-break-spaces`](https://github.com/remarkjs/remark-lint/tree/master/packages/remark-lint-hard-break-spaces) |  |
| [`no-duplicate-definitions`](https://github.com/remarkjs/remark-lint/tree/master/packages/remark-lint-no-duplicate-definitions) |  |
| [`no-heading-content-indent`](https://github.com/remarkjs/remark-lint/tree/master/packages/remark-lint-no-heading-content-indent) |  |
| [`no-inline-padding`](https://github.com/remarkjs/remark-lint/tree/master/packages/remark-lint-no-inline-padding) |  |
| [`no-shortcut-reference-image`](https://github.com/remarkjs/remark-lint/tree/master/packages/remark-lint-no-shortcut-reference-image) |  |
| [`no-shortcut-reference-link`](https://github.com/remarkjs/remark-lint/tree/master/packages/remark-lint-no-shortcut-reference-link) |  |
| [`no-undefined-references`](https://github.com/remarkjs/remark-lint/tree/master/packages/remark-lint-no-undefined-references) |  |
| [`no-unused-definitions`](https://github.com/remarkjs/remark-lint/tree/master/packages/remark-lint-no-unused-definitions) |  |

## Install

npm:

```sh
npm install remark-preset-lint-recommended
```

## Usage

You probably want to use it on the CLI through a config file:

```diff
 ...
 "remarkConfig": {
+  "plugins": ["preset-lint-recommended"]
 }
 ...
```

Or use it on the CLI directly

```sh
remark -u preset-lint-recommended readme.md
```

Or use this on the API:

```diff
 var remark = require('remark');
 var report = require('vfile-reporter');

 remark()
+  .use(require('remark-preset-lint-recommended'))
   .process('_Emphasis_ and **importance**', function (err, file) {
     console.error(report(err || file));
   });
```

## License

[MIT](https://github.com/remarkjs/remark-lint/blob/master/LICENSE) © [Titus Wormer](http://wooorm.com)

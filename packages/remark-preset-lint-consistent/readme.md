<!--This file is generated-->

# remark-preset-lint-consistent

remark preset to configure remark-lint with rules that enforce consistency.

## Install

npm:

```sh
npm install remark-preset-lint-consistent
```

You probably want to use it on the CLI through a config file:

```diff
 ...
 "remarkConfig": {
+  "plugins": ["remark-preset-lint-consistent"]
 }
 ...
```

Or use it on the CLI directly

```sh
remark -u remark-preset-lint-consistent readme.md
```

Or use this on the API:

```diff
 var remark = require('remark');
 var report = require('vfile-reporter');

 var file = remark()
+  .use(require('remark-preset-lint-consistent'))
   .processSync('_Emphasis_ and **importance**')

 console.error(report(file));
```

## Rules

This preset configures [remark-lint](https://github.com/wooorm/remark-lint) with the following rules:

| Rule                                                                                                                            | Setting        |
| ------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| [`blockquote-indentation`](https://github.com/wooorm/remark-lint/tree/master/packages/remark-lint-blockquote-indentation)       | `'consistent'` |
| [`checkbox-character-style`](https://github.com/wooorm/remark-lint/tree/master/packages/remark-lint-checkbox-character-style)   | `'consistent'` |
| [`code-block-style`](https://github.com/wooorm/remark-lint/tree/master/packages/remark-lint-code-block-style)                   | `'consistent'` |
| [`emphasis-marker`](https://github.com/wooorm/remark-lint/tree/master/packages/remark-lint-emphasis-marker)                     | `'consistent'` |
| [`fenced-code-marker`](https://github.com/wooorm/remark-lint/tree/master/packages/remark-lint-fenced-code-marker)               | `'consistent'` |
| [`heading-style`](https://github.com/wooorm/remark-lint/tree/master/packages/remark-lint-heading-style)                         | `'consistent'` |
| [`link-title-style`](https://github.com/wooorm/remark-lint/tree/master/packages/remark-lint-link-title-style)                   | `'consistent'` |
| [`list-item-content-indent`](https://github.com/wooorm/remark-lint/tree/master/packages/remark-lint-list-item-content-indent)   |                |
| [`ordered-list-marker-style`](https://github.com/wooorm/remark-lint/tree/master/packages/remark-lint-ordered-list-marker-style) | `'consistent'` |
| [`rule-style`](https://github.com/wooorm/remark-lint/tree/master/packages/remark-lint-rule-style)                               | `'consistent'` |
| [`strong-marker`](https://github.com/wooorm/remark-lint/tree/master/packages/remark-lint-strong-marker)                         | `'consistent'` |
| [`table-cell-padding`](https://github.com/wooorm/remark-lint/tree/master/packages/remark-lint-table-cell-padding)               | `'consistent'` |

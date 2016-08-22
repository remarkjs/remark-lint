<!--This file is generated-->

# remark-preset-lint-consistent

remark preset to configure remark-lint with settings that enforce consistency.

## Install

npm:

```sh
npm install --save remark-preset-lint-consistent
```

Then, add the following to your config file:

```diff
   ...
   "remarkConfig": {
+    "presets": [
+      "remark-preset-lint-consistent"
+    ]
   }
   ...
```

## Rules

This preset configures [remark-lint](https://github.com/wooorm/remark-lint) with the following rules:

| Rule                                                                                                                    | Setting        |
| ----------------------------------------------------------------------------------------------------------------------- | -------------- |
| [`blockquote-indentation`](https://github.com/wooorm/remark-lint/blob/master/doc/rules.md#blockquote-indentation)       | `'consistent'` |
| [`checkbox-character-style`](https://github.com/wooorm/remark-lint/blob/master/doc/rules.md#checkbox-character-style)   | `'consistent'` |
| [`code-block-style`](https://github.com/wooorm/remark-lint/blob/master/doc/rules.md#code-block-style)                   | `'consistent'` |
| [`emphasis-marker`](https://github.com/wooorm/remark-lint/blob/master/doc/rules.md#emphasis-marker)                     | `'consistent'` |
| [`fenced-code-marker`](https://github.com/wooorm/remark-lint/blob/master/doc/rules.md#fenced-code-marker)               | `'consistent'` |
| [`heading-style`](https://github.com/wooorm/remark-lint/blob/master/doc/rules.md#heading-style)                         | `'consistent'` |
| [`link-title-style`](https://github.com/wooorm/remark-lint/blob/master/doc/rules.md#link-title-style)                   | `'consistent'` |
| [`list-item-content-indent`](https://github.com/wooorm/remark-lint/blob/master/doc/rules.md#list-item-content-indent)   | `true`         |
| [`ordered-list-marker-style`](https://github.com/wooorm/remark-lint/blob/master/doc/rules.md#ordered-list-marker-style) | `'consistent'` |
| [`rule-style`](https://github.com/wooorm/remark-lint/blob/master/doc/rules.md#rule-style)                               | `'consistent'` |
| [`strong-marker`](https://github.com/wooorm/remark-lint/blob/master/doc/rules.md#strong-marker)                         | `'consistent'` |
| [`table-cell-padding`](https://github.com/wooorm/remark-lint/blob/master/doc/rules.md#table-cell-padding)               | `'consistent'` |

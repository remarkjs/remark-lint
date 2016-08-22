<!--This file is generated-->

# remark-preset-lint-recommended

remark preset to configure remark-lint with settings that prevent mistakes or syntaxes that do not work correctly across vendors.

## Install

npm:

```sh
npm install --save remark-preset-lint-recommended
```

Then, add the following to your config file:

```diff
   ...
   "remarkConfig": {
+    "presets": [
+      "remark-preset-lint-recommended"
+    ]
   }
   ...
```

## Rules

This preset configures [remark-lint](https://github.com/wooorm/remark-lint) with the following rules:

| Rule                                                                                                                            | Setting      |
| ------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| [`final-newline`](https://github.com/wooorm/remark-lint/blob/master/doc/rules.md#final-newline)                                 | `true`       |
| [`list-item-bullet-indent`](https://github.com/wooorm/remark-lint/blob/master/doc/rules.md#list-item-bullet-indent)             | `true`       |
| [`list-item-indent`](https://github.com/wooorm/remark-lint/blob/master/doc/rules.md#list-item-indent)                           | `'tab-size'` |
| [`no-auto-link-without-protocol`](https://github.com/wooorm/remark-lint/blob/master/doc/rules.md#no-auto-link-without-protocol) | `true`       |
| [`no-blockquote-without-caret`](https://github.com/wooorm/remark-lint/blob/master/doc/rules.md#no-blockquote-without-caret)     | `true`       |
| [`no-literal-urls`](https://github.com/wooorm/remark-lint/blob/master/doc/rules.md#no-literal-urls)                             | `true`       |
| [`ordered-list-marker-style`](https://github.com/wooorm/remark-lint/blob/master/doc/rules.md#ordered-list-marker-style)         | `'.'`        |
| [`hard-break-spaces`](https://github.com/wooorm/remark-lint/blob/master/doc/rules.md#hard-break-spaces)                         | `true`       |
| [`no-duplicate-definitions`](https://github.com/wooorm/remark-lint/blob/master/doc/rules.md#no-duplicate-definitions)           | `true`       |
| [`no-heading-content-indent`](https://github.com/wooorm/remark-lint/blob/master/doc/rules.md#no-heading-content-indent)         | `true`       |
| [`no-inline-padding`](https://github.com/wooorm/remark-lint/blob/master/doc/rules.md#no-inline-padding)                         | `true`       |
| [`no-shortcut-reference-image`](https://github.com/wooorm/remark-lint/blob/master/doc/rules.md#no-shortcut-reference-image)     | `true`       |
| [`no-shortcut-reference-link`](https://github.com/wooorm/remark-lint/blob/master/doc/rules.md#no-shortcut-reference-link)       | `true`       |
| [`no-undefined-references`](https://github.com/wooorm/remark-lint/blob/master/doc/rules.md#no-undefined-references)             | `true`       |
| [`no-unused-definitions`](https://github.com/wooorm/remark-lint/blob/master/doc/rules.md#no-unused-definitions)                 | `true`       |

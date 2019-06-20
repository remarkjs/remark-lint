<!--This file is generated-->

# remark-lint-no-literal-urls

Warn for literal URLs in text.
URLs are treated as links in some Markdown vendors, but not in others.
To make sure they are always linked, wrap them in `<` (less-than) and `>`
(greater-than).

## Fix

[`remark-stringify`](https://github.com/remarkjs/remark/tree/master/packages/remark-stringify)
never creates literal URLs and always uses `<` (less-than) and `>`
(greater-than).

See [Using remark to fix your Markdown](https://github.com/remarkjs/remark-lint#using-remark-to-fix-your-markdown)
on how to automatically fix warnings for this rule.

## Presets

This rule is included in the following presets:

| Preset | Setting |
| ------ | ------- |
| [`remark-preset-lint-markdown-style-guide`](https://github.com/remarkjs/remark-lint/tree/master/packages/remark-preset-lint-markdown-style-guide) |  |
| [`remark-preset-lint-recommended`](https://github.com/remarkjs/remark-lint/tree/master/packages/remark-preset-lint-recommended) |  |

## Example

##### `valid.md`

###### In

```markdown
<http://foo.bar/baz>
```

###### Out

No messages.

##### `invalid.md`

###### In

```markdown
http://foo.bar/baz
```

###### Out

```text
1:1-1:19: Don’t use literal URLs without angle brackets
```

## Install

```sh
npm install remark-lint-no-literal-urls
```

## Usage

You probably want to use it on the CLI through a config file:

```diff
 ...
 "remarkConfig": {
   "plugins": [
     ...
     "lint",
+    "lint-no-literal-urls",
     ...
   ]
 }
 ...
```

Or use it on the CLI directly

```sh
remark -u lint -u lint-no-literal-urls readme.md
```

Or use this on the API:

```diff
 var remark = require('remark');
 var report = require('vfile-reporter');

 remark()
   .use(require('remark-lint'))
+  .use(require('remark-lint-no-literal-urls'))
   .process('_Emphasis_ and **importance**', function (err, file) {
     console.error(report(err || file));
   });
```

## License

[MIT](https://github.com/remarkjs/remark-lint/blob/master/license) © [Titus Wormer](https://wooorm.com)

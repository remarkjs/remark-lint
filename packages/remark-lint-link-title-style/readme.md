<!--This file is generated-->

# remark-lint-link-title-style

Warn when link and definition titles occur with incorrect quotes.

Options: `'consistent'`, `'"'`, `'\''`, or `'()'`, default: `'consistent'`.

`'consistent'` detects the first used quote style and warns when subsequent
titles use different styles.

## Fix

[`remark-stringify`](https://github.com/wooorm/remark/tree/master/packages/remark-stringify)
uses single quotes for titles if they contain a double quote, and double
quotes otherwise.

See [Using remark to fix your markdown](https://github.com/wooorm/remark-lint/tree/formatting#using-remark-to-fix-your-markdown)
on how to automatically fix warnings for this rule.

## Presets

This rule is included in the following presets:

| Preset | Setting |
| ------ | ------- |
| [`remark-preset-lint-consistent`](https://github.com/wooorm/remark-lint/tree/master/packages/remark-preset-lint-consistent) | `'consistent'` |
| [`remark-preset-lint-markdown-style-guide`](https://github.com/wooorm/remark-lint/tree/master/packages/remark-preset-lint-markdown-style-guide) | `'"'` |

## Example

##### `valid.md`

When configured with `'"'`.

###### In

```markdown
[Example](http://example.com "Example Domain")
[Example](http://example.com "Example Domain")
```

###### Out

No messages.

##### `invalid.md`

When configured with `'"'`.

###### In

```markdown
[Example]: http://example.com 'Example Domain'
```

###### Out

```text
1:47: Titles should use `"` as a quote
```

##### `valid.md`

When configured with `'\''`.

###### In

```markdown
![Example](http://example.com/image.png 'Example Domain')
![Example](http://example.com/image.png 'Example Domain')
```

###### Out

No messages.

##### `valid.md`

When configured with `'()'`.

###### In

```markdown
[Example](http://example.com (Example Domain) )
[Example](http://example.com (Example Domain) )
```

###### Out

No messages.

##### `invalid.md`

When configured with `'()'`.

###### In

```markdown
[Example](http://example.com (Example Domain))
[Example](http://example.com 'Example Domain')
```

###### Out

```text
2:46: Titles should use `()` as a quote
```

##### `invalid.md`

###### In

```markdown
[Example](http://example.com "Example Domain")
[Example](http://example.com#without-title)
[Example](http://example.com 'Example Domain')
```

###### Out

```text
3:46: Titles should use `"` as a quote
```

##### `invalid.md`

When configured with `'.'`.

###### Out

```text
1:1: Invalid link title style marker `.`: use either `'consistent'`, `'"'`, `'\''`, or `'()'`
```

## Install

```sh
npm install remark-lint-link-title-style
```

## Usage

You probably want to use it on the CLI through a config file:

```diff
 ...
 "remarkConfig": {
   "plugins": [
     ...
     "lint",
+    "lint-link-title-style",
     ...
   ]
 }
 ...
```

Or use it on the CLI directly

```sh
remark -u lint -u lint-link-title-style readme.md
```

Or use this on the API:

```diff
 var remark = require('remark');
 var report = require('vfile-reporter');

 remark()
   .use(require('remark-lint'))
+  .use(require('remark-lint-link-title-style'))
   .process('_Emphasis_ and **importance**', function (err, file) {
     console.error(report(err || file));
   });
```

## License

[MIT](https://github.com/wooorm/remark-lint/blob/master/LICENSE) © [Titus Wormer](http://wooorm.com)

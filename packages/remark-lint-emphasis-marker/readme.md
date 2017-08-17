<!--This file is generated-->

# remark-lint-emphasis-marker

Warn for violating emphasis markers.

Options: `'consistent'`, `'*'`, or `'_'`, default: `'consistent'`.

`'consistent'` detects the first used emphasis style and warns when
subsequent emphasis use different styles.

## Presets

This rule is included in the following presets:

| Preset | Setting |
| ------ | ------- |
| [`remark-preset-lint-consistent`](https://github.com/wooorm/remark-lint/tree/master/packages/remark-preset-lint-consistent) | `'consistent'` |
| [`remark-preset-lint-markdown-style-guide`](https://github.com/wooorm/remark-lint/tree/master/packages/remark-preset-lint-markdown-style-guide) | `'*'` |

## Example

##### `valid.md`

When configured with `'*'`.

###### In

```markdown
*foo*
```

###### Out

No messages.

##### `invalid.md`

When configured with `'*'`.

###### In

```markdown
_foo_
```

###### Out

```text
1:1-1:6: Emphasis should use `*` as a marker
```

##### `valid.md`

When configured with `'_'`.

###### In

```markdown
_foo_
```

###### Out

No messages.

##### `invalid.md`

When configured with `'_'`.

###### In

```markdown
*foo*
```

###### Out

```text
1:1-1:6: Emphasis should use `_` as a marker
```

##### `invalid.md`

###### In

```markdown
*foo*
_bar_
```

###### Out

```text
2:1-2:6: Emphasis should use `*` as a marker
```

##### `invalid.md`

When configured with `'invalid'`.

###### Out

```text
1:1: Invalid emphasis marker `invalid`: use either `'consistent'`, `'*'`, or `'_'`
```

## Install

```sh
npm install remark-lint-emphasis-marker
```

## Usage

You probably want to use it on the CLI through a config file:

```diff
 ...
 "remarkConfig": {
   "plugins": [
     ...
     "lint",
+    "lint-emphasis-marker",
     ...
   ]
 }
 ...
```

Or use it on the CLI directly

```sh
remark -u lint -u lint-emphasis-marker readme.md
```

Or use this on the API:

```diff
 var remark = require('remark');
 var report = require('vfile-reporter');

 remark()
   .use(require('remark-lint'))
+  .use(require('remark-lint-emphasis-marker'))
   .process('_Emphasis_ and **importance**', function (err, file) {
     console.error(report(err || file));
   });
```

## License

[MIT](https://github.com/wooorm/remark-lint/blob/master/LICENSE) © [Titus Wormer](http://wooorm.com)

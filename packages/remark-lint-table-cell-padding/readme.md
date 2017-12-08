<!--This file is generated-->

# remark-lint-table-cell-padding

Warn when table cells are incorrectly padded.

Options: `'consistent'`, `'padded'`, or `'compact'`, default: `'consistent'`.

`'consistent'` detects the first used cell padding style and warns when
subsequent cells use different styles.

## Fix

[`remark-stringify`](https://github.com/remarkjs/remark/tree/master/packages/remark-stringify)
formats tables with padding by default. Pass
[`spacedTable: false`](https://github.com/remarkjs/remark/tree/master/packages/remark-stringify#optionsspacedtable)
to not use padding.

See [Using remark to fix your markdown](https://github.com/remarkjs/remark-lint/tree/formatting#using-remark-to-fix-your-markdown)
on how to automatically fix warnings for this rule.

## Presets

This rule is included in the following presets:

| Preset | Setting |
| ------ | ------- |
| [`remark-preset-lint-consistent`](https://github.com/remarkjs/remark-lint/tree/master/packages/remark-preset-lint-consistent) | `'consistent'` |
| [`remark-preset-lint-markdown-style-guide`](https://github.com/remarkjs/remark-lint/tree/master/packages/remark-preset-lint-markdown-style-guide) | `'padded'` |

## Example

##### `valid.md`

When configured with `'padded'`.

###### In

```markdown
| A     | B     |
| ----- | ----- |
| Alpha | Bravo |
```

###### Out

No messages.

##### `invalid.md`

When configured with `'padded'`.

###### In

```markdown
| A    |    B |
| :----|----: |
| Alpha|Bravo |
```

###### Out

```text
3:8: Cell should be padded
3:9: Cell should be padded
```

##### `valid.md`

When configured with `'compact'`.

###### In

```markdown
|A    |B    |
|-----|-----|
|Alpha|Bravo|
```

###### Out

No messages.

##### `invalid.md`

When configured with `'compact'`.

###### In

```markdown
|A    |     B|
|:----|-----:|
|Alpha|Bravo |
```

###### Out

```text
3:13: Cell should be compact
```

##### `invalid.md`

###### In

```markdown
|   A    | B    |
|   -----| -----|
|   Alpha| Bravo|
```

###### Out

```text
3:5: Cell should be padded with 1 space, not 3
3:10: Cell should be padded
3:17: Cell should be padded
```

##### `empty-heading.md`

###### In

```markdown
<!-- Empty heading cells are always OK. -->

|       | Alpha   |
| ----- | ------- |
| Bravo | Charlie |
```

###### Out

No messages.

##### `empty-body.md`

###### In

```markdown
<!-- Empty body cells are always OK. -->

| Alpha   | Bravo   |
| ------- | ------- |
| Charlie |         |
```

###### Out

No messages.

##### `invalid.md`

When configured with `'invalid'`.

###### Out

```text
1:1: Invalid table-cell-padding style `invalid`
```

## Install

```sh
npm install remark-lint-table-cell-padding
```

## Usage

You probably want to use it on the CLI through a config file:

```diff
 ...
 "remarkConfig": {
   "plugins": [
     ...
     "lint",
+    "lint-table-cell-padding",
     ...
   ]
 }
 ...
```

Or use it on the CLI directly

```sh
remark -u lint -u lint-table-cell-padding readme.md
```

Or use this on the API:

```diff
 var remark = require('remark');
 var report = require('vfile-reporter');

 remark()
   .use(require('remark-lint'))
+  .use(require('remark-lint-table-cell-padding'))
   .process('_Emphasis_ and **importance**', function (err, file) {
     console.error(report(err || file));
   });
```

## License

[MIT](https://github.com/remarkjs/remark-lint/blob/master/LICENSE) © [Titus Wormer](http://wooorm.com)

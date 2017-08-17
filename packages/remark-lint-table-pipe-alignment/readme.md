<!--This file is generated-->

# remark-lint-table-pipe-alignment

Warn when table pipes are not aligned.

## Presets

This rule is included in the following presets:

| Preset | Setting |
| ------ | ------- |
| [`remark-preset-lint-markdown-style-guide`](https://github.com/wooorm/remark-lint/tree/master/packages/remark-preset-lint-markdown-style-guide) |  |

## Example

##### `valid.md`

###### In

```markdown
| A     | B     |
| ----- | ----- |
| Alpha | Bravo |
```

###### Out

No messages.

##### `invalid.md`

###### In

```markdown
| A | B |
| -- | -- |
| Alpha | Bravo |
```

###### Out

```text
3:9-3:10: Misaligned table fence
3:17-3:18: Misaligned table fence
```

## Install

```sh
npm install remark-lint-table-pipe-alignment
```

## Usage

You probably want to use it on the CLI through a config file:

```diff
 ...
 "remarkConfig": {
   "plugins": [
     ...
     "lint",
+    "lint-table-pipe-alignment",
     ...
   ]
 }
 ...
```

Or use it on the CLI directly

```sh
remark -u lint -u lint-table-pipe-alignment readme.md
```

Or use this on the API:

```diff
 var remark = require('remark');
 var report = require('vfile-reporter');

 remark()
   .use(require('remark-lint'))
+  .use(require('remark-lint-table-pipe-alignment'))
   .process('_Emphasis_ and **importance**', function (err, file) {
     console.error(report(err || file));
   });
```

## License

[MIT](https://github.com/wooorm/remark-lint/blob/master/LICENSE) © [Titus Wormer](http://wooorm.com)

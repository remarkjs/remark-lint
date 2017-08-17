<!--This file is generated-->

# remark-lint-no-consecutive-blank-lines

Warn for too many consecutive blank lines.  Knows about the extra line
needed between a list and indented code, and two lists.

## Presets

This rule is included in the following presets:

| Preset | Setting |
| ------ | ------- |
| [`remark-preset-lint-markdown-style-guide`](https://github.com/wooorm/remark-lint/tree/master/packages/remark-preset-lint-markdown-style-guide) |  |

## Example

##### `valid.md`

###### In

Note: `␊` represents a line feed.

```markdown
Foo...
␊
...Bar.
```

###### Out

No messages.

##### `valid-for-code.md`

###### In

Note: `␊` represents a line feed.

```markdown
Paragraph.

*   List
␊
␊
    bravo();
```

###### Out

No messages.

##### `invalid.md`

###### In

Note: `␊` represents a line feed.

```markdown
Foo...
␊
␊
...Bar.
```

###### Out

```text
4:1: Remove 1 line before node
```

## Install

```sh
npm install remark-lint-no-consecutive-blank-lines
```

## Usage

You probably want to use it on the CLI through a config file:

```diff
 ...
 "remarkConfig": {
   "plugins": [
     ...
     "lint",
+    "lint-no-consecutive-blank-lines",
     ...
   ]
 }
 ...
```

Or use it on the CLI directly

```sh
remark -u lint -u lint-no-consecutive-blank-lines readme.md
```

Or use this on the API:

```diff
 var remark = require('remark');
 var report = require('vfile-reporter');

 remark()
   .use(require('remark-lint'))
+  .use(require('remark-lint-no-consecutive-blank-lines'))
   .process('_Emphasis_ and **importance**', function (err, file) {
     console.error(report(err || file));
   });
```

## License

[MIT](https://github.com/wooorm/remark-lint/blob/master/LICENSE) © [Titus Wormer](http://wooorm.com)

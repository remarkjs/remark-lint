<!--This file is generated-->

# remark-lint-no-missing-blank-lines

Warn when missing blank lines before a block node.

This rule can be configured to allow tight list items without blank lines
between their contents by passing `{exceptTightLists: true}` (default:
`false`).

## Presets

This rule is not included in any default preset

## Example

##### `valid.md`

###### In

```markdown
# Foo

## Bar

- Paragraph

  + List.

Paragraph.
```

###### Out

No messages.

##### `invalid.md`

###### In

```markdown
# Foo
## Bar

- Paragraph
  + List.

Paragraph.
```

###### Out

```text
2:1-2:7: Missing blank line before block node
5:3-5:10: Missing blank line before block node
```

##### `tight.md`

When configured with `{ exceptTightLists: true }`.

###### In

```markdown
# Foo
## Bar

- Paragraph
  + List.

Paragraph.
```

###### Out

```text
2:1-2:7: Missing blank line before block node
```

## Install

```sh
npm install remark-lint-no-missing-blank-lines
```

## Usage

You probably want to use it on the CLI through a config file:

```diff
 ...
 "remarkConfig": {
   "plugins": [
     ...
     "lint",
+    "lint-no-missing-blank-lines",
     ...
   ]
 }
 ...
```

Or use it on the CLI directly

```sh
remark -u lint -u lint-no-missing-blank-lines readme.md
```

Or use this on the API:

```diff
 var remark = require('remark');
 var report = require('vfile-reporter');

 remark()
   .use(require('remark-lint'))
+  .use(require('remark-lint-no-missing-blank-lines'))
   .process('_Emphasis_ and **importance**', function (err, file) {
     console.error(report(err || file));
   });
```

## License

[MIT](https://github.com/wooorm/remark-lint/blob/master/LICENSE) © [Titus Wormer](http://wooorm.com)

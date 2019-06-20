<!--This file is generated-->

# remark-lint-no-missing-blank-lines

Warn when missing blank lines before block content (and frontmatter
content).

This rule can be configured to allow tight list items without blank lines
between their contents by passing `{exceptTightLists: true}` (default:
`false`).

## Fix

[`remark-stringify`](https://github.com/remarkjs/remark/tree/master/packages/remark-stringify)
always uses one blank line between blocks if possible, or two lines when
needed.
The style of the list items persists.

See [Using remark to fix your Markdown](https://github.com/remarkjs/remark-lint#using-remark-to-fix-your-markdown)
on how to automatically fix warnings for this rule.

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

[MIT](https://github.com/remarkjs/remark-lint/blob/master/license) © [Titus Wormer](https://wooorm.com)

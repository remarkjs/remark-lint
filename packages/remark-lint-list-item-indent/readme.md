<!--This file is generated-->

# remark-lint-list-item-indent

Warn when the spacing between a list item’s bullet and its content
violates a given style.

Options: `'tab-size'`, `'mixed'`, or `'space'`, default: `'tab-size'`.

## Presets

This rule is included in the following presets:

| Preset | Setting |
| ------ | ------- |
| [`remark-preset-lint-markdown-style-guide`](https://github.com/wooorm/remark-lint/tree/master/packages/remark-preset-lint-markdown-style-guide) |  |
| [`remark-preset-lint-recommended`](https://github.com/wooorm/remark-lint/tree/master/packages/remark-preset-lint-recommended) |  |

## Example

##### `valid.md`

###### In

Note: `·` represents a space.

```markdown
*···List
····item.

Paragraph.

11.·List
····item.

Paragraph.

*···List
····item.

*···List
····item.
```

###### Out

No messages.

##### `valid.md`

When configured with `'mixed'`.

###### In

Note: `·` represents a space.

```markdown
*·List item.

Paragraph.

11.·List item

Paragraph.

*···List
····item.

*···List
····item.
```

###### Out

No messages.

##### `invalid.md`

When configured with `'mixed'`.

###### In

Note: `·` represents a space.

```markdown
*···List item.
```

###### Out

```text
1:5: Incorrect list-item indent: remove 2 spaces
```

##### `valid.md`

When configured with `'space'`.

###### In

Note: `·` represents a space.

```markdown
*·List item.

Paragraph.

11.·List item

Paragraph.

*·List
··item.

*·List
··item.
```

###### Out

No messages.

##### `invalid.md`

When configured with `'space'`.

###### In

Note: `·` represents a space.

```markdown
*···List
····item.
```

###### Out

```text
1:5: Incorrect list-item indent: remove 2 spaces
```

##### `invalid.md`

When configured with `'tab-size'`.

###### In

Note: `·` represents a space.

```markdown
*·List
··item.
```

###### Out

```text
1:3: Incorrect list-item indent: add 2 spaces
```

##### `invalid.md`

When configured with `'invalid'`.

###### Out

```text
1:1: Invalid list-item indent style `invalid`: use either `'tab-size'`, `'space'`, or `'mixed'`
```

## Install

```sh
npm install remark-lint-list-item-indent
```

## Usage

You probably want to use it on the CLI through a config file:

```diff
 ...
 "remarkConfig": {
   "plugins": [
     ...
     "lint",
+    "lint-list-item-indent",
     ...
   ]
 }
 ...
```

Or use it on the CLI directly

```sh
remark -u lint -u lint-list-item-indent readme.md
```

Or use this on the API:

```diff
 var remark = require('remark');
 var report = require('vfile-reporter');

 remark()
   .use(require('remark-lint'))
+  .use(require('remark-lint-list-item-indent'))
   .process('_Emphasis_ and **importance**', function (err, file) {
     console.error(report(err || file));
   });
```

## License

[MIT](https://github.com/wooorm/remark-lint/blob/master/LICENSE) © [Titus Wormer](http://wooorm.com)

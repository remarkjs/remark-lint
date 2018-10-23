<!--This file is generated-->

# remark-lint-linebreak-style

Warn when linebreaks violate a given or detected style.

Options: either `'unix'` (for `\n`, denoted as `␊`), `'windows'` (for `\r\n`,
denoted as `␍␊`), or `'consistent'` (to detect the first used linebreak in
a file).  Default: `'consistent'`.

## Fix

[`remark-stringify`](https://github.com/remarkjs/remark/tree/master/packages/remark-stringify)
always uses unix-style linebreaks.

See [Using remark to fix your markdown](https://github.com/remarkjs/remark-lint#using-remark-to-fix-your-markdown)
on how to automatically fix warnings for this rule.

## Presets

This rule is not included in any default preset

## Example

##### `valid-consistent-as-windows.md`

###### In

Note: `␍␊` represents a carriage return and a line feed.

```markdown
Alpha␍␊
Bravo␍␊
```

###### Out

No messages.

##### `valid-consistent-as-unix.md`

###### In

Note: `␊` represents a line feed.

```markdown
Alpha␊
Bravo␊
```

###### Out

No messages.

##### `invalid-unix.md`

When configured with `'unix'`.

###### In

Note: `␍␊` represents a carriage return and a line feed.

```markdown
Alpha␍␊
```

###### Out

```text
1:7: Expected linebreaks to be unix (`\n`), not windows (`\r\n`)
```

##### `invalid-windows.md`

When configured with `'windows'`.

###### In

Note: `␊` represents a line feed.

```markdown
Alpha␊
```

###### Out

```text
1:6: Expected linebreaks to be windows (`\r\n`), not unix (`\n`)
```

## Install

```sh
npm install remark-lint-linebreak-style
```

## Usage

You probably want to use it on the CLI through a config file:

```diff
 ...
 "remarkConfig": {
   "plugins": [
     ...
     "lint",
+    "lint-linebreak-style",
     ...
   ]
 }
 ...
```

Or use it on the CLI directly

```sh
remark -u lint -u lint-linebreak-style readme.md
```

Or use this on the API:

```diff
 var remark = require('remark');
 var report = require('vfile-reporter');

 remark()
   .use(require('remark-lint'))
+  .use(require('remark-lint-linebreak-style'))
   .process('_Emphasis_ and **importance**', function (err, file) {
     console.error(report(err || file));
   });
```

## License

[MIT](https://github.com/remarkjs/remark-lint/blob/master/license) © [Titus Wormer](http://wooorm.com)

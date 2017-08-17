<!--This file is generated-->

# remark-lint-no-html

Warn when HTML nodes are used.

Ignores comments, because they are used by `remark`, `remark-lint`, other
markdown tools, and because markdown doesn’t have native comments.

## Presets

This rule is not included in any default preset

## Example

##### `valid.md`

###### In

```markdown
# Hello

<!--Comments are also OK-->
```

###### Out

No messages.

##### `invalid.md`

###### In

```markdown
<h1>Hello</h1>
```

###### Out

```text
1:1-1:15: Do not use HTML in markdown
```

## Install

```sh
npm install remark-lint-no-html
```

## Usage

You probably want to use it on the CLI through a config file:

```diff
 ...
 "remarkConfig": {
   "plugins": [
     ...
     "lint",
+    "lint-no-html",
     ...
   ]
 }
 ...
```

Or use it on the CLI directly

```sh
remark -u lint -u lint-no-html readme.md
```

Or use this on the API:

```diff
 var remark = require('remark');
 var report = require('vfile-reporter');

 remark()
   .use(require('remark-lint'))
+  .use(require('remark-lint-no-html'))
   .process('_Emphasis_ and **importance**', function (err, file) {
     console.error(report(err || file));
   });
```

## License

[MIT](https://github.com/wooorm/remark-lint/blob/master/LICENSE) © [Titus Wormer](http://wooorm.com)

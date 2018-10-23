<!--This file is generated-->

# remark-lint-no-heading-like-paragraph

Warn for h7+ “headings”.

## Presets

This rule is not included in any default preset

## Example

##### `valid.md`

###### In

```markdown
###### Alpha

Bravo.
```

###### Out

No messages.

##### `invalid.md`

###### In

```markdown
####### Charlie

Delta.
```

###### Out

```text
1:1-1:16: This looks like a heading but has too many hashes
```

## Install

```sh
npm install remark-lint-no-heading-like-paragraph
```

## Usage

You probably want to use it on the CLI through a config file:

```diff
 ...
 "remarkConfig": {
   "plugins": [
     ...
     "lint",
+    "lint-no-heading-like-paragraph",
     ...
   ]
 }
 ...
```

Or use it on the CLI directly

```sh
remark -u lint -u lint-no-heading-like-paragraph readme.md
```

Or use this on the API:

```diff
 var remark = require('remark');
 var report = require('vfile-reporter');

 remark()
   .use(require('remark-lint'))
+  .use(require('remark-lint-no-heading-like-paragraph'))
   .process('_Emphasis_ and **importance**', function (err, file) {
     console.error(report(err || file));
   });
```

## License

[MIT](https://github.com/remarkjs/remark-lint/blob/master/license) © [Titus Wormer](http://wooorm.com)

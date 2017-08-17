<!--This file is generated-->

# remark-lint-no-empty-url

Warn for empty URLs in links and images.

## Presets

This rule is not included in any default preset

## Example

##### `valid.md`

###### In

```markdown
[alpha](http://bravo.com).

![charlie](http://delta.com/echo.png "foxtrott").
```

###### Out

No messages.

##### `invalid.md`

###### In

```markdown
[golf]().

![hotel]().
```

###### Out

```text
1:1-1:9: Don’t use links without URL
3:1-3:11: Don’t use images without URL
```

## Install

```sh
npm install remark-lint-no-empty-url
```

## Usage

You probably want to use it on the CLI through a config file:

```diff
 ...
 "remarkConfig": {
   "plugins": [
     ...
     "lint",
+    "lint-no-empty-url",
     ...
   ]
 }
 ...
```

Or use it on the CLI directly

```sh
remark -u lint -u lint-no-empty-url readme.md
```

Or use this on the API:

```diff
 var remark = require('remark');
 var report = require('vfile-reporter');

 remark()
   .use(require('remark-lint'))
+  .use(require('remark-lint-no-empty-url'))
   .process('_Emphasis_ and **importance**', function (err, file) {
     console.error(report(err || file));
   });
```

## License

[MIT](https://github.com/wooorm/remark-lint/blob/master/LICENSE) © [Titus Wormer](http://wooorm.com)

<!--This file is generated-->

# remark-lint-no-reference-like-url

Warn when URLs are also defined identifiers.

## Presets

This rule is not included in any default preset

## Example

##### `valid.md`

###### In

```markdown
[Alpha](http://example.com).

[bravo]: https://example.com
```

###### Out

No messages.

##### `invalid.md`

###### In

```markdown
[Charlie](delta).

[delta]: https://example.com
```

###### Out

```text
1:1-1:17: Did you mean to use `[delta]` instead of `(delta)`, a reference?
```

## Install

```sh
npm install remark-lint-no-reference-like-url
```

## Usage

You probably want to use it on the CLI through a config file:

```diff
 ...
 "remarkConfig": {
   "plugins": [
     ...
     "lint",
+    "lint-no-reference-like-url",
     ...
   ]
 }
 ...
```

Or use it on the CLI directly

```sh
remark -u lint -u lint-no-reference-like-url readme.md
```

Or use this on the API:

```diff
 var remark = require('remark');
 var report = require('vfile-reporter');

 remark()
   .use(require('remark-lint'))
+  .use(require('remark-lint-no-reference-like-url'))
   .process('_Emphasis_ and **importance**', function (err, file) {
     console.error(report(err || file));
   });
```

## License

[MIT](https://github.com/remarkjs/remark-lint/blob/master/license) © [Titus Wormer](https://wooorm.com)

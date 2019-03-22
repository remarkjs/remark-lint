<!--This file is generated-->

# remark-lint-no-undefined-references

Warn when references to undefined definitions are found.

No warning is emitted if the “link identifier” is `…` or `...`, permitting the
use of _[…]_ and _[...]_ to elide portions of quoted passages (as discussed in
[#207](https://github.com/remarkjs/remark-lint/issues/207)).

## Presets

This rule is included in the following presets:

| Preset | Setting |
| ------ | ------- |
| [`remark-preset-lint-recommended`](https://github.com/remarkjs/remark-lint/tree/master/packages/remark-preset-lint-recommended) |  |

## Example

##### `valid.md`

###### In

```markdown
[foo][]

[foo]: https://example.com
```

###### Out

No messages.

##### `invalid.md`

###### In

```markdown
[bar][]
```

###### Out

```text
1:1-1:8: Found reference to undefined definition
```

## Install

```sh
npm install remark-lint-no-undefined-references
```

## Usage

You probably want to use it on the CLI through a config file:

```diff
 ...
 "remarkConfig": {
   "plugins": [
     ...
     "lint",
+    "lint-no-undefined-references",
     ...
   ]
 }
 ...
```

Or use it on the CLI directly

```sh
remark -u lint -u lint-no-undefined-references readme.md
```

Or use this on the API:

```diff
 var remark = require('remark');
 var report = require('vfile-reporter');

 remark()
   .use(require('remark-lint'))
+  .use(require('remark-lint-no-undefined-references'))
   .process('_Emphasis_ and **importance**', function (err, file) {
     console.error(report(err || file));
   });
```

## License

[MIT](https://github.com/remarkjs/remark-lint/blob/master/license) © [Titus Wormer](https://wooorm.com)

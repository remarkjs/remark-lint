<!--This file is generated-->

# remark-lint-no-undefined-references

Warn when references to undefined definitions are found.

Options: `Object`, optional.

The object can have an `allow` property, an array of strings that
may appear between `[` and `]` but that should not be treated as
link identifiers.

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

##### `valid-allow.md`

When configured with `{ allow: [ '...' ] }`.

###### In

```markdown
> Eliding a portion of a quoted passage [...] is acceptable.
```

###### Out

No messages.

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

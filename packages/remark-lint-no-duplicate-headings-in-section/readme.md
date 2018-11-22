<!--This file is generated-->

# remark-lint-no-duplicate-headings-in-section

Warn when duplicate headings are found, but only when on the same level,
“in” the same section.

## Presets

This rule is not included in any default preset

## Example

##### `valid.md`

###### In

```markdown
## Alpha

### Bravo

## Charlie

### Bravo

### Delta

#### Bravo

#### Echo

##### Bravo
```

###### Out

No messages.

##### `invalid.md`

###### In

```markdown
## Foxtrot

### Golf

### Golf
```

###### Out

```text
5:1-5:9: Do not use headings with similar content per section (3:1)
```

## Install

```sh
npm install remark-lint-no-duplicate-headings-in-section
```

## Usage

You probably want to use it on the CLI through a config file:

```diff
 ...
 "remarkConfig": {
   "plugins": [
     ...
     "lint",
+    "lint-no-duplicate-headings-in-section",
     ...
   ]
 }
 ...
```

Or use it on the CLI directly

```sh
remark -u lint -u lint-no-duplicate-headings-in-section readme.md
```

Or use this on the API:

```diff
 var remark = require('remark');
 var report = require('vfile-reporter');

 remark()
   .use(require('remark-lint'))
+  .use(require('remark-lint-no-duplicate-headings-in-section'))
   .process('_Emphasis_ and **importance**', function (err, file) {
     console.error(report(err || file));
   });
```

## License

[MIT](https://github.com/remarkjs/remark-lint/blob/master/license) © [Titus Wormer](https://wooorm.com)

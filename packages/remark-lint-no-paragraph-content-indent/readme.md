<!--This file is generated-->

# remark-lint-no-paragraph-content-indent

Warn when the content in paragraphs is indented.

## Presets

This rule is not included in any default preset

## Example

##### `valid.md`

###### In

```markdown
Alpha

Bravo
Charlie.
**Delta**.

*   Echo
    Foxtrot.

> Golf
> Hotel.

`india()`
juliett.

-   `kilo()`
    lima.

-   `mike()` - november.

![image]() text

![image reference][] text

[![][text]][text]
```

###### Out

No messages.

##### `invalid.md`

###### In

Note: `·` represents a space.

```markdown
·Alpha

Bravo
·Charlie.
**·Delta**.

*   Echo
    ·Foxtrot.

> Golf
> ·Hotel.

`india()`
·juliett.

-   `kilo()`
    ·lima.

![ image]() text

![ image reference][] text

[![ ][text]][text]
```

###### Out

```text
1:1: Expected no indentation in paragraph content
4:1: Expected no indentation in paragraph content
5:3: Expected no indentation in paragraph content
8:5: Expected no indentation in paragraph content
11:3: Expected no indentation in paragraph content
14:1: Expected no indentation in paragraph content
17:5: Expected no indentation in paragraph content
19:1: Expected no indentation in paragraph content
21:1: Expected no indentation in paragraph content
23:2: Expected no indentation in paragraph content
```

## Install

```sh
npm install remark-lint-no-paragraph-content-indent
```

## Usage

You probably want to use it on the CLI through a config file:

```diff
 ...
 "remarkConfig": {
   "plugins": [
     ...
     "lint",
+    "lint-no-paragraph-content-indent",
     ...
   ]
 }
 ...
```

Or use it on the CLI directly

```sh
remark -u lint -u lint-no-paragraph-content-indent readme.md
```

Or use this on the API:

```diff
 var remark = require('remark');
 var report = require('vfile-reporter');

 remark()
   .use(require('remark-lint'))
+  .use(require('remark-lint-no-paragraph-content-indent'))
   .process('_Emphasis_ and **importance**', function (err, file) {
     console.error(report(err || file));
   });
```

## License

[MIT](https://github.com/remarkjs/remark-lint/blob/master/license) © [Titus Wormer](https://wooorm.com)

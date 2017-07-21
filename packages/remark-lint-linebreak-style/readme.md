<!--This file is generated-->

# remark-lint-linebreak-style

Warn when linebreaks violate a given or detected style.

Options: `string`, either `'unix'` (for `\n`, denoted as ␊), `'windows'`
(for `\r\n`, denoted as ␍␊), or `consistent` (to detect the first used
linebreak in a file).
Default: `'consistent'`.

## Install

```sh
npm install --save remark-lint-linebreak-style
```

## Example

When this rule is turned on, the following file
`valid-consistent-as-windows.md` is ok:

```markdown
Alpha␍␊
Bravo␍␊
```

When this rule is turned on, the following file
`valid-consistent-as-unix.md` is ok:

```markdown
Alpha␊
Bravo␊
```

When this rule is `'unix'`, the following file
`invalid-unix.md` is **not** ok:

```markdown
Alpha␍␊
```

```text
1:7: Expected linebreaks to be unix (`\n`), not windows (`\r\n`)
```

When this rule is `'unix'`, the following file
`valid-unix.md` is ok:

```markdown
Alpha␊
```

When this rule is `'windows'`, the following file
`invalid-windows.md` is **not** ok:

```markdown
Alpha␊
```

```text
1:6: Expected linebreaks to be windows (`\r\n`), not unix (`\n`)
```

When this rule is `'windows'`, the following file
`valid-windows.md` is ok:

```markdown
Alpha␍␊
```

## License

[MIT](https://github.com/wooorm/remark-lint/blob/master/LICENSE) © [Titus Wormer](http://wooorm.com)

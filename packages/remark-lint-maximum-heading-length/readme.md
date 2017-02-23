<!--This file is generated-->

# remark-lint-maximum-heading-length

Warn when headings are too long.

Options: `number`, default: `60`.

Ignores markdown syntax, only checks the plain text content.

## Install

```sh
npm install --save remark-lint-maximum-heading-length
```

## Example

When this rule is `40`, the following file
`invalid.md` is **not** ok:

```markdown
# Alpha bravo charlie delta echo foxtrot golf hotel
```

```text
1:1-1:52: Use headings shorter than `40`
```

When this rule is turned on, the following file
`valid.md` is ok:

```markdown
# Alpha bravo charlie delta echo foxtrot golf hotel

# ![Alpha bravo charlie delta echo foxtrot golf hotel](http://example.com/nato.png)
```

## License

[MIT](https://github.com/wooorm/remark-lint/blob/master/LICENSE) © [Titus Wormer](http://wooorm.com)

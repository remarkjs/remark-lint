<!--This file is generated-->

# remark-lint-list-item-content-indent

Warn when the content of a list item has mixed indentation.

## Install

```sh
npm install --save remark-lint-list-item-content-indent
```

## Example

When this rule is turned on, the following file
`valid.md` is ok:

```markdown
1. [x] Alpha
   1. Bravo
```

When this rule is turned on, the following file
`invalid.md` is **not** ok:

```markdown
1. [x] Charlie
    1. Delta
```

```text
2:5: Don’t use mixed indentation for children, remove 1 space
```

## License

[MIT](https://github.com/wooorm/remark-lint/blob/master/LICENSE) © [Titus Wormer](http://wooorm.com)

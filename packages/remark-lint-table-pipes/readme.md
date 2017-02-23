<!--This file is generated-->

# remark-lint-table-pipes

Warn when table rows are not fenced with pipes.

## Install

```sh
npm install --save remark-lint-table-pipes
```

## Example

When this rule is turned on, the following file
`valid.md` is ok:

```markdown
| A     | B     |
| ----- | ----- |
| Alpha | Bravo |
```

When this rule is turned on, the following file
`invalid.md` is **not** ok:

```markdown
A     | B
----- | -----
Alpha | Bravo
```

```text
1:1: Missing initial pipe in table fence
1:10: Missing final pipe in table fence
3:1: Missing initial pipe in table fence
3:14: Missing final pipe in table fence
```

## License

[MIT](https://github.com/wooorm/remark-lint/blob/master/LICENSE) © [Titus Wormer](http://wooorm.com)

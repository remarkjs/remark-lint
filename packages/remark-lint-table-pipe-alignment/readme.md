<!--This file is generated-->

# remark-lint-table-pipe-alignment

Warn when table pipes are not aligned.

## Install

```sh
npm install --save remark-lint-table-pipe-alignment
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
| A | B |
| -- | -- |
| Alpha | Bravo |
```

```text
3:9-3:10: Misaligned table fence
3:17-3:18: Misaligned table fence
```

## License

[MIT](https://github.com/wooorm/remark-lint/blob/master/LICENSE) © [Titus Wormer](http://wooorm.com)

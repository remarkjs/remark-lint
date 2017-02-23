<!--This file is generated-->

# remark-lint-no-table-indentation

Warn when tables are indented.

## Install

```sh
npm install --save remark-lint-no-table-indentation
```

## Example

When this rule is turned on, the following file
`valid.md` is ok:

```markdown
Paragraph.

| A     | B     |
| ----- | ----- |
| Alpha | Bravo |
```

When this rule is turned on, the following file
`invalid.md` is **not** ok:

```markdown
Paragraph.

   | A     | B     |
   | ----- | ----- |
   | Alpha | Bravo |
```

```text
3:1-3:21: Do not indent table rows
5:1-5:21: Do not indent table rows
```

## License

[MIT](https://github.com/wooorm/remark-lint/blob/master/LICENSE) © [Titus Wormer](http://wooorm.com)

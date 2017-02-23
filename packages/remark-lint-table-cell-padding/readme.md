<!--This file is generated-->

# remark-lint-table-cell-padding

Warn when table cells are incorrectly padded.

Options: `string`, either `'consistent'`, `'padded'`, or `'compact'`,
default: `'consistent'`.

The default value, `consistent`, detects the first used cell padding
style, and will warn when a subsequent cells uses a different
style.

## Install

```sh
npm install --save remark-lint-table-cell-padding
```

## Example

When this rule is `'padded'`, the following file
`valid.md` is ok:

```markdown
<!--Also valid when `consistent`-->

| A     | B     |
| ----- | ----- |
| Alpha | Bravo |
```

When this rule is `'padded'`, the following file
`invalid.md` is **not** ok:

```markdown
| A    |    B |
| :----|----: |
| Alpha|Bravo |
```

```text
3:8: Cell should be padded
3:9: Cell should be padded
```

When this rule is `'compact'`, the following file
`valid.md` is ok:

```markdown
<!--Also valid when `consistent`-->

|A    |B    |
|-----|-----|
|Alpha|Bravo|
```

When this rule is `'compact'`, the following file
`invalid.md` is **not** ok:

```markdown
|A    |     B|
|:----|-----:|
|Alpha|Bravo |
```

```text
3:13: Cell should be compact
```

When this rule is turned on, the following file
`invalid.md` is **not** ok:

```markdown
<!--Always invalid-->

|   A    | B    |
|   -----| -----|
|   Alpha| Bravo|
```

```text
5:5: Cell should be padded with 1 space, not 3
5:10: Cell should be padded
5:17: Cell should be padded
```

When this rule is turned on, the following file
`empty-heading.md` is ok:

```markdown
<!-- Empty heading cells are always OK. -->

|       | Alpha   |
| ----- | ------- |
| Bravo | Charlie |
```

When this rule is turned on, the following file
`empty-body.md` is ok:

```markdown
<!-- Empty body cells are always OK. -->

| Alpha   | Bravo   |
| ------- | ------- |
| Charlie |         |
```

When `'invalid'` is passed in, the following error is given:

```text
1:1: Invalid table-cell-padding style `invalid`
```

## License

[MIT](https://github.com/wooorm/remark-lint/blob/master/LICENSE) © [Titus Wormer](http://wooorm.com)

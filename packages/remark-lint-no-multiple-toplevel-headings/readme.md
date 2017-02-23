<!--This file is generated-->

# remark-lint-no-multiple-toplevel-headings

Warn when multiple top-level headings are used.

Options: `number`, default: `1`.

## Install

```sh
npm install --save remark-lint-no-multiple-toplevel-headings
```

## Example

When this rule is `1`, the following file
`valid.md` is ok:

```markdown
# Foo

## Bar
```

When this rule is `1`, the following file
`invalid.md` is **not** ok:

```markdown
# Foo

# Bar
```

```text
3:1-3:6: Don’t use multiple top level headings (3:1)
```

## License

[MIT](https://github.com/wooorm/remark-lint/blob/master/LICENSE) © [Titus Wormer](http://wooorm.com)

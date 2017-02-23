<!--This file is generated-->

# remark-lint-no-emphasis-as-heading

Warn when emphasis (including strong), instead of a heading, introduces
a paragraph.

## Install

```sh
npm install --save remark-lint-no-emphasis-as-heading
```

## Example

When this rule is turned on, the following file
`valid.md` is ok:

```markdown
# Foo

Bar.
```

When this rule is turned on, the following file
`invalid.md` is **not** ok:

```markdown
*Foo*

Bar.

__Qux__

Quux.
```

```text
1:1-1:6: Don’t use emphasis to introduce a section, use a heading
5:1-5:8: Don’t use emphasis to introduce a section, use a heading
```

## License

[MIT](https://github.com/wooorm/remark-lint/blob/master/LICENSE) © [Titus Wormer](http://wooorm.com)

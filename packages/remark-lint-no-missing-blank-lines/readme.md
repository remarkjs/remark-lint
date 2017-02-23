<!--This file is generated-->

# remark-lint-no-missing-blank-lines

Warn when missing blank lines before a block node.

This rule can be configured to allow tight list items
without blank lines between their contents through
`exceptTightLists: true` (default: false).

## Install

```sh
npm install --save remark-lint-no-missing-blank-lines
```

## Example

When this rule is turned on, the following file
`valid.md` is ok:

```markdown
# Foo

## Bar

- Paragraph

  + List.

Paragraph.
```

When this rule is turned on, the following file
`invalid.md` is **not** ok:

```markdown
# Foo
## Bar

- Paragraph
  + List.

Paragraph.
```

```text
2:1-2:7: Missing blank line before block node
5:3-5:10: Missing blank line before block node
```

When this rule is `{ exceptTightLists: true }`, the following file
`tight.md` is **not** ok:

```markdown
# Foo
## Bar

- Paragraph
  + List.

Paragraph.
```

```text
2:1-2:7: Missing blank line before block node
```

## License

[MIT](https://github.com/wooorm/remark-lint/blob/master/LICENSE) © [Titus Wormer](http://wooorm.com)

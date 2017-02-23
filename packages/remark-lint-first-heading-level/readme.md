<!--This file is generated-->

# remark-lint-first-heading-level

Warn when the first heading has a level other than a specified value.

Options: `number`, default: `1`.

## Install

```sh
npm install --save remark-lint-first-heading-level
```

## Example

When this rule is `2`, the following file
`valid.md` is ok:

```markdown
## Bravo

Paragraph.
```

When this rule is `2`, the following file
`invalid.md` is **not** ok:

```markdown
# Bravo

Paragraph.
```

```text
1:1-1:8: First heading level should be `2`
```

When this rule is turned on, the following file
`valid.md` is ok:

```markdown
# The default is to expect a level one heading
```

When this rule is turned on, the following file
`invalid.md` is **not** ok:

```markdown
<!-- Also invalid by default. -->

## Bravo

Paragraph.
```

```text
3:1-3:9: First heading level should be `1`
```

## License

[MIT](https://github.com/wooorm/remark-lint/blob/master/LICENSE) © [Titus Wormer](http://wooorm.com)

<!--This file is generated-->

# remark-lint-hard-break-spaces

Warn when too many spaces are used to create a hard break.

## Install

```sh
npm install --save remark-lint-hard-break-spaces
```

## Example

When this rule is turned on, the following file
`valid.md` is ok:

```markdown
<!--Note: `·` represents ` `-->

Lorem ipsum··
dolor sit amet
```

When this rule is turned on, the following file
`invalid.md` is **not** ok:

```markdown
<!--Note: `·` represents ` `-->

Lorem ipsum···
dolor sit amet.
```

```text
3:12-4:1: Use two spaces for hard line breaks
```

## License

[MIT](https://github.com/wooorm/remark-lint/blob/master/LICENSE) © [Titus Wormer](http://wooorm.com)

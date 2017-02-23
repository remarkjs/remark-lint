<!--This file is generated-->

# remark-lint-final-definition

Warn when definitions are not placed at the end of the file.

## Install

```sh
npm install --save remark-lint-final-definition
```

## Example

When this rule is turned on, the following file
`valid.md` is ok:

```markdown
Paragraph.

[example]: http://example.com "Example Domain"
```

When this rule is turned on, the following file
`invalid.md` is **not** ok:

```markdown
Paragraph.

[example]: http://example.com "Example Domain"

Another paragraph.
```

```text
3:1-3:47: Move definitions to the end of the file (after the node at line `5`)
```

## License

[MIT](https://github.com/wooorm/remark-lint/blob/master/LICENSE) © [Titus Wormer](http://wooorm.com)

<!--This file is generated-->

# remark-lint-definition-spacing

Warn when consecutive white space is used in a definition.

## Install

```sh
npm install --save remark-lint-definition-spacing
```

## Example

When this rule is turned on, the following file
`valid.md` is ok:

```markdown
[example domain]: http://example.com "Example Domain"
```

When this rule is turned on, the following file
`invalid.md` is **not** ok:

```markdown
[example    domain]: http://example.com "Example Domain"
```

```text
1:1-1:57: Do not use consecutive white-space in definition labels
```

## License

[MIT](https://github.com/wooorm/remark-lint/blob/master/LICENSE) © [Titus Wormer](http://wooorm.com)

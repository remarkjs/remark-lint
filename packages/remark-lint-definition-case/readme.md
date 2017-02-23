<!--This file is generated-->

# remark-lint-definition-case

Warn when definition labels are not lower-case.

## Install

```sh
npm install --save remark-lint-definition-case
```

## Example

When this rule is turned on, the following file
`valid.md` is ok:

```markdown
[example]: http://example.com "Example Domain"
```

When this rule is turned on, the following file
`invalid.md` is **not** ok:

```markdown
[Example]: http://example.com "Example Domain"
```

```text
1:1-1:47: Do not use upper-case characters in definition labels
```

## License

[MIT](https://github.com/wooorm/remark-lint/blob/master/LICENSE) © [Titus Wormer](http://wooorm.com)

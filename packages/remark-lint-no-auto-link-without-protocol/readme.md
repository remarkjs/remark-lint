<!--This file is generated-->

# remark-lint-no-auto-link-without-protocol

Warn for angle-bracketed links without protocol.

## Install

```sh
npm install --save remark-lint-no-auto-link-without-protocol
```

## Example

When this rule is turned on, the following file
`valid.md` is ok:

```markdown
<http://www.example.com>
<mailto:foo@bar.com>
```

When this rule is turned on, the following file
`invalid.md` is **not** ok:

```markdown
<www.example.com>
<foo@bar.com>
```

```text
2:1-2:14: All automatic links must start with a protocol
```

## License

[MIT](https://github.com/wooorm/remark-lint/blob/master/LICENSE) © [Titus Wormer](http://wooorm.com)

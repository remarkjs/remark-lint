<!--This file is generated-->

# remark-lint-no-unused-definitions

Warn when unused definitions are found.

## Install

```sh
npm install --save remark-lint-no-unused-definitions
```

## Example

When this rule is turned on, the following file
`valid.md` is ok:

```markdown
[foo][]

[foo]: https://example.com
```

When this rule is turned on, the following file
`invalid.md` is **not** ok:

```markdown
[bar]: https://example.com
```

```text
1:1-1:27: Found unused definition
```

## License

[MIT](https://github.com/wooorm/remark-lint/blob/master/LICENSE) © [Titus Wormer](http://wooorm.com)

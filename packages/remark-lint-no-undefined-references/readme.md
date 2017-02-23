<!--This file is generated-->

# remark-lint-no-undefined-references

Warn when references to undefined definitions are found.

## Install

```sh
npm install --save remark-lint-no-undefined-references
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
[bar][]
```

```text
1:1-1:8: Found reference to undefined definition
```

## License

[MIT](https://github.com/wooorm/remark-lint/blob/master/LICENSE) © [Titus Wormer](http://wooorm.com)

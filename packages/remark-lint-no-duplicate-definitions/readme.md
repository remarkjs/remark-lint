<!--This file is generated-->

# remark-lint-no-duplicate-definitions

Warn when duplicate definitions are found.

## Install

```sh
npm install --save remark-lint-no-duplicate-definitions
```

## Example

When this rule is turned on, the following file
`valid.md` is ok:

```markdown
[foo]: bar
[baz]: qux
```

When this rule is turned on, the following file
`invalid.md` is **not** ok:

```markdown
[foo]: bar
[foo]: qux
```

```text
2:1-2:11: Do not use definitions with the same identifier (1:1)
```

## License

[MIT](https://github.com/wooorm/remark-lint/blob/master/LICENSE) © [Titus Wormer](http://wooorm.com)

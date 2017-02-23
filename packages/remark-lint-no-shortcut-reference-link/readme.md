<!--This file is generated-->

# remark-lint-no-shortcut-reference-link

Warn when shortcut reference links are used.

## Install

```sh
npm install --save remark-lint-no-shortcut-reference-link
```

## Example

When this rule is turned on, the following file
`valid.md` is ok:

```markdown
[foo][]

[foo]: http://foo.bar/baz
```

When this rule is turned on, the following file
`invalid.md` is **not** ok:

```markdown
[foo]

[foo]: http://foo.bar/baz
```

```text
1:1-1:6: Use the trailing [] on reference links
```

## License

[MIT](https://github.com/wooorm/remark-lint/blob/master/LICENSE) © [Titus Wormer](http://wooorm.com)

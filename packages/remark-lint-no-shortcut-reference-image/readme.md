<!--This file is generated-->

# remark-lint-no-shortcut-reference-image

Warn when shortcut reference images are used.

## Install

```sh
npm install --save remark-lint-no-shortcut-reference-image
```

## Example

When this rule is turned on, the following file
`valid.md` is ok:

```markdown
![foo][]

[foo]: http://foo.bar/baz.png
```

When this rule is turned on, the following file
`invalid.md` is **not** ok:

```markdown
![foo]

[foo]: http://foo.bar/baz.png
```

```text
1:1-1:7: Use the trailing [] on reference images
```

## License

[MIT](https://github.com/wooorm/remark-lint/blob/master/LICENSE) © [Titus Wormer](http://wooorm.com)

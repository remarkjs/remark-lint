<!--This file is generated-->

# remark-lint-no-duplicate-headings

Warn when duplicate headings are found.

## Install

```sh
npm install --save remark-lint-no-duplicate-headings
```

## Example

When this rule is turned on, the following file
`valid.md` is ok:

```markdown
# Foo

## Bar
```

When this rule is turned on, the following file
`invalid.md` is **not** ok:

```markdown
# Foo

## Foo

## [Foo](http://foo.com/bar)
```

```text
3:1-3:7: Do not use headings with similar content (1:1)
5:1-5:29: Do not use headings with similar content (3:1)
```

## License

[MIT](https://github.com/wooorm/remark-lint/blob/master/LICENSE) © [Titus Wormer](http://wooorm.com)

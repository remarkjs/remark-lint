<!--This file is generated-->

# remark-lint-link-title-style

Warn when link and definition titles occur with incorrect quotes.

Options: `string`, either `'consistent'`, `'"'`, `'\''`, or
`'()'`, default: `'consistent'`.

The default value, `consistent`, detects the first used quote
style, and will warn when a subsequent titles use a different
style.

## Install

```sh
npm install --save remark-lint-link-title-style
```

## Example

When this rule is `'"'`, the following file
`valid.md` is ok:

```markdown
<!--Also valid when `consistent`-->

[Example](http://example.com "Example Domain")
[Example](http://example.com "Example Domain")
```

When this rule is `'"'`, the following file
`invalid.md` is **not** ok:

```markdown
[Example]: http://example.com 'Example Domain'
```

```text
1:47: Titles should use `"` as a quote
```

When this rule is `'\''`, the following file
`valid.md` is ok:

```markdown
<!--Also valid when `consistent`-->

![Example](http://example.com/image.png 'Example Domain')
![Example](http://example.com/image.png 'Example Domain')
```

When this rule is `'()'`, the following file
`valid.md` is ok:

```markdown
<!--Also valid when `consistent`-->

[Example](http://example.com (Example Domain) )
[Example](http://example.com (Example Domain) )
```

When this rule is `'()'`, the following file
`invalid.md` is **not** ok:

```markdown
<!--Always invalid-->

[Example](http://example.com (Example Domain))
[Example](http://example.com 'Example Domain')
```

```text
4:46: Titles should use `()` as a quote
```

When this rule is turned on, the following file
`invalid.md` is **not** ok:

```markdown
<!--Always invalid-->

[Example](http://example.com "Example Domain")
[Example](http://example.com#without-title)
[Example](http://example.com 'Example Domain')
```

```text
5:46: Titles should use `"` as a quote
```

When `'.'` is passed in, the following error is given:

```text
1:1: Invalid link title style marker `.`: use either `'consistent'`, `'"'`, `'\''`, or `'()'`
```

## License

[MIT](https://github.com/wooorm/remark-lint/blob/master/LICENSE) © [Titus Wormer](http://wooorm.com)

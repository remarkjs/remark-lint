<!--This file is generated-->

# remark-lint-no-empty-url

Warn for empty URLs in links and images.

## Install

```sh
npm install --save remark-lint-no-empty-url
```

## Example

When this rule is turned on, the following file
`valid.md` is ok:

```markdown
[alpha](http://bravo.com).

![charlie](http://delta.com/echo.png "foxtrott").
```

When this rule is turned on, the following file
`invalid.md` is **not** ok:

```markdown
[golf]().

![hotel]().
```

```text
1:1-1:9: Don’t use links without URL
3:1-3:11: Don’t use images without URL
```

## License

[MIT](https://github.com/wooorm/remark-lint/blob/master/LICENSE) © [Titus Wormer](http://wooorm.com)

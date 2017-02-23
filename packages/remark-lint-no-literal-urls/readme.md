<!--This file is generated-->

# remark-lint-no-literal-urls

Warn when URLs without angle-brackets are used.

## Install

```sh
npm install --save remark-lint-no-literal-urls
```

## Example

When this rule is turned on, the following file
`valid.md` is ok:

```markdown
<http://foo.bar/baz>
<mailto:qux@quux.com>
```

When this rule is turned on, the following file
`invalid.md` is **not** ok:

```markdown
http://foo.bar/baz

mailto:qux@quux.com
```

```text
1:1-1:19: Don’t use literal URLs without angle brackets
```

## License

[MIT](https://github.com/wooorm/remark-lint/blob/master/LICENSE) © [Titus Wormer](http://wooorm.com)

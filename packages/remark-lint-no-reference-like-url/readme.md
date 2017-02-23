<!--This file is generated-->

# remark-lint-no-reference-like-url

Warn when URLs are also defined identifiers.

## Install

```sh
npm install --save remark-lint-no-reference-like-url
```

## Example

When this rule is turned on, the following file
`valid.md` is ok:

```markdown
[Alpha](http://example.com).

[bravo]: https://example.com
```

When this rule is turned on, the following file
`invalid.md` is **not** ok:

```markdown
[Charlie](delta).

[delta]: https://example.com
```

```text
1:1-1:17: Did you mean to use `[delta]` instead of `(delta)`, a reference?
```

## License

[MIT](https://github.com/wooorm/remark-lint/blob/master/LICENSE) © [Titus Wormer](http://wooorm.com)

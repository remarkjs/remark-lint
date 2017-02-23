<!--This file is generated-->

# remark-lint-no-html

Warn when HTML nodes are used.

Ignores comments, because they are used by this tool, remark, and
because markdown doesn’t have native comments.

## Install

```sh
npm install --save remark-lint-no-html
```

## Example

When this rule is turned on, the following file
`valid.md` is ok:

```markdown
# Hello

<!--Comments are also OK-->
```

When this rule is turned on, the following file
`invalid.md` is **not** ok:

```markdown
<h1>Hello</h1>
```

```text
1:1-1:15: Do not use HTML in markdown
```

## License

[MIT](https://github.com/wooorm/remark-lint/blob/master/LICENSE) © [Titus Wormer](http://wooorm.com)

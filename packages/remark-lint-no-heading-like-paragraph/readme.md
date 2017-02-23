<!--This file is generated-->

# remark-lint-no-heading-like-paragraph

Warn for h7+ “headings”.

## Install

```sh
npm install --save remark-lint-no-heading-like-paragraph
```

## Example

When this rule is turned on, the following file
`valid.md` is ok:

```markdown
###### Alpha

Bravo.
```

When this rule is turned on, the following file
`invalid.md` is **not** ok:

```markdown
####### Charlie

Delta.
```

```text
1:1-1:16: This looks like a heading but has too many hashes
```

## License

[MIT](https://github.com/wooorm/remark-lint/blob/master/LICENSE) © [Titus Wormer](http://wooorm.com)

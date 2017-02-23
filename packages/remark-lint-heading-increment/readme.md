<!--This file is generated-->

# remark-lint-heading-increment

Warn when headings increment with more than 1 level at a time.

## Install

```sh
npm install --save remark-lint-heading-increment
```

## Example

When this rule is turned on, the following file
`valid.md` is ok:

```markdown
# Alpha

## Bravo
```

When this rule is turned on, the following file
`invalid.md` is **not** ok:

```markdown
# Charlie

### Delta
```

```text
3:1-3:10: Heading levels should increment by one level at a time
```

## License

[MIT](https://github.com/wooorm/remark-lint/blob/master/LICENSE) © [Titus Wormer](http://wooorm.com)

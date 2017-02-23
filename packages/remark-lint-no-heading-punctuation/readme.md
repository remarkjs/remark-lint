<!--This file is generated-->

# remark-lint-no-heading-punctuation

Warn when a heading ends with a a group of characters.
Defaults to `'.,;:!?'`.

Options: `string`, default: `'.,;:!?'`.

Note that these are added to a regex, in a group (`'[' + char + ']'`),
be careful for escapes and dashes.

## Install

```sh
npm install --save remark-lint-no-heading-punctuation
```

## Example

When this rule is turned on, the following file
`valid.md` is ok:

```markdown
# Hello
```

When this rule is turned on, the following file
`invalid.md` is **not** ok:

```markdown
# Hello:

# Hello?

# Hello!

# Hello,

# Hello;
```

```text
1:1-1:9: Don’t add a trailing `:` to headings
3:1-3:9: Don’t add a trailing `?` to headings
5:1-5:9: Don’t add a trailing `!` to headings
7:1-7:9: Don’t add a trailing `,` to headings
9:1-9:9: Don’t add a trailing `;` to headings
```

When this rule is `',;:!?'`, the following file
`valid.md` is ok:

```markdown
# Hello...
```

## License

[MIT](https://github.com/wooorm/remark-lint/blob/master/LICENSE) © [Titus Wormer](http://wooorm.com)

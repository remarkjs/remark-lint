<!--This file is generated-->

# remark-lint-blockquote-indentation

Warn when blockquotes are either indented too much or too little.

Options: `number`, default: `'consistent'`.

The default value, `consistent`, detects the first used indentation
and will warn when other blockquotes use a different indentation.

## Install

```sh
npm install --save remark-lint-blockquote-indentation
```

## Example

When this rule is `2`, the following file
`valid.md` is ok:

```markdown
<!--This file is also valid by default-->

> Hello

Paragraph.

> World
```

When this rule is `4`, the following file
`valid.md` is ok:

```markdown
<!--This file is also valid by default-->

>   Hello

Paragraph.

>   World
```

When this rule is turned on, the following file
`invalid.md` is **not** ok:

```markdown
>  Hello

Paragraph.

>   World

Paragraph.

> World
```

```text
5:3: Remove 1 space between blockquote and content
9:3: Add 1 space between blockquote and content
```

## License

[MIT](https://github.com/wooorm/remark-lint/blob/master/LICENSE) © [Titus Wormer](http://wooorm.com)

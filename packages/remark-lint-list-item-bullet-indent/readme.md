<!--This file is generated-->

# remark-lint-list-item-bullet-indent

Warn when list item bullets are indented.

## Install

```sh
npm install --save remark-lint-list-item-bullet-indent
```

## Example

When this rule is turned on, the following file
`valid.md` is ok:

```markdown
Paragraph.

* List item
* List item
```

When this rule is turned on, the following file
`invalid.md` is **not** ok:

```markdown
Paragraph.

 * List item
 * List item
```

```text
3:3: Incorrect indentation before bullet: remove 1 space
4:3: Incorrect indentation before bullet: remove 1 space
```

## License

[MIT](https://github.com/wooorm/remark-lint/blob/master/LICENSE) © [Titus Wormer](http://wooorm.com)

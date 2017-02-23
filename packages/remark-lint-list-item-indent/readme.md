<!--This file is generated-->

# remark-lint-list-item-indent

Warn when the spacing between a list item’s bullet and its content
violates a given style.

Options: `string`, either `'tab-size'`, `'mixed'`, or `'space'`,
default: `'tab-size'`.

## Install

```sh
npm install --save remark-lint-list-item-indent
```

## Example

When this rule is turned on, the following file
`valid.md` is ok:

```markdown
The below style is called `tab-size`.

*   List
    item.

Paragraph.

11. List
    item.

Paragraph.

*   List
    item.

*   List
    item.
```

When this rule is `'mixed'`, the following file
`valid.md` is ok:

```markdown
* List item.

Paragraph.

11. List item

Paragraph.

*   List
    item.

*   List
    item.
```

When this rule is `'mixed'`, the following file
`invalid.md` is **not** ok:

```markdown
*   List item.
```

```text
1:5: Incorrect list-item indent: remove 2 spaces
```

When this rule is `'space'`, the following file
`valid.md` is ok:

```markdown
* List item.

Paragraph.

11. List item

Paragraph.

* List
  item.

* List
  item.
```

When this rule is `'space'`, the following file
`invalid.md` is **not** ok:

```markdown
*   List
    item.
```

```text
1:5: Incorrect list-item indent: remove 2 spaces
```

When this rule is `'tab-size'`, the following file
`invalid.md` is **not** ok:

```markdown
* List
  item.
```

```text
1:3: Incorrect list-item indent: add 2 spaces
```

When `'invalid'` is passed in, the following error is given:

```text
1:1: Invalid list-item indent style `invalid`: use either `'tab-size'`, `'space'`, or `'mixed'`
```

## License

[MIT](https://github.com/wooorm/remark-lint/blob/master/LICENSE) © [Titus Wormer](http://wooorm.com)

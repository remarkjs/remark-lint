<!--This file is generated-->

# remark-lint-checkbox-character-style

Warn when list item checkboxes violate a given style.

The default value, `consistent`, detects the first used checked
and unchecked checkbox styles, and will warn when a subsequent
checkboxes use a different style.

These values can also be passed in as an object, such as:

```js
{checked: 'x', unchecked: ' '}
```

## Install

```sh
npm install --save remark-lint-checkbox-character-style
```

## Example

When this rule is `{ checked: 'x' }`, the following file
`valid.md` is ok:

```markdown
<!--This file is also valid by default-->

- [x] List item
- [x] List item
```

When this rule is `{ checked: 'X' }`, the following file
`valid.md` is ok:

```markdown
<!--This file is also valid by default-->

- [X] List item
- [X] List item
```

When this rule is `{ unchecked: ' ' }`, the following file
`valid.md` is ok:

```markdown
<!--This file is also valid by default-->

- [ ] List item
- [ ] List item
- [ ]··
- [ ]
```

When this rule is `{ unchecked: '\t' }`, the following file
`valid.md` is ok:

```markdown
<!--Also valid by default (note: `»` represents `\t`)-->

- [»] List item
- [»] List item
```

When this rule is turned on, the following file
`invalid.md` is **not** ok:

```markdown
<!--Note: `»` represents `\t`-->

- [x] List item
- [X] List item
- [ ] List item
- [»] List item
```

```text
4:4-4:5: Checked checkboxes should use `x` as a marker
6:4-6:5: Unchecked checkboxes should use ` ` as a marker
```

When `{ unchecked: '!' }` is passed in, the following error is given:

```text
1:1: Invalid unchecked checkbox marker `!`: use either `'\t'`, or `' '`
```

When `{ checked: '!' }` is passed in, the following error is given:

```text
1:1: Invalid checked checkbox marker `!`: use either `'x'`, or `'X'`
```

## License

[MIT](https://github.com/wooorm/remark-lint/blob/master/LICENSE) © [Titus Wormer](http://wooorm.com)

<!--This file is generated-->

# remark-lint-ordered-list-marker-value

Warn when the list-item marker values of ordered lists violate a
given style.

Options: `string`, either `'single'`, `'one'`, or `'ordered'`,
default: `'ordered'`.

When set to `'ordered'`, list-item bullets should increment by one,
relative to the starting point.  When set to `'single'`, bullets should
be the same as the relative starting point.  When set to `'one'`, bullets
should always be `1`.

## Install

```sh
npm install --save remark-lint-ordered-list-marker-value
```

## Example

When this rule is turned on, the following file
`valid.md` is ok:

```markdown
The default value is `ordered`, so unless changed, the below
is OK.

1.  Foo
2.  Bar
3.  Baz

Paragraph.

3.  Alpha
4.  Bravo
5.  Charlie

Unordered lists are not affected by this rule.

*   Anton
```

When this rule is `'one'`, the following file
`valid.md` is ok:

```markdown
1.  Foo
1.  Bar
1.  Baz

Paragraph.

1.  Alpha
1.  Bravo
1.  Charlie
```

When this rule is `'one'`, the following file
`invalid.md` is **not** ok:

```markdown
1.  Foo
2.  Bar
```

```text
2:1-2:8: Marker should be `1`, was `2`
```

When this rule is `'single'`, the following file
`valid.md` is ok:

```markdown
1.  Foo
1.  Bar
1.  Baz

Paragraph.

3.  Alpha
3.  Bravo
3.  Charlie
```

When this rule is `'ordered'`, the following file
`valid.md` is ok:

```markdown
1.  Foo
2.  Bar
3.  Baz

Paragraph.

3.  Alpha
4.  Bravo
5.  Charlie
```

When this rule is `'ordered'`, the following file
`invalid.md` is **not** ok:

```markdown
1.  Foo
1.  Bar
```

```text
2:1-2:8: Marker should be `2`, was `1`
```

When `'invalid'` is passed in, the following error is given:

```text
1:1: Invalid ordered list-item marker value `invalid`: use either `'ordered'` or `'one'`
```

## License

[MIT](https://github.com/wooorm/remark-lint/blob/master/LICENSE) © [Titus Wormer](http://wooorm.com)

<!--This file is generated-->

# remark-lint-ordered-list-marker-style

Warn when the list-item marker style of ordered lists violate a given
style.

Options: `string`, either `'consistent'`, `'.'`, or `')'`,
default: `'consistent'`.

Note that `)` is only supported in CommonMark.

The default value, `consistent`, detects the first used list
style, and will warn when a subsequent list uses a different
style.

## Install

```sh
npm install --save remark-lint-ordered-list-marker-style
```

## Example

When this rule is turned on, the following file
`valid.md` is ok:

```markdown
By default (`consistent`), if one style used throughout the file,
that’s OK.

1.  Foo


1.  Bar

Unordered lists are not affected by this rule.

* Foo
```

When this rule is turned on, the following file
`invalid.md` is **not** ok:

```markdown
1.  Foo

2)  Bar
```

```text
3:1-3:8: Marker style should be `.`
```

When this rule is `'.'`, the following file
`valid.md` is ok:

```markdown
1.  Foo

2.  Bar
```

When this rule is `')'`, the following file
`valid.md` is ok:

```markdown
<!-- This is also valid when `consistent`.
     But it does require commonmark. -->

1)  Foo

2)  Bar
```

When `'!'` is passed in, the following error is given:

```text
1:1: Invalid ordered list-item marker style `!`: use either `'.'` or `')'`
```

## License

[MIT](https://github.com/wooorm/remark-lint/blob/master/LICENSE) © [Titus Wormer](http://wooorm.com)

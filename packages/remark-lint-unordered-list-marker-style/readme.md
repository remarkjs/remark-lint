<!--This file is generated-->

# remark-lint-unordered-list-marker-style

Warn when the list-item marker style of unordered lists violate a given
style.

Options: `string`, either `'consistent'`, `'-'`, `'*'`, or `'*'`,
default: `'consistent'`.

The default value, `consistent`, detects the first used list
style, and will warn when a subsequent list uses a different
style.

## Install

```sh
npm install --save remark-lint-unordered-list-marker-style
```

## Example

When this rule is turned on, the following file
`valid.md` is ok:

```markdown
By default (`consistent`), if the file uses only one marker,
that’s OK.

* Foo
* Bar
* Baz

Ordered lists are not affected.

1. Foo
2. Bar
3. Baz
```

When this rule is turned on, the following file
`invalid.md` is **not** ok:

```markdown
* Foo
- Bar
+ Baz
```

```text
2:1-2:6: Marker style should be `*`
3:1-3:6: Marker style should be `*`
```

When this rule is `'*'`, the following file
`valid.md` is ok:

```markdown
* Foo
```

When this rule is `'-'`, the following file
`valid.md` is ok:

```markdown
- Foo
```

When this rule is `'+'`, the following file
`valid.md` is ok:

```markdown
+ Foo
```

When `'!'` is passed in, the following error is given:

```text
1:1: Invalid unordered list-item marker style `!`: use either `'-'`, `'*'`, or `'+'`
```

## License

[MIT](https://github.com/wooorm/remark-lint/blob/master/LICENSE) © [Titus Wormer](http://wooorm.com)

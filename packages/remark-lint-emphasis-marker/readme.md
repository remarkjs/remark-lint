<!--This file is generated-->

# remark-lint-emphasis-marker

Warn for violating emphasis markers.

Options: `string`, either `'consistent'`, `'*'`, or `'_'`,
default: `'consistent'`.

The default value, `consistent`, detects the first used emphasis
style, and will warn when a subsequent emphasis uses a different
style.

## Install

```sh
npm install --save remark-lint-emphasis-marker
```

## Example

When this rule is `'*'`, the following file
`valid.md` is ok:

```markdown
*foo*
```

When this rule is `'*'`, the following file
`invalid.md` is **not** ok:

```markdown
_foo_
```

```text
1:1-1:6: Emphasis should use `*` as a marker
```

When this rule is `'_'`, the following file
`valid.md` is ok:

```markdown
_foo_
```

When this rule is `'_'`, the following file
`invalid.md` is **not** ok:

```markdown
*foo*
```

```text
1:1-1:6: Emphasis should use `_` as a marker
```

When this rule is `'consistent'`, the following file
`invalid.md` is **not** ok:

```markdown
<!-- This is never valid -->

*foo*
_bar_
```

```text
4:1-4:6: Emphasis should use `*` as a marker
```

When `'invalid'` is passed in, the following error is given:

```text
1:1: Invalid emphasis marker `invalid`: use either `'consistent'`, `'*'`, or `'_'`
```

## License

[MIT](https://github.com/wooorm/remark-lint/blob/master/LICENSE) © [Titus Wormer](http://wooorm.com)

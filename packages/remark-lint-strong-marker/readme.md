<!--This file is generated-->

# remark-lint-strong-marker

Warn for violating strong markers.

Options: `string`, either `'consistent'`, `'*'`, or `'_'`,
default: `'consistent'`.

The default value, `consistent`, detects the first used strong
style, and will warn when a subsequent strong uses a different
style.

## Install

```sh
npm install --save remark-lint-strong-marker
```

## Example

When this rule is turned on, the following file
`valid.md` is ok:

```markdown
**foo** and **bar**.
```

When this rule is turned on, the following file
`also-valid.md` is ok:

```markdown
__foo__ and __bar__.
```

When this rule is turned on, the following file
`invalid.md` is **not** ok:

```markdown
**foo** and __bar__.
```

```text
1:13-1:20: Strong should use `*` as a marker
```

When this rule is `'*'`, the following file
`valid.md` is ok:

```markdown
**foo**.
```

When this rule is `'_'`, the following file
`valid.md` is ok:

```markdown
__foo__.
```

When `'!'` is passed in, the following error is given:

```text
1:1: Invalid strong marker `!`: use either `'consistent'`, `'*'`, or `'_'`
```

## License

[MIT](https://github.com/wooorm/remark-lint/blob/master/LICENSE) © [Titus Wormer](http://wooorm.com)

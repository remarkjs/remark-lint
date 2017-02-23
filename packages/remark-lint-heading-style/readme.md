<!--This file is generated-->

# remark-lint-heading-style

Warn when a heading does not conform to a given style.

Options: `string`, either `'consistent'`, `'atx'`, `'atx-closed'`,
or `'setext'`, default: `'consistent'`.

The default value, `consistent`, detects the first used heading
style, and will warn when a subsequent heading uses a different
style.

## Install

```sh
npm install --save remark-lint-heading-style
```

## Example

When this rule is `'atx'`, the following file
`valid.md` is ok:

```markdown
<!--Also valid when `consistent`-->

# Alpha

## Bravo

### Charlie
```

When this rule is `'atx-closed'`, the following file
`valid.md` is ok:

```markdown
<!--Also valid when `consistent`-->

# Delta ##

## Echo ##

### Foxtrot ###
```

When this rule is `'setext'`, the following file
`valid.md` is ok:

```markdown
<!--Also valid when `consistent`-->

Golf
====

Hotel
-----

### India
```

When this rule is turned on, the following file
`invalid.md` is **not** ok:

```markdown
<!--Always invalid.-->

Juliett
=======

## Kilo

### Lima ###
```

```text
6:1-6:8: Headings should use setext
8:1-8:13: Headings should use setext
```

## License

[MIT](https://github.com/wooorm/remark-lint/blob/master/LICENSE) © [Titus Wormer](http://wooorm.com)

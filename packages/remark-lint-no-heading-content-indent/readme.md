<!--This file is generated-->

# remark-lint-no-heading-content-indent

Warn when a heading’s content is indented.

## Install

```sh
npm install --save remark-lint-no-heading-content-indent
```

## Example

When this rule is turned on, the following file
`valid.md` is ok:

```markdown
<!-- Note: the middle-dots represent spaces -->

#·Foo

## Bar·##

  ##·Baz

Setext headings are not affected.

Baz
===
```

When this rule is turned on, the following file
`invalid.md` is **not** ok:

```markdown
<!-- Note: the middle-dots represent spaces -->

#··Foo

## Bar··##

  ##··Baz
```

```text
3:4: Remove 1 space before this heading’s content
5:7: Remove 1 space after this heading’s content
7:7: Remove 1 space before this heading’s content
```

When this rule is turned on, the following file
`empty-heading.md` is ok:

```markdown
#··
```

When this rule is turned on, the following file
`tight.md` is **not** ok:

```markdown
In pedantic mode, headings without spacing can also be detected:

##No spacing left, too much right··##
```

```text
3:3: Add 1 space before this heading’s content
3:34: Remove 1 space after this heading’s content
```

## License

[MIT](https://github.com/wooorm/remark-lint/blob/master/LICENSE) © [Titus Wormer](http://wooorm.com)

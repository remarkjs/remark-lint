<!--This file is generated-->

# remark-lint-no-heading-indent

Warn when a heading is indented.

## Install

```sh
npm install --save remark-lint-no-heading-indent
```

## Example

When this rule is turned on, the following file
`valid.md` is ok:

```markdown
<!-- Note: the middle-dots represent spaces -->

#·Hello world

Foo
-----

#·Hello world·#

Bar
=====
```

When this rule is turned on, the following file
`invalid.md` is **not** ok:

```markdown
<!-- Note: the middle-dots represent spaces -->

···# Hello world

·Foo
-----

·# Hello world #

···Bar
=====
```

```text
3:4: Remove 3 spaces before this heading
5:2: Remove 1 space before this heading
8:2: Remove 1 space before this heading
10:4: Remove 3 spaces before this heading
```

## License

[MIT](https://github.com/wooorm/remark-lint/blob/master/LICENSE) © [Titus Wormer](http://wooorm.com)

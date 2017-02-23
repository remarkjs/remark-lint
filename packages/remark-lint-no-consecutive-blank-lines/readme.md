<!--This file is generated-->

# remark-lint-no-consecutive-blank-lines

Warn for too many consecutive blank lines.  Knows about the extra line
needed between a list and indented code, and two lists.

## Install

```sh
npm install --save remark-lint-no-consecutive-blank-lines
```

## Example

When this rule is turned on, the following file
`valid.md` is ok:

```markdown
Foo...

...Bar.
```

When this rule is turned on, the following file
`valid-for-code.md` is ok:

```markdown
Paragraph.

*   List


    bravo();
```

When this rule is turned on, the following file
`invalid.md` is **not** ok:

```markdown
Foo...


...Bar.
```

```text
4:1: Remove 1 line before node
```

## License

[MIT](https://github.com/wooorm/remark-lint/blob/master/LICENSE) © [Titus Wormer](http://wooorm.com)

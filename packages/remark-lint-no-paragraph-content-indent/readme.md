<!--This file is generated-->

# remark-lint-no-paragraph-content-indent

Warn when warn when the content in paragraphs are indented.

## Install

```sh
npm install --save remark-lint-no-paragraph-content-indent
```

## Example

When this rule is turned on, the following file
`valid.md` is ok:

```markdown
Alpha

Bravo
Charlie.
**Delta**.

*   Echo
    Foxtrot.

> Golf
> Hotel.
```

When this rule is turned on, the following file
`invalid.md` is **not** ok:

```markdown
<!--Note: `·` represents ` `-->

·Alpha

Bravo
·Charlie.
**·Delta**.

*   Echo
    ·Foxtrot.

> Golf
> ·Hotel.
```

```text
3:1: Expected no indentation in paragraph content
6:1: Expected no indentation in paragraph content
7:3: Expected no indentation in paragraph content
10:5: Expected no indentation in paragraph content
13:3: Expected no indentation in paragraph content
```

## License

[MIT](https://github.com/wooorm/remark-lint/blob/master/LICENSE) © [Titus Wormer](http://wooorm.com)

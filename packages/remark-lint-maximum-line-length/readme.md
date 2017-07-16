<!--This file is generated-->

# remark-lint-maximum-line-length

Warn when lines are too long.

Options: `number`, default: `80`.

Ignores nodes which cannot be wrapped, such as headings, tables,
code, link, images, and definitions.

## Install

```sh
npm install --save remark-lint-maximum-line-length
```

## Example

When this rule is `80`, the following file
`invalid.md` is **not** ok:

```markdown
This line is simply not tooooooooooooooooooooooooooooooooooooooooooooooooooooooo
long.

Just like thiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiis one.

And this one is also very wrong: because the link starts aaaaaaafter the column: <http://line.com>

<http://this-long-url-with-a-long-domain-is-invalid.co.uk/a-long-path?query=variables> and such.
```

```text
4:86: Line must be at most 80 characters
6:99: Line must be at most 80 characters
8:97: Line must be at most 80 characters
```

When this rule is turned on, the following file
`valid.md` is ok:

```markdown
This line is simply not toooooooooooooooooooooooooooooooooooooooooooo
long.

This is also fine: <http://this-long-url-with-a-long-domain.co.uk/a-long-path?query=variables>

<http://this-link-is-fine.com>

[foo](http://this-long-url-with-a-long-domain-is-valid.co.uk/a-long-path?query=variables)

<http://this-long-url-with-a-long-domain-is-valid.co.uk/a-long-path?query=variables>

![foo](http://this-long-url-with-a-long-domain-is-valid.co.uk/a-long-path?query=variables)

| An | exception | is | line | length | in | long | tables | because | those | can’t | just |
| -- | --------- | -- | ---- | ------ | -- | ---- | ------ | ------- | ----- | ----- | ---- |
| be | helped    |    |      |        |    |      |        |         |       |       | .    |

The following is also fine, because there is no white-space.

<http://this-long-url-with-a-long-domain-is-invalid.co.uk/a-long-path?query=variables>.

In addition, definitions are also fine:

[foo]: <http://this-long-url-with-a-long-domain-is-invalid.co.uk/a-long-path?query=variables>
```

## License

[MIT](https://github.com/wooorm/remark-lint/blob/master/LICENSE) © [Titus Wormer](http://wooorm.com)

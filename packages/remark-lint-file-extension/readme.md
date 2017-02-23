<!--This file is generated-->

# remark-lint-file-extension

Warn when the document’s extension differs from the given preferred
extension.

Does not warn when given documents have no file extensions (such as
`AUTHORS` or `LICENSE`).

Options: `string`, default: `'md'` — Expected file extension.

## Install

```sh
npm install --save remark-lint-file-extension
```

## Example

When this rule is turned on, the following file
`readme.md` is ok:

```markdown

```

When this rule is turned on, the following file
`readme` is ok:

```markdown

```

When turned on is passed in, the following error is given:

```text
1:1: Invalid extension: use `md`
```

When this rule is `'mkd'`, the following file
`readme.mkd` is ok:

```markdown

```

## License

[MIT](https://github.com/wooorm/remark-lint/blob/master/LICENSE) © [Titus Wormer](http://wooorm.com)

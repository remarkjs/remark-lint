<!--This file is generated-->

# remark-lint-no-file-name-irregular-characters

Warn when file names contain irregular characters: characters other
than alpha-numericals, dashes, and dots (full-stops).

Options: `RegExp` or `string`, default: `'\\.a-zA-Z0-9-'`.

If a string is given, it will be wrapped in
`new RegExp('[^' + preferred + ']')`.

Any match by the wrapped or given expressions triggers a
warning.

## Install

```sh
npm install --save remark-lint-no-file-name-irregular-characters
```

## Example

When this rule is turned on, the following file
`plug-ins.md` is ok:

```markdown

```

When this rule is turned on, the following file
`plugins.md` is ok:

```markdown

```

When turned on is passed in, the following error is given:

```text
1:1: Do not use `_` in a file name
```

When turned on is passed in, the following error is given:

```text
1:1: Do not use ` ` in a file name
```

When `'\\.a-z0-9'` is passed in, the following error is given:

```text
1:1: Do not use `R` in a file name
```

## License

[MIT](https://github.com/wooorm/remark-lint/blob/master/LICENSE) © [Titus Wormer](http://wooorm.com)

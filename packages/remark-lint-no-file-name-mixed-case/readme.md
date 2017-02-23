<!--This file is generated-->

# remark-lint-no-file-name-mixed-case

Warn when a file name uses mixed case: both upper- and lower case
characters.

## Install

```sh
npm install --save remark-lint-no-file-name-mixed-case
```

## Example

When this rule is turned on, the following file
`README.md` is ok:

```markdown

```

When this rule is turned on, the following file
`readme.md` is ok:

```markdown

```

When turned on is passed in, the following error is given:

```text
1:1: Do not mix casing in file names
```

## License

[MIT](https://github.com/wooorm/remark-lint/blob/master/LICENSE) © [Titus Wormer](http://wooorm.com)

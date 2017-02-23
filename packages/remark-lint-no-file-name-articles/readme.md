<!--This file is generated-->

# remark-lint-no-file-name-articles

Warn when file name start with an article.

## Install

```sh
npm install --save remark-lint-no-file-name-articles
```

## Example

When this rule is turned on, the following file
`title.md` is ok:

```markdown

```

When turned on is passed in, the following error is given:

```text
1:1: Do not start file names with `a`
```

When turned on is passed in, the following error is given:

```text
1:1: Do not start file names with `the`
```

When turned on is passed in, the following error is given:

```text
1:1: Do not start file names with `teh`
```

When turned on is passed in, the following error is given:

```text
1:1: Do not start file names with `an`
```

## License

[MIT](https://github.com/wooorm/remark-lint/blob/master/LICENSE) © [Titus Wormer](http://wooorm.com)

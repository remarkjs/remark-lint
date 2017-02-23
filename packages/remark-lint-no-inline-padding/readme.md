<!--This file is generated-->

# remark-lint-no-inline-padding

Warn when inline nodes are padded with spaces between markers and
content.

Warns for emphasis, strong, delete, image, and link.

## Install

```sh
npm install --save remark-lint-no-inline-padding
```

## Example

When this rule is turned on, the following file
`valid.md` is ok:

```markdown
Alpha, *bravo*, _charlie_, [delta](http://echo.fox/trot)
```

When this rule is turned on, the following file
`invalid.md` is **not** ok:

```markdown
Alpha, * bravo *, _ charlie _, [ delta ](http://echo.fox/trot)
```

```text
1:8-1:17: Don’t pad `emphasis` with inner spaces
1:19-1:30: Don’t pad `emphasis` with inner spaces
1:32-1:63: Don’t pad `link` with inner spaces
```

## License

[MIT](https://github.com/wooorm/remark-lint/blob/master/LICENSE) © [Titus Wormer](http://wooorm.com)

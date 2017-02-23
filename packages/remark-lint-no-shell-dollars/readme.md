<!--This file is generated-->

# remark-lint-no-shell-dollars

Warn when shell code is prefixed by dollar-characters.

Ignored indented code blocks and fenced code blocks without language
flag.

## Install

```sh
npm install --save remark-lint-no-shell-dollars
```

## Example

When this rule is turned on, the following file
`valid.md` is ok:

````markdown
        ```sh
        echo a
        echo a > file
        ```

        ```zsh
        $ echo a
        a
        $ echo a > file
        ```

        It’s fine to use dollars in non-shell code.

        ```js
        $('div').remove();
        ```
````

When this rule is turned on, the following file
`invalid.md` is **not** ok:

````markdown
        ```bash
        $ echo a
        $ echo a > file
        ```
````

```text
1:1-4:4: Do not use dollar signs before shell-commands
```

## License

[MIT](https://github.com/wooorm/remark-lint/blob/master/LICENSE) © [Titus Wormer](http://wooorm.com)

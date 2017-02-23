<!--This file is generated-->

# remark-lint-fenced-code-marker

Warn for violating fenced code markers.

Options: `string`, either ``'`'``, or `'~'`, default: `'consistent'`.

The default value, `consistent`, detects the first used fenced code
marker style, and will warn when a subsequent fenced code uses a
different style.

## Install

```sh
npm install --save remark-lint-fenced-code-marker
```

## Example

When this rule is turned on, the following file
`valid.md` is ok:

```markdown
Indented code blocks are not affected by this rule:

    bravo();
```

When this rule is turned on, the following file
`invalid.md` is **not** ok:

````markdown
        <!-- This is always invalid. -->

        ```alpha
        bravo();
        ```

        ~~~
        charlie();
        ~~~
````

```text
7:1-9:4: Fenced code should use ` as a marker
```

When this rule is ``'`'``, the following file
`valid.md` is ok:

````markdown
        <!-- This is also valid by default. -->

        ```alpha
        bravo();
        ```

        ```
        charlie();
        ```
````

When this rule is `'~'`, the following file
`valid.md` is ok:

```markdown
        <!-- This is also valid by default. -->

        ~~~alpha
        bravo();
        ~~~

        ~~~
        charlie();
        ~~~
```

When `'!'` is passed in, the following error is given:

```text
1:1: Invalid fenced code marker `!`: use either `'consistent'`, `` '`' ``, or `'~'`
```

## License

[MIT](https://github.com/wooorm/remark-lint/blob/master/LICENSE) © [Titus Wormer](http://wooorm.com)

<!--This file is generated-->

# remark-lint-code-block-style

Warn when code-blocks do not adhere to a given style.

Options: `string`, either `'consistent'`, `'fenced'`, or `'indented'`,
default: `'consistent'`.

The default value, `consistent`, detects the first used code-block
style, and will warn when a subsequent code-block uses a different
style.

## Install

```sh
npm install --save remark-lint-code-block-style
```

## Example

When this rule is `'indented'`, the following file
`valid.md` is ok:

```markdown
<!-- This is also valid when `'consistent'` -->

    alpha();

Paragraph.

    bravo();
```

When this rule is `'indented'`, the following file
`invalid.md` is **not** ok:

````markdown
        ```
        alpha();
        ```

        Paragraph.

        ```
        bravo();
        ```
````

```text
1:1-3:4: Code blocks should be indented
7:1-9:4: Code blocks should be indented
```

When this rule is `'fenced'`, the following file
`valid.md` is ok:

````markdown
        <!-- This is also valid when `'consistent'` -->

        ```
        alpha();
        ```

        Paragraph.

        ```
        bravo();
        ```
````

When this rule is `'fenced'`, the following file
`invalid.md` is **not** ok:

```markdown
    alpha();

Paragraph.

    bravo();
```

```text
1:1-1:13: Code blocks should be fenced
5:1-5:13: Code blocks should be fenced
```

When this rule is turned on, the following file
`invalid.md` is **not** ok:

````markdown
        <!-- This is always invalid -->

            alpha();

        Paragraph.

        ```
        bravo();
        ```
````

```text
7:1-9:4: Code blocks should be indented
```

When `'invalid'` is passed in, the following error is given:

```text
1:1: Invalid code block style `invalid`: use either `'consistent'`, `'fenced'`, or `'indented'`
```

## License

[MIT](https://github.com/wooorm/remark-lint/blob/master/LICENSE) © [Titus Wormer](http://wooorm.com)

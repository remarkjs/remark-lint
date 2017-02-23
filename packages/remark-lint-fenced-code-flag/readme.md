<!--This file is generated-->

# remark-lint-fenced-code-flag

Warn when fenced code blocks occur without language flag.

Options: `Array.<string>` or `Object`.

Providing an array, is a shortcut for just providing the `flags`
property on the object.

The object can have an array of flags which are deemed valid.
In addition it can have the property `allowEmpty` (`boolean`)
which signifies whether or not to warn for fenced code-blocks without
languge flags.

## Install

```sh
npm install --save remark-lint-fenced-code-flag
```

## Example

When this rule is turned on, the following file
`valid.md` is ok:

````markdown
        ```alpha
        bravo();
        ```
````

When this rule is turned on, the following file
`invalid.md` is **not** ok:

````markdown
        ```
        alpha();
        ```
````

```text
1:1-3:4: Missing code-language flag
```

When this rule is `{ allowEmpty: true }`, the following file
`valid.md` is ok:

````markdown
        ```
        alpha();
        ```
````

When this rule is `{ allowEmpty: false }`, the following file
`invalid.md` is **not** ok:

````markdown
        ```
        alpha();
        ```
````

```text
1:1-3:4: Missing code-language flag
```

When this rule is `[ 'alpha' ]`, the following file
`valid.md` is ok:

````markdown
        ```alpha
        bravo();
        ```
````

When this rule is `[ 'charlie' ]`, the following file
`invalid.md` is **not** ok:

````markdown
        ```alpha
        bravo();
        ```
````

```text
1:1-3:4: Invalid code-language flag
```

## License

[MIT](https://github.com/wooorm/remark-lint/blob/master/LICENSE) © [Titus Wormer](http://wooorm.com)

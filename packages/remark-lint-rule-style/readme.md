<!--This file is generated-->

# remark-lint-rule-style

Warn when the horizontal rules violate a given or detected style.

Note that horizontal rules are also called “thematic break”.

Options: `string`, either a valid markdown rule, or `consistent`,
default: `'consistent'`.

## Install

```sh
npm install --save remark-lint-rule-style
```

## Example

When this rule is `'* * *'`, the following file
`valid.md` is ok:

```markdown
<!-- This is also valid when `consistent`. -->

* * *

* * *
```

When this rule is `'_______'`, the following file
`valid.md` is ok:

```markdown
<!-- This is also valid when `consistent`. -->

_______

_______
```

When this rule is turned on, the following file
`invalid.md` is **not** ok:

```markdown
<!-- Always invalid. -->

***

* * *
```

```text
5:1-5:6: Rules should use `***`
```

When `'!!!'` is passed in, the following error is given:

```text
1:1: Invalid preferred rule-style: provide a valid markdown rule, or `'consistent'`
```

## License

[MIT](https://github.com/wooorm/remark-lint/blob/master/LICENSE) © [Titus Wormer](http://wooorm.com)

<!--This file is generated-->

# remark-lint-list-item-spacing

Warn when list looseness is incorrect, such as being tight
when it should be loose, and vice versa.

Options: optional `Object`.

According to the [markdown-style-guide](http://www.cirosantilli.com/markdown-style-guide/),
if one or more list-items in a list spans more than one line,
the list is required to have blank lines between each item.
And otherwise, there should not be blank lines between items.

Note: this applies to nested-lists too, to disable this behavior
set `forceNestedToLoose` to false.

## Install

```sh
npm install --save remark-lint-list-item-spacing
```

## Example

When this rule is turned on, the following file
`valid.md` is ok:

```markdown
A tight list:

-   item 1
-   item 2
-   item 3

A loose list:

-   Wrapped
    item

-   item 2

-   item 3

A nested list:

-   item 1

    - item 1.1
    - item 1.2

-   item 2

-   item 3
```

When this rule is turned on, the following file
`invalid.md` is **not** ok:

```markdown
A tight list:

-   Wrapped
    item
-   item 2
-   item 3

A loose list:

-   item 1

-   item 2

-   item 3

A nested list:

-   item 1
    - item 1.1
    - item 1.2
-   item 2
-   item 3
```

```text
4:9-5:1: Missing new line after list item
5:11-6:1: Missing new line after list item
11:1-12:1: Extraneous new line after list item
13:1-14:1: Extraneous new line after list item
20:15-21:1: Missing new line after list item
21:11-22:1: Missing new line after list item
```

When this rule is `{ forceNestedToLoose: false }`, the following file
`valid.md` is ok:

```markdown
A tight list:

-   item 1
-   item 2
-   item 3

A loose list:

-   Wrapped
    item

-   item 2

-   item 3

A nested list:

-   item 1
    - item 1.1
    - item 1.2
-   item 2
-   item 3
```

## License

[MIT](https://github.com/wooorm/remark-lint/blob/master/LICENSE) © [Titus Wormer](http://wooorm.com)

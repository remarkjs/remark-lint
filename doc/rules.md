<!-- This file is generated -->

# List of Rules

This document describes all (61)
available rules, what they check for, examples of
what they warn for, and how to fix their warnings.

Both camel-cased and dash-cases versions of rule id’s
are supported in configuration objects:

```json
{
  "final-newline": true
}
```

...is treated the same as:

```json
{
  "finalNewline": true
}
```

Additionally, each rule can be configured with a severity
instead of a boolean as well.  The following is handled the
same as passing `false`:

```json
{
  "final-newline": [0]
}
```

...and passing `[1]` is as passing `true`.  To trigger an
error instead of a warning, pass `2`:

```json
{
  "final-newline": [2]
}
```

It’s also possible to pass both a severity and configuration:

```json
{
  "maximum-line-length": [2, 70]
}
```

Lastly, strings can also be passed, instead of numbers:
`off` instead of `0`, `warn` or `on` instead of `1`, and
`error` instead of `2`.

For example, as follows:

```json
{
  "maximum-line-length": ["error", 70]
}
```

## Table of Contents

-   [reset](#reset)
-   [external](#external)
-   [blockquote-indentation](#blockquote-indentation)
-   [checkbox-character-style](#checkbox-character-style)
-   [checkbox-content-indent](#checkbox-content-indent)
-   [code-block-style](#code-block-style)
-   [definition-case](#definition-case)
-   [definition-spacing](#definition-spacing)
-   [emphasis-marker](#emphasis-marker)
-   [fenced-code-flag](#fenced-code-flag)
-   [fenced-code-marker](#fenced-code-marker)
-   [file-extension](#file-extension)
-   [final-definition](#final-definition)
-   [final-newline](#final-newline)
-   [first-heading-level](#first-heading-level)
-   [hard-break-spaces](#hard-break-spaces)
-   [heading-increment](#heading-increment)
-   [heading-style](#heading-style)
-   [link-title-style](#link-title-style)
-   [list-item-bullet-indent](#list-item-bullet-indent)
-   [list-item-content-indent](#list-item-content-indent)
-   [list-item-indent](#list-item-indent)
-   [list-item-spacing](#list-item-spacing)
-   [maximum-heading-length](#maximum-heading-length)
-   [maximum-line-length](#maximum-line-length)
-   [no-auto-link-without-protocol](#no-auto-link-without-protocol)
-   [no-blockquote-without-caret](#no-blockquote-without-caret)
-   [no-consecutive-blank-lines](#no-consecutive-blank-lines)
-   [no-duplicate-definitions](#no-duplicate-definitions)
-   [no-duplicate-headings-in-section](#no-duplicate-headings-in-section)
-   [no-duplicate-headings](#no-duplicate-headings)
-   [no-emphasis-as-heading](#no-emphasis-as-heading)
-   [no-empty-url](#no-empty-url)
-   [no-file-name-articles](#no-file-name-articles)
-   [no-file-name-consecutive-dashes](#no-file-name-consecutive-dashes)
-   [no-file-name-irregular-characters](#no-file-name-irregular-characters)
-   [no-file-name-mixed-case](#no-file-name-mixed-case)
-   [no-file-name-outer-dashes](#no-file-name-outer-dashes)
-   [no-heading-content-indent](#no-heading-content-indent)
-   [no-heading-indent](#no-heading-indent)
-   [no-heading-like-paragraph](#no-heading-like-paragraph)
-   [no-heading-punctuation](#no-heading-punctuation)
-   [no-html](#no-html)
-   [no-inline-padding](#no-inline-padding)
-   [no-literal-urls](#no-literal-urls)
-   [no-missing-blank-lines](#no-missing-blank-lines)
-   [no-multiple-toplevel-headings](#no-multiple-toplevel-headings)
-   [no-reference-like-url](#no-reference-like-url)
-   [no-shell-dollars](#no-shell-dollars)
-   [no-shortcut-reference-image](#no-shortcut-reference-image)
-   [no-shortcut-reference-link](#no-shortcut-reference-link)
-   [no-table-indentation](#no-table-indentation)
-   [no-tabs](#no-tabs)
-   [no-undefined-references](#no-undefined-references)
-   [no-unused-definitions](#no-unused-definitions)
-   [ordered-list-marker-style](#ordered-list-marker-style)
-   [ordered-list-marker-value](#ordered-list-marker-value)
-   [rule-style](#rule-style)
-   [strong-marker](#strong-marker)
-   [table-cell-padding](#table-cell-padding)
-   [table-pipe-alignment](#table-pipe-alignment)
-   [table-pipes](#table-pipes)
-   [unordered-list-marker-style](#unordered-list-marker-style)

## `reset`

Since version 5.0.0, **reset** is no longer available, and
it is now the default behaviour.

## `external`

External contains a list of extra rules to load.  These are,
or refer to, an object mapping `ruleId`s to rules.

Note that in Node.js, a `string` can be given (a module name
or a file path), but in the browser an object must be passed
in.

When using a globally installed remark-lint, globally installed
external rules are also loaded.

The prefix `remark-lint-` can be omitted.

```js
{
  external: ['no-empty-sections', './a-local-file.js']
}
```

Read more about external rules in
[`doc/external.md`](./external.md).

## `blockquote-indentation`

Warn when blockquotes are either indented too much or too little.

Options: `number`, default: `'consistent'`.

The default value, `consistent`, detects the first used indentation
and will warn when other blockquotes use a different indentation.

When this rule is `2`, the following file
`valid.md` is ok:

```markdown
<!--This file is also valid by default-->

> Hello

Paragraph.

> World
```

When this rule is `4`, the following file
`valid.md` is ok:

```markdown
<!--This file is also valid by default-->

>   Hello

Paragraph.

>   World
```

When this rule is turned on, the following file
`invalid.md` is **not** ok:

```markdown
>  Hello

Paragraph.

>   World

Paragraph.

> World
```

```text
5:3: Remove 1 space between blockquote and content
9:3: Add 1 space between blockquote and content
```

## `checkbox-character-style`

Warn when list item checkboxes violate a given style.

The default value, `consistent`, detects the first used checked
and unchecked checkbox styles, and will warn when a subsequent
checkboxes uses a different style.

These values can also be passed in as an object, such as:

```js
{checked: 'x', unchecked: ' '}
```

When this rule is `{ checked: 'x' }`, the following file
`valid.md` is ok:

```markdown
<!--This file is also valid by default-->

- [x] List item
- [x] List item
```

When this rule is `{ checked: 'X' }`, the following file
`valid.md` is ok:

```markdown
<!--This file is also valid by default-->

- [X] List item
- [X] List item
```

When this rule is `{ unchecked: ' ' }`, the following file
`valid.md` is ok:

```markdown
<!--This file is also valid by default-->

- [ ] List item
- [ ] List item
- [ ]··
- [ ]
```

When this rule is `{ unchecked: '\t' }`, the following file
`valid.md` is ok:

```markdown
<!--Also valid by default (note: `»` represents `\t`)-->

- [»] List item
- [»] List item
```

When this rule is turned on, the following file
`invalid.md` is **not** ok:

```markdown
<!--Note: `»` represents `\t`-->

- [x] List item
- [X] List item
- [ ] List item
- [»] List item
```

```text
4:4-4:5: Checked checkboxes should use `x` as a marker
6:4-6:5: Unchecked checkboxes should use ` ` as a marker
```

When `{ unchecked: '!' }` is passed in, the following error is given:

```text
1:1: Invalid unchecked checkbox marker `!`: use either `'\t'`, or `' '`
```

When `{ checked: '!' }` is passed in, the following error is given:

```text
1:1: Invalid checked checkbox marker `!`: use either `'x'`, or `'X'`
```

## `checkbox-content-indent`

Warn when list item checkboxes are followed by too much white-space.

When this rule is turned on, the following file
`valid.md` is ok:

```markdown
- [ ] List item
+  [x] List item
*   [X] List item
-    [ ] List item
```

When this rule is turned on, the following file
`invalid.md` is **not** ok:

```markdown
- [ ] List item
+ [x]  List item
* [X]   List item
- [ ]    List item
```

```text
2:7-2:8: Checkboxes should be followed by a single character
3:7-3:9: Checkboxes should be followed by a single character
4:7-4:10: Checkboxes should be followed by a single character
```

## `code-block-style`

Warn when code-blocks do not adhere to a given style.

Options: `string`, either `'consistent'`, `'fenced'`, or `'indented'`,
default: `'consistent'`.

The default value, `consistent`, detects the first used code-block
style, and will warn when a subsequent code-block uses a different
style.

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

## `definition-case`

Warn when definition labels are not lower-case.

When this rule is turned on, the following file
`valid.md` is ok:

```markdown
[example]: http://example.com "Example Domain"
```

When this rule is turned on, the following file
`invalid.md` is **not** ok:

```markdown
[Example]: http://example.com "Example Domain"
```

```text
1:1-1:47: Do not use upper-case characters in definition labels
```

## `definition-spacing`

Warn when consecutive white space is used in a definition.

When this rule is turned on, the following file
`valid.md` is ok:

```markdown
[example domain]: http://example.com "Example Domain"
```

When this rule is turned on, the following file
`invalid.md` is **not** ok:

```markdown
[example    domain]: http://example.com "Example Domain"
```

```text
1:1-1:57: Do not use consecutive white-space in definition labels
```

## `emphasis-marker`

Warn for violating emphasis markers.

Options: `string`, either `'consistent'`, `'*'`, or `'_'`,
default: `'consistent'`.

The default value, `consistent`, detects the first used emphasis
style, and will warn when a subsequent emphasis uses a different
style.

When this rule is `'*'`, the following file
`valid.md` is ok:

```markdown
*foo*
```

When this rule is `'*'`, the following file
`invalid.md` is **not** ok:

```markdown
_foo_
```

```text
1:1-1:6: Emphasis should use `*` as a marker
```

When this rule is `'_'`, the following file
`valid.md` is ok:

```markdown
_foo_
```

When this rule is `'_'`, the following file
`invalid.md` is **not** ok:

```markdown
*foo*
```

```text
1:1-1:6: Emphasis should use `_` as a marker
```

When this rule is `'consistent'`, the following file
`invalid.md` is **not** ok:

```markdown
<!-- This is never valid -->

*foo*
_bar_
```

```text
4:1-4:6: Emphasis should use `*` as a marker
```

When `'invalid'` is passed in, the following error is given:

```text
1:1: Invalid emphasis marker `invalid`: use either `'consistent'`, `'*'`, or `'_'`
```

## `fenced-code-flag`

Warn when fenced code blocks occur without language flag.

Options: `Array.<string>` or `Object`.

Providing an array, is a shortcut for just providing the `flags`
property on the object.

The object can have an array of flags which are deemed valid.
In addition it can have the property `allowEmpty` (`boolean`)
which signifies whether or not to warn for fenced code-blocks without
languge flags.

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

## `fenced-code-marker`

Warn for violating fenced code markers.

Options: `string`, either ``'`'``, or `'~'`, default: `'consistent'`.

The default value, `consistent`, detects the first used fenced code
marker style, and will warn when a subsequent fenced code uses a
different style.

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

When `'!'` is passed in, the following error is given:

```text
1:1: Invalid fenced code marker `!`: use either `'consistent'`, `` '`' ``, or `'~'`
```

## `file-extension`

Warn when the document’s extension differs from the given preferred
extension.

Does not warn when given documents have no file extensions (such as
`AUTHORS` or `LICENSE`).

Options: `string`, default: `'md'` — Expected file extension.

When this rule is turned on, the following file
`readme.md` is ok:

```markdown

```

When this rule is turned on, the following file
`readme` is ok:

```markdown

```

When turned on is passed in, the following error is given:

```text
1:1: Invalid extension: use `md`
```

When this rule is `'mkd'`, the following file
`readme.mkd` is ok:

```markdown

```

## `final-definition`

Warn when definitions are not placed at the end of the file.

When this rule is turned on, the following file
`valid.md` is ok:

```markdown
Paragraph.

[example]: http://example.com "Example Domain"
```

When this rule is turned on, the following file
`invalid.md` is **not** ok:

```markdown
Paragraph.

[example]: http://example.com "Example Domain"

Another paragraph.
```

```text
3:1-3:47: Move definitions to the end of the file (after the node at line `5`)
```

## `final-newline`

Warn when a newline at the end of a file is missing.

See [StackExchange](http://unix.stackexchange.com/questions/18743) for
why.

## `first-heading-level`

Warn when the first heading has a level other than a specified value.

Options: `number`, default: `1`.

When this rule is `1`, the following file
`valid.md` is ok:

```markdown
<!-- Also valid by default. -->

# Alpha

Paragraph.
```

When this rule is `1`, the following file
`invalid.md` is **not** ok:

```markdown
<!-- Also invalid by default. -->

## Bravo

Paragraph.
```

```text
3:1-3:9: First heading level should be `1`
```

When this rule is `2`, the following file
`valid.md` is ok:

```markdown
## Bravo

Paragraph.
```

When this rule is `2`, the following file
`invalid.md` is **not** ok:

```markdown
# Bravo

Paragraph.
```

```text
1:1-1:8: First heading level should be `2`
```

## `hard-break-spaces`

Warn when too many spaces are used to create a hard break.

When this rule is turned on, the following file
`valid.md` is ok:

```markdown
<!--Note: `·` represents ` `-->

Lorem ipsum··
dolor sit amet
```

When this rule is turned on, the following file
`invalid.md` is **not** ok:

```markdown
<!--Note: `·` represents ` `-->

Lorem ipsum···
dolor sit amet.
```

```text
3:12-4:1: Use two spaces for hard line breaks
```

## `heading-increment`

Warn when headings increment with more than 1 level at a time.

When this rule is turned on, the following file
`valid.md` is ok:

```markdown
# Alpha

## Bravo
```

When this rule is turned on, the following file
`invalid.md` is **not** ok:

```markdown
# Charlie

### Delta
```

```text
3:1-3:10: Heading levels should increment by one level at a time
```

## `heading-style`

Warn when a heading does not conform to a given style.

Options: `string`, either `'consistent'`, `'atx'`, `'atx-closed'`,
or `'setext'`, default: `'consistent'`.

The default value, `consistent`, detects the first used heading
style, and will warn when a subsequent heading uses a different
style.

When this rule is `'atx'`, the following file
`valid.md` is ok:

```markdown
<!--Also valid when `consistent`-->

# Alpha

## Bravo

### Charlie
```

When this rule is `'atx-closed'`, the following file
`valid.md` is ok:

```markdown
<!--Also valid when `consistent`-->

# Delta ##

## Echo ##

### Foxtrot ###
```

When this rule is `'setext'`, the following file
`valid.md` is ok:

```markdown
<!--Also valid when `consistent`-->

Golf
====

Hotel
-----

### India
```

When this rule is turned on, the following file
`invalid.md` is **not** ok:

```markdown
<!--Always invalid.-->

Juliett
=======

## Kilo

### Lima ###
```

```text
6:1-6:8: Headings should use setext
8:1-8:13: Headings should use setext
```

## `link-title-style`

Warn when link and definition titles occur with incorrect quotes.

Options: `string`, either `'consistent'`, `'"'`, `'\''`, or
`'()'`, default: `'consistent'`.

The default value, `consistent`, detects the first used quote
style, and will warn when a subsequent titles use a different
style.

When this rule is `'"'`, the following file
`valid.md` is ok:

```markdown
<!--Also valid when `consistent`-->

[Example](http://example.com "Example Domain")
[Example](http://example.com "Example Domain")
```

When this rule is `'\''`, the following file
`valid.md` is ok:

```markdown
<!--Also valid when `consistent`-->

[Example](http://example.com 'Example Domain')
[Example](http://example.com 'Example Domain')
```

When this rule is `'()'`, the following file
`valid.md` is ok:

```markdown
<!--Also valid when `consistent`-->

[Example](http://example.com (Example Domain) )
[Example](http://example.com (Example Domain) )
```

When this rule is `'()'`, the following file
`invalid.md` is **not** ok:

```markdown
<!--Always invalid-->

[Example](http://example.com (Example Domain))
[Example](http://example.com 'Example Domain')
```

```text
4:46: Titles should use `()` as a quote
```

When this rule is turned on, the following file
`invalid.md` is **not** ok:

```markdown
<!--Always invalid-->

[Example](http://example.com "Example Domain")
[Example](http://example.com#without-title)
[Example](http://example.com 'Example Domain')
```

```text
5:46: Titles should use `"` as a quote
```

When `'.'` is passed in, the following error is given:

```text
1:1: Invalid link title style marker `.`: use either `'consistent'`, `'"'`, `'\''`, or `'()'`
```

## `list-item-bullet-indent`

Warn when list item bullets are indented.

When this rule is turned on, the following file
`valid.md` is ok:

```markdown
Paragraph.

* List item
* List item
```

When this rule is turned on, the following file
`invalid.md` is **not** ok:

```markdown
Paragraph.

 * List item
 * List item
```

```text
3:3: Incorrect indentation before bullet: remove 1 space
4:3: Incorrect indentation before bullet: remove 1 space
```

## `list-item-content-indent`

Warn when the content of a list item has mixed indentation.

When this rule is turned on, the following file
`valid.md` is ok:

```markdown
1. [x] Alpha
   1. Bravo
```

When this rule is turned on, the following file
`invalid.md` is **not** ok:

```markdown
1. [x] Charlie
    1. Delta
```

```text
2:5: Don’t use mixed indentation for children, remove 1 space
```

## `list-item-indent`

Warn when the spacing between a list item’s bullet and its content
violates a given style.

Options: `string`, either `'tab-size'`, `'mixed'`, or `'space'`,
default: `'tab-size'`.

When this rule is `'tab-size'`, the following file
`valid.md` is ok:

```markdown
*   List
    item.

Paragraph.

11. List
    item.

Paragraph.

*   List
    item.

*   List
    item.
```

When this rule is `'mixed'`, the following file
`valid.md` is ok:

```markdown
* List item.

Paragraph.

11. List item

Paragraph.

*   List
    item.

*   List
    item.
```

When this rule is `'space'`, the following file
`valid.md` is ok:

```markdown
* List item.

Paragraph.

11. List item

Paragraph.

* List
  item.

* List
  item.
```

When `'invalid'` is passed in, the following error is given:

```text
1:1: Invalid list-item indent style `invalid`: use either `'tab-size'`, `'space'`, or `'mixed'`
```

## `list-item-spacing`

Warn when list looseness is incorrect, such as being tight
when it should be loose, and vice versa.

According to the [markdown-style-guide](http://www.cirosantilli.com/markdown-style-guide/),
if one or more list-items in a list spans more than one line,
the list is required to have blank lines between each item.
And otherwise, there should not be blank lines between items.

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
```

```text
4:9-5:1: Missing new line after list item
5:11-6:1: Missing new line after list item
11:1-12:1: Extraneous new line after list item
13:1-14:1: Extraneous new line after list item
```

## `maximum-heading-length`

Warn when headings are too long.

Options: `number`, default: `60`.

Ignores markdown syntax, only checks the plain text content.

When this rule is `40`, the following file
`invalid.md` is **not** ok:

```markdown
# Alpha bravo charlie delta echo foxtrot golf hotel
```

```text
1:1-1:52: Use headings shorter than `40`
```

When this rule is turned on, the following file
`valid.md` is ok:

```markdown
# Alpha bravo charlie delta echo foxtrot golf hotel

# ![Alpha bravo charlie delta echo foxtrot golf hotel](http://example.com/nato.png)
```

## `maximum-line-length`

Warn when lines are too long.

Options: `number`, default: `80`.

Ignores nodes which cannot be wrapped, such as heasings, tables,
code, link, images, and definitions.

When this rule is `80`, the following file
`valid.md` is ok:

```markdown
This line is simply not toooooooooooooooooooooooooooooooooooooooooooo
long.

This is also fine: <http://this-long-url-with-a-long-domain.co.uk/a-long-path?query=variables>

<http://this-link-is-fine.com>

[foo](http://this-long-url-with-a-long-domain-is-valid.co.uk/a-long-path?query=variables)

<http://this-long-url-with-a-long-domain-is-valid.co.uk/a-long-path?query=variables>

![foo](http://this-long-url-with-a-long-domain-is-valid.co.uk/a-long-path?query=variables)

| An | exception | is | line | length | in | long | tables | because | those | can’t | just |
| -- | --------- | -- | ---- | ------ | -- | ---- | ------ | ------- | ----- | ----- | ---- |
| be | helped    |    |      |        |    |      |        |         |       |       | .    |

The following is also fine, because there is no white-space.

<http://this-long-url-with-a-long-domain-is-invalid.co.uk/a-long-path?query=variables>.

In addition, definitions are also fine:

[foo]: <http://this-long-url-with-a-long-domain-is-invalid.co.uk/a-long-path?query=variables>
```

When this rule is `80`, the following file
`invalid.md` is **not** ok:

```markdown
This line is simply not tooooooooooooooooooooooooooooooooooooooooooooooooooooooo
long.

Just like thiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiis one.

And this one is also very wrong: because the link starts aaaaaaafter the column: <http://line.com>

<http://this-long-url-with-a-long-domain-is-invalid.co.uk/a-long-path?query=variables> and such.
```

```text
4:86: Line must be at most 80 characters
6:99: Line must be at most 80 characters
8:97: Line must be at most 80 characters
```

## `no-auto-link-without-protocol`

Warn for angle-bracketed links without protocol.

When this rule is turned on, the following file
`valid.md` is ok:

```markdown
<http://www.example.com>
<mailto:foo@bar.com>
```

When this rule is turned on, the following file
`invalid.md` is **not** ok:

```markdown
<www.example.com>
<foo@bar.com>
```

```text
2:1-2:14: All automatic links must start with a protocol
```

## `no-blockquote-without-caret`

Warn when blank lines without carets are found in a blockquote.

When this rule is turned on, the following file
`valid.md` is ok:

```markdown
> Foo...
>
> ...Bar.
```

When this rule is turned on, the following file
`invalid.md` is **not** ok:

```markdown
> Foo...

> ...Bar.
```

```text
2:1: Missing caret in blockquote
```

## `no-consecutive-blank-lines`

Warn for too many consecutive blank lines.  Knows about the extra line
needed between a list and indented code, and two lists.

When this rule is turned on, the following file
`valid.md` is ok:

```markdown
Foo...

...Bar.
```

When this rule is turned on, the following file
`valid-for-code.md` is ok:

```markdown
Paragraph.

*   List


    bravo();
```

When this rule is turned on, the following file
`invalid.md` is **not** ok:

```markdown
Foo...


...Bar.
```

```text
4:1: Remove 1 line before node
```

## `no-duplicate-definitions`

Warn when duplicate definitions are found.

When this rule is turned on, the following file
`valid.md` is ok:

```markdown
[foo]: bar
[baz]: qux
```

When this rule is turned on, the following file
`invalid.md` is **not** ok:

```markdown
[foo]: bar
[foo]: qux
```

```text
2:1-2:11: Do not use definitions with the same identifier (1:1)
```

## `no-duplicate-headings-in-section`

Warn when duplicate headings are found,
but only when on the same level, “in”
the same section.

When this rule is turned on, the following file
`valid.md` is ok:

```markdown
## Alpha

### Bravo

## Charlie

### Bravo

### Delta

#### Bravo

#### Echo

##### Bravo
```

When this rule is turned on, the following file
`invalid.md` is **not** ok:

```markdown
## Foxtrot

### Golf

### Golf
```

```text
5:1-5:9: Do not use headings with similar content per section (3:1)
```

## `no-duplicate-headings`

Warn when duplicate headings are found.

When this rule is turned on, the following file
`valid.md` is ok:

```markdown
# Foo

## Bar
```

When this rule is turned on, the following file
`invalid.md` is **not** ok:

```markdown
# Foo

## Foo

## [Foo](http://foo.com/bar)
```

```text
3:1-3:7: Do not use headings with similar content (1:1)
5:1-5:29: Do not use headings with similar content (3:1)
```

## `no-emphasis-as-heading`

Warn when emphasis (including strong), instead of a heading, introduces
a paragraph.

When this rule is turned on, the following file
`valid.md` is ok:

```markdown
# Foo

Bar.
```

When this rule is turned on, the following file
`invalid.md` is **not** ok:

```markdown
*Foo*

Bar.
```

```text
1:1-1:6: Don’t use emphasis to introduce a section, use a heading
```

## `no-empty-url`

Warn for empty URLs in links and images.

When this rule is turned on, the following file
`valid.md` is ok:

```markdown
[alpha](http://bravo.com).

![charlie](http://delta.com/echo.png "foxtrott").
```

When this rule is turned on, the following file
`invalid.md` is **not** ok:

```markdown
[golf]().

![hotel]().
```

```text
1:1-1:9: Don’t use links without URL
3:1-3:11: Don’t use images without URL
```

## `no-file-name-articles`

Warn when file name start with an article.

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

## `no-file-name-consecutive-dashes`

Warn when file names contain consecutive dashes.

When this rule is turned on, the following file
`plug-ins.md` is ok:

```markdown

```

When turned on is passed in, the following error is given:

```text
1:1: Do not use consecutive dashes in a file name
```

## `no-file-name-irregular-characters`

Warn when file names contain irregular characters: characters other
than alpha-numericals, dashes, and dots (full-stops).

Options: `RegExp` or `string`, default: `'\\.a-zA-Z0-9-'`.

If a string is given, it will be wrapped in
`new RegExp('[^' + preferred + ']')`.

Any match by the wrapped or given expressions triggers a
warning.

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

## `no-file-name-mixed-case`

Warn when a file name uses mixed case: both upper- and lower case
characters.

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

## `no-file-name-outer-dashes`

Warn when file names contain initial or final dashes.

When this rule is turned on, the following file
`readme.md` is ok:

```markdown

```

When turned on is passed in, the following error is given:

```text
1:1: Do not use initial or final dashes in a file name
```

When turned on is passed in, the following error is given:

```text
1:1: Do not use initial or final dashes in a file name
```

## `no-heading-content-indent`

Warn when a heading’s content is indented.

When this rule is turned on, the following file
`valid.md` is ok:

```markdown
<!-- Note: the middle-dots represent spaces -->

#·Foo

## Bar·##

  ##·Baz
```

When this rule is turned on, the following file
`invalid.md` is **not** ok:

```markdown
<!-- Note: the middle-dots represent spaces -->

#··Foo

## Bar··##

  ##··Baz
```

```text
3:4: Remove 1 space before this heading’s content
5:7: Remove 1 space after this heading’s content
7:7: Remove 1 space before this heading’s content
```

When this rule is turned on, the following file
`empty-heading.md` is ok:

```markdown
#··
```

When this rule is turned on, the following file
`tight.md` is **not** ok:

```markdown
In pedantic mode, headings without spacing can also be detected:

##No spacing left, too much right··##
```

```text
3:3: Add 1 space before this heading’s content
3:34: Remove 1 space after this heading’s content
```

## `no-heading-indent`

Warn when a heading is indented.

When this rule is turned on, the following file
`valid.md` is ok:

```markdown
<!-- Note: the middle-dots represent spaces -->

#·Hello world

Foo
-----

#·Hello world·#

Bar
=====
```

When this rule is turned on, the following file
`invalid.md` is **not** ok:

```markdown
<!-- Note: the middle-dots represent spaces -->

···# Hello world

·Foo
-----

·# Hello world #

···Bar
=====
```

```text
3:4: Remove 3 spaces before this heading
5:2: Remove 1 space before this heading
8:2: Remove 1 space before this heading
10:4: Remove 3 spaces before this heading
```

## `no-heading-like-paragraph`

Warn for h7+ “headings”.

When this rule is turned on, the following file
`valid.md` is ok:

```markdown
###### Alpha

Bravo.
```

When this rule is turned on, the following file
`invalid.md` is **not** ok:

```markdown
####### Charlie

Delta.
```

```text
1:1-1:16: This looks like a heading but has too many hashes
```

## `no-heading-punctuation`

Warn when a heading ends with a a group of characters.
Defaults to `'.,;:!?'`.

Options: `string`, default: `'.,;:!?'`.

Note that these are added to a regex, in a group (`'[' + char + ']'`),
be careful for escapes and dashes.

When this rule is turned on, the following file
`valid.md` is ok:

```markdown
# Hello
```

When this rule is turned on, the following file
`invalid.md` is **not** ok:

```markdown
# Hello:

# Hello?

# Hello!

# Hello,

# Hello;
```

```text
1:1-1:9: Don’t add a trailing `:` to headings
3:1-3:9: Don’t add a trailing `?` to headings
5:1-5:9: Don’t add a trailing `!` to headings
7:1-7:9: Don’t add a trailing `,` to headings
9:1-9:9: Don’t add a trailing `;` to headings
```

When this rule is `',;:!?'`, the following file
`valid.md` is ok:

```markdown
# Hello...
```

## `no-html`

Warn when HTML nodes are used.

Ignores comments, because they are used by this tool, remark, and
because markdown doesn’t have native comments.

When this rule is turned on, the following file
`valid.md` is ok:

```markdown
# Hello

<!--Comments are also OK-->
```

When this rule is turned on, the following file
`invalid.md` is **not** ok:

```markdown
<h1>Hello</h1>
```

```text
1:1-1:15: Do not use HTML in markdown
```

## `no-inline-padding`

Warn when inline nodes are padded with spaces between markers and
content.

Warns for emphasis, strong, delete, image, and link.

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

## `no-literal-urls`

Warn when URLs without angle-brackets are used.

When this rule is turned on, the following file
`valid.md` is ok:

```markdown
<http://foo.bar/baz>
<mailto:qux@quux.com>
```

When this rule is turned on, the following file
`invalid.md` is **not** ok:

```markdown
http://foo.bar/baz

mailto:qux@quux.com
```

```text
1:1-1:19: Don’t use literal URLs without angle brackets
```

## `no-missing-blank-lines`

Warn when missing blank lines before a block node.

This rule can be configured to allow tight list items
without blank lines between their contents through
`exceptTightLists: true` (default: false).

When this rule is turned on, the following file
`valid.md` is ok:

```markdown
# Foo

## Bar

- Paragraph

  + List.

Paragraph.
```

When this rule is turned on, the following file
`invalid.md` is **not** ok:

```markdown
# Foo
## Bar

- Paragraph
  + List.

Paragraph.
```

```text
2:1-2:7: Missing blank line before block node
5:3-5:10: Missing blank line before block node
```

When this rule is `{ exceptTightLists: true }`, the following file
`tight.md` is **not** ok:

```markdown
# Foo
## Bar

- Paragraph
  + List.

Paragraph.
```

```text
2:1-2:7: Missing blank line before block node
```

## `no-multiple-toplevel-headings`

Warn when multiple top-level headings are used.

Options: `number`, default: `1`.

When this rule is `1`, the following file
`valid.md` is ok:

```markdown
# Foo

## Bar
```

When this rule is `1`, the following file
`invalid.md` is **not** ok:

```markdown
# Foo

# Bar
```

```text
3:1-3:6: Don’t use multiple top level headings (3:1)
```

## `no-reference-like-url`

Warn when URLs are also defined identifiers.

When this rule is turned on, the following file
`valid.md` is ok:

```markdown
[Alpha](http://example.com).

[bravo]: https://example.com
```

When this rule is turned on, the following file
`invalid.md` is **not** ok:

```markdown
[Charlie](delta).

[delta]: https://example.com
```

```text
1:1-1:17: Did you mean to use `[delta]` instead of `(delta)`, a reference?
```

## `no-shell-dollars`

Warn when shell code is prefixed by dollar-characters.

Ignored indented code blocks and fenced code blocks without language
flag.

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

## `no-shortcut-reference-image`

Warn when shortcut reference images are used.

When this rule is turned on, the following file
`valid.md` is ok:

```markdown
![foo][]

[foo]: http://foo.bar/baz.png
```

When this rule is turned on, the following file
`invalid.md` is **not** ok:

```markdown
![foo]

[foo]: http://foo.bar/baz.png
```

```text
1:1-1:7: Use the trailing [] on reference images
```

## `no-shortcut-reference-link`

Warn when shortcut reference links are used.

When this rule is turned on, the following file
`valid.md` is ok:

```markdown
[foo][]

[foo]: http://foo.bar/baz
```

When this rule is turned on, the following file
`invalid.md` is **not** ok:

```markdown
[foo]

[foo]: http://foo.bar/baz
```

```text
1:1-1:6: Use the trailing [] on reference links
```

## `no-table-indentation`

Warn when tables are indented.

When this rule is turned on, the following file
`valid.md` is ok:

```markdown
Paragraph.

| A     | B     |
| ----- | ----- |
| Alpha | Bravo |
```

When this rule is turned on, the following file
`invalid.md` is **not** ok:

```markdown
Paragraph.

   | A     | B     |
   | ----- | ----- |
   | Alpha | Bravo |
```

```text
3:1-3:21: Do not indent table rows
5:1-5:21: Do not indent table rows
```

## `no-tabs`

Warn when hard-tabs instead of spaces

When this rule is turned on, the following file
`valid.md` is ok:

```markdown
Foo Bar

    Foo
```

When this rule is turned on, the following file
`invalid.md` is **not** ok:

```markdown
<!-- Note: the guillemets represent tabs -->

»Here's one before a code block.

Here's a tab:», and here is another:».

And this is in `inline»code`.

>»This is in a block quote.

*»And...

»1.»in a list.

And this is a tab as the last character.»
```

```text
3:1: Use spaces instead of hard-tabs
5:14: Use spaces instead of hard-tabs
5:37: Use spaces instead of hard-tabs
7:23: Use spaces instead of hard-tabs
9:2: Use spaces instead of hard-tabs
11:2: Use spaces instead of hard-tabs
13:1: Use spaces instead of hard-tabs
13:4: Use spaces instead of hard-tabs
15:41: Use spaces instead of hard-tabs
```

## `no-undefined-references`

Warn when references to undefined definitions are found.

When this rule is turned on, the following file
`valid.md` is ok:

```markdown
[foo][]

[foo]: https://example.com
```

When this rule is turned on, the following file
`invalid.md` is **not** ok:

```markdown
[bar][]
```

```text
1:1-1:8: Found reference to undefined definition
```

## `no-unused-definitions`

Warn when unused definitions are found.

When this rule is turned on, the following file
`valid.md` is ok:

```markdown
[foo][]

[foo]: https://example.com
```

When this rule is turned on, the following file
`invalid.md` is **not** ok:

```markdown
[bar]: https://example.com
```

```text
1:1-1:27: Found unused definition
```

## `ordered-list-marker-style`

Warn when the list-item marker style of ordered lists violate a given
style.

Options: `string`, either `'consistent'`, `'.'`, or `')'`,
default: `'consistent'`.

Note that `)` is only supported in CommonMark.

The default value, `consistent`, detects the first used list
style, and will warn when a subsequent list uses a different
style.

When this rule is `'.'`, the following file
`valid.md` is ok:

```markdown
<!-- This is also valid when `consistent`. -->

1.  Foo

2.  Bar
```

When this rule is `')'`, the following file
`valid.md` is ok:

```markdown
<!-- This is also valid when `consistent`.
     But it does require commonmark. -->

1)  Foo

2)  Bar
```

When this rule is turned on, the following file
`invalid.md` is **not** ok:

```markdown
1.  Foo

2)  Bar
```

```text
3:1-3:8: Marker style should be `.`
```

When `'!'` is passed in, the following error is given:

```text
1:1: Invalid ordered list-item marker style `!`: use either `'.'` or `')'`
```

## `ordered-list-marker-value`

Warn when the list-item marker values of ordered lists violate a
given style.

Options: `string`, either `'single'`, `'one'`, or `'ordered'`,
default: `'ordered'`.

When set to `'ordered'`, list-item bullets should increment by one,
relative to the starting point.  When set to `'single'`, bullets should
be the same as the relative starting point.  When set to `'one'`, bullets
should always be `1`.

When this rule is `'one'`, the following file
`valid.md` is ok:

```markdown
1.  Foo
1.  Bar
1.  Baz

Paragraph.

1.  Alpha
1.  Bravo
1.  Charlie
```

When this rule is `'one'`, the following file
`invalid.md` is **not** ok:

```markdown
1.  Foo
2.  Bar
```

```text
2:1-2:8: Marker should be `1`, was `2`
```

When this rule is `'single'`, the following file
`valid.md` is ok:

```markdown
1.  Foo
1.  Bar
1.  Baz

Paragraph.

3.  Alpha
3.  Bravo
3.  Charlie
```

When this rule is `'ordered'`, the following file
`valid.md` is ok:

```markdown
1.  Foo
2.  Bar
3.  Baz

Paragraph.

3.  Alpha
4.  Bravo
5.  Charlie
```

When this rule is `'ordered'`, the following file
`invalid.md` is **not** ok:

```markdown
1.  Foo
1.  Bar
```

```text
2:1-2:8: Marker should be `2`, was `1`
```

When `'invalid'` is passed in, the following error is given:

```text
1:1: Invalid ordered list-item marker value `invalid`: use either `'ordered'` or `'one'`
```

## `rule-style`

Warn when the horizontal rules violate a given or detected style.

Note that horizontal rules are also called “thematic break”.

Options: `string`, either a valid markdown rule, or `consistent`,
default: `'consistent'`.

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

## `strong-marker`

Warn for violating strong markers.

Options: `string`, either `'consistent'`, `'*'`, or `'_'`,
default: `'consistent'`.

The default value, `consistent`, detects the first used strong
style, and will warn when a subsequent strong uses a different
style.

When this rule is turned on, the following file
`valid.md` is ok:

```markdown
**foo** and **bar**.
```

When this rule is turned on, the following file
`also-valid.md` is ok:

```markdown
__foo__ and __bar__.
```

When this rule is turned on, the following file
`invalid.md` is **not** ok:

```markdown
**foo** and __bar__.
```

```text
1:13-1:20: Strong should use `*` as a marker
```

When this rule is `'*'`, the following file
`valid.md` is ok:

```markdown
**foo**.
```

When this rule is `'_'`, the following file
`valid.md` is ok:

```markdown
__foo__.
```

When `'!'` is passed in, the following error is given:

```text
1:1: Invalid strong marker `!`: use either `'consistent'`, `'*'`, or `'_'`
```

## `table-cell-padding`

Warn when table cells are incorrectly padded.

Options: `string`, either `'consistent'`, `'padded'`, or `'compact'`,
default: `'consistent'`.

The default value, `consistent`, detects the first used cell padding
style, and will warn when a subsequent cells uses a different
style.

When this rule is `'padded'`, the following file
`valid.md` is ok:

```markdown
<!--Also valid when `consistent`-->

| A     | B     |
| ----- | ----- |
| Alpha | Bravo |
```

When this rule is `'padded'`, the following file
`invalid.md` is **not** ok:

```markdown
| A    |    B |
| :----|----: |
| Alpha|Bravo |
```

```text
3:8: Cell should be padded
3:9: Cell should be padded
```

When this rule is `'compact'`, the following file
`valid.md` is ok:

```markdown
<!--Also valid when `consistent`-->

|A    |B    |
|-----|-----|
|Alpha|Bravo|
```

When this rule is `'compact'`, the following file
`invalid.md` is **not** ok:

```markdown
|A    |     B|
|:----|-----:|
|Alpha|Bravo |
```

```text
3:13: Cell should be compact
```

When this rule is turned on, the following file
`invalid.md` is **not** ok:

```markdown
<!--Always invalid-->

|   A    | B    |
|   -----| -----|
|   Alpha| Bravo|
```

```text
5:5: Cell should be padded with 1 space, not 3
5:10: Cell should be padded
5:17: Cell should be padded
```

When this rule is turned on, the following file
`empty-heading.md` is ok:

```markdown
<!-- Empty heading cells are always OK. -->

|       | Alpha   |
| ----- | ------- |
| Bravo | Charlie |
```

When this rule is turned on, the following file
`empty-body.md` is ok:

```markdown
<!-- Empty body cells are always OK. -->

| Alpha   | Bravo   |
| ------- | ------- |
| Charlie |         |
```

When `'invalid'` is passed in, the following error is given:

```text
1:1: Invalid table-cell-padding style `invalid`
```

## `table-pipe-alignment`

Warn when table pipes are not aligned.

When this rule is turned on, the following file
`valid.md` is ok:

```markdown
| A     | B     |
| ----- | ----- |
| Alpha | Bravo |
```

When this rule is turned on, the following file
`invalid.md` is **not** ok:

```markdown
| A | B |
| -- | -- |
| Alpha | Bravo |
```

```text
3:9-3:10: Misaligned table fence
3:17-3:18: Misaligned table fence
```

## `table-pipes`

Warn when table rows are not fenced with pipes.

When this rule is turned on, the following file
`valid.md` is ok:

```markdown
| A     | B     |
| ----- | ----- |
| Alpha | Bravo |
```

When this rule is turned on, the following file
`invalid.md` is **not** ok:

```markdown
A     | B
----- | -----
Alpha | Bravo
```

```text
1:1: Missing initial pipe in table fence
1:10: Missing final pipe in table fence
3:1: Missing initial pipe in table fence
3:14: Missing final pipe in table fence
```

## `unordered-list-marker-style`

Warn when the list-item marker style of unordered lists violate a given
style.

Options: `string`, either `'consistent'`, `'-'`, `'*'`, or `'*'`,
default: `'consistent'`.

The default value, `consistent`, detects the first used list
style, and will warn when a subsequent list uses a different
style.

When this rule is `'*'`, the following file
`valid.md` is ok:

```markdown
* Foo
```

When this rule is `'-'`, the following file
`valid.md` is ok:

```markdown
- Foo
```

When this rule is `'+'`, the following file
`valid.md` is ok:

```markdown
+ Foo
```

When this rule is turned on, the following file
`invalid.md` is **not** ok:

```markdown
* Foo
- Bar
+ Baz
```

```text
2:1-2:6: Marker style should be `*`
3:1-3:6: Marker style should be `*`
```

When `'!'` is passed in, the following error is given:

```text
1:1: Invalid unordered list-item marker style `!`: use either `'-'`, `'*'`, or `'+'`
```

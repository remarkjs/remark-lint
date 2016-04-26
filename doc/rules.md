# List of Rules

This document describes all available rules, what they
check for, examples of what they warn for, and how to
fix their warnings.

See the readme for a [list of external rules](https://github.com/wooorm/remark-lint#list-of-external-rules).

## Table of Contents

*   [Rules](#rules)

    *   [external](#external)
    *   [reset](#reset)
    *   [blockquote-indentation](#blockquote-indentation)
    *   [checkbox-character-style](#checkbox-character-style)
    *   [checkbox-content-indent](#checkbox-content-indent)
    *   [code-block-style](#code-block-style)
    *   [definition-case](#definition-case)
    *   [definition-spacing](#definition-spacing)
    *   [emphasis-marker](#emphasis-marker)
    *   [fenced-code-flag](#fenced-code-flag)
    *   [fenced-code-marker](#fenced-code-marker)
    *   [file-extension](#file-extension)
    *   [final-definition](#final-definition)
    *   [final-newline](#final-newline)
    *   [first-heading-level](#first-heading-level)
    *   [hard-break-spaces](#hard-break-spaces)
    *   [heading-increment](#heading-increment)
    *   [heading-style](#heading-style)
    *   [link-title-style](#link-title-style)
    *   [list-item-bullet-indent](#list-item-bullet-indent)
    *   [list-item-content-indent](#list-item-content-indent)
    *   [list-item-indent](#list-item-indent)
    *   [list-item-spacing](#list-item-spacing)
    *   [maximum-heading-length](#maximum-heading-length)
    *   [maximum-line-length](#maximum-line-length)
    *   [no-auto-link-without-protocol](#no-auto-link-without-protocol)
    *   [no-blockquote-without-caret](#no-blockquote-without-caret)
    *   [no-consecutive-blank-lines](#no-consecutive-blank-lines)
    *   [no-duplicate-definitions](#no-duplicate-definitions)
    *   [no-duplicate-headings](#no-duplicate-headings)
    *   [no-emphasis-as-heading](#no-emphasis-as-heading)
    *   [no-file-name-articles](#no-file-name-articles)
    *   [no-file-name-consecutive-dashes](#no-file-name-consecutive-dashes)
    *   [no-file-name-irregular-characters](#no-file-name-irregular-characters)
    *   [no-file-name-mixed-case](#no-file-name-mixed-case)
    *   [no-file-name-outer-dashes](#no-file-name-outer-dashes)
    *   [no-heading-content-indent](#no-heading-content-indent)
    *   [no-heading-indent](#no-heading-indent)
    *   [no-heading-punctuation](#no-heading-punctuation)
    *   [no-html](#no-html)
    *   [no-inline-padding](#no-inline-padding)
    *   [no-literal-urls](#no-literal-urls)
    *   [no-missing-blank-lines](#no-missing-blank-lines)
    *   [no-multiple-toplevel-headings](#no-multiple-toplevel-headings)
    *   [no-shell-dollars](#no-shell-dollars)
    *   [no-shortcut-reference-image](#no-shortcut-reference-image)
    *   [no-shortcut-reference-link](#no-shortcut-reference-link)
    *   [no-table-indentation](#no-table-indentation)
    *   [no-tabs](#no-tabs)
    *   [no-undefined-references](#no-undefined-references)
    *   [no-unused-definitions](#no-unused-definitions)
    *   [ordered-list-marker-style](#ordered-list-marker-style)
    *   [ordered-list-marker-value](#ordered-list-marker-value)
    *   [rule-style](#rule-style)
    *   [strong-marker](#strong-marker)
    *   [table-cell-padding](#table-cell-padding)
    *   [table-pipe-alignment](#table-pipe-alignment)
    *   [table-pipes](#table-pipes)
    *   [unordered-list-marker-style](#unordered-list-marker-style)

## Rules

Remember that rules can always be turned off by
passing false. In addition, when reset is given, values can
be null or undefined in order to be ignored.

### external

````md
            <!-- Load more rules -->
            ```json
            {
              "external": ["foo", "bar", "baz"]
            }
            ```
````

External contains a list of extra rules to load.
These are, or refer to, an object mapping `ruleId`s to rules.

Note that in node.js, a string can be given (a module
name or a file), but in the browser an object must be passed in.

When using a globally installed remark-lint, globally installed external
rules are also loaded.

### reset

````md
            <!-- Explicitly activate rules: -->
            ```json
            {
              "reset": true,
              "final-newline": true
            }
            ```
````

By default, all rules are turned on unless explicitly set to `false`.
When `reset: true`, the opposite is true: all rules are turned off,
unless when given a non-nully and non-false value.

Options: `boolean`, default: `false`.

### blockquote-indentation

```md
  <!-- Valid, when set to `4`, invalid when set to `2` -->
  >   Hello
  ...
  >   World

  <!-- Valid, when set to `2`, invalid when set to `4` -->
  > Hello
  ...
  > World

  <!-- Always invalid -->
  > Hello
  ...
  >   World
```

  Warn when blockquotes are either indented too much or too little.

  Options: `number`, default: `'consistent'`.

  The default value, `consistent`, detects the first used indentation
  and will warn when other blockquotes use a different indentation.

### checkbox-character-style

```md
  <!-- Note: the double guillemet (`»`) and middle-dots represent a tab -->

  <!-- Valid by default, `'consistent'`, or `{'checked': 'x'}` -->
  - [x] List item
  - [x] List item

  <!-- Valid by default, `'consistent'`, or `{'checked': 'X'}` -->
  - [X] List item
  - [X] List item

  <!-- Valid by default, `'consistent'`, or `{'unchecked': ' '}` -->
  - [ ] List item
  - [ ] List item

  <!-- Valid by default, `'consistent'`, or `{'unchecked': '»'}` -->
  - [»···] List item
  - [»···] List item

  <!-- Always invalid -->
  - [x] List item
  - [X] List item
  - [ ] List item
  - [»···] List item
```

  Warn when list item checkboxes violate a given style.

  The default value, `consistent`, detects the first used checked
  and unchecked checkbox styles, and will warn when a subsequent
  checkboxes uses a different style.

  These values can also be passed in as an object, such as:

```json
{
   "checked": "x",
   "unchecked": " "
}
```

### checkbox-content-indent

```md
  <!-- Valid: -->
  - [ ] List item
  +  [x] List item
  *   [X] List item
  -    [ ] List item

  <!-- Invalid: -->
  - [ ] List item
  + [x]  List item
  * [X]   List item
  - [ ]    List item
```

  Warn when list item checkboxes are followed by too much white-space.

### code-block-style

````md
              <!-- Valid, when set to `indented` or `consistent`, invalid when set to `fenced` -->
                 Hello

              ...

                 World

              <!-- Valid, when set to `fenced` or `consistent`, invalid when set to `indented` -->
              ```
              Hello
              ```
              ...
              ```bar
              World
              ```

              <!-- Always invalid -->
                  Hello
              ...
              ```
              World
                ```
````

  Warn when code-blocks do not adhere to a given style.

  Options: `string`, either `'consistent'`, `'fenced'`, or `'indented'`,
  default: `'consistent'`.

  The default value, `consistent`, detects the first used code-block
  style, and will warn when a subsequent code-block uses a different
  style.

### definition-case

```md
  <!-- Valid -->
  [example] http://example.com "Example Domain"

  <!-- Invalid -->
  ![Example] http://example.com/favicon.ico "Example image"
```

  Warn when definition labels are not lower-case.

### definition-spacing

```md
  <!-- Valid -->
  [example domain] http://example.com "Example Domain"

  <!-- Invalid -->
  ![example    image] http://example.com/favicon.ico "Example image"
```

  Warn when consecutive white space is used in a definition.

### emphasis-marker

```md
  <!-- Valid when set to `consistent` or `*` -->
  *foo*
  *bar*

  <!-- Valid when set to `consistent` or `_` -->
  _foo_
  _bar_
```

  Warn for violating emphasis markers.

  Options: `string`, either `'consistent'`, `'*'`, or `'_'`,
  default: `'consistent'`.

  The default value, `consistent`, detects the first used emphasis
  style, and will warn when a subsequent emphasis uses a different
  style.

### fenced-code-flag

````md
              <!-- Valid: -->
              ```hello
              world();
              ```

              <!-- Valid: -->
                 Hello

              <!-- Invalid: -->
              ```
              world();
              ```

              <!-- Valid when given `{allowEmpty: true}`: -->
              ```
              world();
              ```

              <!-- Invalid when given `["world"]`: -->
              ```hello
              world();
              ```
````

  Warn when fenced code blocks occur without language flag.

  Options: `Array.<string>` or `Object`.

  Providing an array, is a shortcut for just providing the `flags`
  property on the object.

  The object can have an array of flags which are deemed valid.
  In addition it can have the property `allowEmpty` (`boolean`)
  which signifies whether or not to warn for fenced code-blocks without
  languge flags.

### fenced-code-marker

````md
              <!-- Valid by default and `` '`' ``: -->
              ```foo
              bar();
              ```

              ```
              baz();
              ```

              <!-- Valid by default and `'~'`: -->
              ~~~foo
              bar();
              ~~~

              ~~~
              baz();
              ~~~

              <!-- Always invalid: -->
              ~~~foo
              bar();
              ~~~

              ```
              baz();
              ```
````

  Warn for violating fenced code markers.

  Options: `string`, either ``'`'``, or `'~'`, default: `'consistent'`.

  The default value, `consistent`, detects the first used fenced code
  marker style, and will warn when a subsequent fenced code uses a
  different style.

### file-extension

```md
  Invalid (when `'md'`): readme.mkd, readme.markdown, etc.
  Valid (when `'md'`): readme, readme.md
```

  Warn when the document’s extension differs from the given preferred
  extension.

  Does not warn when given documents have no file extensions (such as
  `AUTHORS` or `LICENSE`).

  Options: `string`, default: `'md'` — Expected file extension.

### final-definition

```md
  <!-- Valid: -->
  ...

  [example] http://example.com "Example Domain"

  <!-- Invalid: -->
  ...

  [example] http://example.com "Example Domain"

  A trailing paragraph.
```

  Warn when definitions are not placed at the end of the file.

### final-newline

  Warn when a newline at the end of a file is missing.

  See [StackExchange](http://unix.stackexchange.com/questions/18743) for
  why.

### first-heading-level

```md
  <!-- Valid, when set to `1` -->
  # Foo

  ## Bar

  <!-- Invalid, when set to `1` -->
  ## Foo

  # Bar
```

  Warn when the first heading has a level other than a specified value.

  Options: `number`, default: `1`.

### hard-break-spaces

```md
  <!-- Note: the middle-dots represent spaces -->

  <!-- Valid: -->
  Lorem ipsum··
  dolor sit amet

  <!-- Invalid: -->
  Lorem ipsum···
  dolor sit amet.
```

  Warn when too many spaces are used to create a hard break.

### heading-increment

```md
  <!-- Valid: -->
  # Foo

  ## Bar

  <!-- Invalid: -->
  # Foo

  ### Bar
```

  Warn when headings increment with more than 1 level at a time.

### heading-style

```md
  <!-- Valid when `consistent` or `atx` -->
  # Foo

  ## Bar

  ### Baz

  <!-- Valid when `consistent` or `atx-closed` -->
  # Foo #

  ## Bar #

  ### Baz ###

  <!-- Valid when `consistent` or `setext` -->
  Foo
  ===

  Bar
  ---

  ### Baz

  <!-- Invalid -->
  Foo
  ===

  ## Bar

  ### Baz ###
```

  Warn when a heading does not conform to a given style.

  Options: `string`, either `'consistent'`, `'atx'`, `'atx-closed'`,
  or `'setext'`, default: `'consistent'`.

  The default value, `consistent`, detects the first used heading
  style, and will warn when a subsequent heading uses a different
  style.

### link-title-style

```md
  <!-- Valid when `consistent` or `"` -->
  [Example](http://example.com "Example Domain")
  [Example](http://example.com "Example Domain")

  <!-- Valid when `consistent` or `'` -->
  [Example](http://example.com 'Example Domain')
  [Example](http://example.com 'Example Domain')

  <!-- Valid when `consistent` or `()` -->
  [Example](http://example.com (Example Domain))
  [Example](http://example.com (Example Domain))

  <!-- Always invalid -->
  [Example](http://example.com "Example Domain")
  [Example](http://example.com 'Example Domain')
  [Example](http://example.com (Example Domain))
```

  Warn when link and definition titles occur with incorrect quotes.

  Options: `string`, either `'consistent'`, `'"'`, `'\''`, or
  `'()'`, default: `'consistent'`.

  The default value, `consistent`, detects the first used quote
  style, and will warn when a subsequent titles use a different
  style.

### list-item-bullet-indent

```md
  <!-- Valid -->
  * List item
  * List item

  <!-- Invalid -->
    * List item
    * List item
```

  Warn when list item bullets are indented.

### list-item-content-indent

```md
  <!-- Valid -->
  *   List item

      *   Nested list item indented by 4 spaces

  <!-- Invalid -->
  *   List item

     *   Nested list item indented by 3 spaces
```

  Warn when the content of a list item has mixed indentation.

### list-item-indent

```md
  <!-- Valid when `tab-size` -->
  *   List
      item.

  11. List
      item.

  <!-- Valid when `mixed` -->
  * List item.

  11. List item

  *   List
      item.

  11. List
      item.

  <!-- Valid when `space` -->
  * List item.

  11. List item

  * List
    item.

  11. List
      item.
```

  Warn when the spacing between a list item’s bullet and its content
  violates a given style.

  Options: `string`, either `'tab-size'`, `'mixed'`, or `'space'`,
  default: `'tab-size'`.

### list-item-spacing

```md
  <!-- Valid: -->
  -   Wrapped
      item

  -   item 2

  -   item 3

  <!-- Valid: -->
  -   item 1
  -   item 2
  -   item 3

  <!-- Invalid: -->
  -   Wrapped
      item
  -   item 2
  -   item 3

  <!-- Invalid: -->
  -   item 1

  -   item 2

  -   item 3
```

  Warn when list looseness is incorrect, such as being tight
  when it should be loose, and vice versa.

### maximum-heading-length

```md
  <!-- Valid, when set to `40` -->
  # Alpha bravo charlie delta echo
  # ![Alpha bravo charlie delta echo](http://example.com/nato.png)

  <!-- Invalid, when set to `40` -->
  # Alpha bravo charlie delta echo foxtrot
```

  Warn when headings are too long.

  Options: `number`, default: `60`.

  Ignores markdown syntax, only checks the plain text content.

### maximum-line-length

```md
  <!-- Valid, when set to `40` -->
  Alpha bravo charlie delta echo.

  Alpha bravo charlie delta echo [foxtrot](./foxtrot.html).

  # Alpha bravo charlie delta echo foxtrot golf hotel.

      # Alpha bravo charlie delta echo foxtrot golf hotel.

  | A     | B     | C       | D     | E    | F       | F    | H     |
  | ----- | ----- | ------- | ----- | ---- | ------- | ---- | ----- |
  | Alpha | bravo | charlie | delta | echo | foxtrot | golf | hotel |

  <!-- Invalid, when set to `40` -->
  Alpha bravo charlie delta echo foxtrot golf.

  Alpha bravo charlie delta echo [foxtrot](./foxtrot.html) golf.
```

  Warn when lines are too long.

  Options: `number`, default: `80`.

  Ignores nodes which cannot be wrapped, such as heasings, tables,
  code, link, images, and definitions.

### no-auto-link-without-protocol

```md
  <!-- Valid: -->
  <http://www.example.com>
  <mailto:foo@bar.com>

  <!-- Invalid: -->
  <www.example.com>
  <foo@bar.com>
```

  Warn for angle-bracketed links without protocol.

### no-blockquote-without-caret

```md
  <!-- Valid: -->
  > Foo...
  >
  > ...Bar.

  <!-- Invalid: -->
  > Foo...

  > ...Bar.
```

  Warn when blank lines without carets are found in a blockquote.

### no-consecutive-blank-lines

```md
  <!-- Valid: -->
  Foo...

  ...Bar.

  <!-- Invalid: -->
  Foo...


  ...Bar.
```

  Warn for too many consecutive blank lines.  Knows about the extra line
  needed between a list and indented code, and two lists.

### no-duplicate-definitions

```md
  <!-- Valid: -->
  [foo]: bar
  [baz]: qux

  <!-- Invalid: -->
  [foo]: bar
  [foo]: qux
```

  Warn when duplicate definitions are found.

### no-duplicate-headings

```md
  <!-- Valid: -->
  # Foo

  ## Bar

  <!-- Invalid: -->
  # Foo

  ## Foo

  ## [Foo](http://foo.com/bar)
```

  Warn when duplicate headings are found.

### no-emphasis-as-heading

```md
  <!-- Valid: -->
  # Foo

  Bar.

  <!-- Invalid: -->
  *Foo*

  Bar.
```

  Warn when emphasis (including strong), instead of a heading, introduces
  a paragraph.

### no-file-name-articles

```md
  Valid: article.md
  Invalid: an-article.md, a-article.md, , the-article.md
```

  Warn when file name start with an article.

### no-file-name-consecutive-dashes

```md
  Invalid: docs/plug--ins.md
  Valid: docs/plug-ins.md
```

  Warn when file names contain consecutive dashes.

### no-file-name-irregular-characters

```md
  Invalid: plug_ins.md, plug ins.md.
  Valid: plug-ins.md, plugins.md.
```

  Warn when file names contain irregular characters: characters other
  than alpha-numericals, dashes, and dots (full-stops).

### no-file-name-mixed-case

```md
  Invalid: Readme.md
  Valid: README.md, readme.md
```

  Warn when a file name uses mixed case: both upper- and lower case
  characters.

### no-file-name-outer-dashes

```md
  Invalid: -readme.md, readme-.md
  Valid: readme.md
```

  Warn when file names contain initial or final dashes.

### no-heading-content-indent

```md
  <!-- Note: the middle-dots represent spaces -->
  <!-- Invalid: -->
  #··Foo

  ## Bar··##

    ##··Baz

  <!-- Valid: -->
  #·Foo

  ## Bar·##

    ##·Baz
```

  Warn when a heading’s content is indented.

### no-heading-indent

```md
  <!-- Note: the middle-dots represent spaces -->
  <!-- Invalid: -->
  ···# Hello world

  ·Foo
  -----

  ·# Hello world #

  ···Bar
  =====

  <!-- Valid: -->
  # Hello world

  Foo
  -----

  # Hello world #

  Bar
  =====
```

  Warn when a heading is indented.

### no-heading-punctuation

```md
  <!-- Invalid: -->
  # Hello:

  # Hello?

  # Hello!

  # Hello,

  # Hello;

  <!-- Valid: -->
  # Hello
```

  Warn when a heading ends with a a group of characters.
  Defaults to `'.,;:!?'`.

  Options: `string`, default: `'.,;:!?'`.

  Note that these are added to a regex, in a group (`'[' + char + ']'`),
  be careful for escapes and dashes.

### no-html

```md
  <!-- Invalid: -->
  <h1>Hello</h1>

  <!-- Valid: -->
  # Hello
```

  Warn when HTML nodes are used.

  Ignores comments, because they are used by this tool, remark, and
  because markdown doesn’t have native comments.

### no-inline-padding

```md
  <!-- Invalid: -->
  * Hello *, [ world ](http://foo.bar/baz)

  <!-- Valid: -->
  *Hello*, [world](http://foo.bar/baz)
```

  Warn when inline nodes are padded with spaces between markers and
  content.

  Warns for emphasis, strong, delete, image, and link.

### no-literal-urls

```md
  <!-- Invalid: -->
  http://foo.bar/baz

  <!-- Valid: -->
  <http://foo.bar/baz>
```

  Warn when URLs without angle-brackets are used.

### no-missing-blank-lines

```md
  <!-- Invalid: -->
  # Foo
  ## Bar

  <!-- Valid: -->
  # Foo

  ## Bar
```

  Warn for missing blank lines before a block node.

### no-multiple-toplevel-headings

```md
  <!-- Invalid, when set to `1` -->
  # Foo

  # Bar

  <!-- Valid, when set to `1` -->
  # Foo

  ## Bar
```

  Warn when multiple top-level headings are used.

  Options: `number`, default: `1`.

### no-shell-dollars

````md
              <!-- Invalid: -->
              ```bash
              $ echo a
              $ echo a > file
              ```

              <!-- Valid: -->
              ```sh
              echo a
              echo a > file
              ```

              <!-- Also valid: -->
              ```zsh
              $ echo a
              a
              $ echo a > file
              ```
````

  Warn when shell code is prefixed by dollar-characters.

  Ignored indented code blocks and fenced code blocks without language
  flag.

### no-shortcut-reference-image

```md
  <!-- Invalid: -->
  ![foo]

  [foo]: http://foo.bar/baz.png

  <!-- Valid: -->
  ![foo][]

  [foo]: http://foo.bar/baz.png
```

  Warn when shortcut reference images are used.

### no-shortcut-reference-link

```md
  <!-- Invalid: -->
  [foo]

  [foo]: http://foo.bar/baz

  <!-- Valid: -->
  [foo][]

  [foo]: http://foo.bar/baz
```

  Warn when shortcut reference links are used.

### no-table-indentation

```md
  <!-- Invalid: -->
      | A     | B     |
      | ----- | ----- |
      | Alpha | Bravo |

  <!-- Valid: -->
  | A     | B     |
  | ----- | ----- |
  | Alpha | Bravo |
```

  Warn when tables are indented.

### no-tabs

```md
  <!-- Note: the double guillemet (`»`) and middle-dots represent a tab -->
  <!-- Invalid: -->
  Foo»Bar

  »···Foo

  <!-- Valid: -->
  Foo Bar

      Foo
```

  Warn when hard-tabs instead of spaces

### no-undefined-references

```md
  <!-- Valid: -->
  [foo][]

  [foo]: https://example.com

  <!-- Invalid: -->
  [bar][]
```

  Warn when references to undefined definitions are found.

### no-unused-definitions

```md
  <!-- Valid: -->
  [foo][]

  [foo]: https://example.com

  <!-- Invalid: -->
  [bar]: https://example.com
```

  Warn when unused definitions are found.

### ordered-list-marker-style

```md
  <!-- Valid when set to `consistent` or `.` -->
  1.  Foo

  2.  Bar

  <!-- Valid when set to `consistent` or `)` -->
  1)  Foo

  2)  Bar
```

  Warn when the list-item marker style of ordered lists violate a given
  style.

  Options: `string`, either `'consistent'`, `'.'`, or `')'`,
  default: `'consistent'`.

  Note that `)` is only supported in CommonMark.

  The default value, `consistent`, detects the first used list
  style, and will warn when a subsequent list uses a different
  style.

### ordered-list-marker-value

```md
  <!-- Valid when set to `one`: -->
  1.  Foo
  1.  Bar
  1.  Baz

  1.  Alpha
  1.  Bravo
  1.  Charlie

  <!-- Valid when set to `single`: -->
  1.  Foo
  1.  Bar
  1.  Baz

  3.  Alpha
  3.  Bravo
  3.  Charlie

  <!-- Valid when set to `ordered`: -->
  1.  Foo
  2.  Bar
  3.  Baz

  3.  Alpha
  4.  Bravo
  5.  Charlie
```

  Warn when the list-item marker values of ordered lists violate a
  given style.

  Options: `string`, either `'single'`, `'one'`, or `'ordered'`,
  default: `'ordered'`.

  When set to `'ordered'`, list-item bullets should increment by one,
  relative to the starting point.  When set to `'single'`, bullets should
  be the same as the relative starting point.  When set to `'one'`, bullets
  should always be `1`.

### rule-style

```md
  <!-- Valid when set to `consistent` or `* * *`: -->
  * * *

  * * *

  <!-- Valid when set to `consistent` or `_______`: -->
  _______

  _______
```

  Warn when the horizontal rules violate a given or detected style.

  Note that horizontal rules are also called “thematic break”.

  Options: `string`, either a valid markdown rule, or `consistent`,
  default: `'consistent'`.

### strong-marker

```md
  <!-- Valid when set to `consistent` or `*` -->
  **foo**
  **bar**

  <!-- Valid when set to `consistent` or `_` -->
  __foo__
  __bar__
```

  Warn for violating strong markers.

  Options: `string`, either `'consistent'`, `'*'`, or `'_'`,
  default: `'consistent'`.

  The default value, `consistent`, detects the first used strong
  style, and will warn when a subsequent strong uses a different
  style.

### table-cell-padding

```md
  <!-- Valid when set to `consistent` or `padded` -->
  | A     | B     |
  | ----- | ----- |
  | Alpha | Bravo |

  <!-- Valid when set to `consistent` or `compact` -->
  |A    |B    |
  |-----|-----|
  |Alpha|Bravo|

  <!-- Invalid: -->
  |   A    | B    |
  |   -----| -----|
  |   Alpha| Bravo|
```

  Warn when table cells are incorrectly padded.

  Options: `string`, either `'consistent'`, `'padded'`, or `'compact'`,
  default: `'consistent'`.

  The default value, `consistent`, detects the first used cell padding
  style, and will warn when a subsequent cells uses a different
  style.

### table-pipe-alignment

```md
  <!-- Valid: -->
  | A     | B     |
  | ----- | ----- |
  | Alpha | Bravo |

  <!-- Invalid: -->
  | A | B |
  | -- | -- |
  | Alpha | Bravo |
```

  Warn when table pipes are not aligned.

### table-pipes

```md
  <!-- Valid: -->
  | A     | B     |
  | ----- | ----- |
  | Alpha | Bravo |

  <!-- Invalid: -->
  A     | B
  ----- | -----
  Alpha | Bravo
```

  Warn when table rows are not fenced with pipes.

### unordered-list-marker-style

```md
  <!-- Valid when set to `consistent` or `-` -->
  -   Foo
  -   Bar

  <!-- Valid when set to `consistent` or `*` -->
  *   Foo
  *   Bar

  <!-- Valid when set to `consistent` or `+` -->
  +   Foo
  +   Bar

  <!-- Never valid: -->
  +   Foo
  -   Bar
```

  Warn when the list-item marker style of unordered lists violate a given
  style.

  Options: `string`, either `'consistent'`, `'-'`, `'*'`, or `'*'`,
  default: `'consistent'`.

  The default value, `consistent`, detects the first used list
  style, and will warn when a subsequent list uses a different
  style.

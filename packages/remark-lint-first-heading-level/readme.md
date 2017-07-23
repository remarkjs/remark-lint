<!--This file is generated-->

# remark-lint-first-heading-level

Warn when the first heading has a level other than a specified value.

Options: `number`, default: `1`.

## Install

```sh
npm install --save remark-lint-first-heading-level
```

## Example

When this rule is `2`, the following file
`valid.md` is ok:

```markdown
## Delta

Paragraph.
```

When this rule is `2`, the following file
`valid-html.md` is ok:

```markdown
<h2>Echo</h2>

Paragraph.
```

When this rule is `2`, the following file
`invalid.md` is **not** ok:

```markdown
# Foxtrot

Paragraph.
```

```text
1:1-1:10: First heading level should be `2`
```

When this rule is `2`, the following file
`invalid-html.md` is **not** ok:

```markdown
<h1>Golf</h1>

Paragraph.
```

```text
1:1-1:14: First heading level should be `2`
```

When this rule is turned on, the following file
`valid.md` is ok:

```markdown
# The default is to expect a level one heading
```

When this rule is turned on, the following file
`valid-html.md` is ok:

```markdown
<h1>An HTML heading is also seen by this rule.</h1>
```

When this rule is turned on, the following file
`valid-delayed.md` is ok:

```markdown
You can use markdown content before the heading.

<div>Or non-heading HTML</div>

<h1>So the first heading, be it HTML or markdown, is checked</h1>
```

When this rule is turned on, the following file
`invalid.md` is **not** ok:

```markdown
## Bravo

Paragraph.
```

```text
1:1-1:9: First heading level should be `1`
```

When this rule is turned on, the following file
`invalid-html.md` is **not** ok:

```markdown
<h2>Charlie</h2>

Paragraph.
```

```text
1:1-1:17: First heading level should be `1`
```

## License

[MIT](https://github.com/wooorm/remark-lint/blob/master/LICENSE) © [Titus Wormer](http://wooorm.com)

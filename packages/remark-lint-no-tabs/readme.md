<!--This file is generated-->

# remark-lint-no-tabs

Warn when hard tabs are used instead of spaces.

## Install

```sh
npm install --save remark-lint-no-tabs
```

## Example

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

## License

[MIT](https://github.com/wooorm/remark-lint/blob/master/LICENSE) © [Titus Wormer](http://wooorm.com)

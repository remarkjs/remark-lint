<!--This file is generated-->

# remark-lint-no-duplicate-headings-in-section

Warn when duplicate headings are found,
but only when on the same level, “in”
the same section.

## Install

```sh
npm install --save remark-lint-no-duplicate-headings-in-section
```

## Example

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

## License

[MIT](https://github.com/wooorm/remark-lint/blob/master/LICENSE) © [Titus Wormer](http://wooorm.com)

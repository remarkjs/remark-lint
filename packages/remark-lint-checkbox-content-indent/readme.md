<!--This file is generated-->

# remark-lint-checkbox-content-indent

Warn when list item checkboxes are followed by too much white-space.

## Install

```sh
npm install --save remark-lint-checkbox-content-indent
```

## Example

When this rule is turned on, the following file
`valid.md` is ok:

```markdown
- [ ] List item
+  [x] List Item
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

## License

[MIT](https://github.com/wooorm/remark-lint/blob/master/LICENSE) © [Titus Wormer](http://wooorm.com)

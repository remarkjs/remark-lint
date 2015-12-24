# API

## Usage

Dependencies:

```javascript
var remark = require('remark');
var lint = require('remark-lint');
var processor = remark().use(lint);
```

Example document.

```javascript
var doc = '* Hello\n' +
    '\n' +
    '-   World\n';
```

Process.

```javascript
processor.process(doc, function (err, file, res) {
    var messages = file.messages;
    /**
     * Yields:
     * [
     *   {
     *     "name": "1:3-1:8",
     *     "file": "",
     *     "reason": "Incorrect list-item content indent: add 2 spaces",
     *     "line": 1,
     *     "column": 3,
     *     "fatal": false,
     *     "ruleId": "list-item-indent"
     *   },
     *   {
     *     "name": "3:1-3:10",
     *     "file": "",
     *     "reason": "Invalid ordered list item marker: should be `*`",
     *     "line": 3,
     *     "column": 1,
     *     "fatal": false,
     *     "ruleId": "unordered-list-marker-style"
     *   }
     * ]
     */
});
```

## [remark](https://github.com/wooorm/remark#api).[use](https://github.com/wooorm/remark#remarkuseplugin-options)(lint, options)

Adds warnings for style violations to a given [virtual file](https://github.com/wooorm/remark/blob/master/doc/remark.3.md#file)
using remark’s [warning API](https://github.com/wooorm/remark/blob/master/doc/remark.3.md#filewarnreason-position).

When processing a file, these warnings are available at `file.messages`, and
look as follows:

```json
{
  "fatal": false,
  "reason": "Marker style should be `*`",
  "file": "~/example.md",
  "line": 3,
  "column": 1,
  "ruleId": "unordered-list-marker-style"
}
```

See [`VFileMessage`](https://github.com/wooorm/vfile#vfilemessage) for more
information.

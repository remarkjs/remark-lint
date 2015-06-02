# API

## Usage

Dependencies:

```javascript
var mdast = require('mdast');
var lint = require('mdast-lint');
var processor = mdast().use(lint);
```

Example document.

```javascript
var doc = '* Hello\n' +
    '\n' +
    '-   World\n';
```

Process.

```javascript
processor.process(doc, function (err, res, file) {
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

## [mdast](https://github.com/wooorm/mdast#api).[use](https://github.com/wooorm/mdast#mdastuseplugin-options)(lint, options)

Adds warnings for style violations to a given [virtual file](https://github.com/wooorm/mdast/blob/master/doc/mdast.3.md#file)
using mdast’s [warning API](https://github.com/wooorm/mdast/blob/master/doc/mdast.3.md#filewarnreason-position).

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

These messages comply to two schema’s. First, they’re valid error objects,
so they can be thrown (while still looking :ok_hand:, due to `Error#toString()`
magic), secondly the `file` object itself can be passed to ESLint’s formatters:

```javascript
var compact = require('eslint/lib/formatters/compact');
var mdast = require('mdast');
var lint = require('mdast-lint');

// For example purposes were processing `example.md` as seen above.
mdast().use(lint).process(doc, function (err, res, file) {
    compact([file]);
    /**
     * line 3, col 1, Warning - Invalid ordered list item marker: should be `*`
     *
     * 1 problem
     */
});
```

Each message contains the following properties:

*   `fatal` (`boolean?`) — Always `false`;

*   `reason` (`string`) — Warning message;

*   `line` (`number`) — Starting line (1-based);

*   `column` (`number`) — Starting column of exception (1-based).

*   `file` (`string`) — File path of exception.

*   `ruleId` (`string`) — Name of the rule which triggered this warning,
    useful when looking for how to turn the darn thing off.

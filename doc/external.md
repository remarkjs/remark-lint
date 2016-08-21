# External rules

External rules make it easy to develop and publish small linting rules
for markdown.

## Table of Contents

*   [Using external rules](#using-external-rules)
*   [Creating external rules](#creating-external-rules)

## Using external rules

External rules can be used by passing their file-path or their name,
in which case `remark-lint-` can be omitted, in an `external` array
to **remark-lint**.  This only works in Node.js.

Alternatively, load modules yourself and pass them in the `external` array too.

### CLI

Say we are in the following directory: `~/projects/things`.

Create a `.remarkrc` file and add the following JSON:

```json
{
  "plugins": {
    "lint": {
      "external": [
        "no-empty-sections"
      ]
    }
  }
}
```

Add a markdown file, such as `readme.md` file, which looks as follows:

```md
# A

## B (this section is empty!)

## C
```

Then, install the required dependencies:

```sh
npm install -g remark-cli remark-lint remark-lint-no-empty-sections
```

Now, run the following in your shell, from the same directory:

```sh
# This will process all markdown files in the current
# directory, and pass the through the specified plugins.
remark .
```

That should show a report like:

```sh
readme.md
    5:1-5:5  warning  Remove empty section: "B (this section is empty!)"  empty-sections

⚠ 1 warning
```

### Programmatic

Say we have a file, `example.md`, which looks as follows:

```md
[link](http://example.com/);
```

And `example.js` next to it:

```js
var fs = require('fs');
var remark = require('remark');
var lint = require('remark-lint');
var report = require('vfile-reporter');
var doc = fs.readFileSync('example.md', 'utf8');

remark()
  .use(lint, {external: ['no-url-trailing-slash']})
  .process(doc, function (err, file) {
    console.log(report(err || file));
  });
```

Then, install the required dependencies:

```sh
npm install remark remark-lint remark-lint-no-url-trailing-slash
```

Finally, run `example.js` with Node:

```sh
node example.js
```

Yields:

```txt
   1:1-1:28  warning  Remove trailing slash (http://example.com)  trailing-slash

⚠ 1 warning
```

## Creating external rules

External rule packages expose an object of dash-cased rule id’s to
functions.

`index.js`:

```js
module.exports = {
  'code-js-flag': require('./rules/code-js-flag.js')
};
```

### Synchronous

Each rule is a function which gets passed a [`root`][root] node,
a [virtual file][vfile], and a setting.

The setting is never `true` or `false`, those are used later to filter
messages.  Rules always run, even when they’re turned off, as they can
be turned on from within markdown code through [comments][]

An example, `./rules/code-js-flag.js`, is as follows:

```js
var visit = require('unist-util-visit');

module.exports = rule;

var valid = ['js', 'javascript', 'es', 'es6', 'javascript'];
var def = valid[0];

function rule(ast, file, setting) {
  pref = setting == null ? def : setting;

  if (valid.indexOf(pref) === -1) {
    /* `file.fail` is for invalid, unrecoverable things, **not** for
     * linting messages. */
    file.fail(pref + ' is not a valid JavaScript extension');
    return
  }

  visit(ast, 'code', function (node) {
    /* Emit a linting message, only for JS code though. */
    if (valid.indexOf(node.lang) !== -1 && node.lang !== pref) {
      file.message(
        'JavaScript code blocks should use `' + pref + '` as a ' +
        'language flag, not `' + node.lang + '`',
        node
      );
    }
  });
}
```

### Promises

A rule can return a promise, this will automatically switch everything
to asynchronous and wait for the rule to resolve or reject before
continuing on.  Note: Do not resolve a value.  Rejecting an error is OK.

```js
function rule(ast, file, setting) {
  return new Promise(function (resolve, reject) {
    // ...do async things.
    setImmediate(function () {
      resolve();
    });
  });
}
```

### Callbacks

If a rule has a fourth parameters, `next`, it must be invoked, and it
may be invoked asynchronously.  An error may be given to `next` to stop
all processing.

```js
function rule(ast, file, setting, next) {
  /* ...do async things. */
  setImmediate(function () {
    next();
  });
}
```

<!--Definitions:-->

[root]: https://github.com/wooorm/mdast#root

[vfile]: https://github.com/wooorm/vfile

[comments]: https://github.com/wooorm/remark-lint#configuring-remark-lint

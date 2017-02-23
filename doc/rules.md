<!-- This file is generated -->

# Rules

This document lists all (61) available rules.  Each rule is a separate
package. See their readme’s for more information.

`false` turns rules off — the code no longer runs:

```js
remark()
  .use(require('remark-lint-final-newline'), false)
  // ...
```

`true` turns a rule on again:

```js
remark()
  .use(require('remark-lint-final-newline'), true)
  // ...
```

Rules can be configured with a severity too.  The following is ignores all
messages from the plugin:

```js
remark()
  .use(require('remark-lint-final-newline'), [0])
  // ...
```

...and passing `[1]` explicitly sets the normal behaviour (warn for problems).
To trigger an error instead of a warning, pass `2`:

```js
remark()
  .use(require('remark-lint-final-newline'), [2])
  // ...
```

It’s also possible to pass both a severity and configuration:

```js
remark()
  .use(require('remark-lint-maximum-line-length'), [2, 70])
  // ...
```

Lastly, strings can also be passed, instead of numbers:
`off` instead of `0`, `warn` or `on` instead of `1`, and
`error` instead of `2`.

```js
remark()
  .use(require('remark-lint-maximum-line-length'), ['error', 70])
  // ...
```

## List of Rules

TODO: For now, see [packages][] for a list of rules.
I’ll add a list of rules later.

[packages]: https://github.com/wooorm/remark-lint/tree/master/packages

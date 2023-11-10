# Create a custom `remark-lint` rule

This guide is part of [a step-by-step tutorial][tutorial], and will help you
getting started to create your first linting plugin for `remark`.

## Contents

* [Set up the project](#set-up-the-project)
* [Set up remark](#set-up-remark)
* [The `no-invalid-gif` rule](#the-no-invalid-gif-rule)
* [Create the custom rule](#create-the-custom-rule)
* [Rule arguments](#rule-arguments)
* [Rule implementation](#rule-implementation)
* [Import the rule in your remark config](#import-the-rule-in-your-remark-config)
* [Apply the rule on the Markdown file](#apply-the-rule-on-the-markdown-file)

## Set up the project

Create a new folder and enter it from your terminal.
For this example I will be using Unix commands (macOS and Linux compatible).
Then generate a `package.json`:

```sh
mkdir my-custom-rule
cd my-custom-rule
npm init -y
```

Now we can start installing our dependencies:

```sh
npm install remark-lint remark-cli
```

* [`remark-lint`][remark-lint]
  — core lint plugin
* [`remark-cli`][remark-cli]
  — command line interface

We will also use some utilities:

```sh
npm install unified-lint-rule unist-util-generated unist-util-visit
```

These will help us creating and managing our custom rules.

## Set up remark

With everything installed, we can now create a `.remarkrc.js` that will contain
the plugins we’ll use.

For more info on configuration, see [Examples in `remark-lint`][examples].

```sh
touch .remarkrc.js
```

```js
// .remarkrc.js
module.exports = {
  plugins: []
}
```

Then, in our `package.json`, add the following script to process all the
markdown files in our project:

```json
"scripts": {
  "lint": "remark ."
}
```

Let’s create a `doc.md`, the markdown file we want to lint:

```sh
touch doc.md
```

…and copy/paste the following:

```markdown
## Best pets! <3

Some funny images of our favorite pets

![a funny cat](funny-cat.gif)

![a lovely dog](lovely-dog.png)
```

At this point, we have a working `remark` configuration and a markdown file in
the project.

If we run `npm run lint` we should expect to see in our terminal:

```sh
doc.md: no issues found
```

All good, the file has been processed, and because we haven’t specified any
plugins nor lint rules, no issues are found.

## The `no-invalid-gif` rule

Let’s imagine we want to write a rule that checks whether a `.gif` file is used
as an image.
Given the content of our `doc.md` file declared above, we would expect an
*error* or *warning* pointing to:

```markdown
![a funny cat](funny-cat.gif)
```

Because the file extension `.gif` in the image violates our rule.

## Create the custom rule

Let’s create a new folder `rules` under the root directory, where we will place
all of our custom rules, and create a new file in it named `no-gif-allowed.js`.

```sh
mkdir rules
cd rules
touch no-gif-allowed.js
cd .. # return to project root
```

*Note*: the name of folders and files, and where to place them within your
project, is up to you.

In `./rules/no-gif-allowed.js`, let’s import `unified-lint-rule`.

We then export the result of calling `rule` by providing the *namespace and rule
name* (`remark-lint:no-gif-allowed`) as the first argument, and our
implementation of the rule (`noGifAllowed`) as the second argument.

```js
// rules/no-gif-allowed.js
import {lintRule} from 'unified-lint-rule'

const remarkLintNoGifAllowed = lintRule(
  'remark-lint:no-gif-allowed',
  (tree, file, options) => {
    // Rule implementation
  }
)

export default remarkLintNoGifAllowed
```

Let’s say you want all your custom rules to be defined as part of your project
namespace.
If your project was named `my-project`, then you can export your rule as:

```js
const remarkLintNoGifAllowed = lintRule('my-project-name:no-gif-allowed', () => {})
// Or:
const remarkLintNoGifAllowed = lintRule('my-npm-published-package:no-gif-allowed', () => {})
```

This can help you when wanting to create a group of rules under the same
*namespace*.

## Rule arguments

Your rule function will receive three arguments:

```js
(tree, file, options) => {}
```

* `tree` (*required*): [mdast][]
* `file` (*required*): [virtual file][vfile]
* `options` (*optional*): additional info passed to the rule by users

## Rule implementation

Because we will be inspecting [mdast][], which is a markdown abstract syntax
tree built upon [unist][], we can take advantage of the many existing
[unist utilities][unist-util] to inspect our tree’s nodes.

For this example, we will use [`unist-util-visit`][unist-util-visit] to
recursively inspect all the image nodes, and
[`unist-util-generated`][unist-util-generated] to ensure we are not inspecting
nodes that we have generated ourselves and do not belong to the `doc.md`.

```js
import {lintRule} from 'unified-lint-rule'
import {visit} from 'unist-visit-util'
import {generated} from 'unist-util-generated'

function isValidNode(node) {
  // Here we check whether the given node violates our rule.
  // Implementation details are not relevant to the scope of this example.
  // This is an overly simplified solution for demonstration purposes
  if (node.url && typeof node.url === 'string') {
    return !node.url.endsWith('.gif')
  }
}

const remarkLintNoGifAllowed = lintRule(
  'remark-lint:no-gif-allowed',
  (tree, file, options) => {
    visit(tree, 'image', (node) => {
      if (!generated(node)) {
        // This is an extremely simplified example of how to structure
        // the logic to check whether a node violates your rule.
        // You have complete freedom over how to visit/inspect the tree,
        // and on how to implement the validation logic for your node.
        const isValid = isValidNode(node)

        if (!isValid) {
          // Remember to provide the node as second argument to the message,
          // in order to obtain the position and column where the violation occurred.
          file.message(
            'Invalid image file extensions. Please do not use gifs',
            node
          )
        }
      }
    })
  }
)

export default remarkLintNoGifAllowed
```

## Import the rule in your remark config

Now that our custom rule is defined and ready to be used we need to add it to
our `remark` configuration.

You can do that by importing your rule and adding it in `plugins` array:

```js
// .remarkrc.js
import remarkLintNoGifAllowed from './rules/no-gif-allowed.js'

const plugins = {
  plugins: [remarkLintNoGifAllowed]
}

const preset = {plugins}

export default preset
```

## Apply the rule on the Markdown file

If you run `npm run lint`, you should see the following message in the terminal:

```text
5:1-5:30  warning  Invalid image file extensions. Please do not use gifs  no-gif-allowed  remark-lint
```

**Congratulations!
The rule works!**

[tutorial]: https://dev.to/floroz/how-to-create-a-custom-lint-rule-for-markdown-and-mdx-using-remark-and-eslint-2jim

[remark-lint]: https://github.com/remarkjs/remark-lint

[remark-cli]: https://github.com/remarkjs/remark/tree/main/packages/remark-cli

[examples]: https://github.com/remarkjs/remark-lint#examples

[mdast]: https://github.com/syntax-tree/mdast

[vfile]: https://github.com/vfile/vfile

[unist]: https://github.com/syntax-tree/unist

[unist-util]: https://github.com/syntax-tree/unist#utilities

[unist-util-visit]: https://github.com/syntax-tree/unist-util-visit

[unist-util-generated]: https://github.com/syntax-tree/unist-util-generated

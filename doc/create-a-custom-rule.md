# Create a custom `remark-lint` rule

This tutorial will help you creating your first linting plugin for `remark`.

## Table of Contents

*   [Set up the project](#set-up-the-project)
*   [Set up remark](#set-up-remark)
*   [The no-invalid-gif rule](#the-no-invalid-gif-rule)
*   [Create the custom rule](#create-the-custom-rule)
*   [Rule arguments](#rule-arguments)
*   [Rule implementation](#rule-implementation)
*   [Import the rule in your remark config](#import-the-rule-in-your-remark-config)
*   [Apply the rule on the Markdown file](#apply-the-rule-on-the-markdown-file)

## Set up the project

Create a new folder and navigate inside it from your Terminal. For this example I will be using UNIX commands (macOS and Linux compatible).
Now we can generate our `package.json`

```bash
$ mkdir my-custom-rule

$ cd my-custom-rule

$ yarn init -y
```

Now we can start installing our dependencies.

```bash
$ yarn add remark-lint remark-cli
```

*   [remark-lint](https://github.com/remarkjs/remark-lint): a plugin to lint markdown built on [remark](https://github.com/remarkjs/remark): (a markdown processor).
*   [remark-cli](https://github.com/remarkjs/remark/tree/main/packages/remark-cli): remark CLI.

Because we will be working with [ASTs](https://en.wikipedia.org/wiki/Abstract_syntax_tree), we will also need some utilities:

```bash
$ yarn unified-lint-rule unist-util-generated unist-util-visit
```

These will help us creating and managing our custom rules.

[Back to Top](#table-of-contents)

## Set up remark

With our dependencies all installed, we can start creating a `.remarkrc.js`, which will contain all the plugins that will be consumed by the remark processor.
For details about alternative or advanced configurations, please refer to [Configuring remark-lint](https://github.com/remarkjs/remark-lint#configuring-remark-lint).

```bash
$ touch .remarkrc.js
```

```js
// .remarkrc.js

module.exports = {
  plugins: [],
};
```

Then, in our `package.json`, let's add the following script, which will process all the markdown file within our project:

```json
"scripts": {
  "lint": "remark ."
}
```

Let's create a `doc.md`, the markdown file we want to lint,

```bash
$ touch doc.md
```

and copy/paste this content:

```md
## Best pets! <3

Some funny images of our favorite pets

![a funny cat](funny-cat.gif)

![a lovely dog](lovely-dog.png)
```

At this point, we have a working `remark` configuration and a markdown file in the project.

If we run `yarn run lint` we should expect to see in our terminal:

```bash
$ doc.md: no issues found
```

All good, the file has been processed, and because we haven't specified any plugins nor lint rule, no issues are found.

[Back to Top](#table-of-contents)

## The no-invalid-gif rule

Let's imagine we want to write a rule that checks whether a `.gif` file is used within an image.

Given the content of our `doc.md` file declared above, we would expect an *error* or *warning* pointing to:

```md
![a funny cat](funny-cat.gif)
```

Because the file extension `.gif` in the image tag, violates our rule.

[Back to Top](#table-of-contents)

## Create the custom rule

Let's create a new folder `rules` under the root directory, where we will place all of our custom rules, and create a new file in it named `no-gif-allowed.js`.

```bash
$ mkdir rules
$ cd rules
$ touch no-gif-allowed.js
```

*Remember*: the name of the folder and files, and where to place them within your project, is entirely up to you.

In `./rules/no-gif-allowed.js`, let's import the `unified-lint-rule`.
We then export the result of calling `rule` by providing the *namespace and rule name* (`remark-lint:no-gif-allowed`) as the first argument, and our implementation of the rule (`noGifAllowed`) as the second argument.

```js
// rules/no-gif-allowed.js

var rule = require("unified-lint-rule");
function noGifAllowed(tree, file, options) {
  // rule implementation
}
module.exports = rule("remark-lint:no-gif-allowed", noGifAllowed);
```

Let's say you want all your custom rules to be defined as part of your project namespace. If your project was named `my-project`, then you can export your rule as:

```js
module.exports = rule("my-project-name:no-gif-allowed", noGifAllowed);
// or
module.exports = rule("my-npm-published-package:no-gif-allowed", noGifAllowed);
```

This can help you when wanting to create a group of rules under the same *label* or *namespace*.

[Back to Top](#table-of-contents)

## Rule arguments

Your rule function will receive three arguments.

```js
function noGifAllowed(tree, file, options) {}
```

*   `tree` (*required*): a [mdast](https://github.com/syntax-tree/mdast).
*   `file` (*required*): a [virtual file format](https://github.com/vfile/vfile).
*   `options` (*optional*): additional information passed to the rule by the remark plugins definition.

[Back to Top](#table-of-contents)

## Rule implementation

Because we will be inspecting a [mdast](https://github.com/syntax-tree/mdast), which is a markdown abstract syntax tree built upon [unist](https://github.com/syntax-tree/unist), we can take advantage of the many existing [unist utilities](https://github.com/syntax-tree/unist#utilities) to inspect our tree's nodes.

For this example, we will use [`unist-util-visit`](https://github.com/syntax-tree/unist-util-visit) to recursively inspect all the image nodes, and [`unist-util-generated`](https://github.com/syntax-tree/unist-util-generated) to ensure we are not inspecting nodes that we have generated ourselves and do not belong to the `doc.md`.

```js
const rule = require("unified-lint-rule");
const visit = require("unist-visit-util");
const generated = require("unist-util-generated");

function isValidNode(node) {
  // here we check whether the given node violates our rule
  // implementation details are not relevant to the scope of this example.
  // This is an overly simplified solution for demonstration purposes
  if (node.url && typeof node.url === "string") {
    return !node.url.endsWith(".gif");
  }
}
function noGifAllowed(tree, file, options) {
  visit(tree, "image", visitor);
  function visitor(node) {
    if (!generated(node)) {
      /**
       * This is an extremely simplified example of how to structure
       * the logic to check whether a node violates your rule.
       * You have complete freedom over how to visit/inspect the tree,
       * and on how to implement the validation logic for your node.
       * */
      const isValid = isValidNode(node);
      if (!isValid) {
        // remember to provide the node as second argument to the message,
        // in order to obtain the position and column where the violation occurred.
        file.message(
          `Invalid image file extentions. Please do not use gifs`,
          node
        );
      }
    }
  }
}
module.exports = rule("remark-lint:no-gif-allowed", noGifAllowed);
```

[Back to Top](#table-of-contents)

## Import the rule in your remark config

Now that our custom rule is defined, and ready to be used, we need to add it to our `remark` configuration.

All you have to do is to import your rule into the `remark` configuration plugins array:

```js
// .remarkrc.js
const noGifAllowed = require("./rules/no-gif-allowed.js");

module.exports = {
  plugins: [noGifAllowed],
};
```

[Back to Top](#table-of-contents)

## Apply the rule on the Markdown file

If you run `yarn lint`, you should see the following message in the terminal:

```bash
 5:1-5:30  warning  Invalid image file extentions. Please do not use gifs  no-gif-allowed  remark-lint
```

**Congratulations! The rule works!**

[Back to Top](#table-of-contents)

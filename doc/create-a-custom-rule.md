# Create a custom `remark-lint` rule

The following is a short guide on how to setup a JavaScript project and create a linting plugin for `remark` using `remark-lint`.


### 1. Set up the project

Let's set up the project and start adding our dependencies.

```bash
yarn init -y
```

Now that we have a `package.json`, we can install our processor and lint plugin:

```bash
yarn add remark remark-lint remark-cli
```

- [remark](https://github.com/remarkjs/remark): a markdown processor.
- [remark-lint](https://github.com/remarkjs/remark-lint): remark plugins to lint markdown.
- [remark-cli](https://github.com/remarkjs/remark/tree/main/packages/remark-cli): CLI.

Because we will be working with [ASTs](https://en.wikipedia.org/wiki/Abstract_syntax_tree), we will also need some utilities:

```bash
yarn unified-lint-rule unist-util-generated unist-util-visit
```

These will help us creating and managing our custom rules.

### 2. Set up remark

With our dependencies all installed, we can start creating a `.remarkrc.js`, which will contain all the plugins that will be consumed by the remark processor.
For details about alternative or advanced configurations, please refer to [Configuring remark-lint](https://github.com/remarkjs/remark-lint#configuring-remark-lint).

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

Let's create a `doc.md`, the markdown file we want to lint:

```md
## Best pets! <3

Some funny images of our favorite pets

![a funny cat](funny-cat.gif)

![a lovely dog](lovely-dog.png)
```

At this point, we have a working `remark` configuration and a markdown file in the project.

If we run `yarn run lint` we should expect to see in our terminal:

```bash
doc.md: no issues found
```

All good, the file has been processed, and because we haven't specified any plugins nor lint rule, no issues are found.

### 3. The `no-invalid-gif` rule:

Let's imagine we want to write a rule that checks whether a `.gif` file is used within an image.

Given the content of our `doc.md` file:

```md
## Best pets! <3

Some funny images of our favourite pets

![a funny cat](funny-cat.gif)

![a lovely dog](lovely-dog.png)
```

We would expect an _error_ or _warning_ pointing to `funny-cat.gif`, because the file extension `.gif` violates our rule.

### 4. Create the custom rule

Let's create a new folder `rules` under the root directory, where we will place all of our custom rules, and create a new file in it named `no-gif-allowed.js`.

_Remember_: the name of the folder and files, and where to place them within your project, is entirely up to you.

In `./rules/no-gif-allowed.js`, let's import the `unified-lint-rule`.
We then export the result of calling `rule` by providing the _namespace and rule name_ (`remark-lint:no-gif-allowed`) as the first argument, and our implementation of the rule (`noGifAllowed`) as the second argument.

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
module.exports = rule("my-project:no-gif-allowed", noGifAllowed);
```

This can help you when wanting to create a group of rules under the same _label_ or _namespace_.

### 5. Rule arguments

Your rule function will receive three arguments.

```js
function noGifAllowed(tree, file, options) {}
```

- `tree` (_required_): a [mdast](https://github.com/syntax-tree/mdast).
- `file` (_required_): a [virtual file format](https://github.com/vfile/vfile).
- `options` (_optional_): additional information passed to the rule by the remark plugins definition.

### 6. Rule implementation

Because we will be inspecting a [mdast](https://github.com/syntax-tree/mdast), which is a markdown abstract syntax tree built upon [unist](https://github.com/syntax-tree/unist), we can take advantage of the many existing [unist utilities](https://github.com/syntax-tree/unist#utilities) to inspect our tree's nodes.

For this example, we will use [`unist-util-visit`](https://github.com/syntax-tree/unist-util-visit) to recursively inspect all the image nodes, and [`unist-util-generated`](https://github.com/syntax-tree/unist-util-generated) to ensure we are not inspecting nodes that we have generated ourselves and do not belong to the `blog-post.md`.

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

### 7. Import the rule in your remark config

Now that our custom rule is defined, and ready to be used, we need to add it to our `remark` configuration.

All you have to do is to import your rule into the `remark` configuration plugins array:

```js
// .remarkrc.js
const noGifAllowed = require("./rules/no-gif-allowed.js");

module.exports = {
  plugins: [noGifAllowed],
};
```

### 8. Run the linter

If you run `yarn lint`, you should see the following message in the terminal:

```bash
 5:1-5:30  warning  Invalid image file extentions. Please do not use gifs  no-gif-allowed  remark-lint
```

#### Congratulations!

The violation has been correctly found and reported.

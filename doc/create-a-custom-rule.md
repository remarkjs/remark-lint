# Create a custom `remark-lint` rule

The following is a short guide on how to extend your `remark-lint` configuration to include custom rules.

## Example of a new rule `remark-lint:no-gif-allowed`

Let's imagine we want to write a rule that checks whether a `.gif` file is used within an image.

We have a `blog-post.md` file.

```md
## Best pets! <3

Some funny images of our favourite pets

![a funny cat](funny-cat.gif)

![a lovely dog](lovely-dog.png)
```

We expect an *error* or *warning* highlighting `funny-cat.gif`, because the file extension `.gif` violates our rule.

### 1. Create a new file

First, let's create a new folder `rules` under the root directory, where we will place all of our custom rules, and create a new file `no-gif-allowed.js`.

*Remember*: the name of the folder and files, and where to place them within your project, is entirely up to you.

In `./rules/no-gif-allowed.js`, let's import the `unified-lint-rule`.
We then export the result of calling `rule` by providing the *namespace and rule name* (`remark-lint:no-gif-allowed`) as first argument, the *rule itself* (`noGifAllowed`) as second argument.

```js
var rule = require('unified-lint-rule')

function noGifAllowed(tree, file, options) {
  // rule implementation
}

module.exports = rule('remark-lint:no-gif-allowed', noGifAllowed)
```

Let's say you want all your custom rules to be defined as part of your project namespace. If your project was named `my-project` than you can export your rule as:

```js
module.exports = rule('my-project:no-gif-allowed', noGifAllowed)
```

### 2. Rule arguments

Your rule function will receive three arguments.

```js
function noGifAllowed(tree, file, options) {}
```

*   `tree` (*required*): a [mdast](https://github.com/syntax-tree/mdast).
*   `file` (*required*): a [virtual file format](https://github.com/vfile/vfile).
*   `options` (*optional*): additional information passed to the rule by the remark plugins definition.

### 3. Define the rule

Because we will be inspecting a [mdast](https://github.com/syntax-tree/mdast), which is a markdown abstract syntax tree built upon [unist](https://github.com/syntax-tree/unist), we can take advantage of the many existing [unist utilities](https://github.com/syntax-tree/unist#utilities) to inspect our tree's nodes.

For this example, we will use [`unist-util-visit`](https://github.com/syntax-tree/unist-util-visit) to recursively inspect all the image nodes, and [`unist-util-generated`](https://github.com/syntax-tree/unist-util-generated) to ensure we are not inspecting nodes that we have generated ourselves and do not belog to the `blog-post.md`.

```js
var rule = require('unified-lint-rule')
var visit = require('unist-visit-util')
var generated = require('unist-util-generated')


function isValidNode(node) {
  // here we check whether the given node violates our rule
  // implementation details are not relevant to the scope of this example.
}

function noGifAllowed(tree, file, options) {

  visit(tree, 'image', visitor);

  function visitor(node) {
    if (!generated(node)) {

      /**
       * This is an extremely simplified example on how to structure
       * the logic to check whether a node violates your rule.
       * You have complete freedom on how to visit/inspect the tree,
       * and how to implement the validation logic for your node.
       * */
      var isValid = isValidNode(node)

      if (!isValid) {
        // remember to pass the node itself alongside message, to obtain the position and column where the violation occurred.
        file.message(`Invalid image file extentions. Please do not use gifs`, node)
      }
    }
  }

}

module.exports = rule('remark-lint:no-gif-allowed', noGifAllowed)

```

### 4. Import the rule in your remark config

Now that our custom rule is defined, and ready to be used, we need to add it to our `remark` configuration.
For details about the configuration, please refer to our [Configuring remark-lint](https://github.com/remarkjs/remark-lint#configuring-remark-lint).

All you have to do, is to import your rule into the `remark` configuration plugins array:

**Example of a `.remarkrc.js` config file**

```js
// .remarkrc.js

var noGifAllowed = require('./rules/no-gif-allowed.js')

module.exports = {
  plugins: [
    noGifAllowed,
  ]
}
```

Now running `remark-lint` through the CLI, or through a ESLint integration, should yeld:

```bash
 5:10  error  'Invalid image file extentions. Please do not use gifs'   no-invalid-gif  remark-lint
```

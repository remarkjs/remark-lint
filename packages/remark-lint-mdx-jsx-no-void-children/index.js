/**
 * remark-lint rule to warn when void HTML elements (such as `<br>`)
 * are seen with children.
 *
 * ## What is this?
 *
 * This package checks that HTML void elements are without children.
 *
 * ## When should I use this?
 *
 * You can use this package to check that HTML void elements are
 * without children.
 *
 * This package assumes semantics from HTML.
 * If you use MDX in a place without HTML you should not use this.
 *
 * This package also checks `children` and `dangerouslySetInnerHTML` as it
 * assumes the semantics that React applies to these names.
 * If how you use JSX conflicts with the React semantics this package may not
 * work for you.
 *
 * ## API
 *
 * ### `unified().use(remarkLintMdxJsxNoVoidChildren[, options])`
 *
 * Warn when void HTML elements (such as `<br>`) are seen with children.
 *
 * ###### Parameters
 *
 * There are no parameters.
 *
 * ###### Returns
 *
 * Transform ([`Transformer` from `unified`][github-unified-transformer]).
 *
 * [api-remark-lint-mdx-jsx-no-void-children]: #unifieduseremarklintmdxjsxnovoidchildren-options
 * [github-unified-transformer]: https://github.com/unifiedjs/unified#transformer
 * [github-remark-mdx]: https://mdxjs.com/packages/remark-mdx/
 *
 * @module mdx-jsx-no-void-children
 * @author Titus Wormer
 * @copyright 2025 Titus Wormer
 * @license MIT
 *
 * @example
 *   {"mdx": true, "name": "ok.mdx"}
 *
 *   <b>Mercury</b> is the first planet from the Sun<br />
 *   and the smallest in the Solar System.
 *
 * @example
 *   {"label": "input", "mdx": true, "name": "not-ok.mdx"}
 *
 *   **Mercury** is the first planet from<br>the</br>
 *   Sun and the smallest in the Solar System.
 *
 *   <hr children={'***'} />
 *
 *   **Venus** is the second planet
 *   from <br dangerouslySetInnerHTML={{__html: 'the'}} />
 *   Sun.
 * @example
 *   {"label": "output", "mdx": true, "name": "not-ok.mdx"}
 *
 *   1:41-1:44: Unexpected children in known HTML void element, expected nothing
 *   4:5-4:21: Unexpected children in known HTML void element, expected nothing
 *   7:10-7:51: Unexpected children in known HTML void element, expected nothing
 */

/**
 * @import {Nodes, Root} from 'mdast'
 * @import {MdxJsxAttribute} from 'mdast-util-mdx'
 */

import {htmlVoidElements} from 'html-void-elements'
import {lintRule} from 'unified-lint-rule'
import {visitParents} from 'unist-util-visit-parents'

const remarkLintMdxJsxNoVoidChildren = lintRule(
  {
    origin: 'remark-lint:mdx-jsx-no-void-children',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-mdx-jsx-no-void-children#readme'
  },
  /**
   * @param {Root} tree
   *   Tree.
   * @returns {undefined}
   *   Nothing.
   */
  function (tree, file) {
    visitParents(tree, function (node, parents) {
      if (
        node.type === 'mdxJsxFlowElement' ||
        node.type === 'mdxJsxTextElement'
      ) {
        const name = node.name

        if (!name || !htmlVoidElements.includes(name)) return

        /** @type {Nodes | MdxJsxAttribute} */
        let problem = node.children[0]

        if (!problem) {
          for (const attribute of node.attributes) {
            if (
              'name' in attribute &&
              (attribute.name === 'children' ||
                attribute.name === 'dangerouslySetInnerHTML')
            ) {
              problem = attribute
              break
            }
          }
        }

        if (problem && problem.position) {
          file.message(
            'Unexpected children in known HTML void element, expected nothing',
            {ancestors: [...parents, node], place: problem.position}
          )
        }
      }
    })
  }
)

export default remarkLintMdxJsxNoVoidChildren
